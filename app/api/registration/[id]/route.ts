import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limit: 30 lookups per IP per minute
  const ip = getClientIp(req);
  if (isRateLimited(`lookup:${ip}`, RATE_LIMITS.LOOKUP)) {
    return NextResponse.json(
      { error: 'Too many lookup requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const rawId = decodeURIComponent(params.id).trim();

    if (!rawId) {
      return NextResponse.json({ error: 'Missing identification parameter' }, { status: 400 });
    }

    // Public lookup: only by registrationId (e.g. CC-2026-0017)
    // Email lookup is NOT permitted here — it would allow email enumeration.
    // Admins can look up by email through the protected admin API.
    const participant = await prisma.participant.findFirst({
      where: { registrationId: { equals: rawId } },
    });

    if (!participant) {
      // Generic message — don't reveal if the ID doesn't exist vs wrong format
      return NextResponse.json(
        { error: `No registration found matching "${rawId}". Check the ID and try again.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        registrationId: participant.registrationId,
        slotNumber: participant.slotNumber,
        fullName: participant.fullName,
        college: participant.college,
        gamerTag: participant.gamerTag,
        preferredFighter: participant.preferredFighter,
        status: participant.status,
        waitlistPosition: participant.waitlistPosition,
        checkedInAt: participant.checkedInAt,
        createdAt: participant.createdAt,
        // Sensitive fields (email, phone, rollNumber) are NOT returned here
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lookup failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
