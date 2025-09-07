import { APP_BASE_URL } from './config';
// Auth removed: no observers or token refresh

// --- Dynamic Base URL Discovery ---
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
    'https://localhost:9010',
    'https://127.0.0.1:9010',
    'http://localhost:9003',
    'http://127.0.0.1:9003',
    'https://localhost:9003',
    'https://127.0.0.1:9003',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://localhost:5173',
    'https://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://localhost:8080',
    'https://127.0.0.1:8080',
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

// --- Token storage helpers ---
async function readStoredToken(): Promise<string | null> {
  return await new Promise((resolve) => {
    try {
      chrome.storage?.local.get(['DESAINR_ID_TOKEN'], (items: any) => {
        resolve((items && items['DESAINR_ID_TOKEN']) || null);
      });
    } catch {
      resolve(null);
    }
  });
}

async function writeStoredToken(token: string): Promise<void> {
  try {
    await chrome.storage?.local.set({ DESAINR_ID_TOKEN: token });
  } catch {
    // ignore
  }
}

async function clearStoredToken(): Promise<void> {
  try {
    await chrome.storage?.local.remove(['DESAINR_ID_TOKEN']);
  } catch {
    // ignore
  }
}

// --- JWT utils ---
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// --- Utilities to find/open a web app tab and request ID token ---
async function findWebAppTab(base: string): Promise<chrome.tabs.Tab | null> {
  return await new Promise((resolve) => {
    try {
      const pattern = base.endsWith('/') ? `${base}*` : `${base}/*`;
      chrome.tabs.query({ url: pattern }, (tabs: chrome.tabs.Tab[]) => {
        resolve((tabs && tabs[0]) ? tabs[0] : null);
      });
    } catch {
      resolve(null);
    }
  });
}

async function waitForComplete(tabId: number): Promise<void> {
  return await new Promise<void>((resolve) => {
    const listener = (id: number, info: chrome.tabs.TabChangeInfo) => {
      if (id === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function ensureWebAppTab(options?: { openIfMissing?: boolean }): Promise<chrome.tabs.Tab | null> {
  const base = await getBestBaseUrl();
  const existing = await findWebAppTab(base);
  if (existing && existing.id) return existing;
  if (options?.openIfMissing === false) return null;
  return await new Promise<chrome.tabs.Tab>((resolve) => {
    chrome.tabs.create({ url: `${base}/` }, async (tab: chrome.tabs.Tab) => {
      if (tab?.id) await waitForComplete(tab.id);
      resolve(tab);
    });
  });
}

async function requestIdTokenFromWebApp(timeoutMs = 8000, options?: { openIfMissing?: boolean; promptLoginIfUnauthorized?: boolean }): Promise<{ ok: boolean; idToken?: string; error?: string }> {
  const tab = await ensureWebAppTab({ openIfMissing: options?.openIfMissing !== false });
  if (!tab?.id) return { ok: false, error: 'no_webapp_tab' };

  const trySend = (): Promise<{ ok: boolean; idToken?: string; error?: string } | null> => new Promise(async (resolve) => {
    let settled = false;
    const settle = (resp: { ok: boolean; idToken?: string; error?: string } | null) => {
      if (settled) return;
      settled = true;
      resolve(resp);
    };
    try {
      chrome.tabs.sendMessage(tab.id!, { type: 'DESAINR_GET_WEBAPP_ID_TOKEN' }, async (resp: any) => {
        const err = chrome.runtime.lastError?.message;
        if (err) return settle(null);
        settle(resp || { ok: false, error: 'no_response' });
      });
    } catch {
      settle(null);
    }
    // Safety timeout
    setTimeout(() => settle({ ok: false, error: 'timeout' }), timeoutMs);
  });

  // Try send; if fails, inject content script and retry once
  let resp = await trySend();
  if (!resp) {
    try {
      await (chrome as any).scripting.executeScript({ target: { tabId: tab.id! }, files: ['contentScript.js'] });
    } catch {}
    resp = await trySend();
  }

  if (resp && !resp.ok && resp.error === 'not_signed_in' && options?.promptLoginIfUnauthorized) {
    try {
      const base = await getBestBaseUrl();
      await new Promise<void>((resolve) => {
        chrome.tabs.update(tab.id!, { url: `${base}/login?next=/` }, () => resolve());
      });
      await waitForComplete(tab.id!);
    } catch {}
  }
  return resp || { ok: false, error: 'no_receiver' };
}

// Try to send a message; if no receiver, attempt to inject content script and retry
async function ensureContentScript(tabId: number): Promise<boolean> {
  try {
    // MV3 scripting API; will fail on restricted pages (chrome:// etc.)
    await (chrome as any).scripting.executeScript({
      target: { tabId },
      files: ['contentScript.js'],
    });
    return true;
  } catch (e) {
    console.warn('[DesAInR] Failed to inject contentScript.js:', e);
    return false;
  }
}

async function safeSendMessage(tabId: number, message: any): Promise<boolean> {
  const delivered = await new Promise<boolean>((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, () => {
        // If lastError is set, receiving end doesn't exist
        const err = chrome.runtime.lastError?.message;
        if (err) return resolve(false);
        resolve(true);
      });
    } catch {
      resolve(false);
    }
  });
  if (delivered) return true;
  // Attempt to inject and retry once
  const injected = await ensureContentScript(tabId);
  if (!injected) return false;
  return await new Promise<boolean>((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, () => {
        const err = chrome.runtime.lastError?.message;
        resolve(!err);
      });
    } catch {
      resolve(false);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'desainr-refine', title: 'DesAInR: Refine Selection', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-translate', title: 'DesAInR: Translate Selection', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-save-memo', title: 'DesAInR: Save to Memo', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-analyze', title: 'DesAInR: Analyze Page', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'desainr-translate-page', title: 'DesAInR: Translate Page', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'desainr-toggle-parallel', title: 'DesAInR: Toggle Parallel Translate', contexts: ['page'] });
});

// Auth removed: no token observers or refresh timers

chrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
  if (!tab?.id) return;
  safeSendMessage(tab.id, { type: 'CONTEXT_MENU', id: info.menuItemId, info }).then((ok) => {
    if (!ok) console.warn('[DesAInR] Could not deliver CONTEXT_MENU message (no receiver).');
  });
});

chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'toggle-overlay') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
      const tab = tabs[0];
      if (tab?.id) {
        safeSendMessage(tab.id, { type: 'TOGGLE_OVERLAY' }).then((ok) => {
          if (!ok) console.warn('[DesAInR] Could not deliver TOGGLE_OVERLAY message (no receiver).');
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((msg: any, sender: any, sendResponse: (resp: any) => void) => {
  if (msg?.type === 'AUTH_REQUEST_TOKEN') {
    (async () => {
      try {
        const resp = await requestIdTokenFromWebApp(8000, { openIfMissing: true, promptLoginIfUnauthorized: true });
        if (resp?.ok && resp.idToken) {
          await writeStoredToken(resp.idToken);
          sendResponse({ ok: true });
        } else {
          sendResponse({ ok: false, error: resp?.error || 'failed' });
        }
      } catch (e: any) {
        sendResponse({ ok: false, error: e?.message || String(e) });
      }
    })();
    return true;
  }
  if (msg?.type === 'AUTH_HAS_TOKEN') {
    (async () => {
      const token = await readStoredToken();
      sendResponse({ hasToken: !!token });
    })();
    return true;
  }
  if (msg?.type === 'AUTH_CLEAR_TOKEN') {
    (async () => {
      await clearStoredToken();
      sendResponse({ ok: true });
    })();
    return true;
  }
  if (msg?.type === 'AUTH_GET_PROFILE') {
    (async () => {
      try {
        const stored = await readStoredToken();
        if (!stored) {
          sendResponse({ ok: false, error: 'no_token' });
          return;
        }
        let claims: any = decodeJwtPayload(stored) || {};
        const nowSec = Math.floor(Date.now() / 1000);
        let expired = typeof claims.exp === 'number' ? claims.exp < nowSec : false;
        if (expired) {
          try {
            const refreshed = await requestIdTokenFromWebApp(8000, { openIfMissing: true, promptLoginIfUnauthorized: true });
            if (refreshed?.ok && refreshed.idToken) {
              await writeStoredToken(refreshed.idToken);
              claims = decodeJwtPayload(refreshed.idToken) || {};
              expired = typeof claims.exp === 'number' ? claims.exp < nowSec : false;
            }
          } catch {}
        }
        const profile = {
          email: claims.email || null,
          name: claims.name || claims.displayName || null,
          picture: claims.picture || null,
          provider: (claims.firebase && claims.firebase.sign_in_provider) || null,
          uid: claims.user_id || claims.sub || null,
          exp: claims.exp || null,
          expired,
          iss: claims.iss || null,
          aud: claims.aud || null,
        };
        sendResponse({ ok: true, profile });
      } catch (e: any) {
        sendResponse({ ok: false, error: e?.message || String(e) });
      }
    })();
    return true;
  }
  if (msg?.type === 'API_CALL') {
    (async () => {
      try {
        const base = await getBestBaseUrl();
        const url = `${base}/api/extension/${msg.path}`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const stored = await readStoredToken();
        if (msg.token) headers['Authorization'] = `Bearer ${msg.token}`;
        else if (stored) headers['Authorization'] = `Bearer ${stored}`;

        const doFetch = async () => {
          return await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(msg.body ?? {}),
          });
        };

        let res = await doFetch();

        // If unauthorized, try to obtain fresh token and retry once
        if (res.status === 401) {
          const tokenResp = await requestIdTokenFromWebApp(8000, { openIfMissing: true, promptLoginIfUnauthorized: true });
          if (tokenResp?.ok && tokenResp.idToken) {
            await writeStoredToken(tokenResp.idToken);
            headers['Authorization'] = `Bearer ${tokenResp.idToken}`;
            res = await doFetch();
          }
        }
        let json: any = undefined;
        let text: string | undefined = undefined;
        try {
          json = await res.json();
        } catch {
          try { text = await res.text(); } catch {}
        }
        if (!res.ok && (!json || typeof json !== 'object')) {
          // Surface text body as error when JSON is unavailable
          sendResponse({ ok: false, status: res.status, error: text || 'HTTP error' });
          return;
        }
        sendResponse({ ok: res.ok, status: res.status, json: json ?? {} });
      } catch (e: any) {
        sendResponse({ ok: false, status: 0, error: e?.message || String(e) });
      }
    })();
    return true; // keep the messaging channel open for async response
  }
});
