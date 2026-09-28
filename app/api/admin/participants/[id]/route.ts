import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { getTournamentSettings, calculatePoolFromSlot } from '@/lib/allocator';
import { normalizePhone } from '@/lib/validation';

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

    // 1. Participant detail corrections
    if (typeof body.fullName === 'string' && body.fullName.trim()) {
      updateData.fullName = body.fullName.trim();
    }
    if (typeof body.gamerTag === 'string' && body.gamerTag.trim()) {
      updateData.gamerTag = body.gamerTag.trim();
    }
    if (typeof body.college === 'string' && body.college.trim()) {
      updateData.college = body.college.trim();
    }

    // Roll number with uniqueness check
    if (body.rollNumber && typeof body.rollNumber === 'string') {
      const cleanRoll = body.rollNumber.trim().toUpperCase();
      if (cleanRoll !== existing.rollNumber) {
        const dupRoll = await prisma.participant.findFirst({
          where: { rollNumber: cleanRoll, id: { not: id } },
        });
        if (dupRoll) {
          return NextResponse.json(
            { error: `Roll Number "${cleanRoll}" is already registered by ${dupRoll.fullName} (${dupRoll.registrationId}).` },
            { status: 400 }
          );
        }
        updateData.rollNumber = cleanRoll;
      }
    }

    // Email with uniqueness check
    if (body.email && typeof body.email === 'string') {
      const cleanEmail = body.email.trim().toLowerCase();
      if (cleanEmail !== existing.email.toLowerCase()) {
        const dupEmail = await prisma.participant.findFirst({
          where: { email: cleanEmail, id: { not: id } },
        });
        if (dupEmail) {
          return NextResponse.json(
            { error: `Email "${cleanEmail}" is already registered by ${dupEmail.fullName} (${dupEmail.registrationId}).` },
            { status: 400 }
          );
        }
        updateData.email = cleanEmail;
      }
    }

    // Phone with uniqueness check
    if (body.phone && typeof body.phone === 'string') {
      const cleanPhone = normalizePhone(body.phone);
      if (cleanPhone !== existing.phone) {
        const dupPhone = await prisma.participant.findFirst({
          where: { phone: cleanPhone, id: { not: id } },
        });
        if (dupPhone) {
          return NextResponse.json(
            { error: `Phone number is already registered by ${dupPhone.fullName} (${dupPhone.registrationId}).` },
            { status: 400 }
          );
        }
        updateData.phone = cleanPhone;
      }
    }

    if (body.preferredFighter !== undefined) {
      updateData.preferredFighter = body.preferredFighter;
    }

    if (body.age !== undefined) {
      updateData.age = body.age ? Number(body.age) : null;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    // 2. Status changes
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'CHECKED-IN' && !existing.checkedInAt) {
        updateData.checkedInAt = new Date();
      } else if (body.status === 'CANCELLED' || body.status === 'DISQUALIFIED') {
        updateData.slotNumber = null;
        updateData.pool = null;
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
      updateData.pool = calculatePoolFromSlot(freeSlot, maxSlots);
      updateData.status = 'REGISTERED';
      updateData.waitlistPosition = null;
    }

    // 4. Slot Customization & Swapping
    if (body.slotNumber !== undefined) {
      if (body.slotNumber === null || body.slotNumber === '') {
        updateData.slotNumber = null;
        updateData.pool = null;
      } else {
        const targetSlot = parseInt(String(body.slotNumber), 10);
        const { maxSlots } = await getTournamentSettings();

        if (isNaN(targetSlot) || targetSlot < 1 || targetSlot > maxSlots) {
          return NextResponse.json(
            { error: `Slot must be a number between 1 and ${maxSlots}` },
            { status: 400 }
          );
        }

        const targetPool = calculatePoolFromSlot(targetSlot, maxSlots);

        // Only check if slot is actually different from current
        if (targetSlot !== existing.slotNumber) {
          const slotOccupant = await prisma.participant.findFirst({
            where: {
              slotNumber: targetSlot,
              id: { not: id },
              status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
            },
          });

          if (slotOccupant) {
            if (body.swapWithOccupant) {
              // Perform atomic swap between current participant and occupant
              const [updatedCurrent, updatedOccupant] = await prisma.$transaction(async (tx) => {
                // Step A: Disconnect current player's slot to avoid unique constraint clash
                await tx.participant.update({
                  where: { id },
                  data: { slotNumber: null, pool: null },
                });

                // Step B: Move occupant into current participant's old slot (or null if current had none)
                const occupantNewSlot = existing.slotNumber;
                const occupantNewPool = calculatePoolFromSlot(occupantNewSlot, maxSlots);
                const occ = await tx.participant.update({
                  where: { id: slotOccupant.id },
                  data: {
                    slotNumber: occupantNewSlot,
                    pool: occupantNewPool,
                    status: occupantNewSlot ? slotOccupant.status : 'WAITLISTED',
                  },
                });

                // Step C: Move current player into target slot and apply other edits
                updateData.slotNumber = targetSlot;
                updateData.pool = targetPool;
                if (existing.status === 'WAITLISTED') {
                  updateData.status = 'REGISTERED';
                  updateData.waitlistPosition = null;
                }

                const curr = await tx.participant.update({
                  where: { id },
                  data: updateData,
                });

                return [curr, occ];
              });

              return NextResponse.json({
                success: true,
                participant: updatedCurrent,
                swapped: true,
                message: `Swapped slots: ${updatedCurrent.fullName} is now Slot #${String(targetSlot).padStart(3, '0')}, and ${updatedOccupant.fullName} is now ${existing.slotNumber ? `Slot #${String(existing.slotNumber).padStart(3, '0')}` : 'Waitlisted'}.`,
              });
            } else {
              return NextResponse.json(
                {
                  error: `Slot #${String(targetSlot).padStart(3, '0')} is already occupied by ${slotOccupant.fullName} (${slotOccupant.gamerTag}).`,
                  occupied: true,
                  occupant: {
                    id: slotOccupant.id,
                    fullName: slotOccupant.fullName,
                    gamerTag: slotOccupant.gamerTag,
                    slotNumber: slotOccupant.slotNumber,
                  },
                },
                { status: 400 }
              );
            }
          }

          // Slot is open / unoccupied
          updateData.slotNumber = targetSlot;
          updateData.pool = targetPool;
          if (existing.status === 'WAITLISTED') {
            updateData.status = 'REGISTERED';
            updateData.waitlistPosition = null;
          }
        }
      }
    }

    const updated = await prisma.participant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      participant: updated,
      message: 'Participant details updated successfully!',
    });
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
