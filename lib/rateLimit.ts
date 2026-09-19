/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Works for single-instance deployments (development, event-scale production).
 * For multi-instance deployments, swap the Map for a Redis-backed store.
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

// Separate windows per limit-group so config is not shared
const windows = new Map<string, WindowEntry>();

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

// Predefined configs for different endpoint groups
export const RATE_LIMITS = {
  REGISTRATION: { limit: 120, windowMs: 60_000 },  // 120 per minute — allows 50+ simultaneous registrations
  ADMIN_LOGIN:  { limit: 30, windowMs: 60_000 },   // 30 per minute per IP
  LOOKUP:       { limit: 100, windowMs: 60_000 },  // 100 per minute per IP
  DEFAULT:      { limit: 200, windowMs: 60_000 },  // 200 per minute per IP
} satisfies Record<string, RateLimitConfig>;

/**
 * Returns true if the request should be BLOCKED (rate limit exceeded).
 * Returns false if the request should be allowed through.
 *
 * @param key  Unique identifier — typically `${group}:${ip}`
 * @param cfg  Rate limit config to apply
 */
export function isRateLimited(key: string, cfg: RateLimitConfig): boolean {
  // Relax rate limiting for local development, loopback, or internal test runs
  if (
    key.includes('127.0.0.1') ||
    key.includes('::1') ||
    key.includes('localhost') ||
    key.endsWith(':unknown')
  ) {
    cfg = { ...cfg, limit: Math.max(cfg.limit, 300) };
  }

  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now > entry.resetAt) {
    // First request in this window — allow and initialize
    windows.set(key, { count: 1, resetAt: now + cfg.windowMs });
    return false;
  }

  if (entry.count >= cfg.limit) {
    return true; // BLOCKED
  }

  entry.count++;
  return false;
}

/**
 * Extract the best available client IP from Next.js request headers.
 * Falls back to 'unknown' if no header is present.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

// ── Cleanup ──────────────────────────────────────────────────────────────────
// Periodically purge expired entries to prevent unbounded memory growth.
// Runs every 5 minutes in the background.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of windows.entries()) {
      if (now > entry.resetAt) {
        windows.delete(key);
      }
    }
  }, 5 * 60_000);
}
