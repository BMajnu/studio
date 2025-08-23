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

async function getStoredAuth(): Promise<StoredAuth> {
  return new Promise((resolve) => {
    chrome.storage.local.get([KEY_UID, KEY_TOKEN, KEY_TIME], (data: Record<string, any>) => {
      resolve({ uid: data[KEY_UID], idToken: data[KEY_TOKEN], signedInAt: data[KEY_TIME] });
    });
  });
}

async function setStoredAuth(a: StoredAuth) {
  await chrome.storage.local.set({ [KEY_UID]: a.uid, [KEY_TOKEN]: a.idToken, [KEY_TIME]: a.signedInAt ?? Date.now() });
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
    await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
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
      await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
    }
  });
}

// Force refresh current user's ID token and cache it
export async function refreshIdToken(force: boolean = true): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) {
    await chrome.storage.local.remove([KEY_UID, KEY_TOKEN, KEY_TIME]);
    return null;
  }
  const tok = await user.getIdToken(force);
  await setStoredAuth({ uid: user.uid, idToken: tok, signedInAt: Date.now() });
  return tok;
}
