import { prisma } from './db';
import { MatchData } from './types';

/**
 * Ensures that the full 256-player championship bracket skeleton
 * (Pools A through H rounds 1-5 + FINALS rounds 1-3) exists in the database.
 * If empty or incomplete, generates all required tournament matches.
 */
export async function ensureBracketMatchesExist(): Promise<void> {
  const pools = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Check which pools already exist
  const existingPools = await prisma.match.findMany({
    select: { pool: true },
    distinct: ['pool'],
  });
  const existingPoolSet = new Set(existingPools.map((p) => p.pool));

  const matchesToCreate: Array<{
    pool: string;
    round: number;
    matchNumber: number;
    player1Slot: number | null;
    player2Slot: number | null;
    player1Name: string | null;
    player2Name: string | null;
    score1: number;
    score2: number;
    status: string;
  }> = [];

  for (let pIdx = 0; pIdx < pools.length; pIdx++) {
    const poolName = pools[pIdx];
    if (existingPoolSet.has(poolName)) {
      continue; // Skip pools that already exist
    }

    const poolStartSlot = pIdx * 32 + 1;

    // Round 1: 16 matches (R32) - Sequential pairing (Slot 1 vs 2, Slot 3 vs 4...)
    for (let m = 1; m <= 16; m++) {
      const s1 = poolStartSlot + (m - 1) * 2;
      const s2 = poolStartSlot + (m - 1) * 2 + 1;

      matchesToCreate.push({
        pool: poolName,
        round: 1,
        matchNumber: m,
        player1Slot: s1,
        player2Slot: s2,
        player1Name: `Slot #${s1}`,
        player2Name: `Slot #${s2}`,
        score1: 0,
        score2: 0,
        status: 'SCHEDULED',
      });
    }

    // Round 2: 8 matches (R16)
    for (let m = 1; m <= 8; m++) {
      matchesToCreate.push({
        pool: poolName,
        round: 2,
        matchNumber: m,
        player1Slot: null,
        player2Slot: null,
        player1Name: `Winner Match #${(m - 1) * 2 + 1}`,
        player2Name: `Winner Match #${(m - 1) * 2 + 2}`,
        score1: 0,
        score2: 0,
        status: 'SCHEDULED',
      });
    }

    // Round 3: 4 matches (Quarterfinals)
    for (let m = 1; m <= 4; m++) {
      matchesToCreate.push({
        pool: poolName,
        round: 3,
        matchNumber: m,
        player1Slot: null,
        player2Slot: null,
        player1Name: `Winner R16 #${(m - 1) * 2 + 1}`,
        player2Name: `Winner R16 #${(m - 1) * 2 + 2}`,
        score1: 0,
        score2: 0,
        status: 'SCHEDULED',
      });
    }

    // Round 4: 2 matches (Semifinals)
    for (let m = 1; m <= 2; m++) {
      matchesToCreate.push({
        pool: poolName,
        round: 4,
        matchNumber: m,
        player1Slot: null,
        player2Slot: null,
        player1Name: `Winner QF #${(m - 1) * 2 + 1}`,
        player2Name: `Winner QF #${(m - 1) * 2 + 2}`,
        score1: 0,
        score2: 0,
        status: 'SCHEDULED',
      });
    }

    // Round 5: 1 match (Group Final)
    matchesToCreate.push({
      pool: poolName,
      round: 5,
      matchNumber: 1,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner SF #1',
      player2Name: 'Winner SF #2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });
  }

  // Ensure FINALS bracket structure (8 Pool Champions -> 4 QF, 2 SF, 2 Finals)
  const finalsMatches = await prisma.match.findMany({
    where: { pool: 'FINALS' },
  });

  // If FINALS matches don't exist or need 8-pool structure
  if (finalsMatches.length < 8) {
    // Delete existing old 4-match finals if present
    if (finalsMatches.length > 0) {
      await prisma.match.deleteMany({ where: { pool: 'FINALS' } });
    }

    // Championship Finals (8 Pool Champions)
    // Round 1: Championship Quarterfinals (4 matches)
    matchesToCreate.push({
      pool: 'FINALS',
      round: 1,
      matchNumber: 1,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner Pool A',
      player2Name: 'Winner Pool B',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    matchesToCreate.push({
      pool: 'FINALS',
      round: 1,
      matchNumber: 2,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner Pool C',
      player2Name: 'Winner Pool D',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    matchesToCreate.push({
      pool: 'FINALS',
      round: 1,
      matchNumber: 3,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner Pool E',
      player2Name: 'Winner Pool F',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    matchesToCreate.push({
      pool: 'FINALS',
      round: 1,
      matchNumber: 4,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner Pool G',
      player2Name: 'Winner Pool H',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    // Round 2: Championship Semifinals (2 matches)
    matchesToCreate.push({
      pool: 'FINALS',
      round: 2,
      matchNumber: 1,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner QF #1',
      player2Name: 'Winner QF #2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    matchesToCreate.push({
      pool: 'FINALS',
      round: 2,
      matchNumber: 2,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner QF #3',
      player2Name: 'Winner QF #4',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    // Round 3: Grand Final & 3rd Place Match
    matchesToCreate.push({
      pool: 'FINALS',
      round: 3,
      matchNumber: 1,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Loser Semifinal 1',
      player2Name: 'Loser Semifinal 2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });

    matchesToCreate.push({
      pool: 'FINALS',
      round: 3,
      matchNumber: 2,
      player1Slot: null,
      player2Slot: null,
      player1Name: 'Winner Semifinal 1',
      player2Name: 'Winner Semifinal 2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    });
  }

  if (matchesToCreate.length > 0) {
    await prisma.match.createMany({
      data: matchesToCreate,
    });
  }
}
