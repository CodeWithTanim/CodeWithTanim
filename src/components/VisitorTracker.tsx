'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking admin routes
    if (!pathname || pathname.startsWith('/habiba')) return;

    // Throttle tracking the same page repeatedly in fast navigation
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      }).catch(() => {
        // Analytics failure should never break user experience
      });
    } catch {
      // Ignore
    }
  }, [pathname]);

  return null;
}
