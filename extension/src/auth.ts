import { firebaseAuth } from './firebaseClient';
import { onIdTokenChanged } from 'firebase/auth';

type StoredAuth = {
  uid?: string;
  idToken?: string;
  signedInAt?: number;
};

const KEY_UID = 'desainr.auth.uid';
const KEY_TOKEN = 'desainr.auth.idToken';
const KEY_TIME = 'desainr.auth.signedInAt';

function hasChromeStorage(): boolean {
  try {
    return typeof chrome !== 'undefined' && !!(chrome as any).storage && !!(chrome as any).storage.local;
  } catch {
    return false;
  }
}

async function getStoredAuth(): Promise<StoredAuth> {
  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([KEY_UID, KEY_TOKEN, KEY_TIME], (data: Record<string, any>) => {
        resolve({ uid: data[KEY_UID], idToken: data[KEY_TOKEN], signedInAt: data[KEY_TIME] });
      });
    });
  }
  // Fallback to page localStorage when chrome.storage is unavailable
  try {
    const uid = (globalThis as any)?.localStorage?.getItem(KEY_UID) || undefined;
    const idToken = (globalThis as any)?.localStorage?.getItem(KEY_TOKEN) || undefined;
    const signedAtStr = (globalThis as any)?.localStorage?.getItem(KEY_TIME) || undefined;
    const signedInAt = signedAtStr ? Number(signedAtStr) : undefined;
    return { uid, idToken, signedInAt };
  } catch {
    return {};
  }
}

async function setStoredAuth(a: StoredAuth) {
  const payload = { [KEY_UID]: a.uid, [KEY_TOKEN]: a.idToken, [KEY_TIME]: a.signedInAt ?? Date.now() } as any;
  if (hasChromeStorage()) {
    await chrome.storage.local.set(payload);
    return;
  }
  try {
    (globalThis as any)?.localStorage?.setItem(KEY_UID, String(payload[KEY_UID] ?? ''));
    (globalThis as any)?.localStorage?.setItem(KEY_TOKEN, String(payload[KEY_TOKEN] ?? ''));
    (globalThis as any)?.localStorage?.setItem(KEY_TIME, String(payload[KEY_TIME] ?? ''));
  } catch {}
}

export async function getIdToken(): Promise<string> {
  const user = firebaseAuth.currentUser;
  if (user) {
    const fresh = await user.getIdToken(true);
    await setStoredAuth({ uid: user.uid, idToken: fresh });
    return fresh;
  }
  const stored = await getStoredAuth();
  if (stored.idToken) return stored.idToken;
  throw new Error('Not signed in');
}

export async function signOut() {
  try {
    await firebaseAuth.signOut();
  } finally {
    if (hasChromeStorage()) {
      await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
    } else {
      try {
        (globalThis as any)?.localStorage?.removeItem(KEY_UID);
        (globalThis as any)?.localStorage?.removeItem(KEY_TOKEN);
        (globalThis as any)?.localStorage?.removeItem(KEY_TIME);
      } catch {}
    }
  }
}

let observersInited = false;
export function initAuthObservers() {
  if (observersInited) return;
  observersInited = true;
  onIdTokenChanged(firebaseAuth, async (user) => {
    if (user) {
      try {
        const tok = await user.getIdToken(false);
        await setStoredAuth({ uid: user.uid, idToken: tok, signedInAt: Date.now() });
      } catch (e) {
        // no-op
      }
    } else {
      if (hasChromeStorage()) {
        await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
      } else {
        try {
          (globalThis as any)?.localStorage?.removeItem(KEY_UID);
          (globalThis as any)?.localStorage?.removeItem(KEY_TOKEN);
          (globalThis as any)?.localStorage?.removeItem(KEY_TIME);
        } catch {}
      }
    }
  });
}

// Force refresh current user's ID token and cache it
export async function refreshIdToken(force: boolean = true): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) {
    if (hasChromeStorage()) {
      await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
    } else {
      try {
        (globalThis as any)?.localStorage?.removeItem(KEY_UID);
        (globalThis as any)?.localStorage?.removeItem(KEY_TOKEN);
        (globalThis as any)?.localStorage?.removeItem(KEY_TIME);
      } catch {}
    }
    return null;
  }
  const tok = await user.getIdToken(force);
  await setStoredAuth({ uid: user.uid, idToken: tok, signedInAt: Date.now() });
  return tok;
}
