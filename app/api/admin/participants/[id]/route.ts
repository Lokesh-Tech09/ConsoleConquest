import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { getTournamentSettings } from '@/lib/allocator';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const body = await req.json();

    const existing = await prisma.participant.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    // 1. Status changes
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'CHECKED-IN' && !existing.checkedInAt) {
        updateData.checkedInAt = new Date();
      } else if (body.status === 'CANCELLED' || body.status === 'DISQUALIFIED') {
        // Release the slot when cancelled or disqualified — slot can be reassigned
        updateData.slotNumber = null;
      }
    }

    // 2. Manual slot change
    if (body.slotNumber !== undefined) {
      if (body.slotNumber === null || body.slotNumber === '') {
        updateData.slotNumber = null;
      } else {
        const targetSlot = parseInt(String(body.slotNumber), 10);
        const { maxSlots } = await getTournamentSettings();

        if (isNaN(targetSlot) || targetSlot < 1 || targetSlot > maxSlots) {
          return NextResponse.json(
            { error: `Slot must be a number between 1 and ${maxSlots}` },
            { status: 400 }
          );
        }

        // Check if another active participant is already assigned to this slot
        const slotOccupant = await prisma.participant.findFirst({
          where: {
            slotNumber: targetSlot,
            id: { not: id },
            status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
          },
        });

        if (slotOccupant) {
          return NextResponse.json(
            {
              error: `Slot #${String(targetSlot).padStart(3, '0')} is already occupied by ${slotOccupant.fullName} (${slotOccupant.gamerTag}). Reassign them first.`,
            },
            { status: 400 }
          );
        }

        updateData.slotNumber = targetSlot;
        if (existing.status === 'WAITLISTED') {
          updateData.status = 'REGISTERED';
          updateData.waitlistPosition = null;
        }
      }
    }

    // 3. Promote from waitlist
    if (body.action === 'PROMOTE_WAITLIST') {
      const { maxSlots } = await getTournamentSettings();
      const occupied = await prisma.participant.findMany({
        where: {
          slotNumber: { not: null },
          status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
        },
        select: { slotNumber: true },
      });
      const occupiedSet = new Set(occupied.map((p) => p.slotNumber as number));
      let freeSlot: number | null = null;
      for (let s = 1; s <= maxSlots; s++) {
        if (!occupiedSet.has(s)) {
          freeSlot = s;
          break;
        }
      }

      if (!freeSlot) {
        return NextResponse.json(
          { error: 'Cannot promote: all tournament slots are currently occupied.' },
          { status: 400 }
        );
      }

      updateData.slotNumber = freeSlot;
      updateData.status = 'REGISTERED';
      updateData.waitlistPosition = null;
    }

    // 4. Notes or preferred fighter update
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.preferredFighter) updateData.preferredFighter = body.preferredFighter;

    const updated = await prisma.participant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, participant: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * SOFT DELETE — never hard-deletes a participant.
 * Sets status to CANCELLED and releases the slot.
 * Registration ID and audit history are preserved.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.participant.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Soft delete: preserve the record, release the slot, mark as CANCELLED
    const updated = await prisma.participant.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        slotNumber: null,
        waitlistPosition: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${updated.fullName} (${updated.registrationId}) has been cancelled. Record preserved for audit history.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Cancellation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
