/// <reference types="chrome" />
import { APP_BASE_URL } from './config';

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

async function autoSignInFromActiveTab(_opts?: { silent?: boolean }): Promise<void> {
  // Auth removed: no-op
  return;
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

async function exchangeIdToken(_idToken: string) {
  // Auth removed: stub response
  return { ok: false, error: 'auth_removed' } as any;
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

function clearProfile() {
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  const avatarEl = document.getElementById('user-avatar') as HTMLImageElement | null;
  const sessionEl = document.getElementById('user-session');
  if (nameEl) nameEl.textContent = '';
  if (emailEl) emailEl.textContent = '';
  if (avatarEl) {
    avatarEl.src = '';
    avatarEl.style.display = 'none';
  }
  if (sessionEl) sessionEl.textContent = '';
}

function renderProfile(profile: any) {
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  const avatarEl = document.getElementById('user-avatar') as HTMLImageElement | null;
  const sessionEl = document.getElementById('user-session');
  if (nameEl) nameEl.textContent = profile?.name || profile?.email || 'Signed account';
  if (emailEl) emailEl.textContent = profile?.email || '';
  if (avatarEl) {
    if (profile?.picture) {
      avatarEl.src = profile.picture;
      avatarEl.style.display = '';
    } else {
      avatarEl.src = '';
      avatarEl.style.display = 'none';
    }
  }
  if (sessionEl) sessionEl.textContent = profile?.expired ? 'Expired' : 'Active';
}

async function fetchAndRenderProfile(): Promise<void> {
  try {
    chrome.runtime.sendMessage({ type: 'AUTH_GET_PROFILE' }, (resp: any) => {
      const err = chrome.runtime.lastError?.message;
      if (err) {
        clearProfile();
        return;
      }
      if (resp?.ok && resp.profile) {
        renderProfile(resp.profile);
        const statusText = document.getElementById('status-text');
        if (statusText) statusText.textContent = resp.profile.expired ? 'Signed in (expired)' : 'Signed in';
      } else {
        clearProfile();
        const statusText = document.getElementById('status-text');
        if (statusText) statusText.textContent = 'Not signed in';
      }
    });
  } catch {
    clearProfile();
  }
}

function updateUI(signedIn: boolean) {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const loadingEl = document.getElementById('loading');
  const signinSection = document.getElementById('signin-section');
  const signoutSection = document.getElementById('signout-section');
  if (loadingEl) loadingEl.style.display = 'none';
  if (statusDot) statusDot.classList.add('active');
  if (statusText) statusText.textContent = signedIn ? 'Signed in' : 'Not signed in';
  if (signinSection) signinSection.style.display = signedIn ? 'none' : 'block';
  if (signoutSection) signoutSection.style.display = signedIn ? 'block' : 'none';
  if (signedIn) {
    fetchAndRenderProfile();
  } else {
    clearProfile();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const btnOverlay = document.getElementById('open-overlay') as HTMLButtonElement | null;
  const btnOpenWebApp = document.getElementById('open-webapp') as HTMLButtonElement | null;
  const btnOpenDesigner = document.getElementById('open-designer') as HTMLButtonElement | null;
  const btnToggleSettings = document.getElementById('toggle-settings') as HTMLButtonElement | null;
  const settingsPanel = document.getElementById('settings-panel') as HTMLDivElement | null;
  const inputTargetLang = document.getElementById('setting-target-lang') as (HTMLSelectElement | HTMLInputElement | null);
  const inputModelId = document.getElementById('setting-model-id') as (HTMLSelectElement | HTMLInputElement | null);
  const inputThinkingMode = document.getElementById('setting-thinking-mode') as (HTMLSelectElement | HTMLInputElement | null);
  const inputUserApiKey = document.getElementById('setting-user-api-key') as (HTMLInputElement | null);
  const btnSaveSettings = document.getElementById('save-settings') as HTMLButtonElement | null;
  const btnCloseSettings = document.getElementById('close-settings') as HTMLButtonElement | null;

  const btnSignin = document.getElementById('signin') as HTMLButtonElement | null;
  const btnSignout = document.getElementById('signout') as HTMLButtonElement | null;

  // Initialize UI based on existing token
  (async () => {
    try {
      // Default to signed-out so the Sign In button is visible immediately.
      updateUI(false);
      chrome.runtime.sendMessage({ type: 'AUTH_HAS_TOKEN' }, (resp: any) => {
        const err = chrome.runtime.lastError?.message;
        if (err) {
          // Keep signed-out if background didn't respond
          updateUI(false);
          return;
        }
        const has = !!(resp && resp.hasToken);
        updateUI(has);
      });
    } catch {
      updateUI(false);
    }
  })();

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
      const base = await getBestBaseUrl();
      await chrome.tabs.create({ url: `${base}/` });
      window.close();
    } catch (e: any) {
      showError(e?.message || 'Failed to open web app');
    }
  });

  // Open Designer Page
  btnOpenDesigner?.addEventListener('click', async () => {
    try {
      const base = await getBestBaseUrl();
      await chrome.tabs.create({ url: `${base}/designer` });
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
          'desainr.settings.userApiKey',
        ]);
        if (inputTargetLang) (inputTargetLang as any).value = data['desainr.settings.targetLang'] || (inputTargetLang as any).value || 'en';
        if (inputModelId) {
          const saved = data['desainr.settings.modelId'];
          // Works for both <select> and <input>
          const options = (inputModelId as HTMLSelectElement).options as any;
          const exists = saved && options && Array.from(options).some((o: any) => o.value === saved);
          (inputModelId as any).value = exists ? saved : ((inputModelId as any).value || 'googleai/gemini-1.5-flash-latest');
        }
        if (inputThinkingMode) {
          const tm = data['desainr.settings.thinkingMode'];
          (inputThinkingMode as any).value = (tm === 'default' || tm === 'none') ? tm : ((inputThinkingMode as any).value || 'none');
        }
        if (inputUserApiKey) {
          inputUserApiKey.value = data['desainr.settings.userApiKey'] || '';
        }
      } catch {}
    }
  });

  // Save settings
  btnSaveSettings?.addEventListener('click', async () => {
    try {
      const targetLang = ((inputTargetLang as any)?.value || '').trim();
      const modelId = ((inputModelId as any)?.value || '').trim();
      const thinkingMode = ((inputThinkingMode as any)?.value || '').trim();
      const userApiKey = (inputUserApiKey?.value || '').trim();
      await chrome.storage.local.set({
        'desainr.settings.targetLang': targetLang,
        'desainr.settings.modelId': modelId,
        'desainr.settings.thinkingMode': thinkingMode || 'none',
        'desainr.settings.userApiKey': userApiKey,
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

  // Sign in: request token from web app via background
  btnSignin?.addEventListener('click', async () => {
    showLoading(true);
    try {
      chrome.runtime.sendMessage({ type: 'AUTH_REQUEST_TOKEN' }, async (resp: any) => {
        if (resp && resp.ok) {
          updateUI(true);
          window.close();
          return;
        }
        // If token could not be obtained, open login page explicitly
        try {
          const base = await getBestBaseUrl();
          await chrome.tabs.create({ url: `${base}/login?next=/` });
        } catch {}
        updateUI(false);
      });
    } catch {
      updateUI(false);
    }
  });

  // Sign out: clear token in background
  btnSignout?.addEventListener('click', async () => {
    try {
      chrome.runtime.sendMessage({ type: 'AUTH_CLEAR_TOKEN' }, () => {
        updateUI(false);
      });
    } catch {
      updateUI(false);
    }
  });
});
