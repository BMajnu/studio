import { firebaseAuth } from './firebaseClient';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { APP_BASE_URL } from './config';
import { signOut as signOutExt } from './auth';

function parseFragment(url: string): Record<string, string> {
  const u = new URL(url);
  const hash = u.hash?.replace(/^#/, '') || '';
  const params = new URLSearchParams(hash);
  const out: Record<string, string> = {};
  params.forEach((v, k) => (out[k] = v));
  return out;
}

async function exchangeIdToken(idToken: string) {
  const res = await fetch(`${APP_BASE_URL}/api/extension/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error(`Exchange failed: ${res.status}`);
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('signin') as HTMLButtonElement | null;
  const btnOut = document.getElementById('signout') as HTMLButtonElement | null;

  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      if (btn) btn.style.display = 'none';
      if (btnOut) btnOut.style.display = 'inline-block';
    } else {
      if (btn) btn.style.display = 'inline-block';
      if (btnOut) btnOut.style.display = 'none';
    }
  });

  btn?.addEventListener('click', async () => {
    try {
      const redirect = chrome.identity.getRedirectURL('extension_cb');
      const authUrl = `${APP_BASE_URL}/extension/connect?redirect_uri=${encodeURIComponent(redirect)}`;
      const finalUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true });
      if (!finalUrl) throw new Error('No final URL from WebAuthFlow');

      const frag = parseFragment(finalUrl);
      const idToken = frag['id_token'];
      if (!idToken) throw new Error('No id_token returned');

      const { ok, customToken, uid, error } = await exchangeIdToken(idToken);
      if (!ok) throw new Error(error || 'Exchange returned not ok');

      const cred = await signInWithCustomToken(firebaseAuth, customToken);
      const freshIdToken = await cred.user.getIdToken(true);

      await chrome.storage.local.set({
        'desainr.auth.uid': uid,
        'desainr.auth.idToken': freshIdToken,
        'desainr.auth.signedInAt': Date.now(),
      });

      alert('Signed in successfully. You can close this popup.');
    } catch (e: any) {
      console.error('Popup sign-in error:', e);
      alert(`Sign-in failed: ${e?.message || e}`);
    }
  });

  btnOut?.addEventListener('click', async () => {
    try {
      await signOutExt();
      alert('Signed out.');
    } catch (e: any) {
      console.error('Popup sign-out error:', e);
      alert(`Sign-out failed: ${e?.message || e}`);
    }
  });
});
