import { prisma } from './db';
import { MatchData } from './types';

/**
 * Ensures that the full 128-player championship bracket skeleton
 * (Pools A, B, C, D rounds 1-5 + FINALS rounds 1-2) exists in the database.
 * If empty, generates all 127 tournament matches in a single batch.
 */
export async function ensureBracketMatchesExist(): Promise<void> {
  const matchCount = await prisma.match.count();
  if (matchCount > 0) {
    return;
  }

  const pools = ['A', 'B', 'C', 'D'];
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
    const poolStartSlot = pIdx * 32 + 1;

    // Round 1: 16 matches (R32) - Sequential registration-order pairing (Slot 1 vs 2, Slot 3 vs 4...)
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

  // Championship Finals
  // Round 1: Semifinals (Winner A vs B, Winner C vs D)
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

  // Round 2: Grand Final & 3rd Place Match
  matchesToCreate.push({
    pool: 'FINALS',
    round: 2,
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
    round: 2,
    matchNumber: 2,
    player1Slot: null,
    player2Slot: null,
    player1Name: 'Winner Semifinal 1',
    player2Name: 'Winner Semifinal 2',
    score1: 0,
    score2: 0,
    status: 'SCHEDULED',
  });

  await prisma.match.createMany({
    data: matchesToCreate,
  });
}
