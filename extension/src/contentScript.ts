import { isEditableElement, getEditableSelection, replaceEditableSelection, enhanceFormSelection } from './formSupport';
import { MonicaStyleContextMenu, type MenuAction, DefaultActions } from './ui/MonicaStyleContextMenu';
import { MonicaStyleToolbar, type ToolbarAction } from './ui/MonicaStyleToolbar';
import { MonicaTheme } from './ui/MonicaStyleTheme';

(() => {
  const ID = 'desainr-overlay-root';
  // Monica-style UI components
  let monicaContextMenu: MonicaStyleContextMenu | null = null;
  let monicaToolbar: MonicaStyleToolbar | null = null;
  let monicaToast: HTMLElement | null = null;
  
  // Initialize Monica-style components
  const initMonicaComponents = () => {
    if (!monicaContextMenu) {
      monicaContextMenu = new MonicaStyleContextMenu();
    }
    if (!monicaToolbar) {
      monicaToolbar = new MonicaStyleToolbar();
    }
  };
  
  // Initialize on load
  initMonicaComponents();
  
  // Monica-style action handler
  async function handleMonicaAction(actionId: string, actionLabel: string) {
    try {
      // For Refine: show split popup (Original vs Refined) near selection
      if (actionId === 'refine') {
        const selection = window.getSelection()?.toString() || '';
        if (!selection.trim()) {
          showOverlayMessage('No text selected', 'warning');
          return;
        }
        const rect = (() => {
          try {
            const sel = window.getSelection();
            if (sel && sel.rangeCount) return sel.getRangeAt(0).getBoundingClientRect();
          } catch {}
          return null;
        })();
        try {
          await showResultPopup('Refine', selection, 'Working…', rect || undefined);
          const st = await chrome.storage?.local.get?.([
            'desainr.settings.modelId',
            'desainr.settings.thinkingMode',
            'desainr.settings.userApiKey'
          ]).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const userApiKey = st?.['desainr.settings.userApiKey'];
          const { rewrite } = await import('./apiClient');
          const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify', modelId, thinkingMode, userApiKey } as any);
          if (ok && (json as any)?.result) {
            await showResultPopup('Refine', selection, (json as any).result, rect || undefined);
          } else {
            const msg = error || (json as any)?.error || 'unknown';
            await showResultPopup('Refine', selection, `Failed (${status}): ${msg}`, rect || undefined);
          }
        } catch (e: any) {
          await showResultPopup('Refine', selection, `Error: ${e?.message || e}`, rect || undefined);
        }
        return;
      }

      // Compute selection & rect for popup positioning
      const selection = window.getSelection()?.toString() || '';
      const rect = (() => {
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount) return sel.getRangeAt(0).getBoundingClientRect();
        } catch {}
        return null;
      })();

      if (actionId === 'translate') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { translateChunks } = await import('./apiClient');
        await showResultPopup('Translate', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.targetLang',
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey'
        ]).catch(() => ({} as any));
        const targetLang = st?.['desainr.settings.targetLang'] || (await import('./config')).DEFAULT_TARGET_LANG;
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await translateChunks({ selection, url: location.href, targetLang, modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Translate', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Translate', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'rewrite') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { rewrite } = await import('./apiClient');
        await showResultPopup('Rewrite', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify', modelId, thinkingMode, userApiKey } as any);
        if (ok && (json as any)?.result) {
          await showResultPopup('Rewrite', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Rewrite', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'expand') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { rewrite } = await import('./apiClient');
        await showResultPopup('Expand', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'expand', modelId, thinkingMode, userApiKey } as any);
        if (ok && (json as any)?.result) {
          await showResultPopup('Expand', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Expand', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'correct') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { rewrite } = await import('./apiClient');
        await showResultPopup('Correct Grammar', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'grammar', modelId, thinkingMode, userApiKey } as any);
        if (ok && (json as any)?.result) {
          await showResultPopup('Correct Grammar', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Correct Grammar', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'explain') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Explain', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Explain this clearly', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Explain', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Explain', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'rephrase') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Rephrase', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Rephrase', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Rephrase', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'summarize') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Summarize', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Summarize the following text concisely in 1-3 sentences. Return only the summary.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Summarize', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Summarize', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'add-details') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Add Details', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Add helpful, concrete details to the following text while preserving tone and meaning. Return only the improved text.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Add Details', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Add Details', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'more-informative') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('More Informative', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Make the following text more informative by adding succinct, factual context. Keep it concise. Return only the revised text.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('More Informative', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('More Informative', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'simplify') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Simplify', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Simplify the following text to be easier to understand, using plain language. Return only the simplified text.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Simplify', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Simplify', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'emojify') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Emojify', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Rewrite the following text with a friendly, engaging tone and add relevant emojis where appropriate; do not overuse them. Return only the revised text.', modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Emojify', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Emojify', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'analyze') {
        const { analyzePage } = await import('./apiClient');
        await showResultPopup('Analyze', selection || '(No selection)', 'Working…', rect || undefined);
        const { ok, status, json, error } = await analyzePage({ url: location.href, title: document.title });
        if (ok) {
          await showResultPopup('Analyze', selection || '(No selection)', ((json as any)?.summary || 'Done'), rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Analyze', selection || '(No selection)', `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'designer-chat') {
        toggleReactOverlay();
      } else if (actionId === 'copy') {
        // Copy selected text
        const selection = window.getSelection()?.toString() || '';
        if (selection) {
          navigator.clipboard.writeText(selection);
          showOverlayMessage('Text copied to clipboard! 📋', 'success');
        } else {
          showOverlayMessage('No text selected', 'warning');
        }
      } else if (actionId === 'settings') {
        showOverlayMessage('Extension settings coming soon! ⚙️', 'info');
      } else if (actionId === 'customize') {
        showOverlayMessage('Custom actions coming soon! 🔧', 'info');
      } else {
        showOverlayMessage(`Unknown action: ${actionLabel}`, 'warning');
      }
    } catch (error: any) {
      showOverlayMessage(`Error: ${error?.message || error}`, 'error');
    }
  }
  
  // Sanitize any leftover stub overlay from previous versions
  const prev = document.getElementById(ID) as HTMLElement | null;
  if (prev) {
    try {
      prev.style.display = 'none';
      prev.textContent = '';
    } catch {}
  }
  // Monica-style toast notification system
  function createMonicaToast(): HTMLElement {
    if (monicaToast) {
      monicaToast.remove();
    }
    
    monicaToast = document.createElement('div');
    Object.assign(monicaToast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: MonicaTheme.zIndex.toast,
      background: MonicaTheme.colors.surface,
      color: MonicaTheme.colors.textPrimary,
      border: `1px solid ${MonicaTheme.colors.border}`,
      borderRadius: MonicaTheme.borderRadius.lg,
      padding: `${MonicaTheme.spacing.md} ${MonicaTheme.spacing.lg}`,
      boxShadow: MonicaTheme.shadows.lg,
      backdropFilter: 'blur(12px)',
      maxWidth: '420px',
      fontFamily: MonicaTheme.typography.fontFamily,
      fontSize: MonicaTheme.typography.fontSize.sm,
      display: 'none',
      opacity: '0',
      transform: 'translateY(-8px) scale(0.95)',
      transition: `all ${MonicaTheme.animation.fast}`,
    } as any);
    
    document.documentElement.appendChild(monicaToast);
    return monicaToast;
  }
  
  function ensureOverlay(): HTMLElement {
    return createMonicaToast();
  }

  // Monica-style toast helpers with smooth animations
  function showOverlayMessage(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const el = createMonicaToast();
    
    // Create toast content with icon
    const icons = {
      info: '💬',
      success: '✅', 
      error: '❌',
      warning: '⚠️'
    };
    
    const colors = {
      info: MonicaTheme.colors.info,
      success: MonicaTheme.colors.success,
      error: MonicaTheme.colors.error,
      warning: MonicaTheme.colors.warning
    };
    
    el.innerHTML = `
      <div style="display: flex; align-items: center; gap: ${MonicaTheme.spacing.md};">
        <div style="font-size: 18px;">${icons[type]}</div>
        <div style="flex: 1; line-height: ${MonicaTheme.typography.lineHeight.normal};">${message}</div>
        <div style="width: 4px; height: 40px; background: ${colors[type]}; border-radius: 2px; margin-left: ${MonicaTheme.spacing.md};"></div>
      </div>
    `;
    
    el.style.display = 'block';
    
    // Animate in
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });
    
    // Auto-hide after delay
    setTimeout(() => hideOverlay(), 3000);
  }
  
  function hideOverlay() {
    if (monicaToast) {
      monicaToast.style.opacity = '0';
      monicaToast.style.transform = 'translateY(-8px) scale(0.95)';
      setTimeout(() => {
        if (monicaToast) {
          monicaToast.style.display = 'none';
        }
      }, 150);
    }
  }
  
  function toggle() {
    if (monicaToast && monicaToast.style.display !== 'none') {
      hideOverlay();
    } else {
      showOverlayMessage('DesAInR Assistant ready! 🚀');
    }
  }

  function showUndoButton(el: HTMLElement, undo: () => boolean, ttlMs = 6000) {
    const btn = document.createElement('button');
    btn.innerHTML = `
      <div style="display: flex; align-items: center; gap: ${MonicaTheme.spacing.xs};">
        <span>↶</span>
        <span>Undo</span>
      </div>
    `;
    Object.assign(btn.style, {
      marginLeft: MonicaTheme.spacing.md,
      padding: `${MonicaTheme.spacing.xs} ${MonicaTheme.spacing.md}`,
      background: MonicaTheme.colors.primary,
      color: 'white',
      border: 'none',
      borderRadius: MonicaTheme.borderRadius.md,
      cursor: 'pointer',
      fontSize: MonicaTheme.typography.fontSize.sm,
      fontWeight: MonicaTheme.typography.fontWeight.medium,
      transition: `all ${MonicaTheme.animation.fast}`,
      fontFamily: MonicaTheme.typography.fontFamily,
    } as any);
    
    btn.onmouseenter = () => {
      btn.style.background = MonicaTheme.colors.primaryHover;
      btn.style.transform = 'translateY(-1px)';
    };
    btn.onmouseleave = () => {
      btn.style.background = MonicaTheme.colors.primary;
      btn.style.transform = 'translateY(0)';
    };
    
    const onClick = () => {
      try { 
        const ok = undo(); 
        showOverlayMessage(ok ? 'Undone successfully! ✓' : 'Undo failed', ok ? 'success' : 'error');
      }
      catch { 
        showOverlayMessage('Undo failed', 'error'); 
      }
      finally { 
        btn.remove(); 
        setTimeout(() => hideOverlay(), 800); 
      }
    };
    btn.addEventListener('click', onClick, { once: true });
    el.appendChild(btn);
    setTimeout(() => { try { btn.remove(); } catch {} }, ttlMs);
  }

  function showCopyButton(el: HTMLElement, text: string, ttlMs = 12000) {
    const btn = document.createElement('button');
    btn.innerHTML = `
      <div style="display: flex; align-items: center; gap: ${MonicaTheme.spacing.xs};">
        <span>📋</span>
        <span>Copy</span>
      </div>
    `;
    Object.assign(btn.style, {
      marginLeft: MonicaTheme.spacing.md,
      padding: `${MonicaTheme.spacing.xs} ${MonicaTheme.spacing.md}`,
      background: MonicaTheme.colors.surface,
      color: MonicaTheme.colors.textPrimary,
      border: `1px solid ${MonicaTheme.colors.border}`,
      borderRadius: MonicaTheme.borderRadius.md,
      cursor: 'pointer',
      fontSize: MonicaTheme.typography.fontSize.sm,
      fontWeight: MonicaTheme.typography.fontWeight.medium,
      transition: `all ${MonicaTheme.animation.fast}`,
      fontFamily: MonicaTheme.typography.fontFamily,
    } as any);
    
    btn.onmouseenter = () => {
      btn.style.background = MonicaTheme.colors.surfaceHover;
      btn.style.borderColor = MonicaTheme.colors.primary;
      btn.style.transform = 'translateY(-1px)';
    };
    btn.onmouseleave = () => {
      btn.style.background = MonicaTheme.colors.surface;
      btn.style.borderColor = MonicaTheme.colors.border;
      btn.style.transform = 'translateY(0)';
    };
    
    const onClick = async () => {
      try {
        await navigator.clipboard.writeText(text);
        showOverlayMessage('Copied to clipboard! ✓', 'success');
      } catch {
        showOverlayMessage('Copy failed', 'error');
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
      .popup { min-width: 520px; max-width: 720px; max-height: 520px; overflow: auto;
        background: #fff; color: #111; border: 1px solid #e6e6e6; border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.2); font-family: Segoe UI, Arial, sans-serif;
      }
      .hdr { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #efefef; }
      .ttl { font-weight: 700; font-size: 14px; }
      .body { padding: 12px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
      .panel { display:flex; flex-direction:column; gap:8px; }
      .ph { font-weight: 600; color:#333; font-size: 12px; }
      .orig { color:#444; background:#fafafa; border:1px solid #f0f0f0; border-radius:8px; padding:8px; }
      .res { background:#fff; border:1px solid #eee; border-radius:8px; padding:8px; }
      .ftr { display:flex; justify-content:flex-end; gap:8px; padding:10px 12px; border-top:1px solid #efefef; }
      button { border:1px solid #ddd; border-radius:8px; padding:6px 10px; background:#f7f7f7; cursor:pointer; }
      button.primary { background:#6f6cff; color:#fff; border-color:#6f6cff; }
      button:hover { filter: brightness(0.97); }
    `;
    popupShadow.appendChild(style);
    const box = document.createElement('div');
    box.className = 'popup';
    box.innerHTML = `<div class="hdr"><div class="ttl">Refine Result</div><button id="close">✕</button></div>
      <div class="body">
        <div class="panel">
          <div class="ph">Original Text</div>
          <div class="orig" id="orig"></div>
        </div>
        <div class="panel">
          <div class="ph">Refined Text</div>
          <div class="res" id="res"></div>
        </div>
      </div>
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
    const shadow = popupShadow;
    if (!shadow) { try { console.warn('DesAInR: popupShadow not available'); } catch {} return; }
    const ttl = shadow.querySelector('.ttl') as HTMLElement | null;
    const orig = shadow.getElementById('orig') as HTMLElement | null;
    const res = shadow.getElementById('res') as HTMLElement | null;
    const btnClose = shadow.getElementById('close') as HTMLButtonElement | null;
    const btnCancel = shadow.getElementById('cancel') as HTMLButtonElement | null;
    const btnCopy = shadow.getElementById('copy') as HTMLButtonElement | null;
    const btnReplace = shadow.getElementById('replace') as HTMLButtonElement | null;
    if (ttl) ttl.textContent = title;
    if (orig) orig.textContent = original;
    if (res) res.textContent = result;

    function position() {
      let x = 0, y = 0;
      const margin = 10;
      // Prefer near selection; otherwise center top area
      const r = (selectionRect || new DOMRect(window.innerWidth/2 - 200, 80, 400, 0));
      const rect = host.getBoundingClientRect();
      x = Math.min(Math.max(margin, r.left), window.innerWidth - rect.width - margin);
      y = Math.min(Math.max(margin, r.top + r.height + margin), window.innerHeight - rect.height - margin);
      host.style.left = `${Math.round(x)}px`;
      host.style.top = `${Math.round(y)}px`;
    }

    host.style.display = 'block';
    // Allow layout to compute, then position
    requestAnimationFrame(() => position());

    const close = () => { host.style.display = 'none'; };
    if (btnClose) btnClose.onclick = () => close();
    if (btnCancel) btnCancel.onclick = () => close();
    if (btnCopy) btnCopy.onclick = async () => { try { await navigator.clipboard.writeText(result); } catch {} };
    if (btnReplace) btnReplace.onclick = async () => {
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

    const refineBtn = toolbarShadow?.getElementById('btn-refine') as HTMLButtonElement | null;
    if (refineBtn) {
      refineBtn.addEventListener('click', async () => {
        withSelection(async (selection) => {
          const { rewrite } = await import('./apiClient');
          try {
            // show a quick loading popup first
            await showResultPopup('Rewrite', selection, 'Working…', currentSelectionRect || undefined);
            // load model id and thinking mode from settings
            const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
            const modelId = st?.['desainr.settings.modelId'];
            const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
            const userApiKey = st?.['desainr.settings.userApiKey'];
            const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify', modelId, thinkingMode, userApiKey } as any);
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
    }
    // More menu handlers
    const moreBtn = toolbarShadow?.getElementById('btn-more') as HTMLButtonElement | null;
    const menu = toolbarShadow?.getElementById('menu') as HTMLDivElement | null;
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        suppressHideUntil = Date.now() + 350;
        if (menu) menu.classList.toggle('open');
      });
    }
    if (menu) {
      menu.addEventListener('click', async (e) => {
        suppressHideUntil = Date.now() + 350;
        const t = e.target as HTMLElement | null;
        const act = t?.closest('.mi') as HTMLElement | null;
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
              const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
              const modelId = st?.['desainr.settings.modelId'];
              const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
              const userApiKey = st?.['desainr.settings.userApiKey'];
              const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
            const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
            const modelId = st?.['desainr.settings.modelId'];
            const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
            const userApiKey = st?.['desainr.settings.userApiKey'];
            const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: label, modelId, thinkingMode, userApiKey });
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
    }
    const translateBtn = toolbarShadow?.getElementById('btn-translate') as HTMLButtonElement | null;
    if (translateBtn) {
      translateBtn.addEventListener('click', async () => {
        withSelection(async (selection) => {
          const { translateChunks } = await import('./apiClient');
          try {
            await showResultPopup('Translate', selection, 'Working…', currentSelectionRect || undefined);
            const st = await chrome.storage?.local.get?.(['desainr.settings.targetLang','desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
            const targetLang = st?.['desainr.settings.targetLang'] || (await import('./config')).DEFAULT_TARGET_LANG;
            const modelId = st?.['desainr.settings.modelId'];
            const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
            const userApiKey = st?.['desainr.settings.userApiKey'];
            const { ok, status, json, error } = await translateChunks({ selection, url: location.href, targetLang, modelId, thinkingMode, userApiKey });
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
    }
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
    
    // Use Monica-style toolbar instead of legacy toolbar
    if (monicaToolbar) {
      const rect = info.rect;
      const x = rect.left + rect.width / 2; // Center on selection
      const y = rect.top - 8; // Slightly above selection
      
      monicaToolbar.show(x, y, (action: ToolbarAction) => {
        handleMonicaAction(action.id, action.label);
      });
    }
  }

  function hideToolbar() {
    // Hide Monica-style toolbar
    if (monicaToolbar) {
      try {
        monicaToolbar.hide();
      } catch (e) {
        console.warn('Error hiding Monica toolbar:', e);
      }
    }
    
    // Legacy toolbar fallback
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

  // Bridge: request ID token from web app via window.postMessage
  function requestWebAppIdToken(timeoutMs = 4000): Promise<{ ok: boolean; idToken?: string; error?: string }> {
    return new Promise((resolve) => {
      let settled = false;
      const cleanup = (tid?: number) => {
        window.removeEventListener('message', onMessage as any);
        if (tid) clearTimeout(tid);
      };
      const onMessage = (event: MessageEvent) => {
        if (event.source !== window) return;
        const data = (event as any).data;
        if (!data || data.type !== 'DESAINR_WEBAPP_TOKEN') return;
        if (settled) return;
        settled = true;
        cleanup();
        const { ok, idToken, error } = data || {};
        resolve({ ok: !!ok, idToken, error: error || (ok ? undefined : 'no_token') });
      };
      window.addEventListener('message', onMessage as any);
      const tid = window.setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          resolve({ ok: false, error: 'timeout' });
        }
      }, timeoutMs);
      try {
        window.postMessage({ type: 'DESAINR_EXTENSION_GET_TOKEN', from: 'desainr-extension' }, window.origin);
      } catch {
        settled = true;
        cleanup(tid);
        resolve({ ok: false, error: 'post_message_failed' });
      }
    });
  }
  chrome.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: (resp: any) => void) => {
    if (msg?.type === 'TOGGLE_OVERLAY') toggleReactOverlay();
    if (msg?.type === 'CONTEXT_MENU') {
      handleContextMenu(msg.id, msg.info);
    }
    if (msg?.type === 'DESAINR_GET_WEBAPP_ID_TOKEN') {
      requestWebAppIdToken().then((resp) => sendResponse(resp));
      return true;
    }
  });

  document.addEventListener('mouseup', () => {
    // Show Monica-style toolbar near current selection
    setTimeout(() => {
      showToolbarNearSelection().catch(() => {});
    }, 100); // Small delay to ensure selection is finalized
  });
  
  // Context menu integration with Monica-style menu
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      // Show Monica-style context menu for text selections
      e.preventDefault();
      
      if (monicaContextMenu) {
        monicaContextMenu.show(e.pageX, e.pageY, (action: MenuAction) => {
          handleMonicaAction(action.id, action.label);
        });
      }
    }
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
        const st = await chrome.storage?.local.get?.(['desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await rewrite({ selection, url: location.href, task: 'clarify', modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.(['desainr.settings.targetLang','desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey']).catch(() => ({} as any));
        const targetLang = st?.['desainr.settings.targetLang'] || DEFAULT_TARGET_LANG;
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const { ok, status, json, error } = await translateChunks({ selection, url: location.href, targetLang, modelId, thinkingMode, userApiKey });
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
