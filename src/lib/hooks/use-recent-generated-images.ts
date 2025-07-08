import { useEffect, useState } from 'react';
import { GeneratedImage } from '@/lib/types';
import { loadRecentGeneratedImages } from '@/lib/storage/generated-images-local';
import { loadImagesIndexedDB } from '@/lib/storage/generated-images-indexeddb';

/**
 * Fetches all generated images stored in localStorage (no expiration)
 */
export function useRecentGeneratedImages(userId?: string) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Keep a reference to the most recent images to avoid redundant re-renders
    let currentImages: GeneratedImage[] = [];

    const loadImages = async () => {
      // Load from localStorage first (quick)
      const localImages = loadRecentGeneratedImages(userId);

      // Attempt to load from IndexedDB (may have more)
      let indexedImages: GeneratedImage[] = [];
      try {
        indexedImages = await loadImagesIndexedDB(userId);
      } catch (err) {
        console.error('Failed to load images from IndexedDB', err);
      }

      // Merge, preferring IndexedDB (it should include all local images anyway)
      const merged = [...indexedImages];
      const existingSet = new Set(merged.map(img => img.id));
      for (const img of localImages) {
        if (!img.id || !existingSet.has(img.id)) {
          merged.push(img);
        }
      }
      // Sort newest first
      merged.sort((a,b) => (b.createdAt||0)-(a.createdAt||0));
      setImages(merged);
      currentImages = [...merged];
    };

    loadImages();

    // Handler for custom events (same tab)
    const handleUpdate = (e: Event) => {
      const detailUserId = (e as CustomEvent).detail?.userId;
      if (!detailUserId || detailUserId === userId) {
        loadImages();
      }
    };

    // Handler for storage events (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `desainr_generated_images_${userId}`) {
        loadImages();
      }
    };

    window.addEventListener('generated-images-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    // Cleanup
    return () => {
      window.removeEventListener('generated-images-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [userId]);

  return { images, loading };
} 