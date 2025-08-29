// Minimal overlay shim for type-checking and safe runtime fallback
export function mountOverlay(host: HTMLElement, onClose: () => void) {
  // Basic placeholder UI
  try {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.background = 'rgba(0,0,0,0.75)';
    container.style.color = '#fff';
    container.style.padding = '8px 12px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

    const label = document.createElement('div');
    label.textContent = 'Overlay (shim)';
    label.style.fontSize = '12px';
    label.style.marginRight = '8px';

    const btn = document.createElement('button');
    btn.textContent = 'Close';
    btn.style.marginLeft = '8px';
    btn.onclick = () => {
      try { onClose?.(); } catch {}
      try { host.remove(); } catch {}
    };

    container.appendChild(label);
    container.appendChild(btn);
    host.appendChild(container);
  } catch {
    // ignore errors in non-DOM environments
  }

  return {
    detach: () => {
      try { host.remove(); } catch {}
    }
  };
}
