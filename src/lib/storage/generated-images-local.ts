// Helper functions to persist generated images for the current browser session (sessionStorage)
import { GeneratedImage } from '@/lib/types';
import { DEFAULT_USER_ID } from '@/lib/constants';

const STORAGE_KEY_PREFIX = 'desainr_generated_images_';

/**
 * Resolve a safe userId. If none is provided (undefined/null/empty), default to
 * the app-wide DEFAULT_USER_ID (usually "default-user").
 */
function resolveUserId(userId?: string): string {
  return userId || DEFAULT_USER_ID;
}

// Images are kept only for the lifetime of the browser tab/session.
// sessionStorage quotas are typically similar to localStorage (~5-10 MB),
// so we may still need to trim on quota errors.
const MAX_BYTES = 9 * 1024 * 1024; // 9 MB pragmatic upper-bound

function getKey(userId?: string) {
  return `${STORAGE_KEY_PREFIX}${resolveUserId(userId)}`;
}

function approxBytes(str:string){return str.length*2;} // UTF-16

/**
 * Load all generated images stored in sessionStorage (cleared on browser close).
 */
export function loadRecentGeneratedImages(userId?: string): GeneratedImage[] {
  try {
    const raw = sessionStorage.getItem(getKey(userId));
    if (!raw) return [];
    const arr: GeneratedImage[] = JSON.parse(raw);
    return arr;
  } catch (e) {
    console.error('Failed to load generated images from sessionStorage', e);
    return [];
  }
}

/**
 * Save newly generated images (array) by merging with any existing recent images and pruning expired ones.
 */
export async function saveGeneratedImagesLocal(userId: string | undefined, images: GeneratedImage[]) {
  try {
    // Ensure all images have required fields
    const now = Date.now();
    
    // Add timestamps to any images missing them
    const preparedImages = images.map(img => ({
      ...img,
      id: img.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
      createdAt: img.createdAt || now
    }));
    
    const safeUserId = resolveUserId(userId);

    // Load existing images from sessionStorage for this session
    let existingImages: GeneratedImage[] = [];
    try {
      const raw = sessionStorage.getItem(getKey(safeUserId));
      if (raw) {
        existingImages = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading existing images', e);
      // Continue with empty existing images
    }

    // Create a map of existing image IDs for quicker lookups
    const existingImageMap = new Map();
    for (const img of existingImages) {
      if (img.id) {
        existingImageMap.set(img.id, true);
      }
    }

    // Add only the new images that don't exist yet
    const newImages = preparedImages.filter(img => !img.id || !existingImageMap.has(img.id));
    
    // Combine new and existing images
    const allImages = [...newImages, ...existingImages];
    
    // Sort by creation time (newest first)
    allImages.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
    
    // Attempt to save all images first
    try {
      sessionStorage.setItem(getKey(safeUserId), JSON.stringify(allImages));
      
      // Notify listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('generated-images-updated', { detail: { userId } }));
      }
      return;
    } catch (e) {
      // If we hit quota errors, start trimming older images
      console.warn('Storage quota exceeded, trimming older images');
    }
    
    // Handle quota errors by removing the oldest images until it fits
    let trimmedImages = [...allImages];
    while (trimmedImages.length > 0) {
      try {
        sessionStorage.setItem(getKey(safeUserId), JSON.stringify(trimmedImages));
        
        // Successfully saved, notify listeners
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('generated-images-updated', { detail: { userId } }));
        }
        return;
      } catch (e) {
        // Remove the oldest image (which will be at the end after sorting)
        trimmedImages.pop();
      }
    }
    
    console.error('Could not save any images to sessionStorage, even after trimming');
  } catch (e) {
    console.error('Failed to save generated images to sessionStorage', e);
  }
}

/**
 * Rewrite images in sessionStorage (utility for consistency).
 */
export function cleanupExpiredGeneratedImages(userId?: string) {
  try {
    const recent = loadRecentGeneratedImages(userId);
    sessionStorage.setItem(getKey(userId), JSON.stringify(recent));
  } catch (e) {
    console.error('Failed writing generated images sessionStorage', e);
  }
}

/**
 * Try committing the array to sessionStorage. If we hit quota, pop the oldest
 * image(s) and retry until it succeeds or the list is empty.
 */
function persistSafely(key: string, images: GeneratedImage[]) {
  let pruned = [...images];
  while (pruned.length) {
    try {
      sessionStorage.setItem(key, JSON.stringify(pruned));
      return; // success
    } catch (e: any) {
      // Remove the oldest (last) image and retry
      pruned.pop();
    }
  }
  // If we get here, even an empty array couldn't be stored – give up silently.
}