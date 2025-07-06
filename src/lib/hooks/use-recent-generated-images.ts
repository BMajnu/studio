import { useEffect, useState } from 'react';
import { GeneratedImage } from '@/lib/types';
import { loadRecentGeneratedImages } from '@/lib/storage/generated-images-local';

/**
 * Fetches recent generated images (≤1 h) from localStorage
 */
export function useRecentGeneratedImages(userId?: string) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Initial load from local storage
    const initialImages = loadRecentGeneratedImages(userId);
    setImages(initialImages);
    
    // Keep a reference to the most recent images to avoid redundant re-renders
    let currentImages = [...initialImages];

    // Handler for custom events (same tab)
    const handleUpdate = (e: Event) => {
      const detailUserId = (e as CustomEvent).detail?.userId;
      if (!detailUserId || detailUserId === userId) {
        const newImages = loadRecentGeneratedImages(userId);
        
        // Check if the images have actually changed before updating state
        if (JSON.stringify(newImages) !== JSON.stringify(currentImages)) {
          currentImages = [...newImages];
          setImages(newImages);
        }
      }
    };

    // Handler for storage events (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `desainr_generated_images_${userId}`) {
        const newImages = loadRecentGeneratedImages(userId);
        
        // Check if the images have actually changed before updating state
        if (JSON.stringify(newImages) !== JSON.stringify(currentImages)) {
          currentImages = [...newImages];
          setImages(newImages);
        }
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