"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * A utility hook that listens for Next.js route changes and emits a custom event.
 * This is useful for triggering actions when the user navigates between pages.
 */
export function useRouteChangeEvent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Combine path and query params to track full route changes
  const fullRoute = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

  useEffect(() => {
    // When the route changes, dispatch a custom event that our hooks can listen for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('routeChangeComplete', {
        detail: {
          pathname,
          searchParams: searchParams?.toString(),
          timestamp: Date.now()
        }
      }));
    }
  }, [fullRoute, pathname, searchParams]);
  
  // This hook doesn't return anything, it just registers the effect
  return null;
} 