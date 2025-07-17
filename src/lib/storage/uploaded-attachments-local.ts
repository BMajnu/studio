// src/lib/storage/uploaded-attachments-local.ts
import { AttachedFile } from '@/lib/types';
// @ts-ignore
import { saveAttachmentsIndexedDB } from './uploaded-attachments-indexeddb';
import { DEFAULT_USER_ID } from '@/lib/constants';

export interface UploadedAttachment extends AttachedFile {
  id: string;
  createdAt: number;
  key: string;
  userId: string;
}

const STORAGE_KEY_PREFIX = 'desainr_uploaded_attachments_';

function resolveUserId(userId?: string): string {
  return userId || DEFAULT_USER_ID;
}

function getKey(userId?: string) {
  return `${STORAGE_KEY_PREFIX}${resolveUserId(userId)}`;
}

export function loadUploadedAttachments(userId?: string): UploadedAttachment[] {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    const arr: UploadedAttachment[] = JSON.parse(raw);
    return arr;
  } catch (e: unknown) {
    console.error('Failed to load uploaded attachments from localStorage', e);
    return [];
  }
}

export async function saveUploadedAttachments(userId: string | undefined, attachments: Partial<UploadedAttachment>[]) {
  try {
    const now = Date.now();
    const prepared = attachments.map(att => {
      const id = att.id || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
      return {
        ...att,
        id,
        createdAt: att.createdAt || now,
        key: `${resolveUserId(userId)}_${id}`,
        userId: resolveUserId(userId),
      } as UploadedAttachment;
    });

    const safeUserId = resolveUserId(userId);

    await saveAttachmentsIndexedDB(safeUserId, prepared).catch((e: unknown) => console.error('IndexedDB save failed', e));

    let existing: UploadedAttachment[] = [];
    try {
      const raw = localStorage.getItem(getKey(safeUserId));
      if (raw) existing = JSON.parse(raw);
    } catch (e: unknown) {}

    const existingMap = new Map(existing.map(a => [a.id, true]));
    const newAtts = prepared.filter(a => !existingMap.has(a.id));
    const all = [...newAtts, ...existing].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));

    try {
      localStorage.setItem(getKey(safeUserId), JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('uploaded-attachments-updated', { detail: { userId } }));
      return;
    } catch (e: unknown) {
      console.warn('Storage quota exceeded, trimming older attachments');
    }

    let trimmed = [...all];
    while (trimmed.length > 0) {
      try {
        localStorage.setItem(getKey(safeUserId), JSON.stringify(trimmed));
        window.dispatchEvent(new CustomEvent('uploaded-attachments-updated', { detail: { userId } }));
        return;
      } catch (e: unknown) {
        trimmed.pop();
      }
    }
  } catch (e: unknown) {
    console.error('Failed to save uploaded attachments', e);
  }
} 