export type OverlayMount = { detach: () => void };

/**
 * Minimal overlay mount stub. Renders a simple container with a Close button
 * inside a Shadow DOM and returns a detach() method to unmount.
 */
export function mountOverlay(host: HTMLElement, onClose?: () => void): OverlayMount {
  // Ensure a clean host
  try {
    host.innerHTML = '';
  } catch {}

  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .wrap {
      position: relative;
      min-width: 320px;
      max-width: 90vw;
      min-height: 160px;
      max-height: 80vh;
      background: #ffffff;
      color: #111;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      overflow: auto;
      padding: 12px;
    }
    .hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .ttl { font-weight: 700; font-size: 14px; }
    button {
      border: 1px solid #e2e8f0;
      background: #f7fafc;
      border-radius: 8px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    button:hover { background: #eef2f7; }
    .body { font-size: 13px; line-height: 1.5; color: #374151; }
  `;
  shadow.appendChild(style);

  const root = document.createElement('div');
  root.className = 'wrap';
  root.innerHTML = `
    <div class="hdr">
      <div class="ttl">DesAInR Overlay</div>
      <button id="ovl-close" title="Close">Close</button>
    </div>
    <div class="body">Overlay is mounted. This is a minimal stub implementation.</div>
  `;
  shadow.appendChild(root);

  const closeBtn = shadow.getElementById('ovl-close') as HTMLButtonElement | null;
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      try { onClose && onClose(); } catch {}
    });
  }

  const detach = () => {
    try {
      if (host.parentNode) host.parentNode.removeChild(host);
    } catch {}
  };

  return { detach };
}
