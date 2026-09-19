import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.tournamentSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to get settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: Record<string, string> = await req.json();

    // ── Capacity validation ──────────────────────────────────────────────
    if (body.MAX_SLOTS !== undefined) {
      const newMaxSlots = parseInt(body.MAX_SLOTS, 10);

      if (isNaN(newMaxSlots) || newMaxSlots < 2) {
        return NextResponse.json(
          { error: 'MAX_SLOTS must be a number ≥ 2' },
          { status: 400 }
        );
      }

      // Count currently active participants (registered + checked-in + playing + advanced)
      const activeCount = await prisma.participant.count({
        where: {
          slotNumber: { not: null },
          status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
        },
      });

      if (newMaxSlots < activeCount) {
        return NextResponse.json(
          {
            error: `Cannot reduce capacity below the number of currently active registrations.`,
            detail: {
              currentCapacity: parseInt(
                (
                  await prisma.tournamentSetting.findUnique({
                    where: { key: 'MAX_SLOTS' },
                  })
                )?.value || '128',
                10
              ),
              requestedCapacity: newMaxSlots,
              activeRegistrations: activeCount,
              message: `There are ${activeCount} active players. New capacity must be at least ${activeCount}.`,
            },
          },
          { status: 400 }
        );
      }
    }
    // ────────────────────────────────────────────────────────────────────

    // Upsert all provided settings
    for (const [key, value] of Object.entries(body)) {
      await prisma.tournamentSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
