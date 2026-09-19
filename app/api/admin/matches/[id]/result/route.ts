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
    const matchId = params.id;
    const body = await req.json();
    const { score1, score2, winnerSlot, status } = body;

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const isCompleted = status === 'COMPLETED' || winnerSlot !== undefined;
    const chosenWinnerSlot = winnerSlot !== undefined && winnerSlot !== null ? Number(winnerSlot) : null;

    // Determine default scores if not explicitly provided
    let finalScore1 = score1 !== undefined && score1 !== null ? Number(score1) : match.score1;
    let finalScore2 = score2 !== undefined && score2 !== null ? Number(score2) : match.score2;

    if (chosenWinnerSlot && finalScore1 === 0 && finalScore2 === 0) {
      const defaultWinScore = match.round >= 5 ? 2 : 1;
      if (chosenWinnerSlot === match.player1Slot) {
        finalScore1 = defaultWinScore;
        finalScore2 = 0;
      } else if (chosenWinnerSlot === match.player2Slot) {
        finalScore1 = 0;
        finalScore2 = defaultWinScore;
      }
    }

    // Look up winner details from participants table
    let winnerName: string | null = null;
    let winnerTag: string | null = null;
    let winnerFighter: string | null = null;

    let loserSlot: number | null = null;
    let loserName: string | null = null;
    let loserTag: string | null = null;
    let loserFighter: string | null = null;

    if (chosenWinnerSlot) {
      const winnerParticipant = await prisma.participant.findFirst({
        where: { slotNumber: chosenWinnerSlot },
      });

      if (chosenWinnerSlot === match.player1Slot) {
        winnerName = winnerParticipant?.fullName || match.player1Name || `Slot #${chosenWinnerSlot}`;
        winnerTag = winnerParticipant?.gamerTag || match.player1Tag || null;
        winnerFighter = winnerParticipant?.preferredFighter || match.player1Fighter || null;

        loserSlot = match.player2Slot;
        loserName = match.player2Name;
        loserTag = match.player2Tag;
        loserFighter = match.player2Fighter;
      } else if (chosenWinnerSlot === match.player2Slot) {
        winnerName = winnerParticipant?.fullName || match.player2Name || `Slot #${chosenWinnerSlot}`;
        winnerTag = winnerParticipant?.gamerTag || match.player2Tag || null;
        winnerFighter = winnerParticipant?.preferredFighter || match.player2Fighter || null;

        loserSlot = match.player1Slot;
        loserName = match.player1Name;
        loserTag = match.player1Tag;
        loserFighter = match.player1Fighter;
      }
    }

    // Update current match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        score1: finalScore1,
        score2: finalScore2,
        winnerSlot: chosenWinnerSlot,
        winnerName,
        status: isCompleted ? 'COMPLETED' : (status || 'SCHEDULED'),
      },
    });

    // Advance winner to next round when completed
    if (updatedMatch.status === 'COMPLETED' && chosenWinnerSlot) {
      let targetPool = match.pool;
      let targetRound = match.round + 1;
      let targetMatchNumber = Math.ceil(match.matchNumber / 2);
      let isPlayer1InNext = match.matchNumber % 2 !== 0;

      // Special Case 1: Pool Championship (Round 5) -> Advances to FINALS Round 1 (Semifinals)
      if (match.pool !== 'FINALS' && match.round === 5) {
        targetPool = 'FINALS';
        targetRound = 1;
        if (match.pool === 'A') {
          targetMatchNumber = 1;
          isPlayer1InNext = true;
        } else if (match.pool === 'B') {
          targetMatchNumber = 1;
          isPlayer1InNext = false;
        } else if (match.pool === 'C') {
          targetMatchNumber = 2;
          isPlayer1InNext = true;
        } else if (match.pool === 'D') {
          targetMatchNumber = 2;
          isPlayer1InNext = false;
        }
      }
      // Special Case 2: FINALS Semifinals (Round 1) -> Match 2 is Grand Final, Match 1 is 3rd Place
      else if (match.pool === 'FINALS' && match.round === 1) {
        // Winners go to Grand Final (FINALS Round 2, Match 2)
        targetPool = 'FINALS';
        targetRound = 2;
        targetMatchNumber = 2; // Match #2 is Grand Final
        isPlayer1InNext = match.matchNumber === 1;

        // Losers go to 3rd Place match (FINALS Round 2, Match 1)
        if (loserSlot) {
          const thirdPlaceMatch = await prisma.match.findFirst({
            where: { pool: 'FINALS', round: 2, matchNumber: 1 },
          });
          const thirdPlaceData: Record<string, unknown> = match.matchNumber === 1
            ? { player1Slot: loserSlot, player1Name: loserName, player1Tag: loserTag, player1Fighter: loserFighter }
            : { player2Slot: loserSlot, player2Name: loserName, player2Tag: loserTag, player2Fighter: loserFighter };

          if (thirdPlaceMatch) {
            await prisma.match.update({
              where: { id: thirdPlaceMatch.id },
              data: thirdPlaceData,
            });
          }
        }
      }

      // Check if not Grand Final (Grand Final has no next round)
      const isGrandFinal = match.pool === 'FINALS' && match.round === 2;
      if (!isGrandFinal) {
        const nextMatch = await prisma.match.findFirst({
          where: {
            pool: targetPool,
            round: targetRound,
            matchNumber: targetMatchNumber,
          },
        });

        const nextData: Record<string, unknown> = isPlayer1InNext
          ? {
              player1Slot: chosenWinnerSlot,
              player1Name: winnerName,
              player1Tag: winnerTag,
              player1Fighter: winnerFighter,
            }
          : {
              player2Slot: chosenWinnerSlot,
              player2Name: winnerName,
              player2Tag: winnerTag,
              player2Fighter: winnerFighter,
            };

        if (nextMatch) {
          await prisma.match.update({
            where: { id: nextMatch.id },
            data: nextData,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      match: updatedMatch,
      winner: winnerName,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update match';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
