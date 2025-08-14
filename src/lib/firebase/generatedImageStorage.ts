import { firebaseAppInstance } from './clientApp';
import { 
  getFirestore, collection, doc, setDoc,
  getDocs, query, where, orderBy, limit, onSnapshot, type Unsubscribe, getDoc
} from 'firebase/firestore';
import { GeneratedImage } from '@/lib/types';

/**
 * GeneratedImageStorage
 * Persists generated images to Firestore (per-user) so they can be surfaced in the Media gallery.
 */
export class GeneratedImageStorage {
  private static db = getFirestore(firebaseAppInstance);

  /**
   * Save an array of generated images for the given user & prompt.
   * Each image is written into `users/{userId}/generated_images/{imageId}`
   * with a TTL of 24 hours via `expiresAt` field (Firestore TTL).  
   * @param userId The ID of the user
   * @param images Array of images (dataUri + alt fields populated). Function will attach id/createdAt/expiresAt.
   * @param prompt The text prompt used to generate the images (stored for reference)
   */
  static async saveImages(userId: string, images: GeneratedImage[], prompt: string): Promise<void> {
    if (!userId || images.length === 0) return;

    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // +24 hours

    // Firestore write promises
    const writes: Promise<any>[] = [];

    for (const img of images) {
      const id = img.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
      const imageDoc = {
        id,
        dataUri: img.dataUri,
        alt: img.alt,
        prompt,
        createdAt: now,
        expiresAt,
        userId
      };
      const ref = doc(collection(GeneratedImageStorage.db, `users/${userId}/generated_images`), id);
      writes.push(setDoc(ref, imageDoc, { merge: true }));

      // Also mutate the image object in-place so caller has ids/ts
      img.id = id;
      img.createdAt = now;
      img.expiresAt = expiresAt;
    }

    // Await completion so caller can react (optional)
    try {
      await Promise.allSettled(writes);
    } catch (err) {
      console.error('Error saving generated images to Firestore', err);
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