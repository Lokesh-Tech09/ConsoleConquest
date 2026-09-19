import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  isAdminAuthenticated,
} from '@/lib/auth';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authenticated = isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  // Rate limit: 10 admin login attempts per IP per minute
  const ip = getClientIp(req);
  if (isRateLimited(`admin-login:${ip}`, RATE_LIMITS.ADMIN_LOGIN)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please wait a minute before retrying.' },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    // ALWAYS verify via DB bcrypt hash — no plaintext fallback
    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      // Generic message — don't reveal if username vs password is wrong
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Set HMAC-signed session cookie — not a static value
    setAdminSessionCookie(username.trim());

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  clearAdminSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out' });
}
