import { APP_BASE_URL } from './config';
import { initAuthObservers, refreshIdToken } from './auth';

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

  // Only consider the stored base URL (if any) and the production APP_BASE_URL
  const candidates = [
    ...candidatesPref,
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

  // Fallback: prefer stored, otherwise production APP_BASE_URL
  cachedBaseUrl = candidatesPref[0] || APP_BASE_URL;
  lastBaseUrlCheck = now;
  return cachedBaseUrl;
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
  // Schedule periodic token refresh (every 45 minutes)
  chrome.alarms.create('desainr_refresh_token', { periodInMinutes: 45 });
});

// Keep ID token fresh in storage and clear on sign-out
initAuthObservers();
// Proactively refresh shortly after startup
setTimeout(() => { refreshIdToken(true).catch(() => {}); }, 5000);

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('desainr_refresh_token', { periodInMinutes: 45 });
  refreshIdToken(true).catch(() => {});
});

chrome.alarms.onAlarm.addListener((alarm: any) => {
  if (alarm.name === 'desainr_refresh_token') {
    refreshIdToken(true).catch(() => {});
  }
});

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
  if (msg?.type === 'API_CALL') {
    (async () => {
      try {
        const base = await getBestBaseUrl();
        const url = `${base}/api/extension/${msg.path}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${msg.token}`,
          },
          body: JSON.stringify(msg.body ?? {}),
        });
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
  if (msg?.type === 'SAVE_PINNED_ACTIONS') {
    (async () => {
      try {
        const actions = Array.isArray(msg.actions) ? msg.actions : [];
        await chrome.storage?.sync?.set({ 'desainr.pinnedActions': actions });
        // Broadcast to all tabs so any active contentScript can update its UI immediately
        try {
          chrome.tabs.query({}, (tabs: any[]) => {
            for (const t of tabs) {
              if (!t?.id) continue;
              // Fire-and-forget; safeSendMessage will inject if needed
              safeSendMessage(t.id, { type: 'SAVE_PINNED_ACTIONS', actions }).catch(() => {});
            }
          });
        } catch {}
        sendResponse({ ok: true });
      } catch (e: any) {
        sendResponse({ ok: false, status: 0, error: e?.message || String(e) });
      }
    })();
    return true; // async
  }
});
