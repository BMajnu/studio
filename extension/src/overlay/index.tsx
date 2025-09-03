import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

export type Mounted = { detach: () => void };

function getFocusable(root: ShadowRoot): HTMLElement[] {
  const nodes = root.querySelectorAll<HTMLElement>([
    'a[href]','area[href]','button','input','select','textarea','iframe','[tabindex]:not([tabindex="-1"])','[contenteditable="true"]'
  ].join(','));
  const list: HTMLElement[] = [];
  nodes.forEach((el) => {
    const style = (el as HTMLElement).style;
    const visible = (el.offsetWidth + el.offsetHeight) > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
    const disabled = (el as HTMLButtonElement).disabled === true;
    if (visible && !disabled) list.push(el);
  });
  return list;
}

export function mountOverlay(host: HTMLElement, onClose?: () => void): Mounted {
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    a { color: #0a58ca; }
    button { font-family: Segoe UI, Arial, sans-serif; }
    :focus { outline: 2px solid #4a90e2; outline-offset: 2px; }
  `;
  shadow.appendChild(style);
  const container = document.createElement('div');
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  container.tabIndex = -1;
  shadow.appendChild(container);

  const root = createRoot(container);
  const handleClose = () => {
    try { onClose?.(); } catch {}
  };
  root.render(<App onClose={handleClose} />);

  // Focus management: initial focus and Tab trap
  const focusInitial = () => {
    const focusables = getFocusable(shadow);
    if (focusables.length) {
      try { focusables[0].focus(); } catch {}
    } else {
      try { container.focus(); } catch {}
    }
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = getFocusable(shadow);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = shadow.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (!active || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!active || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };
  container.addEventListener('keydown', onKeydown);
  // Kick off initial focus after a tick
  setTimeout(focusInitial, 0);

  return {
    detach() {
      try { container.removeEventListener('keydown', onKeydown); } catch {}
      try { root.unmount(); } catch {}
      try { host.remove(); } catch {}
    }
  };
}
