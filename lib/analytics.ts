/**
 * Lightweight, privacy-respecting client analytics tracker for Console Conquest (Point 19).
 * Fully respects user choice in CookieConsent (Points 5 & 19).
 * Does not collect PII or store cross-site tracking cookies.
 */

export interface AnalyticsEvent {
  event: string;
  timestamp: string;
  properties?: Record<string, unknown>;
  path?: string;
}

function isAnalyticsPermitted(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cc_cookie_consent');
  // Only track if user explicitly accepted 'all'
  return consent === 'all';
}

export function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  if (!isAnalyticsPermitted()) return;

  const eventPayload: AnalyticsEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    properties,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  };

  try {
    // Store recent local session events (capped at 50) for in-app funnel diagnostics
    const stored = JSON.parse(
      sessionStorage.getItem('cc_analytics_events') || '[]'
    ) as AnalyticsEvent[];
    stored.push(eventPayload);
    if (stored.length > 50) stored.shift();
    sessionStorage.setItem('cc_analytics_events', JSON.stringify(stored));

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] 📊 Event: ${eventName}`, properties);
    }
  } catch {
    // Ignore storage issues in private browsing
  }
}

export function trackPageView(pathname: string) {
  trackEvent('page_view', { pathname, referrer: typeof document !== 'undefined' ? document.referrer : '' });
}
