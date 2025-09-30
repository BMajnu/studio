import { onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuth } from './lib/firebase';

// Keep an ID token in chrome.storage.local under 'desainr.idToken'
export function initAuthObservers() {
  try {
    onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          await chrome.storage?.local.set?.({ 'desainr.idToken': token });
        } else {
          try { await chrome.storage?.local.remove?.(['desainr.idToken'] as any); } catch {}
        }
      } catch {}
    });
  } catch {}
}

export async function refreshIdToken(force?: boolean) {
  try {
    const u = firebaseAuth.currentUser;
    if (!u) return;
    const t = await u.getIdToken(!!force);
    await chrome.storage?.local.set?.({ 'desainr.idToken': t });
  } catch {}
}
