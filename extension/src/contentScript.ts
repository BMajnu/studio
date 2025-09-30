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
  // Keep a snapshot of the last non-empty selection to survive toolbar/context clicks
  let lastSelectionText: string = '';
  let lastSelectionRange: Range | null = null;
  function captureSelectionSnapshot() {
    try {
      const sel = window.getSelection();
      const text = sel?.toString() || '';
      if (text && text.trim()) {
        lastSelectionText = text;
        try { lastSelectionRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null; } catch { lastSelectionRange = null; }
      }
    } catch {}
  }
  document.addEventListener('selectionchange', captureSelectionSnapshot, true);
  function getSelectionTextAndRect(): { text: string; rect: DOMRect | null } {
    let text = '';
    let rect: DOMRect | null = null;
    try {
      const sel = window.getSelection();
      text = sel?.toString() || '';
      if (sel && sel.rangeCount) {
        try { rect = sel.getRangeAt(0).getBoundingClientRect(); } catch {}
      }
    } catch {}
    if (!text.trim() && lastSelectionText.trim()) {
      text = lastSelectionText;
      try { rect = lastSelectionRange ? lastSelectionRange.getBoundingClientRect() : rect; } catch {}
    }
    return { text, rect };
  }
  
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
      // Handle Customize Actions - open modal
      if (actionId === 'customize') {
        const { CustomActionModal } = await import('./ui/CustomActionModal');
        const modal = new CustomActionModal();
        modal.show((newAction) => {
          showOverlayMessage(`✨ Custom action "${newAction.label}" created!`, 'success');
          // Reload menu to show new action
          if (monicaContextMenu) {
            (monicaContextMenu as any).loadCustomActions?.();
          }
          if (monicaToolbar) {
            (monicaToolbar as any).loadCustomActions?.();
          }
        });
        return;
      }

      // Handle custom actions (actions starting with 'custom-')
      if (actionId.startsWith('custom-')) {
        const { text: selection, rect } = getSelectionTextAndRect();
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        
        try {
          await showResultPopup(actionLabel, selection, 'Working…', rect || undefined);
          const { executeCustomAction } = await import('./customActions');
          const result = await executeCustomAction(actionId, selection);
          
          if (result.ok && result.result) {
            await showResultPopup(actionLabel, selection, result.result, rect || undefined);
          } else {
            await showResultPopup(actionLabel, selection, `Failed: ${result.error || 'unknown'}`, rect || undefined);
          }
        } catch (e: any) {
          await showResultPopup(actionLabel, selection, `Error: ${e?.message || e}`, rect || undefined);
        }
        return;
      }
      
      // For Refine: show split popup (Original vs Refined) near selection
      if (actionId === 'refine') {
        const { text: selection, rect } = getSelectionTextAndRect();
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        try {
          await showResultPopup('Refine', selection, 'Working…', rect || undefined);
          const { actions } = await import('./apiClient');
          const st = await chrome.storage?.local.get?.([
            'desainr.settings.modelId',
            'desainr.settings.thinkingMode',
            'desainr.settings.userApiKey',
            'desainr.settings.outputLang'
          ]).catch(() => ({} as any));
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const userApiKey = st?.['desainr.settings.userApiKey'];
          const out = st?.['desainr.settings.outputLang'] || 'auto';
          const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
          const instruction = `Refine this text professionally: enhance clarity, grammar, flow, and readability. Make it more polished and impactful while maintaining the original message, tone, and voice. Fix any errors and improve word choice. Return ONLY the refined text.${dir}`;
          const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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

      // Compute selection & rect for popup positioning (use snapshot if current selection cleared by clicks)
      const { text: selection, rect } = getSelectionTextAndRect();

      if (actionId === 'translate') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        try {
          await showResultPopup('Translate', selection, 'Working…', rect || undefined);
          const st = await chrome.storage?.local.get?.([
            'desainr.settings.targetLang',
            'desainr.settings.modelId',
            'desainr.settings.thinkingMode',
            'desainr.settings.userApiKey',
            'desainr.settings.outputLang'
          ]).catch(() => ({} as any));
          let targetLang = st?.['desainr.settings.targetLang'] || (await import('./config')).DEFAULT_TARGET_LANG;
          const outputLang = st?.['desainr.settings.outputLang'] || 'auto';
          if (outputLang && outputLang !== 'auto') targetLang = outputLang;
          const modelId = st?.['desainr.settings.modelId'];
          const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
          const userApiKey = st?.['desainr.settings.userApiKey'];
          const { translateChunks } = await import('./apiClient');
          let resp = await translateChunks({ selection, url: location.href, targetLang, modelId, thinkingMode, userApiKey });
          if (resp.ok && (resp.json as any)?.result) {
            await showResultPopup('Translate', selection, (resp.json as any).result, rect || undefined);
          } else {
            // Fallback via actions endpoint
            const { actions } = await import('./apiClient');
            const instruction = `CRITICAL: Translate EVERY word of the provided text to ${targetLang}. Do NOT summarize or shorten. Translate the COMPLETE text maintaining original length and structure. Return ONLY the full translation of ALL provided text.`;
            const alt = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
            if (alt.ok && (alt.json as any)?.result) {
              await showResultPopup('Translate', selection, (alt.json as any).result, rect || undefined);
            } else {
              const msg = alt.error || (alt.json as any)?.error || resp.error || (resp.json as any)?.error || 'unknown';
              await showResultPopup('Translate', selection, `Failed (${alt.status || resp.status}): ${msg}`, rect || undefined);
            }
          }
        } catch (e: any) {
          await showResultPopup('Translate', selection, `Error: ${e?.message || e}`, rect || undefined);
        }
      } else if (actionId === 'expand') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Expand', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey','desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Expand this text thoughtfully with relevant details, examples, and context. Add depth and substance while maintaining the original tone, style, and core message. Make it more comprehensive and informative. Return ONLY the expanded text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Expand', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Expand', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'correct') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Correct Grammar', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId','desainr.settings.thinkingMode','desainr.settings.userApiKey','desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Fix all grammar, spelling, punctuation, and syntax errors. Ensure perfect language mechanics while preserving the original meaning and style. Return ONLY the corrected text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Provide a clear, easy-to-understand explanation of this text. Break down complex concepts, clarify meanings, and add helpful context. Make it accessible to a general audience. Return ONLY the explanation.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: 'Rephrase the following text to be clearer and more natural while preserving meaning. Return only the rephrased text.' + dir, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Create a concise, well-written summary in 1-3 sentences. Capture the core message, key insights, and most important details. Make it clear and engaging. Return ONLY the summary.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Enhance this text by adding specific, helpful details, concrete examples, and relevant context. Make it more complete and valuable while maintaining the original tone and message. Return ONLY the improved text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Make this more informative by adding relevant facts, data, and context. Increase the educational value while staying concise and focused. Ensure accuracy and credibility. Return ONLY the enhanced text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Simplify this text using clear, plain language. Remove jargon and complexity. Make it easy to understand for anyone. Keep the core message intact but more accessible. Return ONLY the simplified text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
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
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Add relevant, appropriate emojis to make this text more expressive and engaging. Use emojis thoughtfully to enhance meaning and emotion, not excessively. Keep the text professional yet friendly. Return ONLY the emojified text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Emojify', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Emojify', selection, `Failed (${status}): ${msg}`, rect || undefined);
        }
      } else if (actionId === 'humanize') {
        if (!selection.trim()) { showOverlayMessage('No text selected', 'warning'); return; }
        const { actions } = await import('./apiClient');
        await showResultPopup('Humanize', selection, 'Working…', rect || undefined);
        const st = await chrome.storage?.local.get?.([
          'desainr.settings.modelId',
          'desainr.settings.thinkingMode',
          'desainr.settings.userApiKey',
          'desainr.settings.outputLang'
        ]).catch(() => ({} as any));
        const modelId = st?.['desainr.settings.modelId'];
        const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
        const userApiKey = st?.['desainr.settings.userApiKey'];
        const out = st?.['desainr.settings.outputLang'] || 'auto';
        const dir = out==='auto' ? ' Respond in the same language as the input.' : ` Respond in ${out}.`;
        const instruction = `Humanize this text by making it sound natural and conversational, as if written by a real person. Use everyday language and common words that people actually use. Avoid overly formal or complex vocabulary, technical jargon, and uncommon words. Remove special characters, underscores, asterisks, and AI-typical formatting. Make sentences flow naturally with varied structure. Keep it authentic, relatable, and engaging. Preserve the core message but make it feel genuinely human-written. Return ONLY the humanized text.${dir}`;
        const { ok, status, json, error } = await actions({ selection, clientMessage: selection, customInstruction: instruction, modelId, thinkingMode, userApiKey });
        if (ok && (json as any)?.result) {
          await showResultPopup('Humanize', selection, (json as any).result, rect || undefined);
        } else {
          const msg = error || (json as any)?.error || 'unknown';
          await showResultPopup('Humanize', selection, `Failed (${status}): ${msg}`, rect || undefined);
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
      } else if (actionId === 'designer') {
        toggleReactOverlay();
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
    // Prevent page handlers from hijacking clicks (avoids unwanted redirects)
    try {
      const stopOnly = (e: Event) => { try { e.stopPropagation(); } catch {} };
    const stopAndPrevent = (e: Event) => { try { e.preventDefault(); } catch {} try { e.stopPropagation(); } catch {} };
    // Use bubble-phase so target handlers run, then block page listeners
    host.addEventListener('click', stopOnly);
    host.addEventListener('mousedown', stopOnly);
    host.addEventListener('mouseup', stopOnly);
    host.addEventListener('pointerdown', stopOnly);
    host.addEventListener('pointerup', stopOnly);
    host.addEventListener('touchstart', stopOnly);
    host.addEventListener('touchend', stopOnly);
    host.addEventListener('auxclick', stopAndPrevent);
    host.addEventListener('contextmenu', stopAndPrevent);
  } catch {}
    popupShadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .popup { 
        width: clamp(640px, 80vw, 1040px); max-width: 96vw; max-height: 86vh; overflow: visible;
        background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%); color: #1f2937;
        border: 1px solid rgba(99,102,241,0.18);
        border-radius: 16px; box-shadow: 0 20px 50px rgba(17,24,39,0.18);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px; line-height: 1.45;
        opacity: 0; transform: translateY(6px) scale(0.98);
        transition: transform .18s ease, opacity .18s ease;
        position: relative;
      }
      .popup.show { opacity: 1; transform: translateY(0) scale(1); }
      .toolbar { 
        display: none;
      }
      .body { 
        display: grid; grid-template-columns: 1fr 10px 1fr; gap: 0;
        border-top-left-radius: 14px; border-top-right-radius: 14px;
        overflow: hidden;
        background: transparent;
      }
      .split-scroll { position: relative; background: #eef2ff; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
      .split-scroll .thumb { position: absolute; left: 2px; right: 2px; top: 0; height: 60px; border-radius: 6px; background: linear-gradient(180deg,#a5b4fc,#6366f1); box-shadow: inset 0 0 0 2px rgba(255,255,255,.6); cursor: grab; }
      .split-scroll .thumb:active { cursor: grabbing; }
      .text-area { 
        background: #ffffff; padding: 12px; white-space: pre-wrap; 
        min-height: 96px; max-height: 70vh;
        overflow-y: auto; font-size: 12.5px; line-height: 1.5;
        border: none; position: relative;
      }
      .text-area.result { 
        background: linear-gradient(180deg, #fafbff 0%, #f7faff 100%);
      }
      .footer { 
        display: flex; justify-content: space-between; align-items: center; gap: 8px; 
        padding: 10px 12px; background: #fafbfc;
        border-top: 1px solid #f0f0f0; overflow: visible;
        border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;
      }
      .footer-left {
        display: flex; align-items: center; gap: 6px;
      }
      .action-switcher { 
        display: inline-flex; align-items: center; gap: 8px; position: relative; 
      }
      .action-switcher.open { border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(99,102,241,.18); }
      .dropdown-arrow { opacity: 0.6; }
      .btn { 
        border: 1px solid #d1d5db; border-radius: 3px; 
        padding: 4px 8px; background: #fff; 
        cursor: pointer; font-size: 11px; color: #666;
        transition: transform .12s ease, background .12s ease, border-color .12s ease, box-shadow .12s ease;
      }
      .btn:hover { 
        background: #f9f9ff; border-color: #a5b4fc; box-shadow: 0 2px 8px rgba(99,102,241,.18);
        transform: translateY(-1px);
      }
      .btn.primary { 
        background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%); color: #fff; border-color: #4f46e5;
      }
      .btn.primary:hover { 
        background: linear-gradient(180deg, #4f46e5 0%, #4338ca 100%);
      }
      .action-dropdown {
        position: absolute; bottom: 100%; left: 0;
        background: #fff; border: 1px solid rgba(99,102,241,0.2);
        border-radius: 12px; box-shadow: 0 12px 32px rgba(17,24,39,0.18);
        max-height: 260px; overflow-y: auto; width: max-content; min-width: 220px; max-width: 60vw;
        z-index: 1000; display: none; margin-bottom: 8px;
      }
      .action-dropdown.show { display: block; }
      .dropdown-item {
        padding: 6px 10px; cursor: pointer; transition: background .12s ease, transform .12s ease; 
        font-size: 12.5px; color: #1f2937; display: flex; align-items: center; gap: 8px;
        border-bottom: 1px solid #f3f4f6;
      }
      .dropdown-item:last-child { border-bottom: none; }
      .dropdown-item:hover { 
        background: #eef2ff; transform: translateX(2px);
      }
      .dropdown-item.active { 
        background: #e0e7ff; color: #4f46e5;
      }
      .dropdown-item .ico { display:inline-flex; width:16px; height:16px; }
      .dropdown-item .ico svg { width:16px; height:16px; stroke:#4b5563; }

      /* Hide side scrollbars (we use center scrollbar) */
      .text-area::-webkit-scrollbar { width: 0; height: 0; }
      .text-area { scrollbar-width: none; }
      /* Keep dropdown scrollbar minimal */
      .action-dropdown::-webkit-scrollbar { width: 10px; }
      .action-dropdown::-webkit-scrollbar-track { background: #f8fafc; border-radius: 12px; }
      .action-dropdown::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 12px; }
      .action-dropdown { scrollbar-width: thin; scrollbar-color: #c7d2fe #f8fafc; }

      /* Processing overlay */
      .processing { position: absolute; inset: 0; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(2px); background: rgba(255,255,255,0.65); z-index: 2; }
      .processing .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
      .processing .msg { margin-top: 10px; font-size: 12px; color: #4b5563; text-align:center; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .processing-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; }

      /* Dropdown single-line fit */
      .dropdown-item { white-space: nowrap; }
      
      /* Language switcher */
      .lang-wrap { position: relative; display:inline-flex; }
      .lang-switcher { display:inline-flex; align-items:center; gap:6px; }
      .lang-dropdown { position:absolute; bottom:100%; left:0; background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow: 0 12px 32px rgba(17,24,39,0.18); max-height:260px; overflow:auto; display:none; margin-bottom:8px; z-index:1000; min-width:160px; }
      .lang-dropdown.show { display:block; }
      .lang-item { padding:6px 10px; display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; border-bottom:1px solid #f3f4f6; }
      .lang-item:last-child { border-bottom:none; }
      .lang-item:hover { background:#eef2ff; }
    `;
    popupShadow.appendChild(style);
    const box = document.createElement('div');
    box.className = 'popup';
    box.innerHTML = `
      <div class="body">
        <div class="text-area" id="orig"></div>
        <div class="split-scroll" id="split-scroll"><div class="thumb" id="split-thumb"></div></div>
        <div class="text-area result" id="res"></div>
      </div>
      <div class="footer">
        <div class="left">
          <div class="action-switcher btn" id="action-switcher">
            <span id="action-label">Refine</span>
            <span class="dropdown-arrow">▼</span>
            <div class="action-dropdown" id="action-dropdown">
              <div class="dropdown-item active" data-action="refine"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></span> Refine</div>
              <div class="dropdown-item" data-action="translate"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15M9 7.5h6M9 12h3"/></svg></span> Translate</div>
              <div class="dropdown-item" data-action="summarize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h12M3 18h8"/></svg></span> Summarize</div>
              <div class="dropdown-item" data-action="expand"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16M4 12h16"/></svg></span> Expand</div>
              <div class="dropdown-item" data-action="correct"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg></span> Correct Grammar</div>
              <div class="dropdown-item" data-action="explain"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 6.75h1.5v1.5h-1.5zM12 17.25v-6"/></svg></span> Explain</div>
              <div class="dropdown-item" data-action="add-details"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12M6 12h12"/></svg></span> Add Details</div>
              <div class="dropdown-item" data-action="more-informative"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25h1.5v6h-1.5zM12 6.75h.008v.008H12z"/></svg></span> More Informative</div>
              <div class="dropdown-item" data-action="simplify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12"/></svg></span> Simplify</div>
              <div class="dropdown-item" data-action="emojify"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121a3 3 0 01-4.242 0M9 9h.01M15 9h.01M12 21a9 9 0 100-18 9 9 0 000 18z"/></svg></span> Emojify</div>
              <div class="dropdown-item" data-action="humanize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></span> Humanize</div>
              <div class="dropdown-item" data-action="designer"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4 4 12-12"/></svg></span> Designer</div>
              <div class="dropdown-item" data-action="customize"><span class="ico"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h3M4.5 12h15M8.25 18h7.5"/></svg></span> Customize Actions</div>
            </div>
          </div>
          <button class="btn" id="regen" title="Regenerate">↻ Regenerate</button>
          <div class="lang-wrap">
            <button class="btn lang-switcher" id="lang-switcher" title="Output language"><span id="lang-label">Auto</span> <span class="dropdown-arrow">▼</span></button>
            <div class="lang-dropdown" id="lang-dropdown">
              <div class="lang-item" data-lang="auto">Auto (same as input)</div>
              <div class="lang-item" data-lang="en">English</div>
              <div class="lang-item" data-lang="bn">Bengali (বাংলা)</div>
              <div class="lang-item" data-lang="hi">Hindi (हिन्दी)</div>
              <div class="lang-item" data-lang="es">Spanish (Español)</div>
              <div class="lang-item" data-lang="fr">French (Français)</div>
              <div class="lang-item" data-lang="de">German (Deutsch)</div>
              <div class="lang-item" data-lang="it">Italian (Italiano)</div>
              <div class="lang-item" data-lang="pt">Portuguese (Português)</div>
              <div class="lang-item" data-lang="ar">Arabic (العربية)</div>
              <div class="lang-item" data-lang="zh">Chinese (中文)</div>
              <div class="lang-item" data-lang="ja">Japanese (日本語)</div>
              <div class="lang-item" data-lang="ko">Korean (한국어)</div>
              <div class="lang-item" data-lang="ru">Russian (Русский)</div>
            </div>
          </div>
        </div>
        <div class="right" style="display:flex; gap:6px;">
          <button class="btn" id="copy">Copy</button>
          <button class="btn primary" id="replace">Replace</button>
          <button class="btn" id="close">Close</button>
        </div>
      </div>
    `;
    popupShadow.appendChild(box);
    document.documentElement.appendChild(host);
    popupHost = host;
    return host;
  }

  // Store current popup state for action switching
  let currentPopupOriginal = '';
  let currentPopupRect: DOMRect | undefined;
  let currentPopupAction = 'refine';

  async function showResultPopup(title: string, original: string, result: string, selectionRect?: DOMRect) {
    const host = ensurePopup();
    const shadow = popupShadow;
    if (!shadow) { try { console.warn('DesAInR: popupShadow not available'); } catch {} return; }
    
    // Store current state
    currentPopupOriginal = original;
    currentPopupRect = selectionRect;
    currentPopupAction = title.toLowerCase();
    
    const popup = shadow.querySelector('.popup') as HTMLElement;
    const actionSwitcher = shadow.getElementById('action-switcher') as HTMLElement | null;
    const actionDropdown = shadow.getElementById('action-dropdown') as HTMLElement | null;
    const orig = shadow.getElementById('orig') as HTMLElement | null;
    const res = shadow.getElementById('res') as HTMLElement | null;
    const split = shadow.getElementById('split-scroll') as HTMLElement | null;
    const thumb = shadow.getElementById('split-thumb') as HTMLElement | null;
    const btnClose = shadow.getElementById('close') as HTMLButtonElement | null;
    const btnCopy = shadow.getElementById('copy') as HTMLButtonElement | null;
    const btnReplace = shadow.getElementById('replace') as HTMLButtonElement | null;
    const btnRegen = shadow.getElementById('regen') as HTMLButtonElement | null;
    
    // Set content
    if (orig) orig.textContent = original;
    if (res) res.textContent = result;

    // Processing overlay (for initial Working… state)
    const ensureProcessing = (on: boolean) => {
      const host = shadow.querySelector('.processing') as HTMLElement | null;
      if (on) {
        if (host) return;
        const wrap = document.createElement('div');
        wrap.className = 'processing';
        wrap.innerHTML = `<div class="processing-wrap"><div class="spinner"></div><div class="msg">Preparing…</div></div>`;
        const body = shadow.querySelector('.body') as HTMLElement | null;
        if (body) body.appendChild(wrap);
      } else if (host) {
        try { host.remove(); } catch {}
      }
    };
    ensureProcessing(result === 'Working…');

    // Synchronize scrolling between the two panes (proportional)
    if (orig && res) {
      let syncing: 0 | 1 | 2 = 0; // 1 = from left, 2 = from right
      const sync = (from: HTMLElement, to: HTMLElement) => {
        const fromMax = Math.max(1, from.scrollHeight - from.clientHeight);
        const toMax = Math.max(1, to.scrollHeight - to.clientHeight);
        const p = from.scrollTop / fromMax;
        to.scrollTop = p * toMax;
      };
      orig.onscroll = () => {
        if (syncing === 2) return;
        syncing = 1;
        sync(orig, res);
        syncing = 0;
        updateThumb();
      };
      res.onscroll = () => {
        if (syncing === 1) return;
        syncing = 2;
        sync(res, orig);
        syncing = 0;
        updateThumb();
      };

      const updateThumb = () => {
        if (!split || !thumb) return;
        const maxLeft = Math.max(1, orig.scrollHeight - orig.clientHeight);
        const maxRight = Math.max(1, res.scrollHeight - res.clientHeight);
        const p = Math.max(orig.scrollTop / maxLeft, res.scrollTop / maxRight);
        const trackH = split.clientHeight;
        const viewRatio = Math.min(orig.clientHeight / orig.scrollHeight, res.clientHeight / res.scrollHeight);
        const thumbH = Math.max(40, Math.floor(trackH * viewRatio));
        const top = Math.floor((trackH - thumbH) * p);
        thumb.style.height = `${thumbH}px`;
        thumb.style.top = `${top}px`;
      };

      // Mouse wheel on center track controls both
      if (split) {
        split.onwheel = (e: WheelEvent) => {
          e.preventDefault();
          const delta = (e.deltaY || e.deltaX);
          orig.scrollTop += delta;
          res.scrollTop += delta;
        };
        // Drag thumb
        if (thumb) {
          let dragging = false; let startY = 0; let startTop = 0;
          thumb.addEventListener('mousedown', (e) => { dragging = true; startY = e.clientY; startTop = thumb.offsetTop; e.preventDefault(); });
          window.addEventListener('mousemove', (e) => {
            if (!dragging || !split) return;
            const trackH = split.clientHeight;
            const thumbH = thumb.offsetHeight;
            const maxTop = trackH - thumbH;
            const newTop = Math.max(0, Math.min(maxTop, startTop + (e.clientY - startY)));
            const p = maxTop ? newTop / maxTop : 0;
            const maxLeft = Math.max(1, orig.scrollHeight - orig.clientHeight);
            const maxRight = Math.max(1, res.scrollHeight - res.clientHeight);
            orig.scrollTop = p * maxLeft;
            res.scrollTop = p * maxRight;
          });
          window.addEventListener('mouseup', () => { dragging = false; });
        }
        // Initial thumb
        setTimeout(updateThumb, 0);
      }
    }
    
    // Update action display
    const actionMap: Record<string, string> = {
      'refine': ' Refine',
      'translate': ' Translate', 
      'rephrase': ' Rephrase',
      'summarize': ' Summarize',
      'expand': ' Expand',
      'correct grammar': ' Correct Grammar',
      'explain': ' Explain',
      'add details': ' Add Details'
    };
    
    const actionLabelText = actionMap[currentPopupAction] || 'Refine';
    const actionLabelEl = shadow.getElementById('action-label');
    if (actionLabelEl) actionLabelEl.textContent = actionLabelText;
    
    // Update active state in dropdown
    const dropdownItems = shadow.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      const action = (item as HTMLElement).dataset.action;
      if (action === currentPopupAction) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    function position() {
      const margin = 15;
      const rect = host.getBoundingClientRect();
      let x = 0, y = 0;
      
      if (selectionRect) {
        // Position near selection, but ensure it fits in viewport
        x = selectionRect.left;
        y = selectionRect.bottom + margin;
        
        // Adjust if popup would go off screen horizontally
        if (x + rect.width > window.innerWidth - margin) {
          x = window.innerWidth - rect.width - margin;
        }
        if (x < margin) {
          x = margin;
        }
        
        // Adjust if popup would go off screen vertically
        if (y + rect.height > window.innerHeight - margin) {
          y = selectionRect.top - rect.height - margin;
          if (y < margin) {
            y = margin;
          }
        }
      } else {
        // Center in viewport
        x = (window.innerWidth - rect.width) / 2;
        y = (window.innerHeight - rect.height) / 2;
      }
      
      host.style.left = `${Math.round(x)}px`;
      host.style.top = `${Math.round(y)}px`;
    }

    host.style.display = 'block';
    // Show animation
    requestAnimationFrame(() => {
      if (popup) popup.classList.add('show');
      position();
    });

    const close = () => { 
      if (popup) popup.classList.remove('show');
      setTimeout(() => host.style.display = 'none', 300);
    };
    
    // Action switcher functionality
    if (actionSwitcher && actionDropdown) {
      actionSwitcher.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        actionDropdown.classList.toggle('show');
        actionSwitcher.classList.toggle('open');
      };
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        actionDropdown.classList.remove('show');
        actionSwitcher.classList.remove('open');
      }, { once: true });
      
      // Handle action selection
      dropdownItems.forEach(item => {
        (item as HTMLElement).onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const action = (item as HTMLElement).dataset.action;
          if (action && action !== currentPopupAction) {
            actionDropdown.classList.remove('show');
            actionSwitcher.classList.remove('open');
            
            // Show loading state
            if (res) res.textContent = 'Processing...';
            
            // Call the corresponding action
            await handleMonicaAction(action, action);
            
            // The result will be updated by the action handler
            // which will call showResultPopup again
          }
        };
      });
    }
    // Language switcher
    const langSwitcher = shadow.getElementById('lang-switcher') as HTMLElement | null;
    const langDropdown = shadow.getElementById('lang-dropdown') as HTMLElement | null;
    const langLabel = shadow.getElementById('lang-label') as HTMLElement | null;
    const updateLangLabel = (code: string) => {
      const map: Record<string,string> = { auto: 'Auto', en: 'English', bn: 'Bengali', hi: 'Hindi', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ru: 'Russian' };
      if (langLabel) langLabel.textContent = map[code] || code.toUpperCase();
    };
    try {
      const st = await chrome.storage?.local.get?.(['desainr.settings.outputLang']);
      updateLangLabel((st?.['desainr.settings.outputLang'] as string) || 'auto');
    } catch {}
    if (langSwitcher && langDropdown) {
      langSwitcher.onclick = (e) => { e.preventDefault(); e.stopPropagation(); langDropdown.classList.toggle('show'); };
      document.addEventListener('click', () => { try { langDropdown.classList.remove('show'); } catch {} }, { once: true });
      const items = Array.from(langDropdown.querySelectorAll('.lang-item')) as HTMLElement[];
      items.forEach(item => {
        item.onclick = async (e) => {
          e.preventDefault(); e.stopPropagation();
          const code = item.dataset.lang || 'auto';
          try {
            await chrome.storage?.local.set?.({ 'desainr.settings.outputLang': code });
            if (code !== 'auto') { try { await chrome.storage?.local.set?.({ 'desainr.settings.targetLang': code }); } catch {} }
          } catch {}
          updateLangLabel(code);
          langDropdown.classList.remove('show');
        };
      });
    }
    
    if (btnClose) btnClose.onclick = (e) => { e.preventDefault(); e.stopPropagation(); close(); };
    if (btnCopy) btnCopy.onclick = async (e) => {
      e?.preventDefault?.(); e?.stopPropagation?.();
      try {
        await navigator.clipboard.writeText(result);
        showOverlayMessage('Copied! ✓', 'success');
      } catch {
        showOverlayMessage('Copy failed', 'error');
      }
    };
    if (btnRegen) btnRegen.onclick = async (e) => {
      e.preventDefault(); e.stopPropagation();
      if (res) res.textContent = 'Processing...';
      await handleMonicaAction(currentPopupAction, currentPopupAction);
    };
    if (btnReplace) btnReplace.onclick = async (e) => {
      e?.preventDefault?.(); e?.stopPropagation?.();
      const el = ensureOverlay();
      try {
        const { applyReplacementOrCopyWithUndo } = await import('./domReplace');
        // Primary path: smart replacer (handles many cases)
        let { outcome, undo } = await applyReplacementOrCopyWithUndo(result);

        // Fallback 1: focused editable input/textarea/contentEditable
        if (outcome !== 'replaced') {
          try {
            const { getEditableSelection, isEditableElement, replaceEditableSelection } = await import('./formSupport');
            const sel = getEditableSelection();
            if (sel && sel.element && isEditableElement(sel.element)) {
              const u0 = replaceEditableSelection(sel.element as any, result, sel.start, sel.end);
              const u = () => { try { u0(); return true; } catch { return false; } };
              if (u) { outcome = 'replaced' as any; undo = u; }
            }
          } catch {}
        }

        // Fallback 2: lastSelectionRange in DOM
        if (outcome !== 'replaced' && lastSelectionRange) {
          try {
            const range = lastSelectionRange;
            const before = range.cloneRange();
            // Capture old contents for undo
            const frag = range.cloneContents();
            range.deleteContents();
            const textNode = document.createTextNode(result);
            range.insertNode(textNode);
            // Prepare undo
            const u = () => {
              try {
                const r = before;
                // Remove inserted node
                textNode.parentNode && textNode.parentNode.removeChild(textNode);
                r.insertNode(frag);
                return true;
              } catch { return false; }
            };
            outcome = 'replaced' as any; undo = u;
          } catch {}
        }

        if (outcome === 'replaced') {
          el.textContent = 'Replaced ✓';
          if (undo) showUndoButton(el, undo);
        } else if (outcome === 'copied') {
          el.textContent = 'Copied ✓';
          showCopyButton(el, result);
        } else {
          // As a last resort, copy
          try { await navigator.clipboard.writeText(result); el.textContent = 'Copied ✓'; }
          catch { el.textContent = 'Done'; }
        }
      } catch (e) {
        el.textContent = `Replace failed: ${(e as any)?.message || e}`;
      } finally {
        el.style.display = 'block';
        setTimeout(() => hideOverlay(), 1000);
        close();
      }
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
