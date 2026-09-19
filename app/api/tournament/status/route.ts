import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTournamentSettings } from '@/lib/allocator';
import { EVENT_CONFIG } from '@/lib/config';
import { TournamentStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, registeredCount, checkedInCount, waitlistCount] = await Promise.all([
      getTournamentSettings(),
      prisma.participant.count({
        where: {
          slotNumber: { not: null },
          status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
        },
      }),
      prisma.participant.count({
        where: { status: 'CHECKED-IN' },
      }),
      prisma.participant.count({
        where: { status: 'WAITLISTED' },
      }),
    ]);

    const { maxSlots, registrationOpen, waitlistEnabled } = settings;
    const availableSlots = Math.max(0, maxSlots - registeredCount);

    let status: TournamentStatus['status'] = 'OPEN';
    if (!registrationOpen) {
      status = 'CLOSED';
    } else if (availableSlots === 0) {
      status = waitlistEnabled ? 'WAITLIST_ACTIVE' : 'FULL';
    }

    const payload: TournamentStatus = {
      eventName: EVENT_CONFIG.EVENT_NAME,
      gameName: EVENT_CONFIG.GAME_NAME,
      format: EVENT_CONFIG.FORMAT,
      maxSlots,
      registeredCount,
      availableSlots,
      isRegistrationOpen: registrationOpen,
      waitlistEnabled,
      waitlistCount,
      checkedInCount,
      status,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=2',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query status';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
