import { GeneratedImage } from '@/lib/types';

interface IDBImageRecord extends GeneratedImage {
  key: string;
  userId: string;
}

const DB_NAME = 'DesainrGeneratedImagesDB';
const STORE_NAME = 'images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveImagesIndexedDB(userId: string, images: GeneratedImage[]): Promise<void> {
  if (!images.length) return;
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const now = Date.now();

  for (const img of images) {
    const id = img.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const record: IDBImageRecord = {
      ...img,
      id,
      createdAt: img.createdAt || now,
      key: `${userId}_${id}`,
      userId,
    } as IDBImageRecord;
    store.put(record);
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
}

export async function loadImagesIndexedDB(userId: string): Promise<GeneratedImage[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  const records: IDBImageRecord[] = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as IDBImageRecord[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
} 