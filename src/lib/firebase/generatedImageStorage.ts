import { firebaseAppInstance } from './clientApp';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
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
   * with a TTL of 1 hour via `expiresAt` field (Firestore TTL).  
   * @param userId The ID of the user
   * @param images Array of images (dataUri + alt fields populated). Function will attach id/createdAt/expiresAt.
   * @param prompt The text prompt used to generate the images (stored for reference)
   */
  static async saveImages(userId: string, images: GeneratedImage[], prompt: string): Promise<void> {
    if (!userId || images.length === 0) return;

    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000; // +1 hour

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
} 