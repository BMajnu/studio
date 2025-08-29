import { firebaseApp } from './clientApp';
import { 
  getFirestore, collection, doc, setDoc,
  getDocs, query, where, orderBy, limit, onSnapshot, type Unsubscribe, getDoc
} from 'firebase/firestore';
import { GeneratedImage } from '@/lib/types';

// Conservative limit for base64 payload length kept in Firestore documents
const MAX_FIRESTORE_BASE64_CHARS = 900 * 1024; // ~900KB of base64 string to stay under 1MiB document limit

// Helpers to reason about data URI payload sizes
// Note: Firestore document size limit (1MiB) applies to the serialized string length.
// Therefore we should compare against the BASE64 STRING LENGTH, not decoded bytes.
function estimateDataUriBase64Chars(dataUri: string): number {
  try {
    const idx = dataUri.indexOf(',');
    return idx >= 0 ? Math.max(0, dataUri.length - (idx + 1)) : dataUri.length;
  } catch {
    return dataUri.length;
  }
}

// Compress an image data URI down to fit under a base64 string length budget using canvas (client only)
async function compressDataUriIfNeeded(
  dataUri: string,
  maxBase64Chars: number = 900 * 1024,
  maxWidth: number = 1024,
): Promise<string> {
  try {
    if (typeof window === 'undefined') return dataUri; // SSR safety
    if (!dataUri.startsWith('data:')) return dataUri;
    if (estimateDataUriBase64Chars(dataUri) <= maxBase64Chars) return dataUri;

    const img = new Image();
    const load = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUri;
      });
    await load();

    const origW = Math.max(1, img.width);
    const origH = Math.max(1, img.height);
    const initialW = Math.min(origW, Math.max(1, Math.round(maxWidth)));
    const initialH = Math.max(1, Math.round(origH * (initialW / origW)));
    const canvas = document.createElement('canvas');
    let targetW = initialW;
    let targetH = initialH;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUri;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    let quality = 0.85;
    let out = canvas.toDataURL('image/jpeg', quality);
    let iter = 0;
    const minQuality = 0.4;
    const minWidth = 512;
    while (estimateDataUriBase64Chars(out) > maxBase64Chars && iter < 12) {
      if (quality > minQuality + 0.01) {
        quality = Math.max(minQuality, quality - 0.1);
      } else if (targetW > minWidth) {
        const newW = Math.max(minWidth, Math.round(targetW * 0.85));
        const newH = Math.max(1, Math.round(origH * (newW / origW)));
        targetW = newW;
        targetH = newH;
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.drawImage(img, 0, 0, targetW, targetH);
      } else {
        // Cannot reduce further
        break;
      }
      out = canvas.toDataURL('image/jpeg', quality);
      iter++;
    }
    return out;
  } catch {
    return dataUri;
  }
}

/**
 * GeneratedImageStorage
 * Persists generated images to Firestore (per-user) so they can be surfaced in the Media gallery.
 */
export class GeneratedImageStorage {
  private static db = getFirestore(firebaseApp);

  /**
   * Save an array of generated images for the given user & prompt.
   * Each image is written into `users/{userId}/generated_images/{imageId}`
   * with a TTL of 24 hours via `expiresAt` field (Firestore TTL).  
   * @param userId The ID of the user
   * @param images Array of images (dataUri + alt fields populated). Function will attach id/createdAt/expiresAt.
   * @param prompt The text prompt used to generate the images (stored for reference)
   */
  static async saveImages(userId: string, images: GeneratedImage[], prompt: string): Promise<{ ok: number; failed: number; errors?: { id: string; error: any }[] }> {
    if (!userId || images.length === 0) return { ok: 0, failed: 0 };

    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // +24 hours

    // Firestore write promises
    const writes: Promise<any>[] = [];
    const writeIds: string[] = [];
    const preErrors: { id: string; error: any }[] = [];

    for (const img of images) {
      const id = img.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
      // Ensure dataUri fits Firestore doc size limits by compressing if needed
      let dataToStore = img.dataUri;
      try {
        const beforeChars = estimateDataUriBase64Chars(img.dataUri);
        dataToStore = await compressDataUriIfNeeded(img.dataUri, MAX_FIRESTORE_BASE64_CHARS);
        const afterChars = estimateDataUriBase64Chars(dataToStore);
        try {
          if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
            console.debug('[Images][Firebase] compress', {
              id,
              base64KB_before: (beforeChars / 1024).toFixed(1),
              base64KB_after: (afterChars / 1024).toFixed(1),
            });
          }
        } catch {}
        // Strict size guard: if still too large, skip Firestore write and record error
        if (afterChars > MAX_FIRESTORE_BASE64_CHARS) {
          const err = new Error(`dataUri too large after compression (${Math.round(afterChars / 1024)}KB > ${Math.round(MAX_FIRESTORE_BASE64_CHARS / 1024)}KB)`);
          preErrors.push({ id, error: err });
          try {
            if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
              console.error('[Images][Firebase] skip oversized image', { id, afterKB: (afterChars / 1024).toFixed(1) });
            }
          } catch {}
          // Assign ids/timestamps to the image for consistency, but do not write to Firestore
          img.id = id;
          img.createdAt = now;
          img.expiresAt = expiresAt;
          continue;
        }
      } catch {}
      const imageDoc = {
        id,
        dataUri: dataToStore,
        alt: img.alt,
        prompt,
        createdAt: now,
        expiresAt,
        userId
      };
      const ref = doc(collection(GeneratedImageStorage.db, `users/${userId}/generated_images`), id);
      writes.push(setDoc(ref, imageDoc, { merge: true }));
      writeIds.push(id);

      // Also mutate the image object in-place so caller has ids/ts
      img.id = id;
      img.createdAt = now;
      img.expiresAt = expiresAt;
    }

    // Await completion so caller can react (optional)
    try {
      const results = await Promise.allSettled(writes);
      let ok = 0;
      let failed = 0;
      const errors: { id: string; error: any }[] = [];
      results.forEach((r, idx) => {
        if (r.status === 'fulfilled') ok++;
        else {
          failed++;
          errors.push({ id: writeIds[idx], error: r.reason });
        }
      });
      // Include pre-validation failures (oversized after compression)
      const allErrors = preErrors.concat(errors);
      failed += preErrors.length;
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
          console.debug('[Images][Firebase] save summary', { ok, failed, preFailed: preErrors.length, attemptedWrites: writes.length });
          if (failed) console.error('[Images][Firebase] save errors', allErrors);
        }
      } catch {}
      return { ok, failed, errors: allErrors.length ? allErrors : undefined };
    } catch (err) {
      console.error('Error saving generated images to Firestore', err);
      return { ok: 0, failed: images.length, errors: images.map((im) => ({ id: im.id || 'unknown', error: err })) };
    }
  }

  /**
   * Get recent images for a user within the last `windowMs` (default 24h), newest first.
   */
  static async getRecentImages(userId: string, windowMs: number = 24 * 60 * 60 * 1000): Promise<GeneratedImage[]> {
    if (!userId) return [];
    const since = Date.now() - windowMs;
    const colRef = collection(GeneratedImageStorage.db, `users/${userId}/generated_images`);
    const qRef = query(colRef, where('createdAt', '>=', since), orderBy('createdAt', 'desc'), limit(100));
    try {
      const snap = await getDocs(qRef);
      return snap.docs.map((d) => d.data() as GeneratedImage);
    } catch (e) {
      console.error('getRecentImages failed', e);
      return [];
    }
  }

  /**
   * Watch recent images within last `windowMs` and invoke callback on updates.
   * Returns an unsubscribe function to stop listening.
   */
  static watchRecentImages(
    userId: string,
    callback: (images: GeneratedImage[]) => void,
    windowMs: number = 24 * 60 * 60 * 1000
  ): Unsubscribe | null {
    if (!userId) return null;
    const since = Date.now() - windowMs;
    const colRef = collection(GeneratedImageStorage.db, `users/${userId}/generated_images`);
    const qRef = query(colRef, where('createdAt', '>=', since), orderBy('createdAt', 'desc'), limit(100));
    try {
      const unsub = onSnapshot(qRef, (snap) => {
        const items = snap.docs.map((d) => d.data() as GeneratedImage);
        callback(items);
      }, (err) => {
        console.error('watchRecentImages error', err);
      });
      return unsub;
    } catch (e) {
      console.error('watchRecentImages failed', e);
      return null;
    }
  }

  /**
   * Attach/merge Drive metadata onto an image document.
   */
  static async upsertDriveMeta(
    userId: string,
    imageId: string,
    drive: { fileId: string; webViewLink?: string; webContentLink?: string }
  ): Promise<void> {
    if (!userId || !imageId) return;
    try {
      const ref = doc(collection(GeneratedImageStorage.db, `users/${userId}/generated_images`), imageId);
      await setDoc(ref, { driveFileId: drive.fileId, driveWebViewLink: drive.webViewLink, driveWebContentLink: drive.webContentLink }, { merge: true });
    } catch (e) {
      console.error('upsertDriveMeta failed', e);
    }
  }
}