import bcrypt from 'bcryptjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

// HMAC-signed session token — not a static string.
// AUTH_SECRET must be set in .env (min 32 chars recommended).
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  'CHANGE_THIS_TO_A_RANDOM_SECRET_IN_PRODUCTION_AT_LEAST_32_CHARS';

const COOKIE_NAME = 'cc_admin_token';
const SESSION_VERSION = 'v1'; // increment to invalidate all sessions

/** Build an HMAC-signed session token: "<payload>.<signature>" */
function buildToken(username: string): string {
  const payload = `${SESSION_VERSION}:${username}:${Date.now()}`;
  const sig = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${sig}`;
}

/** Verify an HMAC-signed session token. Returns username or null. */
function verifyToken(token: string): string | null {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;

    const encodedPayload = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    // Recompute expected signature
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const expectedSig = createHmac('sha256', AUTH_SECRET)
      .update(payload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    // Check version prefix
    if (!payload.startsWith(`${SESSION_VERSION}:`)) return null;

    const parts = payload.split(':');
    return parts[1] || null; // username
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // Import prisma here to avoid circular deps
  const { prisma } = await import('./db');

  const admin = await prisma.adminUser.findUnique({
    where: { username: username.trim() },
  });

  if (!admin) return false;
  return bcrypt.compare(password, admin.passwordHash);
}

export function setAdminSessionCookie(username: string) {
  const cookieStore = cookies();
  const token = buildToken(username);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
}

export function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token?.value) return false;
    return verifyToken(token.value) !== null;
  } catch {
    return false;
  }
}

export function getAdminUsername(): string | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token?.value) return null;
    return verifyToken(token.value);
  } catch {
    return null;
  }
}
