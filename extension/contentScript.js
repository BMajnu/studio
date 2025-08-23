(function () {
  const ID = 'desainr-overlay-root';
  function ensureOverlay() {
    let root = document.getElementById(ID);
    if (!root) {
      root = document.createElement('div');
      root.id = ID;
      Object.assign(root.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: 999999,
        background: 'white', color: '#111', border: '1px solid #ddd',
        borderRadius: '8px', padding: '8px 12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        display: 'none', maxWidth: '420px', fontFamily: 'Segoe UI, Arial, sans-serif',
      });
      root.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.';
      document.documentElement.appendChild(root);
    }
    return root;
  }
  function toggle() {
    const el = ensureOverlay();
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'TOGGLE_OVERLAY') toggle();
    if (msg?.type === 'CONTEXT_MENU') {
      // simple toast
      const el = ensureOverlay();
      el.style.display = 'block';
      el.textContent = `DesAInR: ${msg.id} triggered (stub).`;
      setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 1500);
    }
  });

  // Selection hint (minimal)
  document.addEventListener('mouseup', () => {
    const sel = window.getSelection()?.toString().trim();
    if (sel) {
      const el = ensureOverlay();
      el.style.display = 'block';
      el.textContent = `Selected: "${sel.slice(0, 60)}"...`;
      setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 1500);
    }
  });
})();
