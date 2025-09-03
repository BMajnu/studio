import { isEditableElement, getEditableSelection, replaceEditableSelection, enhanceFormSelection } from './formSupport';

(() => {
  const ID = 'desainr-overlay-root';
  // Sanitize any leftover stub overlay from previous versions
  const prev = document.getElementById(ID) as HTMLElement | null;
  if (prev) {
    try {
      prev.style.display = 'none';
      prev.textContent = '';
    } catch {}
  }
  function ensureOverlay(): HTMLElement {
    let root = document.getElementById(ID) as HTMLElement | null;
    if (!root) {
      root = document.createElement('div');
      root.id = ID;
      Object.assign(root.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: 999999,
        background: 'white', color: '#111', border: '1px solid #ddd',
        borderRadius: '8px', padding: '8px 12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        display: 'none', maxWidth: '420px', fontFamily: 'Segoe UI, Arial, sans-serif',
      } as any);
      document.documentElement.appendChild(root);
    }
    return root;
  }

  // Transient toast helpers (replace previous persistent stub banner)
  function showOverlayMessage(message: string) {
    const el = ensureOverlay();
    el.textContent = message;
    el.style.display = 'block';
  }
  function hideOverlay() {
    const el = ensureOverlay();
    el.style.display = 'none';
  }
  function toggle() {
    const el = ensureOverlay();
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }

  function showUndoButton(el: HTMLElement, undo: () => boolean, ttlMs = 6000) {
    const btn = document.createElement('button');
    btn.textContent = 'Undo';
    Object.assign(btn.style, { marginLeft: '8px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' } as any);
    const onClick = () => {
      try { const ok = undo(); el.textContent = ok ? 'Undone ✓' : 'Undo failed'; }
      catch { el.textContent = 'Undo failed'; }
      finally { btn.remove(); setTimeout(() => hideOverlay(), 800); }
    };
    btn.addEventListener('click', onClick, { once: true });
    el.appendChild(btn);
    setTimeout(() => { try { btn.remove(); } catch {} }, ttlMs);
  }

  function showCopyButton(el: HTMLElement, text: string, ttlMs = 12000) {
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    Object.assign(btn.style, { marginLeft: '8px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' } as any);
    const onClick = async () => {
      try {
        await navigator.clipboard.writeText(text);
        el.textContent = 'Copied ✓';
      } catch {
        el.textContent = 'Copy failed';
      } finally {
        btn.remove();
        setTimeout(() => hideOverlay(), 800);
      }
    };
    btn.addEventListener('click', onClick, { once: true });
    el.appendChild(btn);
    setTimeout(() => { try { btn.remove(); } catch {} }, ttlMs);
  }

  function escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderAnalyzeOverlay(el: HTMLElement, data: { summary?: string; keyPoints?: string[]; links?: string[] }) {
    const summary = escHtml(String(data.summary || 'Analysis complete'));
    const pts = Array.isArray(data.keyPoints) ? data.keyPoints : [];
    const lks = Array.isArray(data.links) ? data.links : [];
    const pointsHtml = pts.length ? `<ul style="margin:6px 0 8px 18px; padding:0;">${pts.map(p => `<li style=\"margin:2px 0;\">${escHtml(p)}</li>`).join('')}</ul>` : '';
    const linksHtml = lks.length ? `<div style="margin-top:6px; max-height:160px; overflow:auto;"><div style="font-weight:600; margin-bottom:4px;">Top links</div>${lks.slice(0,10).map(h => `<div style=\"white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\"><a href=\"${escHtml(h)}\" target=\"_blank\" rel=\"noopener noreferrer\">${escHtml(h)}</a></div>`).join('')}</div>` : '';
    el.innerHTML = `<div style="font-size:13px; line-height:1.35;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-weight:700;">Analysis</div>
        <button id="desainr-close-overlay" style="border:1px solid #ddd; border-radius:6px; padding:2px 6px; background:#f7f7f7; cursor:pointer;">Close</button>
      </div>
      <div style="margin-top:6px;">${summary}</div>
      ${pointsHtml}
      ${linksHtml}
    </div>`;
    const btn = el.querySelector('#desainr-close-overlay') as HTMLButtonElement | null;
    if (btn) btn.onclick = () => { el.style.display = 'none'; };
  }

  // React overlay toggle (Phase 6.1.2)
  let reactOverlayHost: HTMLDivElement | null = null;
  let reactOverlayMount: { detach: () => void } | null = null;
  async function toggleReactOverlay() {
    if (reactOverlayMount) {
      try { reactOverlayMount.detach(); } catch {}
      reactOverlayMount = null;
      reactOverlayHost = null;
      return;
    }
    const host = document.createElement('div');
    host.id = 'desainr-overlay-react-root';
    Object.assign(host.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: 1000000,
    } as any);
    document.documentElement.appendChild(host);
    try {
      const mod = await import('./overlay');
      reactOverlayMount = mod.mountOverlay(host, () => {
        try { reactOverlayMount?.detach(); } catch {}
        reactOverlayMount = null;
        reactOverlayHost = null;
      });
      reactOverlayHost = host;
    } catch (e) {
      // Fallback: show toast error
      const el = ensureOverlay();
      el.style.display = 'block';
      el.textContent = `Overlay failed: ${(e as any)?.message || e}`;
      setTimeout(() => hideOverlay(), 1500);
    }
  }

  // Mini selection toolbar injected via Shadow DOM
  let toolbarHost: HTMLDivElement | null = null;
  let toolbarShadow: ShadowRoot | null = null;
  let currentSelectionText: string = '';
  let currentSelectionRect: DOMRect | null = null;
  // Prevent accidental hide while interacting with toolbar
  let suppressHideUntil = 0;

  // Result popup (Monica-style confirm UI)
  let popupHost: HTMLDivElement | null = null;
  let popupShadow: ShadowRoot | null = null;

  function ensurePopup(): HTMLDivElement {
    if (popupHost) return popupHost;
    const host = document.createElement('div');
    host.id = 'desainr-result-popup';
    Object.assign(host.style, {
      position: 'fixed', zIndex: 1000000, top: '0px', left: '0px', display: 'none'
    } as any);
    popupShadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .popup { min-width: 360px; max-width: 520px; max-height: 420px; overflow: auto;
        background: #fff; color: #111; border: 1px solid #e6e6e6; border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.2); font-family: Segoe UI, Arial, sans-serif;
      }
      .hdr { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #efefef; }
      .ttl { font-weight: 700; font-size: 14px; }
      .body { padding: 10px 12px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
      .orig { color:#666; background:#fafafa; border:1px solid #f0f0f0; border-radius:8px; padding:8px; margin-bottom:8px; }
      .res { background:#fff; border:1px solid #eee; border-radius:8px; padding:8px; }
      .ftr { display:flex; justify-content:flex-end; gap:8px; padding:10px 12px; border-top:1px solid #efefef; }
      button { border:1px solid #ddd; border-radius:8px; padding:6px 10px; background:#f7f7f7; cursor:pointer; }
      button.primary { background:#6f6cff; color:#fff; border-color:#6f6cff; }
      button:hover { filter: brightness(0.97); }
    `;
    popupShadow.appendChild(style);
    const box = document.createElement('div');
    box.className = 'popup';
    box.innerHTML = `<div class="hdr"><div class="ttl">Result</div><button id="close">✕</button></div>
      <div class="body"><div class="orig" id="orig"></div><div class="res" id="res"></div></div>
      <div class="ftr">
        <button id="copy">Copy</button>
        <button id="cancel">Cancel</button>
        <button id="replace" class="primary">Replace</button>
      </div>`;
    popupShadow.appendChild(box);
    document.documentElement.appendChild(host);
    popupHost = host;
    return host;
  }

  async function showResultPopup(title: string, original: string, result: string, selectionRect?: DOMRect) {
    const host = ensurePopup();
    const shadow = popupShadow!;
    const ttl = shadow.querySelector('.ttl') as HTMLElement;
    const orig = shadow.getElementById('orig') as HTMLElement;
    const res = shadow.getElementById('res') as HTMLElement;
    const btnClose = shadow.getElementById('close') as HTMLButtonElement;
    const btnCancel = shadow.getElementById('cancel') as HTMLButtonElement;
    const btnCopy = shadow.getElementById('copy') as HTMLButtonElement;
    const btnReplace = shadow.getElementById('replace') as HTMLButtonElement;
    ttl.textContent = title;
    orig.textContent = original;
    res.textContent = result;

    function position() {
      let x = 0, y = 0;
      const margin = 10;
      // Prefer near selection; otherwise center top area
      const r = (selectionRect || new DOMRect(window.innerWidth/2 - 200, 80, 400, 0));
      const rect = (popupHost as HTMLDivElement).getBoundingClientRect();
      x = Math.min(Math.max(margin, r.left), window.innerWidth - rect.width - margin);
      y = Math.min(Math.max(margin, r.top + r.height + margin), window.innerHeight - rect.height - margin);
      host.style.left = `${Math.round(x)}px`;
      host.style.top = `${Math.round(y)}px`;
    }

    host.style.display = 'block';
    // Allow layout to compute, then position
    requestAnimationFrame(() => position());

    const close = () => { host.style.display = 'none'; };
    btnClose.onclick = btnCancel.onclick = () => close();
    btnCopy.onclick = async () => { try { await navigator.clipboard.writeText(result); } catch {} };
    btnReplace.onclick = async () => {
      const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
      const { outcome, undo } = await applyReplacementOrCopyWithUndo(result);
      const el = ensureOverlay();
      if (outcome === 'replaced') {
        el.textContent = 'Replaced ✓';
        if (undo) showUndoButton(el, undo);
      } else if (outcome === 'copied') {
        el.textContent = 'Copied ✓';
        showCopyButton(el, result);
      } else {
        el.textContent = 'Done';
      }
      el.style.display = 'block';
      setTimeout(() => hideOverlay(), 900);
      close();
    };
  }

  function ensureToolbar(): HTMLDivElement {
    if (toolbarHost) return toolbarHost;
    const host = document.createElement('div');
    host.id = 'desainr-mini-toolbar';
    Object.assign(host.style, {
      position: 'fixed',
      zIndex: '999999',
      top: '0px',
      left: '0px',
      display: 'none',
    } as any);
    toolbarShadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      .wrap { display:flex; align-items:center; gap:6px; padding:6px 8px; border:1px solid #e6e6e6; border-radius:12px; background:#fff; box-shadow: 0 10px 28px rgba(0,0,0,0.18); font-family: Segoe UI, Arial, sans-serif; }
      .btn { border:1px solid #e6e6e6; border-radius:10px; padding:6px 8px; background:#f7f7f7; cursor:pointer; display:flex; align-items:center; gap:6px; }
      .btn:hover { background:#efefef; }
      .ico { font-size:13px; }
      .more { position: relative; }
      .menu { position:absolute; top:36px; right:0; background:#fff; border:1px solid #e6e6e6; border-radius:10px; box-shadow:0 14px 32px rgba(0,0,0,0.18); padding:6px; min-width:200px; display:none; }
      .menu.open { display:block; }
      .mi { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:8px; cursor:pointer; }
      .mi:hover { background:#f5f5ff; }
    `;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML = `
      <button id="btn-refine" class="btn" title="Refine"><span class="ico">✍️</span><span>Refine</span></button>
      <button id="btn-translate" class="btn" title="Translate"><span class="ico">🌐</span><span>Translate</span></button>
      <div class="more">
        <button id="btn-more" class="btn" title="More"><span class="ico">⋯</span></button>
        <div id="menu" class="menu">
          <div class="mi" data-act="Rephrase it">🔁 Rephrase it</div>
          <div class="mi" data-act="Add statistics">📊 Add statistics</div>
          <div class="mi" data-act="Add details">➕ Add details</div>
          <div class="mi" data-act="Add humor">😄 Add humor</div>
          <div class="mi" data-act="Make it polite">🙏 Make it polite</div>
          <div class="mi" data-act="Remove jargon">🧹 Remove jargon</div>
          <div class="mi" data-act="More informative">💡 More informative</div>
          <div style="height:6px"></div>
          <div class="mi" data-act="Analyze">🔍 Analyze</div>
          <div class="mi" data-act="Custom">⚙️ Custom…</div>
        </div>
      </div>
    `;
    toolbarShadow.appendChild(style);
    toolbarShadow.appendChild(wrap);
    document.documentElement.appendChild(host);
    // Prevent selectionchange-driven hides when clicking within the toolbar
    host.addEventListener('mousedown', () => { suppressHideUntil = Date.now() + 350; }, true);

    function withSelection(cb: (sel: string) => void) {
      const text = currentSelectionText || window.getSelection()?.toString() || '';
      if (text.trim()) cb(text);
    }

    toolbarShadow!.getElementById('btn-refine')!.addEventListener('click', async () => {
      withSelection(async (selection) => {
        const { rewrite } = await import('./apiClient');
        try {
          // show a quick loading popup first
          await showResultPopup('Rewrite', selection, 'Working…', currentSelectionRect || undefined);
          // load model id and thinking mode from settings
          const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify', modelId, thinkingMode } as any);
          if (ok && json?.result) {
            await showResultPopup('Rewrite', selection, json.result, currentSelectionRect || undefined);
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            await showResultPopup('Rewrite', selection, `Failed (${status}): ${msg}` , currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup('Rewrite', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally {
          hideToolbar();
        }
      });
    });
    // More menu handlers
    const moreBtn = toolbarShadow!.getElementById('btn-more') as HTMLButtonElement;
    const menu = toolbarShadow!.getElementById('menu') as HTMLDivElement;
    moreBtn.addEventListener('click', () => {
      suppressHideUntil = Date.now() + 350;
      menu.classList.toggle('open');
    });
    menu.addEventListener('click', async (e) => {
      suppressHideUntil = Date.now() + 350;
      const t = e.target as HTMLElement;
      const act = t.closest('.mi') as HTMLElement | null;
      if (!act) return;
      menu.classList.remove('open');
      const label = act.getAttribute('data-act') || '';
      if (!label) return;
      withSelection(async (selection) => {
        if (label === 'Analyze') {
          const { analyzePage } = await import('./apiClient');
          try {
            await showResultPopup('Analyze', selection, 'Working…', currentSelectionRect || undefined);
            const { ok, status, json, error } = await analyzePage({ url: location.href, title: document.title });
            if (ok) {
              await showResultPopup('Analyze', selection, (json?.summary || ''), currentSelectionRect || undefined);
            } else {
              const msg = (json as any)?.error || error || 'unknown';
              await showResultPopup('Analyze', selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
            }
          } catch (e: any) {
            await showResultPopup('Analyze', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
          } finally { hideToolbar(); }
          return;
        }
        if (label === 'Custom…' || label === 'Custom') {
          const instruction = window.prompt('Custom instruction (e.g., "Draft a polite reply"):', '');
          if (!instruction) { hideToolbar(); return; }
          const { actions } = await import('./apiClient');
          try {
            await showResultPopup('Custom', selection, 'Working…', currentSelectionRect || undefined);
            const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
            const modelId = st?.['desainr.settings.modelId'];
            const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
            const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode });
            if (ok && json?.result) {
              await showResultPopup('Custom', selection, json.result, currentSelectionRect || undefined);
            } else {
              const msg = (json as any)?.error || error || 'unknown';
              await showResultPopup('Custom', selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
            }
          } catch (e: any) {
            await showResultPopup('Custom', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
          } finally { hideToolbar(); }
          return;
        }
        // Refinement presets via actions endpoint
        const { actions } = await import('./apiClient');
        try {
          await showResultPopup(label, selection, 'Working…', currentSelectionRect || undefined);
          const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: label, modelId, thinkingMode });
          if (ok && json?.result) {
            await showResultPopup(label, selection, json.result, currentSelectionRect || undefined);
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            await showResultPopup(label, selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup(label, selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally { hideToolbar(); }
      });
    });
    toolbarShadow!.getElementById('btn-translate')!.addEventListener('click', async () => {
      withSelection(async (selection) => {
        const { translateChunks } = await import('./apiClient');
        try {
          await showResultPopup('Translate', selection, 'Working…', currentSelectionRect || undefined);
          const st = await chrome.storage?.local.get?.(['desainr.settings.targetLang','desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const targetLang = st?.['desainr.settings.targetLang'] || (await import('./config')).DEFAULT_TARGET_LANG;
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await translateChunks({ selection, url: location.href, targetLang, modelId, thinkingMode });
          if (ok && json?.result) {
            await showResultPopup('Translate', selection, json.result, currentSelectionRect || undefined);
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            await showResultPopup('Translate', selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup('Translate', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally {
          hideToolbar();
        }
      });
    });
    // Analyze now accessible from More menu; button removed

    toolbarHost = host;
    return host;
  }

  async function showToolbarNearSelection() {
    const mod = await import('./selection');
    const info = mod.getSelectionInfo();
    if (!info) { hideToolbar(); return; }
    currentSelectionText = info.text;
    currentSelectionRect = info.rect;
    const host = ensureToolbar();
    host.style.display = 'block';
    // Position near selection using viewport coordinates and clamp to edges
    const margin = 8;
    const rect = info.rect;
    let x = rect.left;
    let y = rect.top - 44; // above selection
    // Measure toolbar size
    const r = host.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (x + r.width + margin > vw) x = Math.max(margin, vw - r.width - margin);
    if (x < margin) x = margin;
    if (y < margin) y = Math.min(vh - r.height - margin, rect.bottom + margin);
    host.style.left = `${Math.round(x)}px`;
    host.style.top = `${Math.round(y)}px`;
  }

  function hideToolbar() {
    // Do not hide the toolbar if a result popup is currently visible
    if (popupHost && popupHost.style.display !== 'none') return;
    if (toolbarHost) toolbarHost.style.display = 'none';
  }

  document.addEventListener('keydown', (e: any) => {
    if (e.key === 'Escape') {
      hideToolbar();
      if (reactOverlayMount) {
        try { reactOverlayMount.detach(); } catch {}
        reactOverlayMount = null;
        reactOverlayHost = null;
      }
    }
  });

  // Hide toolbar when selection is cleared (unless we just clicked inside the toolbar)
  document.addEventListener('selectionchange', () => {
    if (Date.now() < suppressHideUntil) return;
    const text = window.getSelection()?.toString() || '';
    if (!text.trim()) hideToolbar();
  });

  // Hide when clicking outside the toolbar
  document.addEventListener('mousedown', (e: any) => {
    if (!toolbarHost) return;
    const path = (e as any).composedPath?.() as Node[] | undefined;
    const inside = path ? path.includes(toolbarHost) : toolbarHost.contains(e.target as Node);
    if (!inside) hideToolbar();
  }, true);

  chrome.runtime.onMessage.addListener((msg: any) => {
    if (msg?.type === 'TOGGLE_OVERLAY') toggleReactOverlay();
    if (msg?.type === 'CONTEXT_MENU') {
      handleContextMenu(msg.id, msg.info);
    }
  });

  document.addEventListener('mouseup', () => {
    // Show mini toolbar near current selection
    showToolbarNearSelection().catch(() => {});
  });

  async function handleContextMenu(id: string, info: any) {
    const { rewrite, translateChunks, analyzePage, saveMemo } = await import('./apiClient');
    const { DEFAULT_TARGET_LANG } = await import('./config');
    const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
    const el = ensureOverlay();
    el.style.display = 'block';
    try {
      if (id === 'desainr-refine') {
        el.textContent = 'Refining selection...';
        const selection = window.getSelection()?.toString() || '';
        const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify' });
        if (ok && json?.result) {
          const { outcome, undo } = await applyReplacementOrCopyWithUndo(json.result);
          if (outcome === 'replaced') {
            el.textContent = 'Refined ✓ (replaced selection)';
            if (undo) showUndoButton(el, undo);
          } else if (outcome === 'copied') {
            el.textContent = 'Refined ✓ (copied)';
          } else {
            el.textContent = 'Refined ✓';
          }
        } else {
          el.textContent = `Refine failed (${status}): ${error || 'unknown'}`;
        }
      } else if (id === 'desainr-translate') {
        el.textContent = 'Translating selection...';
        const selection = window.getSelection()?.toString() || '';
        const { ok, status, json, error } = await translateChunks({ selection, url: location.href, targetLang: DEFAULT_TARGET_LANG });
        if (ok && json?.result) {
          const { outcome, undo } = await applyReplacementOrCopyWithUndo(json.result);
          if (outcome === 'replaced') {
            el.textContent = 'Translated ✓ (replaced selection)';
            if (undo) showUndoButton(el, undo);
          } else if (outcome === 'copied') {
            el.textContent = 'Translated ✓ (copied)';
          } else {
            el.textContent = 'Translated ✓';
          }
        } else {
          el.textContent = `Translate failed (${status}): ${error || 'unknown'}`;
        }
      } else if (id === 'desainr-save-memo') {
        el.textContent = 'Saving to memo...';
        const selection = window.getSelection()?.toString() || '';
        if (!selection) {
          el.textContent = 'No text selected';
        } else {
          const memoData = {
            title: `Selection from ${document.title || location.hostname}`,
            content: selection,
            url: location.href,
            type: 'selection' as const,
            metadata: {
              pageTitle: document.title,
              timestamp: new Date().toISOString()
            },
            tags: ['selection', 'extension']
          };
          const { ok, json, error } = await saveMemo(memoData);
          if (ok && json) {
            el.textContent = `✓ Saved to memo (ID: ${json.memoId})`;
          } else {
            el.textContent = `Save to memo failed: ${error || 'unknown'}`;
          }
        }
      } else if (id === 'desainr-analyze') {
        el.textContent = 'Analyzing page...';
        const { ok, status, json, error } = await analyzePage({ url: location.href, title: document.title });
        if (ok) {
          renderAnalyzeOverlay(el, { summary: json?.summary, keyPoints: json?.keyPoints, links: json?.links });
        } else {
          el.textContent = `Analyze failed (${status}): ${error || 'unknown'}`;
        }
      } else if (id === 'desainr-translate-page') {
        el.textContent = 'Translating page...';
        const { translatePageAll } = await import('./pageTranslate');
        const { DEFAULT_TARGET_LANG } = await import('./config');
        try {
          const res = await translatePageAll(DEFAULT_TARGET_LANG);
          el.textContent = `Translated page ✓ (${res.translated}/${res.totalNodes} nodes, skipped ${res.skipped})`;
        } catch (e: any) {
          el.textContent = `Translate page error: ${e?.message || e}`;
        }
      } else if (id === 'desainr-toggle-parallel') {
        const { isParallelModeEnabled, enableParallelMode, disableParallelMode } = await import('./parallel');
        const { DEFAULT_TARGET_LANG } = await import('./config');
        try {
          if (!isParallelModeEnabled()) {
            el.textContent = 'Enabling parallel translate...';
            await enableParallelMode(DEFAULT_TARGET_LANG);
            el.textContent = 'Parallel translate ON';
          } else {
            el.textContent = 'Disabling parallel translate...';
            disableParallelMode();
            el.textContent = 'Parallel translate OFF';
          }
        } catch (e: any) {
          el.textContent = `Parallel toggle error: ${e?.message || e}`;
        }
      } else {
        el.textContent = `Unknown action: ${id}`;
      }
    } catch (e: any) {
      el.textContent = `Error: ${e?.message || e}`;
    } finally {
      // Auto-hide the toast instead of restoring the legacy stub banner
      setTimeout(() => { try { hideOverlay(); } catch {} }, 800);
    }
  }
})();
