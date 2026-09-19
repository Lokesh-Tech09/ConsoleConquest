import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/reset
 * Clears ALL participants and matches.
 * Requires: admin session + confirmation token in body.
 * Settings and AdminUser records are preserved.
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Require explicit confirmation string to prevent accidental calls
    if (body.confirm !== 'CLEAR ALL REGISTRATIONS') {
      return NextResponse.json(
        { error: 'Missing confirmation. Send { confirm: "CLEAR ALL REGISTRATIONS" }' },
        { status: 400 }
      );
    }

    // Delete in correct order (matches reference participants via slot numbers)
    const matchResult = await prisma.match.deleteMany();
    const participantResult = await prisma.participant.deleteMany();

    // Re-initialize clean 128-player championship bracket skeleton immediately
    const { ensureBracketMatchesExist } = await import('@/lib/bracketManager');
    await ensureBracketMatchesExist();

    return NextResponse.json({
      success: true,
      message: `Tournament reset complete. Cleared ${participantResult.count} participants and reset bracket tree.`,
      cleared: {
        participants: participantResult.count,
        matches: matchResult.count,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Reset failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
