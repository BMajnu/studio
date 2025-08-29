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
      try { const ok = undo(); el.textContent = ok ? 'Undone \u2713' : 'Undo failed'; }
      catch { el.textContent = 'Undo failed'; }
      finally { btn.remove(); setTimeout(() => hideOverlay(), 800); }
    };
    // Popup manages its own lifecycle; keep this helper simple.
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
  
  // Load pinned actions from storage (default: refine, translate, rephrase, summarize)
  let pinnedActions: string[] = ['refine', 'translate', 'rephrase', 'summarize'];
  chrome.storage?.sync?.get(['desainr.pinnedActions'], (result: any) => {
    if (result && result['desainr.pinnedActions']) {
      pinnedActions = result['desainr.pinnedActions'];
    }
  });

  // Make selection helper available module-wide so all handlers (incl. runCustomAction) can use it
  function withSelection(cb: (sel: string) => void) {
    const text = currentSelectionText || window.getSelection()?.toString() || '';
    if (text.trim()) cb(text);
  }

  // Custom Actions (Firestore + storage sync)
  type CustomActionDef = { title: string; instruction: string };
  const CUSTOM_ACTIONS_KEY = 'desainr.customActions';
  let customActions: Record<string, CustomActionDef> = {};

  async function loadCustomActionsFromStorage(): Promise<Record<string, CustomActionDef>> {
    try {
      const data = await chrome.storage?.sync?.get?.([CUSTOM_ACTIONS_KEY]).catch(() => ({} as any));
      const arr = (data && data[CUSTOM_ACTIONS_KEY]) || [];
      const map: Record<string, CustomActionDef> = {};
      if (Array.isArray(arr)) {
        for (const it of arr) {
          if (it && typeof it.id === 'string' && it.title && it.instruction) {
            map[String(it.id)] = { title: String(it.title), instruction: String(it.instruction) };
          }
        }
      }
      return map;
    } catch {
      return {};
    }
  }

  async function saveCustomActionsToStorage(map: Record<string, CustomActionDef>): Promise<void> {
    const arr = Object.entries(map).map(([id, def]) => ({ id, title: def.title, instruction: def.instruction }));
    try { await chrome.storage?.sync?.set?.({ [CUSTOM_ACTIONS_KEY]: arr }); } catch {}
  }

  function requestRebuildToolbar() {
    try {
      if (toolbarHost) {
        toolbarHost.remove();
        toolbarHost = null;
        toolbarShadow = null;
        ensureToolbar();
      }
    } catch {}
  }

  async function initCustomActions() {
    // Load cached first for fast UI
    customActions = await loadCustomActionsFromStorage();
    // Then load from Firestore when available
    try {
      const { firebaseAuth, firebaseDb } = await import('./firebaseClient');
      const user = firebaseAuth.currentUser;
      if (!user) return;
      const { getDocs, collection, orderBy, query } = await import('firebase/firestore');
      const ref = collection(firebaseDb, 'users', user.uid, 'customActions');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const map: Record<string, CustomActionDef> = {};
      snap.forEach(doc => {
        const d: any = doc.data();
        if (d && d.name && d.instruction) {
          const id = `custom:${doc.id}`;
          map[id] = { title: String(d.name), instruction: String(d.instruction) };
        }
      });
      // Merge and persist cache
      customActions = map;
      await saveCustomActionsToStorage(customActions);
      requestRebuildToolbar();
    } catch {
      // ignore Firestore errors; rely on cache
    }
  }
  // Kick off async load
  initCustomActions();

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
      .popup { 
        min-width: 420px; width: 580px; max-width: 90vw;
        min-height: 300px; height: 460px; max-height: 80vh;
        background: #fff; color: #111; 
        border: 1px solid #e1e5e9; border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        resize: both; overflow: auto;
        backdrop-filter: blur(10px);
        animation: popupSlideIn 0.25s cubic-bezier(0.2, 0.8, 0.3, 1);
        transition: width 0.15s ease, height 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease;
        position: relative;
      }
      .popup:hover { 
        box-shadow: 0 24px 70px rgba(0,0,0,0.18), 0 10px 25px rgba(0,0,0,0.1); 
        transform: translateY(-1px);
      }
      @keyframes popupSlideIn {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .resize-handle { 
        position: absolute; bottom: 0; right: 0; width: 16px; height: 16px;
        background: linear-gradient(-45deg, transparent 30%, #cdd1d5 30%, #cdd1d5 40%, transparent 40%, transparent 60%, #cdd1d5 60%, #cdd1d5 70%, transparent 70%);
        cursor: nw-resize; border-radius: 0 0 16px 0;
      }
      /* Responsive grid layout */
      .body { padding: 12px 16px 8px; font-size: 13.5px; line-height: 1.5; flex: 1; overflow: auto; }
      .cols { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 16px; 
        align-items: start;
        min-height: 200px;
      }
      @media (max-width: 600px) {
        .cols { grid-template-columns: 1fr; gap: 12px; }
      }
      .orig, .res { 
        min-height: 120px; border-radius: 12px; padding: 12px; 
        white-space: pre-wrap; font-size: 13px; line-height: 1.6;
        transition: all 0.2s ease;
      }
      .orig { 
        color: #4a5568; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
        border: 1px solid #e2e8f0;
      }
      .res { 
        background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%); 
        border: 1px solid #e1e7ed;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .orig:hover, .res:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .col-title { 
        font-size: 11px; color: #718096; margin: 0 0 8px 4px; 
        font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      }
      .ftr { 
        display: flex; align-items: center; justify-content: space-between; 
        gap: 12px; padding: 12px 16px; 
        border-top: 1px solid #f0f4f7; background: #fafbfc;
        border-radius: 0 0 16px 16px;
      }
      .ftr-left { font-size: 12px; color: #718096; font-weight: 500; }
      .btns { display: flex; gap: 8px; }
      button { 
        border: 1px solid #e2e8f0; border-radius: 8px; 
        padding: 6px 12px; background: #ffffff; cursor: pointer; 
        font-size: 12px; font-weight: 500; color: #4a5568;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }
      button:hover { 
        background: #f7fafc; border-color: #cbd5e0; 
        transform: translateY(-0.5px); box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }
      button.primary { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: #fff; border-color: #667eea;
      }
      button.primary:hover { 
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        border-color: #5a6fd8;
      }
      
      /* Modern scrollbar styles */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
        border-radius: 10px;
        transition: all 0.3s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
      
      /* Firefox scrollbar */
      .orig, .res, .body {
        scrollbar-width: thin;
        scrollbar-color: rgba(102, 126, 234, 0.2) transparent;
      }
      
      /* Add smooth scrolling */
      .orig, .res {
        scroll-behavior: smooth;
        overflow-y: auto;
      }
    `;
    popupShadow.appendChild(style);
    const box = document.createElement('div');
    box.className = 'popup';
    box.innerHTML = `
      <div class="body">
        <div class="cols">
          <div>
            <div class="col-title">Original</div>
            <div class="orig" id="orig"></div>
          </div>
          <div>
            <div class="col-title" id="resTitle">Result</div>
            <div class="res" id="res"></div>
          </div>
        </div>
      </div>
      <div class="ftr">
        <div class="ftr-left" id="footerTitle">Result</div>
        <div class="btns">
          <button id="regen" title="Regenerate">↻</button>
          <button id="copy" title="Copy">Copy</button>
          <button id="cancel" title="Cancel">Cancel</button>
          <button id="replace" class="primary" title="Replace">Replace</button>
        </div>
      </div>
      <div class="resize-handle" title="Drag to resize"></div>`;
    popupShadow.appendChild(box);
    document.documentElement.appendChild(host);
    popupHost = host;
    return host;
  }

  async function showResultPopup(title: string, original: string, result: string, selectionRect?: DOMRect) {
    const host = ensurePopup();
    const shadow = popupShadow!;
    // No header now; we still keep a title string for context
    const ttl = { textContent: '' } as any as HTMLElement;
    const orig = shadow.getElementById('orig') as HTMLElement;
    const res = shadow.getElementById('res') as HTMLElement;
    const resTitle = shadow.getElementById('resTitle') as HTMLElement;
    const footerTitle = shadow.getElementById('footerTitle') as HTMLElement;
    const btnCancel = shadow.getElementById('cancel') as HTMLButtonElement;
    const btnCopy = shadow.getElementById('copy') as HTMLButtonElement;
    const btnReplace = shadow.getElementById('replace') as HTMLButtonElement;
    const btnRegen = shadow.getElementById('regen') as HTMLButtonElement;
    const box = shadow.querySelector('.popup') as HTMLDivElement;
    const body = shadow.querySelector('.body') as HTMLDivElement;
    // Set contextual titles
    const titleText = title;
    if (footerTitle) footerTitle.textContent = titleText;
    (ttl as any).textContent = titleText;
    // Set right column title contextually
    if (resTitle) resTitle.textContent = (title === 'Translate') ? 'Translated' : 'Result';
    orig.textContent = original;
    res.textContent = result;

    // Auto-resize to content with viewport clamping
    const resizeToContent = () => {
      if (!box) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minW = 420, minH = 300;
      const maxW = Math.floor(vw * 0.9), maxH = Math.floor(vh * 0.8);

      // Temporarily allow natural size within constraints
      box.style.maxWidth = `${maxW}px`;
      box.style.maxHeight = `${maxH}px`;
      box.style.width = 'auto';
      box.style.height = 'auto';

      // Measure intrinsic content size
      let measuredW = Math.min(maxW, Math.max(minW, Math.ceil(box.scrollWidth)));
      let measuredH = Math.min(maxH, Math.max(minH, Math.ceil(box.scrollHeight)));

      // Maintain a stable content-to-window ratio on wide screens to avoid overly wide, short boxes
      // If the viewport is wide and the content is relatively short, gently narrow the width
      if (vw >= 1200 && measuredH < Math.floor(vh * 0.35)) {
        const targetW = Math.max(minW, Math.min(maxW, Math.ceil(measuredH * 1.6)));
        if (targetW < measuredW) measuredW = targetW;
      }

      box.style.width = `${measuredW}px`;
      box.style.height = `${measuredH}px`;

      // Reposition after size change
      try { position(); } catch {}
    };
    const scheduleResize = () => requestAnimationFrame(resizeToContent);

    // Observe content changes to keep sizing tight to content
    const mo = new MutationObserver(() => scheduleResize());
    try {
      mo.observe(orig, { childList: true, subtree: true, characterData: true });
      mo.observe(res, { childList: true, subtree: true, characterData: true });
    } catch {}
    const onWinResize = () => scheduleResize();
    try { window.addEventListener('resize', onWinResize, { passive: true }); } catch {}

    // Synchronized text selection between columns
    function setupSyncSelection() {
      // Try multiple splitting patterns for better sentence detection
      const splitSentences = (text: string, isTranslated: boolean = false) => {
        if (isTranslated) {
          // For Bengali/translated text, use Bengali sentence delimiter and standard punctuation
          return text.split(/(?<=[।।.!?])\s*/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());
        } else {
          // For English/original text
          return text.split(/(?<=[.!?])\s+/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());
        }
      };
      
      const sentences = splitSentences(original, false);
      const translatedSentences = splitSentences(result, true);
      
      // Clear existing content and rebuild with sentence spans
      orig.innerHTML = '';
      res.innerHTML = '';
      
      // Track highlighted elements
      let currentHighlight: string | null = null;
      
      const createSpan = (text: string, idx: number, container: HTMLElement) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.cssText = `
          cursor: pointer; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline;
          padding: 0;
          border-radius: 0;
        `;
        span.dataset.sentIdx = String(idx);
        span.className = 'sentence-span';
        container.appendChild(span);
        
        // Add space after sentence (except last one)
        if (idx < sentences.length - 1 || idx < translatedSentences.length - 1) {
          container.appendChild(document.createTextNode(' '));
        }
        return span;
      };
      
      // Create spans for original sentences
      sentences.forEach((sentence, idx) => {
        createSpan(sentence, idx, orig);
      });
      
      // Create spans for translated sentences
      translatedSentences.forEach((sentence, idx) => {
        if (idx < sentences.length) { // Only create if there's a corresponding original
          createSpan(sentence, idx, res);
        }
      });
      
      // Enhanced hover and selection sync
      const highlightSentences = (idx: string, highlight: boolean) => {
        const spans = shadow.querySelectorAll(`span[data-sent-idx="${idx}"]`);
        spans.forEach(s => {
          const elem = s as HTMLElement;
          if (highlight) {
            elem.style.background = 'linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.1) 100%)';
            elem.style.borderRadius = '6px';
            elem.style.padding = '3px 6px';
            elem.style.boxShadow = '0 2px 4px rgba(99,102,241,0.1)';
            elem.style.transform = 'scale(1.02)';
          } else {
            elem.style.background = '';
            elem.style.borderRadius = '';
            elem.style.padding = '0';
            elem.style.boxShadow = '';
            elem.style.transform = '';
          }
        });
      };
      
      // Add event listeners
      const allSpans = shadow.querySelectorAll('.sentence-span');
      allSpans.forEach(span => {
        const spanEl = span as HTMLElement;
        
        spanEl.addEventListener('mouseenter', () => {
          const idx = spanEl.dataset.sentIdx!;
          if (currentHighlight !== idx) {
            if (currentHighlight) highlightSentences(currentHighlight, false);
            highlightSentences(idx, true);
            currentHighlight = idx;
          }
        });
        
        spanEl.addEventListener('click', () => {
          const idx = spanEl.dataset.sentIdx!;
          // Get the text from both columns for this sentence
          const origText = sentences[parseInt(idx)];
          const transText = translatedSentences[parseInt(idx)];
          if (origText && transText) {
            // Visual feedback on click
            spanEl.style.transform = 'scale(0.98)';
            setTimeout(() => {
              spanEl.style.transform = 'scale(1.02)';
            }, 100);
          }
        });
      });
      
      // Clear highlights when mouse leaves the content area
      [orig, res].forEach(container => {
        container.addEventListener('mouseleave', () => {
          if (currentHighlight) {
            highlightSentences(currentHighlight, false);
            currentHighlight = null;
          }
        });
      });
    }
    
    // Enable sync selection for Translate mode
    if (title === 'Translate') {
      try { setupSyncSelection(); } catch {}
    }
    // Initial sizing
    scheduleResize();

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

    // Close on outside click (and cancel)
    const onDocPointer = (e: any) => {
      try {
        const path = e.composedPath?.() || [];
        if (!path.includes(host)) close();
      } catch {
        if (!(host as HTMLDivElement).contains(e.target as Node)) close();
      }
    };
    function close() {
      host.style.display = 'none';
      try { document.removeEventListener('pointerdown', onDocPointer, true); } catch {}
      try { window.removeEventListener('resize', onWinResize as any); } catch {}
      try { mo.disconnect(); } catch {}
    }
    try { document.addEventListener('pointerdown', onDocPointer, true); } catch {}
    btnCancel.onclick = () => close();
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
    // Only show regenerate for Translate
    if (btnRegen) btnRegen.style.display = (title === 'Translate') ? '' : 'none';
    btnRegen.onclick = async () => {
      try {
        // Only implement built-in regenerate for Translate results
        if (ttl.textContent === 'Translate') {
          res.textContent = 'Working…';
          const st = await chrome.storage?.local.get?.(['desainr.settings.targetLang','desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const targetLang = st?.['desainr.settings.targetLang'] || (await import('./config')).DEFAULT_TARGET_LANG;
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { translateChunks } = await import('./apiClient');
          const { ok, status, json, error } = await translateChunks({ selection: original, url: location.href, targetLang, modelId, thinkingMode });
          if (ok && json?.result) {
            res.textContent = json.result;
            scheduleResize();
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            res.textContent = `Failed (${status}): ${msg}`;
            scheduleResize();
          }
        } else {
          // Fallback: show a note when regenerate is not available
          const el = ensureOverlay();
          el.textContent = 'Regenerate is available for Translate results only.';
          el.style.display = 'block';
          setTimeout(() => hideOverlay(), 1000);
        }
      } catch (e: any) {
        res.textContent = `Error: ${e?.message || e}`;
        scheduleResize();
      }
    };
  }

  function ensureToolbar(): HTMLDivElement | undefined {
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
      .wrap { 
        display: flex; align-items: center; gap: 4px; padding: 4px; 
        background: #ffffff; border: 1px solid rgba(0,0,0,0.08); 
        border-radius: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        backdrop-filter: blur(12px); background: rgba(255,255,255,0.95);
      }
      .btn-wrap {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
      }
      .btn { 
        position: relative; border: none; background: transparent; 
        width: 36px; height: 36px; border-radius: 50%; 
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s ease; font-size: 12px;
      }
      .btn:hover { background: rgba(99,102,241,0.1); transform: scale(1.05); }
      .btn:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
      .btn.active { background: rgba(99,102,241,0.15); }
      .btn svg.ico { 
        color: #4a5568; 
        transition: all 0.2s ease;
      }
      .btn:hover svg.ico { 
        color: #6366f1; 
        transform: scale(1.1);
      }
      .btn span:not(.ico) { display: none; }
      /* toolbar pin button removed; pin/unpin controls live only in More menu */
      
      /* Monica-style tooltip */
      .btn::after {
        content: attr(title); position: absolute; bottom: -28px; left: 50%;
        transform: translateX(-50%) scale(0.8); opacity: 0;
        background: rgba(0,0,0,0.8); color: white; padding: 4px 8px;
        border-radius: 6px; font-size: 11px; white-space: nowrap;
        pointer-events: none; transition: all 0.2s ease;
      }
      .btn:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
      
      .divider { width: 1px; height: 20px; background: rgba(0,0,0,0.08); margin: 0 4px; }
      .more { position: relative; }
      .menu { 
        position: absolute; top: 44px; right: 0; 
        background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
        border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; 
        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
        padding: 4px; min-width: 220px; display: none;
        animation: menuSlide 0.2s ease;
      }
      @keyframes menuSlide {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .menu.open { display: block; }
      .mi { 
        display: flex; align-items: center; gap: 10px; 
        padding: 8px 12px; border-radius: 8px; cursor: pointer;
        transition: all 0.15s ease; font-size: 13px; color: #4a5568;
      }
      .mi:hover { background: rgba(99,102,241,0.08); color: #6366f1; transform: translateX(2px); }
      .mi:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; background: rgba(99,102,241,0.08); }
      .mi .mi-icon { 
        width: 16px; height: 16px; opacity: 0.6; margin-right: 2px;
        transition: all 0.2s ease;
      }
      .mi:hover .mi-icon { opacity: 1; color: #6366f1; }
      .mi .mi-pin {
        margin-left: auto; border: none; background: transparent; cursor: pointer;
        width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      }
      .mi .mi-pin:hover { background: rgba(99,102,241,0.08); }
      .mi .mi-pin:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
      .mi .mi-pin svg { width: 16px; height: 16px; color: #6b7280; }
      .mi .mi-pin.pinned svg { color: #6366f1; }
    `;
    // Define all available actions with their icons
    let actionIcons: Record<string, { title: string; svg: string }> = {
      'refine': {
        title: 'Refine',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>'
      },
      'translate': {
        title: 'Translate',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/></svg>'
      },
      'rephrase': {
        title: 'Rephrase',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>'
      },
      'summarize': {
        title: 'Summarize',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>'
      },
      'add-details': {
        title: 'Add Details',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>'
      },
      'more-informative': {
        title: 'More Informative',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/></svg>'
      },
      'explain': {
        title: 'Explain',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>'
      },
      'simplify': {
        title: 'Simplify',
        svg: '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/></svg>'
      }
    };
    // Merge dynamic custom actions with a Heroicons sparkles icon
    const customIconSvg = '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 7.5 12 3l2.187 4.5L18.75 9 14.25 11.25 12 15.75 9.75 11.25 5.25 9l4.563-1.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 18l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>';
    for (const [id, def] of Object.entries(customActions)) {
      actionIcons[id] = { title: def.title, svg: customIconSvg };
    }
    
    // Generate buttons dynamically based on pinned actions
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.setAttribute('role', 'toolbar');
    wrap.setAttribute('aria-label', 'DesAInR toolbar');
    
    const pinSvgOutline = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/></svg>';
    const pinSvgFilled = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd"/></svg>';

    let buttonsHtml = '';
    pinnedActions.forEach(actionId => {
      const action = actionIcons[actionId];
      if (action) {
        buttonsHtml += `
          <div class="btn-wrap" data-action-id="${actionId}">
            <button id="btn-${actionId}" class="btn" title="${action.title}" aria-label="${action.title}" tabindex="0">${action.svg}</button>
          </div>`;
      }
    });

    const allActionIds = Object.keys(actionIcons);
    const menuItemsHtml = allActionIds.map(id => {
      const act = actionIcons[id];
      if (!act) return '';
      const icon = act.svg
        .replace('class="ico"', 'class="mi-icon"')
        .replace('width="20"', 'width="16"')
        .replace('height="20"', 'height="16"');
      const isPinned = pinnedActions.includes(id);
      const pinBtn = `<button class="mi-pin ${isPinned ? 'pinned' : ''}" data-action-id="${id}" title="${isPinned ? 'Unpin from toolbar' : 'Pin to toolbar'}" aria-label="${isPinned ? 'Unpin from toolbar' : 'Pin to toolbar'}: ${act.title}" aria-pressed="${isPinned ? 'true' : 'false'}" tabindex="0">${isPinned ? pinSvgFilled : pinSvgOutline}</button>`;
      return `<div class="mi" data-action-id="${id}" title="${act.title}" role="menuitem" tabindex="-1">${icon}${act.title}${pinBtn}</div>`;
    }).join('');

    wrap.innerHTML = buttonsHtml + '<div class="divider"></div>' +
      '<div class="more">' +
        '<button id="btn-more" class="btn" title="More Actions" aria-label="More Actions" aria-haspopup="true" aria-expanded="false" aria-controls="menu" tabindex="0">' +
          '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />' +
          '</svg>' +
        '</button>' +
        '<div id="menu" class="menu" role="menu" aria-label="All actions">' +
          menuItemsHtml +
          '<div style="height:4px; border-top: 1px solid rgba(0,0,0,0.06); margin: 4px 8px;"></div>' +
          '<div class="mi" data-act="Analyze" role="menuitem" tabindex="-1">' +
            '<svg class="mi-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">' +
              '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5L12 12m8.25-4.5v9L12 21m0-9L3.75 7.5M12 12v9" />' +
            '</svg>' +
            'Analyze' +
          '</div>' +
          '<div class="mi" data-act="Custom" role="menuitem" tabindex="-1">' +
            '<svg class="mi-icon" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">' +
              '<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />' +
            '</svg>' +
            'Custom...' +
          '</div>' +
        '</div>' +
      '</div>';
    toolbarShadow.appendChild(style);
    toolbarShadow.appendChild(wrap);
    document.documentElement.appendChild(host);
    // Ensure module-scoped reference is set so other functions can manage visibility/lifecycle
    toolbarHost = host;
    // Handle pin toggle in pinned row (unpin only)
    wrap.addEventListener('click', (e: any) => {
      const pinEl = (e.target as HTMLElement).closest('.btn-pin') as HTMLElement | null;
      if (!pinEl) return;
      e.stopPropagation();
      const actionId = pinEl.getAttribute('data-action-id') || '';
      if (!actionId) return;
      pinnedActions = pinnedActions.filter(id => id !== actionId);
      chrome.runtime.sendMessage({ type: 'SAVE_PINNED_ACTIONS', actions: pinnedActions });
    });
    // Prevent selectionchange-driven hides when clicking within the toolbar
    host.addEventListener('mousedown', () => { suppressHideUntil = Date.now() + 350; }, true);

    async function handleRewriteAction() {
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
            await showResultPopup('Rewrite', selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup('Rewrite', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally {
          hideToolbar();
        }
      });
    }
    // More menu handlers
    const moreBtn = toolbarShadow!.getElementById('btn-more') as HTMLButtonElement;
    const menu = toolbarShadow!.getElementById('menu') as HTMLDivElement;

    function setMenuOpen(open: boolean) {
      suppressHideUntil = Date.now() + 350;
      if (open) {
        menu.classList.add('open');
        moreBtn.setAttribute('aria-expanded', 'true');
        const first = menu.querySelector('.mi') as HTMLElement | null;
        if (first) first.focus();
      } else {
        menu.classList.remove('open');
        moreBtn.setAttribute('aria-expanded', 'false');
        moreBtn.focus();
      }
    }

    moreBtn.addEventListener('click', () => {
      setMenuOpen(!menu.classList.contains('open'));
    });

    moreBtn.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuOpen(true);
      }
    });
    // Rotate/cycle quick actions to regenerate different outcomes
    const rotateLabels = ['Rephrase it','Add details','More informative','Make it polite'];
    let rotateIdx = 0;
    function runPreset(label: string, selection: string) {
      return (async () => {
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
      })();
    }
    
    // Define helper functions first before using them
    async function handleActionPreset(instruction: string) {
      withSelection(async (selection) => {
        const { actions } = await import('./apiClient');
        try {
          await showResultPopup(instruction, selection, 'Working…', currentSelectionRect || undefined);
          const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode });
          if (ok && json?.result) {
            await showResultPopup(instruction, selection, json.result, currentSelectionRect || undefined);
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            await showResultPopup(instruction, selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup(instruction, selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally {
          hideToolbar();
        }
      });
    }
    
    async function handleRefineAction() {
      withSelection(async (selection) => {
        const { actions } = await import('./apiClient');
        try {
          await showResultPopup('Rephrase', selection, 'Working…', currentSelectionRect || undefined);
          const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Rephrase it', modelId, thinkingMode });
          if (ok && json?.result) {
            await showResultPopup('Rephrase', selection, json.result, currentSelectionRect || undefined);
          } else {
            const msg = (json as any)?.error || error || 'unknown';
            await showResultPopup('Rephrase', selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
          }
        } catch (e: any) {
          await showResultPopup('Rephrase', selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
        } finally {
          hideToolbar();
        }
      });
    }
    
    async function handleTranslateAction() {
      withSelection(async (selection) => {
        const { translate } = await import('./apiClient');
        try {
          await showResultPopup('Translate', selection, 'Working…', currentSelectionRect || undefined);
          const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const { ok, status, json, error } = await translate({ text: selection, modelId, thinkingMode });
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
    }
    
    // Add event listeners for the new main buttons
    // Add event listeners for dynamically generated buttons
    pinnedActions.forEach(actionId => {
      const btn = toolbarShadow!.getElementById(`btn-${actionId}`) as HTMLButtonElement;
      if (!btn) return;
      
      btn.addEventListener('click', async () => {
        if (actionId === 'refine') {
          await handleRewriteAction();
        } else if (actionId === 'translate') {
          await handleTranslateAction();
        } else if (actionId === 'rephrase') {
          await handleActionPreset('Rephrase it');
        } else if (actionId === 'summarize') {
          await handleActionPreset('Summarize');
        } else if (actionId === 'add-details') {
          await handleActionPreset('Add details');
        } else if (actionId === 'more-informative') {
          await handleActionPreset('More informative');
        } else if (actionId === 'explain') {
          await handleActionPreset('Explain');
        } else if (actionId === 'simplify') {
          await handleActionPreset('Simplify');
        } else if (actionId.startsWith('custom:')) {
          const def = customActions[actionId];
          if (def) {
            await runCustomAction(def.title, def.instruction);
          }
        }
      });
    });

    // Arrow key navigation between toolbar buttons
    wrap.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('btn')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const buttons = Array.from(wrap.querySelectorAll('.btn')) as HTMLElement[];
        const idx = buttons.indexOf(target);
        if (idx >= 0) {
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
          buttons[nextIdx]?.focus();
        }
      }
    });
    // Keyboard navigation within the menu
    menu.addEventListener('keydown', (e: KeyboardEvent) => {
      const items = Array.from(menu.querySelectorAll('.mi')) as HTMLElement[];
      const activeEl = (toolbarShadow!.activeElement as HTMLElement) || (document.activeElement as HTMLElement);
      const currentItem = activeEl?.closest?.('.mi') as HTMLElement | null;
      let idx = currentItem ? items.indexOf(currentItem) : -1;
      if (e.key === 'Escape') { e.preventDefault(); setMenuOpen(false); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        idx = (idx + 1 + items.length) % items.length;
        items[idx]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx = (idx - 1 + items.length) % items.length;
        items[idx]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault(); items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault(); items[items.length - 1]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentItem) currentItem.click();
      }
    });
    // Handle menu clicks (including pin toggles)
    menu.addEventListener('click', async (e: MouseEvent) => {
      suppressHideUntil = Date.now() + 350;
      const t = e.target as HTMLElement;
      // Pin/unpin via More menu
      const pinBtn = t.closest('.mi-pin') as HTMLElement | null;
      if (pinBtn) {
        e.stopPropagation();
        const actionId = pinBtn.getAttribute('data-action-id') || '';
        if (!actionId) return;
        const isPinned = pinnedActions.includes(actionId);
        if (isPinned) {
          pinnedActions = pinnedActions.filter(id => id !== actionId);
        } else {
          if (pinnedActions.length >= 9) {
            const el = ensureOverlay();
            el.textContent = 'You can only pin up to 9 actions';
            el.style.display = 'block';
            setTimeout(() => hideOverlay(), 1200);
            return;
          }
          pinnedActions = [...pinnedActions, actionId];
        }
        chrome.runtime.sendMessage({ type: 'SAVE_PINNED_ACTIONS', actions: pinnedActions });
        return; // Do not run the action when clicking pin
      }
      const act = t.closest('.mi') as HTMLElement | null;
      if (!act) return;
      menu.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');

      // Prefer actionId routing; fallback to legacy data-act labels
      const actionId = act.getAttribute('data-action-id') || '';
      if (actionId) {
        withSelection(async () => {
          if (actionId === 'refine') {
            await handleRewriteAction();
          } else if (actionId === 'translate') {
            await handleTranslateAction();
          } else if (actionId === 'rephrase') {
            await handleActionPreset('Rephrase it');
          } else if (actionId === 'summarize') {
            await handleActionPreset('Summarize');
          } else if (actionId === 'add-details') {
            await handleActionPreset('Add details');
          } else if (actionId === 'more-informative') {
            await handleActionPreset('More informative');
          } else if (actionId === 'explain') {
            await handleActionPreset('Explain');
          } else if (actionId === 'simplify') {
            await handleActionPreset('Simplify');
          } else if (actionId.startsWith('custom:')) {
            const def = customActions[actionId];
            if (def) await runCustomAction(def.title, def.instruction);
          }
          hideToolbar();
        });
        return;
      }

      const label = act.getAttribute('data-act') || '';
      if (!label) return;
      // Handle menu items that do not require a text selection first
      if (label === 'Custom…' || label === 'Custom') {
        openCustomActionModal();
        return;
      }

      if (label === 'Analyze') {
        const { analyzePage } = await import('./apiClient');
        const selection = currentSelectionText || window.getSelection()?.toString() || '';
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

      // Actions that require a selection
      withSelection(async (selection) => {
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


  // Run a named custom action with separate label and instruction
  async function runCustomAction(label: string, instruction: string) {
    const { actions } = await import('./apiClient');
    // Allow running even without a selection: fall back to empty string
    const selection = currentSelectionText || window.getSelection()?.toString() || '';
    try {
      await showResultPopup(label, selection, 'Working…', currentSelectionRect || undefined);
      const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode']).catch(() => ({} as any));
      const modelId = st?.['desainr.settings.modelId'];
      const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
      const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode });
      if (ok && json?.result) {
        await showResultPopup(label, selection, json.result, currentSelectionRect || undefined);
      } else {
        const msg = (json as any)?.error || error || 'unknown';
        await showResultPopup(label, selection, `Failed (${status}): ${msg}`, currentSelectionRect || undefined);
      }
    } catch (e: any) {
      await showResultPopup(label, selection, `Error: ${e?.message || e}`, currentSelectionRect || undefined);
    } finally {
      // Removed hideToolbar() to keep the popup open for results
    }
  }

  function openCustomActionModal() {
    const overlay = document.createElement('div');
    // ... (rest of the code remains the same)
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '1000001';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const panel = document.createElement('div');
    panel.style.width = '520px';
    panel.style.maxWidth = '92vw';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #e1e5e9';
    panel.style.borderRadius = '16px';
    panel.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)';
    panel.style.padding = '16px';
    panel.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
    panel.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px;">
        <div style="font-weight:700; font-size:15px; display:flex; align-items:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 7.5 12 3l2.187 4.5L18.75 9 14.25 11.25 12 15.75 9.75 11.25 5.25 9l4.563-1.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 18l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>
          New Custom Action
        </div>
        <button id="ca-close" style="border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; background:#ffffff; cursor:pointer; font-size:12px; font-weight:500; color:#4a5568; box-shadow:0 1px 3px rgba(0,0,0,0.04);">Close</button>
      </div>
      <label style="display:block; font-size:12px; color:#6b7280; margin:8px 0 4px;">Button name</label>
      <input id="ca-name" type="text" placeholder="e.g., Polite reply" style="width:100%; padding:10px 12px; border:1px solid #e2e8f0; border-radius:12px; font-size:13px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);" />
      <label style="display:block; font-size:12px; color:#6b7280; margin:10px 0 4px;">API prompt / instruction</label>
      <textarea id="ca-instruction" rows="5" placeholder="Describe what to do with the selected text..." style="width:100%; padding:10px 12px; border:1px solid #e2e8f0; border-radius:12px; font-size:13px; resize:vertical; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);"></textarea>
      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
        <button id="ca-save" style="border:1px solid #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#fff; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:12px; font-weight:600;">Save</button>
      </div>
    `;
    overlay.appendChild(panel);
    // Mount at document root so it isn't hidden when the toolbar auto-hides on selection changes
    document.documentElement.appendChild(overlay);

    const close = () => { try { overlay.remove(); } catch {} };
    (panel.querySelector('#ca-close') as HTMLButtonElement).onclick = close;
    (overlay as any).onclick = (e: any) => { if (e.target === overlay) close(); };
    // Basic keyboard accessibility
    overlay.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        (panel.querySelector('#ca-save') as HTMLButtonElement)?.click();
      }
    });
    const saveBtn = panel.querySelector('#ca-save') as HTMLButtonElement;
    saveBtn.onclick = async () => {
      const name = String((panel.querySelector('#ca-name') as HTMLInputElement).value || '').trim();
      const instruction = String((panel.querySelector('#ca-instruction') as HTMLTextAreaElement).value || '').trim();
      if (!name || !instruction) { (saveBtn as any).disabled = false; return; }
      (saveBtn as any).disabled = true;
      try {
        let newId = '';
        try {
          const { firebaseAuth, firebaseDb } = await import('./firebaseClient');
          const user = firebaseAuth.currentUser;
          if (user) {
            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
            const docRef = await addDoc(collection(firebaseDb, 'users', user.uid, 'customActions'), { name, instruction, createdAt: serverTimestamp() });
            newId = `custom:${docRef.id}`;
          }
        } catch {}
        if (!newId) newId = `custom:local-${Date.now()}`;
        customActions[newId] = { title: name, instruction };
        await saveCustomActionsToStorage(customActions);
        close();
        showOverlayMessage('Custom action saved \u2713');
        setTimeout(() => hideOverlay(), 1000);
        requestRebuildToolbar();
      } finally {
        (saveBtn as any).disabled = false;
      }
    };
    const nameEl = panel.querySelector('#ca-name') as HTMLInputElement;
    setTimeout(() => nameEl?.focus(), 10);
  }

  function openCustomizeToolbarWindow() {
    const windowHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customize Toolbar</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            min-height: 100vh;
            color: #1f2937;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          h1 {
            margin: 0 0 24px;
            font-size: 24px;
            color: #1f2937;
          }
          .actions-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .action-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            background: #f9fafb;
            border-radius: 8px;
            cursor: move;
            transition: all 0.2s;
          }
          .action-item:hover {
            background: #f3f4f6;
            transform: translateX(2px);
          }
          .action-item input[type="checkbox"] {
            margin-right: 12px;
            width: 18px;
            height: 18px;
            cursor: pointer;
          }
          .action-item label {
            flex: 1;
            cursor: pointer;
            font-size: 15px;
          }
          .pinned-section {
            background: #eff6ff;
            border: 2px dashed #3b82f6;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            min-height: 180px;
          }
          .pinned-title {
            font-size: 14px;
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .buttons {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }
          button {
            flex: 1;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .save-btn {
            background: #10b981;
            color: white;
          }
          .save-btn:hover {
            background: #059669;
          }
          .cancel-btn {
            background: #e5e7eb;
            color: #4b5563;
          }
          .cancel-btn:hover {
            background: #d1d5db;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Customize Toolbar Actions</h1>
          <div class="pinned-section">
            <div class="pinned-title">Pinned Actions (Max 9)</div>
            <ul class="actions-list" id="pinnedList"></ul>
          </div>
          <div>
            <div class="pinned-title" style="color: #6b7280;">Available Actions</div>
            <ul class="actions-list" id="availableList"></ul>
          </div>
          <div class="buttons">
            <button class="save-btn" id="saveBtn">Save Changes</button>
            <button class="cancel-btn" id="cancelBtn">Cancel</button>
          </div>
        </div>
        <script>
          const allActions = [
            { id: 'refine', label: 'Refine' },
            { id: 'translate', label: 'Translate' },
            { id: 'rephrase', label: 'Rephrase' },
            { id: 'summarize', label: 'Summarize' },
            { id: 'add-details', label: 'Add Details' },
            { id: 'more-informative', label: 'More Informative' },
            { id: 'explain', label: 'Explain' },
            { id: 'simplify', label: 'Simplify' }
          ];
          
          let pinnedActions = ${JSON.stringify(pinnedActions)};
          
          function renderLists() {
            const pinnedList = document.getElementById('pinnedList');
            const availableList = document.getElementById('availableList');
            
            pinnedList.innerHTML = '';
            availableList.innerHTML = '';
            
            pinnedActions.forEach(actionId => {
              const action = allActions.find(a => a.id === actionId);
              if (action) {
                const li = document.createElement('li');
                li.className = 'action-item';
                li.draggable = true;
                li.dataset.actionId = action.id;
                li.innerHTML = '<input type="checkbox" checked> <label>' + action.label + '</label>';
                pinnedList.appendChild(li);
              }
            });
            
            allActions.forEach(action => {
              if (!pinnedActions.includes(action.id)) {
                const li = document.createElement('li');
                li.className = 'action-item';
                li.draggable = true;
                li.dataset.actionId = action.id;
                li.innerHTML = '<input type="checkbox"> <label>' + action.label + '</label>';
                availableList.appendChild(li);
              }
            });
            
            // Add event listeners
            document.querySelectorAll('.action-item input').forEach(input => {
              input.addEventListener('change', (e) => {
                const actionId = e.target.parentElement.dataset.actionId;
                if (e.target.checked) {
                  if (pinnedActions.length < 9) {
                    pinnedActions.push(actionId);
                    renderLists();
                  } else {
                    e.target.checked = false;
                    alert('You can only pin up to 9 actions');
                  }
                } else {
                  pinnedActions = pinnedActions.filter(id => id !== actionId);
                  renderLists();
                }
              });
            });
          }
          
          renderLists();
          
          document.getElementById('saveBtn').addEventListener('click', () => {
            try {
              window.opener && window.opener.postMessage({ source: 'desainr', type: 'SAVE_PINNED_ACTIONS', actions: pinnedActions }, '*');
            } catch {}
            window.close();
          });
          
          document.getElementById('cancelBtn').addEventListener('click', () => {
            window.close();
          });
        </script>
      </body>
      </html>
    `;
    
    const blob = new Blob([windowHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=550,height=650');
  }
  
  async function showToolbarNearSelection() {
    const mod = await import('./selection');
    const info = mod.getSelectionInfo();
    if (!info) { hideToolbar(); return; }
    currentSelectionText = info.text;
    currentSelectionRect = info.rect;
    const host = ensureToolbar();
    if (!host) return;
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

  chrome.runtime.onMessage.addListener((msg: any, _sender, sendResponse) => {
    try {
      if (msg?.type === 'TOGGLE_OVERLAY') {
        toggleReactOverlay();
        try { sendResponse?.({ ok: true }); } catch {}
        return; // response sent
      }
      if (msg?.type === 'CONTEXT_MENU') {
        handleContextMenu(msg.id, msg.info);
        return;
      }
      if (msg?.type === 'SAVE_PINNED_ACTIONS') {
        pinnedActions = msg.actions;
        chrome.storage?.sync?.set({ 'desainr.pinnedActions': pinnedActions });
        // Rebuild toolbar with new pinned actions
        if (toolbarHost) {
          toolbarHost.remove();
          toolbarHost = null;
          toolbarShadow = null;
        }
        ensureToolbar();
        return;
      }
    } catch {}
  });

  // Listen for messages from the Customize Toolbar window (opened via Blob).
  // Blob windows cannot access extension APIs; they postMessage back to the opener.
  window.addEventListener('message', (ev: any) => {
    const d = ev?.data;
    if (!d || d.source !== 'desainr' || d.type !== 'SAVE_PINNED_ACTIONS') return;
    try {
      const actions = Array.isArray(d.actions) ? d.actions : [];
      // Update local state immediately for responsive UI
      pinnedActions = actions;
      chrome.storage?.sync?.set({ 'desainr.pinnedActions': pinnedActions });
      if (toolbarHost) {
        toolbarHost.remove();
        toolbarHost = null;
        toolbarShadow = null;
      }
      ensureToolbar();
      // Forward to background so other tabs receive the update
      try { chrome.runtime.sendMessage({ type: 'SAVE_PINNED_ACTIONS', actions: pinnedActions }); } catch {}
    } catch {}
  }, false);

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
      setTimeout(() => {
        try {
          hideOverlay();
        } catch {}
      }, 800);
    }
  }

}
})();
