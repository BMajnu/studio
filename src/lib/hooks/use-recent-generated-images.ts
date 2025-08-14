import { useEffect, useState } from 'react';
import { GeneratedImage } from '@/lib/types';
import { loadRecentGeneratedImages, saveGeneratedImagesLocal } from '@/lib/storage/generated-images-local';
import { GeneratedImageStorage } from '@/lib/firebase/generatedImageStorage';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderCached, fetchRecentImagesDataUrisFromDrive } from '@/lib/integrations/google-drive';

/**
 * Fetches all generated images stored in sessionStorage (this session only)
 */
export function useRecentGeneratedImages(userId?: string) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { googleAccessToken } = useAuth();

  useEffect(() => {
    if (!userId) return;

    // Keep a reference to the most recent images to avoid redundant re-renders
    let currentImages: GeneratedImage[] = [];
    let unsub: ReturnType<typeof GeneratedImageStorage.watchRecentImages> | null = null;
    let driveFetchedOnce = false;

    const mergeAndSet = (arr: GeneratedImage[]) => {
      const byId = new Map<string, GeneratedImage>();
      for (const img of [...arr, ...currentImages]) {
        const id = img.id || `${img.createdAt}-${Math.random()}`;
        if (!byId.has(id)) byId.set(id, { ...img, id });
      }
      const merged = Array.from(byId.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setImages(merged);
      currentImages = merged;
    };

    const initFromSession = () => {
      const sessionImages = loadRecentGeneratedImages(userId);
      if (sessionImages.length) {
        mergeAndSet(sessionImages);
      }
    };

    const loadFromFirebaseAndDrive = async () => {
      setLoading(true);
      try {
        // 1) Live watch Firebase recent (24h)
        unsub = GeneratedImageStorage.watchRecentImages(userId, async (remote) => {
          mergeAndSet(remote);
          // Keep session cache fresh for snappy reloads
          try { await saveGeneratedImagesLocal(userId, remote); } catch {}

          // Optional debug: Firebase live update count
          try {
            if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
              console.debug('[Images][Firebase] live update', { count: (remote || []).length });
            }
          } catch {}

          // If Drive available, supplement missing items (once per mount)
          if (googleAccessToken && !driveFetchedOnce) {
            driveFetchedOnce = true;
            try {
              const existingIds = new Set((remote || []).map(r => r.id).filter(Boolean) as string[]);
              const folderId = await ensureAppFolderCached(googleAccessToken, 'DesAInR');
              const driveFiles = await fetchRecentImagesDataUrisFromDrive(googleAccessToken, folderId, 20);
              const mapped: GeneratedImage[] = driveFiles.map(f => ({
                id: (f.appProperties?.imageId as string) || f.id,
                dataUri: f.dataUri,
                alt: f.name || 'Generated image',
                prompt: (f.appProperties?.prompt as string) || 'Generated image',
                createdAt: Number(f.appProperties?.createdAt) || Date.parse(f.createdTime) || Date.now(),
              })).filter(img => !existingIds.has(img.id!));
              // Optional debug: Drive supplement counts
              try {
                if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
                  console.debug('[Images][Drive] supplement', { fetched: driveFiles.length, added: mapped.length });
                }
              } catch {}
              if (mapped.length) {
                mergeAndSet(mapped);
                try { await saveGeneratedImagesLocal(userId, mapped); } catch {}
              }
            } catch (e) {
              console.warn('Drive supplement failed', e);
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    // 1) Immediate session display
    initFromSession();
    // 2) Start live sync
    loadFromFirebaseAndDrive();

    // Handler for custom events (same tab)
    const handleUpdate = (e: Event) => {
      const detailUserId = (e as CustomEvent).detail?.userId;
      if (!detailUserId || detailUserId === userId) {
        initFromSession();
      }
    };

    window.addEventListener('generated-images-updated', handleUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('generated-images-updated', handleUpdate);
      if (typeof unsub === 'function') unsub();
    };
  }, [userId, googleAccessToken]);

  return { images, loading };
}