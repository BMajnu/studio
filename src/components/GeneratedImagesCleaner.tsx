"use client";

import { useEffect } from 'react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { cleanupExpiredGeneratedImages } from '@/lib/storage/generated-images-local';

/**
 * GeneratedImagesCleaner – invisible component that rewrites session-based
 * generated-image records in sessionStorage when the app mounts or the user ID
 * changes. Images in sessionStorage persist only for the current tab/session
 * (i.e., until the browser/tab is closed); TTL trimming is handled by Firestore
 * for cloud copies (24h) – not enforced locally.
 */
export default function GeneratedImagesCleaner() {
  const { profile } = useUserProfile();

  useEffect(() => {
    if (!profile?.userId) return;
    cleanupExpiredGeneratedImages(profile.userId);
  }, [profile?.userId]);

  return null; // Renders nothing
} 