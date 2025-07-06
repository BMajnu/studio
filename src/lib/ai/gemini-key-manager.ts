import { UserProfile } from '@/lib/types';

interface KeyMeta {
  key: string;
  lastUsed: number; // ms
  coolUntil: number; // ms, 0 if ready
  successCount: number;
  failureCount: number;
  isInvalid: boolean; // Added for permanent exclusion
}

export class GeminiKeyManager {
  private keys: KeyMeta[] = [];
  private coolOffMs: number;

  constructor(profile: UserProfile | null, coolOffMinutes = 10) {
    this.coolOffMs = coolOffMinutes * 60 * 1000;
    const list = profile?.geminiApiKeys || [];
    this.keys = list.map((k) => ({ 
      key: k.trim(), 
      lastUsed: 0, 
      coolUntil: 0, 
      successCount: 0, 
      failureCount: 0,
      isInvalid: false // Initialize as valid
    }));
  }

  /** Return the next available key, or undefined if none ready */
  getActiveKey(): string | undefined {
    const now = Date.now();
    // sort by earliest lastUsed to distribute load
    const sorted = [...this.keys].sort((a, b) => a.lastUsed - b.lastUsed);
    // Find a key that is not invalid and not cooling off
    const candidate = sorted.find((m) => !m.isInvalid && m.coolUntil <= now);
    if (candidate) {
      candidate.lastUsed = now;
      return candidate.key;
    }
    return undefined; // all cooling off or invalid
  }

  /** Mark key successful */
  reportSuccess(key: string) {
    const meta = this.keys.find((k) => k.key === key);
    if (meta) {
      meta.successCount += 1;
    }
  }

  /** Mark key quota error and cool it */
  reportQuotaError(key: string) {
    const meta = this.keys.find((k) => k.key === key);
    if (meta) {
      meta.failureCount += 1;
      meta.coolUntil = Date.now() + this.coolOffMs;
    }
  }

  /** Mark a key as permanently invalid */
  reportInvalidKey(key: string) {
    const meta = this.keys.find((k) => k.key === key);
    if (meta) {
      meta.isInvalid = true;
    }
  }

  getAllKeys() {
    return this.keys.map(({ key, coolUntil, successCount, failureCount, lastUsed, isInvalid }) => ({ 
      key, 
      coolUntil, 
      successCount, 
      failureCount, 
      lastUsed,
      isInvalid 
    }));
  }
} 