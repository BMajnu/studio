// src/lib/storage/uploaded-attachments-indexeddb.ts
import { AttachedFile } from '@/lib/types';

interface UploadedAttachment extends AttachedFile {
  id: string;
  createdAt: number;
  key: string;
  userId: string;
}

const DB_NAME = 'DesainrUploadedAttachmentsDB';
const STORE_NAME = 'attachments';

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

export async function saveAttachmentsIndexedDB(userId: string, attachments: UploadedAttachment[]): Promise<void> {
  if (!attachments.length) return;
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const now = Date.now();
  for (const att of attachments) {
    const id = att.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const record: UploadedAttachment = {
      ...att,
      id,
      createdAt: att.createdAt || now,
      key: `${userId}_${id}`,
      userId,
    };
    store.put(record);
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
}

export async function loadAttachmentsIndexedDB(userId: string): Promise<UploadedAttachment[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  const records: UploadedAttachment[] = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as UploadedAttachment[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return records
    .filter(r => r.userId === userId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
} 