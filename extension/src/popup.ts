import { firebaseAuth } from './firebaseClient';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { APP_BASE_URL } from './config';
import { signOut as signOutExt } from './auth';

// --- Dynamic Base URL Discovery (mirrors logic in background.ts) ---
let cachedBaseUrl: string | null = null;
let lastBaseUrlCheck = 0;

async function readStoredBaseUrl(): Promise<string | null> {
  return await new Promise((resolve) => {
    try {
      chrome.storage?.local.get(['DESAINR_BASE_URL'], (items: any) => {
        resolve((items && items['DESAINR_BASE_URL']) || null);
      });
    } catch {
      resolve(null);
    }
  });
}

async function writeStoredBaseUrl(url: string): Promise<void> {
  try {
    await chrome.storage?.local.set({ DESAINR_BASE_URL: url });
  } catch {
    // ignore
  }
}

async function isServerReachable(base: string): Promise<boolean> {
  try {
    const res = await fetch(`${base}/api/extension/rewrite`, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

async function getBestBaseUrl(): Promise<string> {
  const now = Date.now();
  if (cachedBaseUrl && now - lastBaseUrlCheck < 60_000) {
    return cachedBaseUrl;
  }
  const candidatesPref: string[] = [];
  const stored = await readStoredBaseUrl();
  if (stored) candidatesPref.push(stored);
  if (APP_BASE_URL) candidatesPref.push(APP_BASE_URL);
  const candidates = [
    ...candidatesPref,
    'http://localhost:9010',
    'http://127.0.0.1:9010',
    'http://localhost:9003',
    'http://127.0.0.1:9003',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ];
  const seen = new Set<string>();
  for (const cand of candidates) {
    if (!cand || seen.has(cand)) continue;
    seen.add(cand);
    if (await isServerReachable(cand)) {
      cachedBaseUrl = cand;
      lastBaseUrlCheck = now;
      await writeStoredBaseUrl(cand);
      return cand;
    }
  }
  cachedBaseUrl = candidatesPref[0] || 'http://localhost:9010';
  lastBaseUrlCheck = now;
  return cachedBaseUrl;
}

// Attempt to send a message to the active tab; if no receiver, try injecting contentScript.js and retry.
async function safeSendToActiveTab(message: any): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any[]) => {
      const tab = tabs[0];
      if (!tab?.id) return resolve(false);

      const trySend = (): Promise<boolean> => new Promise((res) => {
        try {
          chrome.tabs.sendMessage(tab.id, message, () => {
            const err = chrome.runtime.lastError?.message;
            res(!err);
          });
        } catch {
          res(false);
        }
      });

      let ok = await trySend();
      if (ok) return resolve(true);

      // Try to inject the content script and retry once
      try {
        await (chrome as any).scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js'],
        });
      } catch (e) {
        console.warn('[DesAInR][popup] scripting injection failed:', e);
        return resolve(false);
      }
      ok = await trySend();
      resolve(ok);
    });
  });
}

function parseFragment(url: string): Record<string, string> {
  const u = new URL(url);
  const hash = u.hash?.replace(/^#/, '') || '';
  const params = new URLSearchParams(hash);
  const out: Record<string, string> = {};
  params.forEach((v, k) => (out[k] = v));
  return out;
}

async function exchangeIdToken(idToken: string) {
  const base = await getBestBaseUrl();
  const res = await fetch(`${base}/api/extension/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Exchange failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function showError(message: string) {
  const errorEl = document.getElementById('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
      errorEl.style.display = 'none';
    }, 5000);
  }
}

function showLoading(show: boolean) {
  const loadingEl = document.getElementById('loading');
  const signinSection = document.getElementById('signin-section');
  const signoutSection = document.getElementById('signout-section');
  
  if (loadingEl) loadingEl.style.display = show ? 'block' : 'none';
  if (show) {
    if (signinSection) signinSection.style.display = 'none';
    if (signoutSection) signoutSection.style.display = 'none';
  }
}

function updateUI(user: any) {
  const signinSection = document.getElementById('signin-section');
  const signoutSection = document.getElementById('signout-section');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const loadingEl = document.getElementById('loading');
  
  if (loadingEl) loadingEl.style.display = 'none';
  
  if (user) {
    if (signinSection) signinSection.style.display = 'none';
    if (signoutSection) signoutSection.style.display = 'block';
    if (statusDot) statusDot.classList.add('active');
    if (statusText) statusText.textContent = `Signed in as ${user.email || 'User'}`;
  } else {
    if (signinSection) signinSection.style.display = 'block';
    if (signoutSection) signoutSection.style.display = 'none';
    if (statusDot) statusDot.classList.remove('active');
    if (statusText) statusText.textContent = 'Not signed in';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('signin') as HTMLButtonElement | null;
  const btnOut = document.getElementById('signout') as HTMLButtonElement | null;
  const btnOverlay = document.getElementById('open-overlay') as HTMLButtonElement | null;
  const btnOpenWebApp = document.getElementById('open-webapp') as HTMLButtonElement | null;
  const btnOpenDesigner = document.getElementById('open-designer') as HTMLButtonElement | null;
  const btnToggleSettings = document.getElementById('toggle-settings') as HTMLButtonElement | null;
  const settingsPanel = document.getElementById('settings-panel') as HTMLDivElement | null;
  const inputTargetLang = document.getElementById('setting-target-lang') as HTMLSelectElement | null;
  const inputModelId = document.getElementById('setting-model-id') as HTMLSelectElement | null;
  const inputThinkingMode = document.getElementById('setting-thinking-mode') as HTMLSelectElement | null;
  const btnSaveSettings = document.getElementById('save-settings') as HTMLButtonElement | null;
  const btnCloseSettings = document.getElementById('close-settings') as HTMLButtonElement | null;

  // Check auth state
  onAuthStateChanged(firebaseAuth, (user) => {
    updateUI(user);
  });

  // Open overlay button
  btnOverlay?.addEventListener('click', async () => {
    const ok = await safeSendToActiveTab({ type: 'TOGGLE_OVERLAY' });
    if (!ok) {
      showError('This page does not allow the overlay or the content script is blocked. Try a regular website tab.');
      return;
    }
    window.close();
  });

  // Open Web App
  btnOpenWebApp?.addEventListener('click', async () => {
    try {
      await chrome.tabs.create({ url: `${APP_BASE_URL}/` });
      window.close();
    } catch (e: any) {
      showError(e?.message || 'Failed to open web app');
    }
  });

  // Open Designer Page
  btnOpenDesigner?.addEventListener('click', async () => {
    try {
      // Default to /designer; adjust as needed
      await chrome.tabs.create({ url: `${APP_BASE_URL}/designer` });
      window.close();
    } catch (e: any) {
      showError(e?.message || 'Failed to open designer page');
    }
  });

  // Settings toggle
  btnToggleSettings?.addEventListener('click', async () => {
    if (!settingsPanel) return;
    const visible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = visible ? 'none' : 'block';
    if (!visible) {
      // Load current settings when opening
      try {
        const data = await chrome.storage.local.get([
          'desainr.settings.targetLang',
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
        ]);
        if (inputTargetLang) inputTargetLang.value = data['desainr.settings.targetLang'] || inputTargetLang.value || 'en';
        if (inputModelId) {
          const saved = data['desainr.settings.modelId'];
          const exists = saved && Array.from(inputModelId.options).some((o) => o.value === saved);
          inputModelId.value = exists ? saved : (inputModelId.value || 'googleai/gemini-1.5-flash-latest');
        }
        if (inputThinkingMode) {
          const tm = data['desainr.settings.thinkingMode'];
          inputThinkingMode.value = (tm === 'default' || tm === 'none') ? tm : (inputThinkingMode.value || 'none');
        }
      } catch {}
    }
  });

  // Save settings
  btnSaveSettings?.addEventListener('click', async () => {
    try {
      const targetLang = (inputTargetLang?.value || '').trim();
      const modelId = (inputModelId?.value || '').trim();
      const thinkingMode = (inputThinkingMode?.value || '').trim();
      await chrome.storage.local.set({
        'desainr.settings.targetLang': targetLang,
        'desainr.settings.modelId': modelId,
        'desainr.settings.thinkingMode': thinkingMode || 'none',
      });
      showError('');
      // Give quick feedback by briefly showing a message in error area styled subtlely
      const errorEl = document.getElementById('error');
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.style.background = '#c6f6d5';
        errorEl.style.color = '#22543d';
        errorEl.textContent = 'Settings saved';
        setTimeout(() => { errorEl.style.display = 'none'; errorEl.style.background=''; errorEl.style.color=''; }, 900);
      }
    } catch (e: any) {
      showError(e?.message || 'Failed to save settings');
    }
  });

  // Close settings
  btnCloseSettings?.addEventListener('click', () => {
    if (settingsPanel) settingsPanel.style.display = 'none';
  });

  // Sign in button
  btn?.addEventListener('click', async () => {
    try {
      showLoading(true);
      showError('');
      
      const redirect = chrome.identity.getRedirectURL('extension_cb');
      console.log('Redirect URL:', redirect);

      const base = await getBestBaseUrl();
      // Chrome identity may reject http://localhost; prefer 127.0.0.1 for auth window
      let authBase = base;
      try {
        const tmp = new URL(base);
        if (tmp.hostname === 'localhost') tmp.hostname = '127.0.0.1';
        authBase = tmp.toString().replace(/\/$/, '');
      } catch {}
      const authUrl = `${authBase}/extension/connect?redirect_uri=${encodeURIComponent(redirect)}`;
      console.log('Auth URL:', authUrl);
      
      const finalUrl = await chrome.identity.launchWebAuthFlow({ 
        url: authUrl, 
        interactive: true 
      });
      
      if (!finalUrl) {
        throw new Error('Authentication was cancelled');
      }

      const frag = parseFragment(finalUrl);
      const idToken = frag['id_token'];
      
      if (!idToken) {
        console.error('No id_token in response:', frag);
        throw new Error('No authentication token received');
      }

      const { ok, customToken, uid, error } = await exchangeIdToken(idToken);
      if (!ok) {
        throw new Error(error || 'Failed to exchange token');
      }

      const cred = await signInWithCustomToken(firebaseAuth, customToken);
      const freshIdToken = await cred.user.getIdToken(true);

      await chrome.storage.local.set({
        'desainr.auth.uid': uid,
        'desainr.auth.idToken': freshIdToken,
        'desainr.auth.signedInAt': Date.now(),
      });

      updateUI(cred.user);
      showLoading(false);
    } catch (e: any) {
      console.error('Popup sign-in error:', e);
      showLoading(false);
      updateUI(null);
      showError(e?.message || 'Sign-in failed. Please try again.');
    }
  });

  // Sign out button
  btnOut?.addEventListener('click', async () => {
    try {
      showLoading(true);
      await signOutExt();
      updateUI(null);
      showLoading(false);
    } catch (e: any) {
      console.error('Popup sign-out error:', e);
      showLoading(false);
      showError(e?.message || 'Sign-out failed');
    }
  });
});
