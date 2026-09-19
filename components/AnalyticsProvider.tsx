'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'all' && pathname) {
        trackPageView(pathname);
      }
    };

    window.addEventListener('cookie_consent_changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie_consent_changed', handleConsentChange);
    };
  }, [pathname]);

  return null;
}
