'use client';

import { notFound } from 'next/navigation';

export default function ExtensionConnect() {
  // Legacy redirect-based extension connect route has been removed.
  // Return 404 to indicate this page no longer exists.
  notFound();
}
