chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'desainr-refine', title: 'DesAInR: Refine Selection', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-translate', title: 'DesAInR: Translate Selection', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'desainr-analyze', title: 'DesAInR: Analyze Page', contexts: ['page'] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'CONTEXT_MENU', id: info.menuItemId, info });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-overlay') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_OVERLAY' });
    });
  }
});
