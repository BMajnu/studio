/// <reference types="chrome" />
import { firebaseAuth } from './firebaseClient';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { APP_BASE_URL } from './config';
import { signOut as signOutExt } from './auth';

// --- Dynamic Base URL Discovery (mirrors logic in background.ts) ---
let cachedBaseUrl: string | null = null;
let lastBaseUrlCheck = 0;

// --- Messaging helpers: talk specifically to a DesAInR web app tab (open one if needed) ---
async function requestIdTokenFromWebAppTab(timeoutMs = 8000, options?: { openIfMissing?: boolean }): Promise<{ ok: boolean; idToken?: string; error?: string }> {
  const base = await getBestBaseUrl();

  const findTab = async (): Promise<chrome.tabs.Tab | null> => {
    return await new Promise<chrome.tabs.Tab | null>((resolve) => {
      // url filter supports patterns like https://example.com/*
      const pattern = base.endsWith('/') ? `${base}*` : `${base}/*`;
      chrome.tabs.query({ url: pattern }, (tabs: chrome.tabs.Tab[]) => {
        resolve((tabs && tabs[0]) ? tabs[0] : null);
      });
    });
  };

  const waitForComplete = async (tabId: number): Promise<void> => {
    return await new Promise<void>((resolve) => {
      const listener = (id: number, info: chrome.tabs.TabChangeInfo) => {
        if (id === tabId && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
  };

  const ensureTab = async (): Promise<chrome.tabs.Tab | null> => {
    const existing = await findTab();
    if (existing && existing.id) return existing;
    if (options?.openIfMissing === false) return null;
    // Open a new tab to the app root
    const created = await new Promise<chrome.tabs.Tab>((resolve) => {
      chrome.tabs.create({ url: `${base}/` }, (tab: chrome.tabs.Tab) => resolve(tab));
    });
    if (created.id) await waitForComplete(created.id);
    return created;
  };

  const tab = await ensureTab();
  if (!tab?.id) return { ok: false, error: 'no_webapp_tab' };

  return await new Promise((resolve) => {
    let settled = false;
    const settle = (resp: any) => {
      if (settled) return;
      settled = true;
      resolve(resp);
    };

    const trySend = (): Promise<boolean> => new Promise((res) => {
      try {
        chrome.tabs.sendMessage(tab.id!, { type: 'DESAINR_GET_WEBAPP_ID_TOKEN' }, (resp: any) => {
          const err = chrome.runtime.lastError?.message;
          if (err) {
            return res(false);
          }
          settle(resp || { ok: false, error: 'no_response' });
        });
      } catch {
        res(false);
      }
    });

    (async () => {
      let ok = await trySend();
      if (settled) return;
      if (!ok) {
        try {
          await (chrome as any).scripting.executeScript({
            target: { tabId: tab.id! },
            files: ['contentScript.js'],
          });
        } catch {}
        ok = await trySend();
        if (settled) return;
      }
      setTimeout(() => { settle({ ok: false, error: 'timeout' }); }, timeoutMs);
    })();
  });
}

async function autoSignInFromActiveTab(opts?: { silent?: boolean }): Promise<void> {
  const silent = !!opts?.silent;
  if (!silent) {
    showLoading(true);
    showError('');
  }
  try {
    const tokenResp = await requestIdTokenFromWebAppTab(8000, { openIfMissing: !silent });
    if (!tokenResp?.ok || !tokenResp.idToken) {
      const reason = tokenResp?.error || 'unknown';
      if (silent) {
        return;
      }
      throw new Error(reason === 'not_signed_in'
        ? 'Please open desainr app in a tab and sign in first.'
        : `Token request failed (${reason}). Open desainr web app and ensure you are signed in.`);
    }
    const idToken = tokenResp.idToken;
    const { ok, customToken, uid, error, diagnostics } = await exchangeIdToken(idToken);
    if (diagnostics) { try { console.info('[DesAInR][ext][exchange] diagnostics ' + JSON.stringify(diagnostics)); } catch {} }
    if (!ok) throw new Error(error || 'Failed to exchange token');
    let cred;
    try {
      cred = await signInWithCustomToken(firebaseAuth, customToken);
    } catch (e: any) {
      console.error('Direct sign-in error:', e);
      // Deep diagnostics: call REST API to inspect raw error
      try {
        const { FIREBASE_WEB_CONFIG } = await import('./config');
        const apiKey = (FIREBASE_WEB_CONFIG as any)?.apiKey;
        if (apiKey) {
          const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: customToken, returnSecureToken: true }),
          });
          const body = await resp.json().catch(() => null);
          try { console.warn('[DesAInR][ext][signIn][rest] http ' + resp.status); } catch {}
          try { console.warn('[DesAInR][ext][signIn][rest] body ' + JSON.stringify(body)); } catch {}
        }
      } catch {}
      throw e;
    }
    const freshIdToken = await cred.user.getIdToken(true);
    await chrome.storage.local.set({
      'desainr.auth.uid': uid,
      'desainr.auth.idToken': freshIdToken,
      'desainr.auth.signedInAt': Date.now(),
    });
    updateUI(cred.user);
    if (!silent) showLoading(false);
  } catch (e: any) {
    console.error('Direct sign-in error:', e);
    if (silent) {
      try { console.warn('[DesAInR][popup] Auto sign-in (silent) failed:', e?.message || e); } catch {}
      return;
    }
    updateUI(null);
    showLoading(false);
    showError(e?.message || 'Sign-in failed');
  }
}

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
  return new Promise<boolean>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: chrome.tabs.Tab[]) => {
      const tab: chrome.tabs.Tab | undefined = tabs[0];
      if (!tab?.id) return resolve(false);
      const tabId: number = tab.id;

      const trySend = (): Promise<boolean> => new Promise<boolean>((res) => {
        try {
          chrome.tabs.sendMessage(tabId, message, () => {
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
          target: { tabId },
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
  try { console.info('[DesAInR][ext][exchange] http ' + res.status); } catch {}
  try { console.info('[DesAInR][ext][exchange] body ' + JSON.stringify(data)); } catch {}
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Exchange failed: ${res.status}`;
    const diag = (data && (data.diagnostics || null)) || null;
    if (diag) { try { console.warn('[DesAInR][ext][exchange] diagnostics ' + JSON.stringify(diag)); } catch {} }
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
    // Silent auto sign-in attempt when popup opens and user is not signed in.
    // This will only try if a DesAInR web app tab already exists; it will not open a new tab.
    if (!user) {
      setTimeout(() => {
        try { autoSignInFromActiveTab({ silent: true }); } catch {}
      }, 300);
    }
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
      const base = await getBestBaseUrl();
      await chrome.tabs.create({ url: `${base}/login` });
      window.close();
    } catch (e: any) {
      showError(e?.message || 'Failed to open login page');
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
