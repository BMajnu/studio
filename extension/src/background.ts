import { APP_BASE_URL } from './config';
import { initAuthObservers, refreshIdToken } from './auth';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'desainr-refine', title: 'DesAInR: Refine Selection', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-translate', title: 'DesAInR: Translate Selection', contexts: ['selection'] });
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
  chrome.tabs.sendMessage(tab.id, { type: 'CONTEXT_MENU', id: info.menuItemId, info });
});

chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'toggle-overlay') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
      const tab = tabs[0];
      if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_OVERLAY' });
    });
  }
});

chrome.runtime.onMessage.addListener((msg: any, sender: any, sendResponse: (resp: any) => void) => {
  if (msg?.type === 'API_CALL') {
    (async () => {
      try {
        const url = `${APP_BASE_URL}/api/extension/${msg.path}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${msg.token}`,
          },
          body: JSON.stringify(msg.body ?? {}),
        });
        const json = await res.json().catch(() => ({}));
        sendResponse({ ok: res.ok, status: res.status, json });
      } catch (e: any) {
        sendResponse({ ok: false, status: 0, error: e?.message || String(e) });
      }
    })();
    return true; // keep the messaging channel open for async response
  }
});
