"use client";

import { useEffect } from 'react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { cleanupExpiredGeneratedImages } from '@/lib/storage/generated-images-local';

/**
 * GeneratedImagesCleaner – invisible component that removes expired
 * generated-image records (older than 1 h) from localStorage every time
 * the app mounts and whenever the user ID changes.
 */
export default function GeneratedImagesCleaner() {
  const { profile } = useUserProfile();

  useEffect(() => {
    if (!profile?.userId) return;
    cleanupExpiredGeneratedImages(profile.userId);
  }, [profile?.userId]);

  return null; // Renders nothing
} 