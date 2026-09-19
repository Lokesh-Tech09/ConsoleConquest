import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureBracketMatchesExist } from '@/lib/bracketManager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pool = searchParams.get('pool');

    // Ensure 128-player tournament tree exists
    await ensureBracketMatchesExist();

    const whereClause: Record<string, unknown> = {};
    if (pool && pool !== 'ALL') {
      whereClause.pool = pool;
    }

    const [matches, participants] = await Promise.all([
      prisma.match.findMany({
        where: whereClause,
        orderBy: [
          { pool: 'asc' },
          { round: 'asc' },
          { matchNumber: 'asc' },
        ],
      }),
      prisma.participant.findMany({
        where: {
          slotNumber: { not: null },
          status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
        },
        select: {
          slotNumber: true,
          pool: true,
          fullName: true,
          gamerTag: true,
          preferredFighter: true,
          college: true,
          status: true,
        },
        orderBy: { slotNumber: 'asc' },
      }),
    ]);

    // Build fast O(1) slot map of registered fighters
    const participantSlotMap = new Map<number, typeof participants[0]>();
    participants.forEach((p) => {
      if (p.slotNumber !== null) {
        participantSlotMap.set(p.slotNumber, p);
      }
    });

    // Dynamically enrich matches with active registered contenders
    const enrichedMatches = matches.map((m) => {
      let p1Name = m.player1Name;
      let p1Tag = m.player1Tag;
      let p1Fighter = m.player1Fighter;

      let p2Name = m.player2Name;
      let p2Tag = m.player2Tag;
      let p2Fighter = m.player2Fighter;

      // In Round 1, reflect actual registered participant names and fighter selections instantly
      if (m.round === 1) {
        if (m.player1Slot) {
          const p1 = participantSlotMap.get(m.player1Slot);
          if (p1) {
            p1Name = p1.fullName;
            p1Tag = p1.gamerTag;
            p1Fighter = p1.preferredFighter;
          } else {
            p1Name = `Slot #${String(m.player1Slot).padStart(3, '0')} (Open)`;
            p1Tag = null;
            p1Fighter = null;
          }
        }

        if (m.player2Slot) {
          const p2 = participantSlotMap.get(m.player2Slot);
          if (p2) {
            p2Name = p2.fullName;
            p2Tag = p2.gamerTag;
            p2Fighter = p2.preferredFighter;
          } else {
            p2Name = `Slot #${String(m.player2Slot).padStart(3, '0')} (Open)`;
            p2Tag = null;
            p2Fighter = null;
          }
        }
      }

      return {
        ...m,
        player1Name: p1Name,
        player1Tag: p1Tag,
        player1Fighter: p1Fighter,
        player2Name: p2Name,
        player2Tag: p2Tag,
        player2Fighter: p2Fighter,
      };
    });

    // Group matches by pool and round
    const byPool: Record<string, Record<number, typeof enrichedMatches>> = {};
    enrichedMatches.forEach((m) => {
      const p = m.pool || 'A';
      if (!byPool[p]) byPool[p] = {};
      if (!byPool[p][m.round]) byPool[p][m.round] = [];
      byPool[p][m.round].push(m);
    });

    return NextResponse.json(
      {
        success: true,
        matches: enrichedMatches,
        byPool,
        participants,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=2',
        },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch bracket';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
