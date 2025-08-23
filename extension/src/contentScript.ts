(() => {
  const ID = 'desainr-overlay-root';
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
      root.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.';
      document.documentElement.appendChild(root);
    }
    return root;
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
      finally { btn.remove(); setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 1200); }
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
        setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 1200);
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
      // Fallback: show stub overlay error
      const el = ensureOverlay();
      el.style.display = 'block';
      el.textContent = `Overlay failed: ${(e as any)?.message || e}`;
      setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 3000);
    }
  }

  // Mini selection toolbar injected via Shadow DOM
  let toolbarHost: HTMLDivElement | null = null;
  let toolbarShadow: ShadowRoot | null = null;
  let currentSelectionText: string = '';

  function ensureToolbar(): HTMLDivElement {
    if (toolbarHost) return toolbarHost;
    const host = document.createElement('div');
    host.id = 'desainr-mini-toolbar';
    Object.assign(host.style, {
      position: 'absolute',
      zIndex: '999999',
      top: '0px',
      left: '0px',
      display: 'none',
    } as any);
    toolbarShadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      .wrap { display:flex; gap:6px; padding:6px 8px; border:1px solid #ddd; border-radius:8px; background:#fff; box-shadow: 0 8px 24px rgba(0,0,0,0.18); font-family: Segoe UI, Arial, sans-serif; }
      button { border:1px solid #ddd; border-radius:6px; padding:6px 8px; background:#f7f7f7; cursor:pointer; }
      button:hover { background:#ececec; }
    `;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML = `
      <button id="btn-refine" title="Refine">Refine</button>
      <button id="btn-custom" title="Custom Action">Custom</button>
      <button id="btn-translate" title="Translate">Translate</button>
      <button id="btn-analyze" title="Analyze Page">Analyze</button>
    `;
    toolbarShadow.appendChild(style);
    toolbarShadow.appendChild(wrap);
    document.documentElement.appendChild(host);

    function withSelection(cb: (sel: string) => void) {
      const text = currentSelectionText || window.getSelection()?.toString() || '';
      if (text.trim()) cb(text);
    }

    toolbarShadow!.getElementById('btn-refine')!.addEventListener('click', async () => {
      withSelection(async (selection) => {
        const { rewrite } = await import('./apiClient');
        const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
        const el = ensureOverlay();
        el.style.display = 'block';
        el.textContent = 'Refining...';
        try {
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
        } catch (e: any) {
          el.textContent = `Refine error: ${e?.message || e}`;
        } finally {
          setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 3000);
          hideToolbar();
        }
      });
    });
    toolbarShadow!.getElementById('btn-custom')!.addEventListener('click', async () => {
      withSelection(async (selection) => {
        const instruction = window.prompt('Custom instruction to apply (e.g., "Draft a polite reply"):', '');
        if (!instruction) { hideToolbar(); return; }
        const { actions } = await import('./apiClient');
        const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
        const el = ensureOverlay();
        el.style.display = 'block';
        el.textContent = 'Applying custom action...';
        try {
          const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction });
          if (ok && json?.result) {
            const { outcome, undo } = await applyReplacementOrCopyWithUndo(json.result);
            if (outcome === 'replaced') {
              el.textContent = 'Custom ✓ (replaced selection)';
              if (undo) showUndoButton(el, undo);
              showCopyButton(el, json.result);
            } else if (outcome === 'copied') {
              el.textContent = 'Custom ✓ (copied)';
            } else {
              el.textContent = 'Custom ✓';
              showCopyButton(el, json.result);
            }
          } else {
            el.textContent = `Custom failed (${status}): ${error || 'unknown'}`;
          }
        } catch (e: any) {
          el.textContent = `Custom error: ${e?.message || e}`;
        } finally {
          setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 3000);
          hideToolbar();
        }
      });
    });
    toolbarShadow!.getElementById('btn-translate')!.addEventListener('click', async () => {
      withSelection(async (selection) => {
        const { translateChunks } = await import('./apiClient');
        const { DEFAULT_TARGET_LANG } = await import('./config');
        const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
        const el = ensureOverlay();
        el.style.display = 'block';
        el.textContent = 'Translating...';
        try {
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
        } catch (e: any) {
          el.textContent = `Translate error: ${e?.message || e}`;
        } finally {
          setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 3000);
          hideToolbar();
        }
      });
    });
    toolbarShadow!.getElementById('btn-analyze')!.addEventListener('click', async () => {
      const { analyzePage } = await import('./apiClient');
      const el = ensureOverlay();
      el.style.display = 'block';
      el.textContent = 'Analyzing page...';
      try {
        const { ok, status, json, error } = await analyzePage({ url: location.href, title: document.title });
        if (ok) {
          renderAnalyzeOverlay(el, { summary: json?.summary, keyPoints: json?.keyPoints, links: json?.links });
        } else {
          el.textContent = `Analyze failed (${status}): ${error || 'unknown'}`;
        }
      } catch (e: any) {
        el.textContent = `Analyze error: ${e?.message || e}`;
      } finally {
        setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 8000);
        hideToolbar();
      }
    });

    toolbarHost = host;
    return host;
  }

  async function showToolbarNearSelection() {
    const mod = await import('./selection');
    const info = mod.getSelectionInfo();
    if (!info) { hideToolbar(); return; }
    currentSelectionText = info.text;
    const host = ensureToolbar();
    host.style.left = `${Math.max(8, info.pageX)}px`;
    host.style.top = `${Math.max(8, info.pageY - 44)}px`;
    host.style.display = 'block';
  }

  function hideToolbar() {
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
    const { rewrite, translateChunks, analyzePage } = await import('./apiClient');
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
      setTimeout(() => (el.textContent = 'DesAInR Overlay (stub) – press Ctrl/Cmd+M to toggle.'), 1800);
    }
  }
})();
