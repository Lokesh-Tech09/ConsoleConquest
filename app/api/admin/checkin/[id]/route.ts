import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [{ id }, { registrationId: id }],
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const updated = await prisma.participant.update({
      where: { id: participant.id },
      data: {
        status: 'CHECKED-IN',
        checkedInAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${updated.fullName} (${updated.gamerTag}) checked in successfully for Slot #${updated.slotNumber}!`,
      participant: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Check-in failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
