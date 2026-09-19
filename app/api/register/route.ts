import { NextRequest, NextResponse } from 'next/server';
import { registerParticipant } from '@/lib/allocator';
import { RegistrationInput } from '@/lib/types';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  // Rate limit: 5 registration attempts per IP per minute (Point 18)
  const ip = getClientIp(req);
  if (isRateLimited(`register:${ip}`, RATE_LIMITS.REGISTRATION)) {
    return NextResponse.json(
      { success: false, error: 'Too many registration attempts. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const body: RegistrationInput = await req.json();

    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Point 18: Spam/Bot Protection - Server-side Honeypot Check
    if (body.honeypot && typeof body.honeypot === 'string' && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { success: false, error: 'Automated spam submission detected.' },
        { status: 400 }
      );
    }

    // Point 18: Spam/Bot Protection - Submission speed check (< 1.5 seconds)
    if (body.formLoadedAt && typeof body.formLoadedAt === 'number') {
      const elapsed = Date.now() - body.formLoadedAt;
      if (elapsed < 1500) {
        return NextResponse.json(
          {
            success: false,
            error: 'Form was submitted unnaturally fast. Please verify your details before submitting.',
          },
          { status: 400 }
        );
      }
    }

    const result = await registerParticipant(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to complete registration',
          field: result.field,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        registrationId: result.registrationId,
        slotNumber: result.slotNumber,
        status: result.status,
        waitlistPosition: result.waitlistPosition,
        message: result.slotNumber
          ? `Registration Confirmed! Allocated Slot #${String(result.slotNumber).padStart(3, '0')}`
          : `Tournament capacity reached. Added to Waitlist #${result.waitlistPosition}`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: `Registration error: ${msg}` },
      { status: 500 }
    );
  }
}
