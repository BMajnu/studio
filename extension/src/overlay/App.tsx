import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createFocusTrap, setupEscapeHandler, announceToScreenReader, getAriaLabel, detectHighContrastMode } from './accessibility';
import { Toast, useToast } from './Toast';
import { getTheme, themed } from './theme';

export type AppProps = { onClose?: () => void };

type TabKey = 'chat' | 'write' | 'translate' | 'analyze';

const tabLabel: Record<TabKey, string> = {
  chat: 'Chat',
  write: 'Write',
  translate: 'Translate',
  analyze: 'Analyze',
};

export function App({ onClose }: AppProps) {
  const [tab, setTab] = useState<TabKey>('chat');
  const overlayRef = useRef<HTMLDivElement>(null);
  const [highContrast, setHighContrast] = useState(detectHighContrastMode());
  const theme = getTheme(highContrast);
  const styles = themed(theme);
  const { messages: toastMessages, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
  // Chat tab state
  type ChatMsg = { role: 'user' | 'assistant'; text: string };
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatModel, setChatModel] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  type ChatSuggestion = { title: string; prompt: string };
  const [chatSuggestions, setChatSuggestions] = useState<ChatSuggestion[]>([]);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<number>(-1);
  // Analyze tab state
  const [analyzeBusy, setAnalyzeBusy] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [memoSaveStatus, setMemoSaveStatus] = useState<string>('');
  // Translate tab state
  const [translateBusy, setTranslateBusy] = useState(false);
  const [translateMsg, setTranslateMsg] = useState('');
  const [parallelOn, setParallelOn] = useState(false);
  const [targetLang, setTargetLang] = useState<string>('');
  // Write tab state
  const [writeBusy, setWriteBusy] = useState(false);
  const [writeMsg, setWriteMsg] = useState('');
  const [writeUndo, setWriteUndo] = useState<null | (() => boolean)>(null);

  // Style helper functions using theme
  const btn = (): React.CSSProperties => styles.button('secondary', false) as React.CSSProperties;
  const tabBtn = (active: boolean): React.CSSProperties => styles.button('secondary', active) as React.CSSProperties;

  // Helpers for suggestions
  function normalizeSuggestions(input: any): { title: string; prompt: string }[] {
    const out: { title: string; prompt: string }[] = [];
    if (!Array.isArray(input)) return out;
    for (const s of input) {
      if (!s) continue;
      if (typeof s === 'string') {
        out.push({ title: s, prompt: s });
      } else if (typeof s.title === 'string' && typeof s.prompt === 'string') {
        out.push({ title: String(s.title), prompt: String(s.prompt) });
      } else if (typeof s.text === 'string') {
        const t = String(s.text);
        out.push({ title: (typeof s.title === 'string' ? String(s.title) : t.slice(0, 40)), prompt: t });
      }
    }
    return out;
  }
  function mergeSuggestions(base: ChatSuggestion[], add: ChatSuggestion[]): ChatSuggestion[] {
    const seen = new Set<string>();
    const out: ChatSuggestion[] = [];
    for (const s of [...base, ...add]) {
      const key = s.title.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out;
  }

  const header = useMemo(() => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontWeight: 700 }} role="heading" aria-level={1}>DesAInR</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button 
          onClick={onClose} 
          style={btn()}
          aria-label={getAriaLabel('close')}
        >
          Close
        </button>
      </div>
    </div>
  ), [onClose]);

  // Setup accessibility features
  useEffect(() => {
    if (!overlayRef.current) return;
    
    // Create focus trap
    const cleanupFocusTrap = createFocusTrap(overlayRef.current);
    
    // Setup escape handler
    const cleanupEscape = onClose ? setupEscapeHandler(onClose) : undefined;
    
    // Announce overlay opened
    announceToScreenReader('DesAInR overlay opened', 'polite');
    
    return () => {
      cleanupFocusTrap();
      cleanupEscape?.();
      announceToScreenReader('DesAInR overlay closed', 'polite');
    };
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await import('../config');
        setTargetLang(cfg.DEFAULT_TARGET_LANG);
      } catch {}
      try {
        const p = await import('../parallel');
        setParallelOn(p.isParallelModeEnabled());
      } catch {}
      // Load any saved slash prompts from storage (optional for 6.2.4)
      try {
        chrome.storage?.sync?.get('slashPrompts', (data: any) => {
          const arr = Array.isArray(data?.slashPrompts) ? data.slashPrompts : [];
          const sugg = normalizeSuggestions(arr);
          setChatSuggestions((prev) => mergeSuggestions(prev, sugg));
        });
      } catch {}
      // Load slash prompts from backend (Firestore)
      try {
        const api = await import('../apiClient');
        const res = await api.getSlashPrompts(50);
        if (res.ok && Array.isArray((res.json as any)?.prompts)) {
          const fsSugg = normalizeSuggestions((res.json as any).prompts);
          setChatSuggestions((prev) => mergeSuggestions(prev, fsSugg));
        }
      } catch {}
    })();
  }, []);

  // Derived filtered suggestions for UI (supports "/" search)
  const filteredSuggestions = useMemo(() => {
    const q = chatInput.trim();
    const list = q.startsWith('/')
      ? chatSuggestions.filter((s) => {
          const needle = q.slice(1).toLowerCase();
          return s.title.toLowerCase().includes(needle) || s.prompt.toLowerCase().includes(needle);
        })
      : chatSuggestions;
    return list.slice(0, 5);
  }, [chatInput, chatSuggestions]);

  // Keep selected index in range when suggestions/input change
  useEffect(() => {
    if (chatInput.trim().startsWith('/') && filteredSuggestions.length > 0) {
      setSelectedSuggestionIdx((prev) => (prev >= 0 && prev < filteredSuggestions.length ? prev : 0));
    } else {
      setSelectedSuggestionIdx(-1);
    }
  }, [chatInput, filteredSuggestions.length]);

  async function runAnalyze() {
    try {
      setAnalyzeBusy(true);
      setAnalyzeError(null);
      const mod = await import('../apiClient');
      const res = await mod.analyzePage({ url: location.href, title: document.title });
      if (!res.ok) {
        setAnalyzeError(`Analyze failed (${res.status}): ${res.error || 'unknown'}`);
      } else {
        setSummary(String(res.json?.summary || ''));
        setKeyPoints(Array.isArray(res.json?.keyPoints) ? res.json!.keyPoints : []);
        setLinks(Array.isArray(res.json?.links) ? res.json!.links : []);
      }
    } catch (e: any) {
      setAnalyzeError(e?.message || String(e));
    } finally {
      setAnalyzeBusy(false);
    }
  }

  // Chat handlers
  async function sendChat() {
    const raw = chatInput.trim();
    if (!raw) return;
    // Expand slash prompt if typed, exact match by title
    let msg = raw;
    if (raw.startsWith('/')) {
      const key = raw.slice(1).trim().toLowerCase();
      const match = chatSuggestions.find((s) => s.title.toLowerCase() === key) || (filteredSuggestions.length === 1 ? filteredSuggestions[0] : undefined);
      if (match) msg = match.prompt;
    }
    setChatBusy(true);
    setChatError(null);
    setChatInput('');
    const newHist: ChatMsg[] = [...chatHistory, { role: 'user' as const, text: msg }];
    setChatHistory(newHist);
    try {
      const api = await import('../apiClient');
      const body: any = { message: msg, userName: 'Extension User', chatHistory: newHist };
      if (chatModel) body.modelId = chatModel;
      const res = await api.chat(body);
      if (!res.ok) {
        setChatError(`Chat failed (${res.status}): ${res.error || 'unknown'}`);
      } else if (res.json) {
        const en = String(res.json.responseEnglish || '');
        const bn = String(res.json.responseBengali || '');
        const combined = [en && `EN:\n${en}`, bn && `BN:\n${bn}`].filter(Boolean).join('\n\n');
        setChatHistory((h) => [...h, { role: 'assistant', text: combined || '(empty)' }]);
        const sugg = Array.isArray((res.json as any).suggestedActions) ? normalizeSuggestions((res.json as any).suggestedActions) : [];
        if (sugg.length) setChatSuggestions(sugg.slice(0, 5));
      }
    } catch (e: any) {
      setChatError(e?.message || String(e));
    } finally {
      setChatBusy(false);
    }
  }

  function onChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const hasSuggs = chatInput.trim().startsWith('/') && filteredSuggestions.length > 0;
    if (hasSuggs && (e.key === 'ArrowDown' || e.key === 'Down')) {
      e.preventDefault();
      setSelectedSuggestionIdx((prev) => (prev + 1) % filteredSuggestions.length);
      return;
    }
    if (hasSuggs && (e.key === 'ArrowUp' || e.key === 'Up')) {
      e.preventDefault();
      setSelectedSuggestionIdx((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      return;
    }
    if (hasSuggs && (e.key === 'Tab')) {
      e.preventDefault();
      if (selectedSuggestionIdx >= 0) {
        const s = filteredSuggestions[selectedSuggestionIdx];
        setChatInput(s.prompt);
      }
      return;
    }
    if (e.key === 'Escape') {
      if (hasSuggs) {
        e.preventDefault();
        setSelectedSuggestionIdx(-1);
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasSuggs && selectedSuggestionIdx >= 0) {
        const s = filteredSuggestions[selectedSuggestionIdx];
        setChatInput(s.prompt);
      } else {
        sendChat();
      }
    }
  }

  async function translatePageAction() {
    try {
      setTranslateBusy(true);
      setTranslateMsg('Translating page...');
      const mod = await import('../pageTranslate');
      const { DEFAULT_TARGET_LANG } = await import('../config');
      const res = await mod.translatePageAll(DEFAULT_TARGET_LANG);
      setTranslateMsg(`Translated page ✓ (${res.translated}/${res.totalNodes} nodes, skipped ${res.skipped})`);
    } catch (e: any) {
      setTranslateMsg(`Translate page error: ${e?.message || String(e)}`);
    } finally {
      setTranslateBusy(false);
    }
  }

  async function toggleParallelAction() {
    try {
      setTranslateBusy(true);
      const p = await import('../parallel');
      const { DEFAULT_TARGET_LANG } = await import('../config');
      if (!p.isParallelModeEnabled()) {
        setTranslateMsg('Enabling parallel translate...');
        await p.enableParallelMode(DEFAULT_TARGET_LANG);
        setParallelOn(true);
        setTranslateMsg('Parallel translate ON');
      } else {
        setTranslateMsg('Disabling parallel translate...');
        p.disableParallelMode();
        setParallelOn(false);
        setTranslateMsg('Parallel translate OFF');
      }
    } catch (e: any) {
      setTranslateMsg(`Parallel toggle error: ${e?.message || String(e)}`);
    } finally {
      setTranslateBusy(false);
    }
  }

  async function saveToMemo() {
    if (!summary && keyPoints.length === 0) {
      setMemoSaveStatus('No content to save');
      return;
    }
    
    setMemoSaveStatus('Saving...');
    
    try {
      const api = await import('../apiClient');
      
      // Prepare memo content
      let content = '';
      if (summary) {
        content += `Summary:\n${summary}\n\n`;
      }
      if (keyPoints.length > 0) {
        content += `Key Points:\n${keyPoints.map(p => `• ${p}`).join('\n')}\n\n`;
      }
      if (links.length > 0) {
        content += `Links:\n${links.slice(0, 10).join('\n')}`;
      }
      
      const memoData = {
        title: document.title || 'Page Analysis',
        content: content.trim(),
        url: window.location.href,
        type: 'analysis' as const,
        metadata: {
          summary,
          keyPoints,
          links: links.slice(0, 10)
        },
        tags: ['analysis', 'extension']
      };
      
      const res = await api.saveMemo(memoData);
      
      if (res.ok && res.json) {
        setMemoSaveStatus(`✓ Saved to memo (ID: ${res.json.memoId})`);
        // Clear status after 3 seconds
        setTimeout(() => setMemoSaveStatus(''), 3000);
      } else {
        setMemoSaveStatus(`Failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save to memo error:', err);
      setMemoSaveStatus('Failed to save memo');
    }
  }

  async function refineSelectionAction() {
    try {
      setWriteBusy(true);
      setWriteMsg('Refining selection...');
      setWriteUndo(null);
      const sel = window.getSelection()?.toString() || '';
      if (!sel.trim()) {
        setWriteMsg('No selection found on page.');
        return;
      }
      const { rewrite } = await import('../apiClient');
      const { applyReplacementOrCopyWithUndo } = await import('../domReplace');
      const { ok, status, json, error } = await rewrite({ selection: sel, url: location.href, task: 'clarify' });
      if (ok && json?.result) {
        const { outcome, undo } = await applyReplacementOrCopyWithUndo(json.result);
        if (outcome === 'replaced') {
          setWriteMsg('Refined ✓ (replaced selection)');
          if (undo) setWriteUndo(() => undo);
        } else if (outcome === 'copied') {
          setWriteMsg('Refined ✓ (copied)');
        } else {
          setWriteMsg('Refined ✓');
        }
      } else {
        setWriteMsg(`Refine failed (${status}): ${error || 'unknown'}`);
      }
    } catch (e: any) {
      setWriteMsg(`Refine error: ${e?.message || String(e)}`);
    } finally {
      setWriteBusy(false);
    }
  }

  return (
    <>
      <Toast messages={toastMessages} onRemove={removeToast} highContrast={highContrast} />
      <div 
        ref={overlayRef}
        style={{ 
          ...styles.container,
          padding: '10px 12px', 
          minWidth: 360, 
          maxWidth: 520, 
          maxHeight: 520, 
          overflow: 'auto', 
          fontFamily: 'Segoe UI, Arial, sans-serif'
        }}
        role="dialog"
        aria-label="DesAInR Extension Overlay"
      >
      {header}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {(['chat','write','translate','analyze'] as TabKey[]).map(k => (
          <button key={k} onClick={() => setTab(k)} style={tabBtn(tab === k)}>{tabLabel[k]}</button>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <label htmlFor="desainr-model" style={{ color: '#555' }}>Model:</label>
              <select id="desainr-model" value={chatModel} onChange={(e) => setChatModel(e.target.value)} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid #ddd' }}>
                <option value="">Default (server)</option>
                <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash</option>
              </select>
              {chatError && <span style={{ color: '#c00', fontSize: 12 }}>{chatError}</span>}
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, maxHeight: 220, overflow: 'auto', background: '#fafafa' }}>
              {chatHistory.length === 0 && <div style={{ color: '#666' }}>Start a conversation...</div>}
              {chatHistory.map((m, i) => (
                <div key={i} style={{ margin: '6px 0' }}>
                  <div style={{ fontWeight: 600, color: m.role === 'user' ? '#333' : '#0a5' }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{m.text}</pre>
                </div>
              ))}
            </div>
            {filteredSuggestions.length > 0 && (
              <div role="listbox" aria-expanded={true} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(s.prompt)}
                    style={{
                      ...btn(),
                      fontSize: 12,
                      outline: 'none',
                      background: i === selectedSuggestionIdx ? '#e6f0ff' : '#f7f7f7',
                      border: i === selectedSuggestionIdx ? '1px solid #8ab4ff' : '1px solid #ddd',
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={onChatKeyDown}
                placeholder={chatBusy ? 'Sending...' : 'Type a message (Enter to send, Shift+Enter for newline)'}
                rows={3}
                style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: 6, resize: 'vertical' }}
                disabled={chatBusy}
              />
              <button onClick={sendChat} disabled={chatBusy || !chatInput.trim()} style={btn()}>{chatBusy ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        )}
        {tab === 'write' && (
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <button onClick={refineSelectionAction} disabled={writeBusy} style={btn()}>{writeBusy ? 'Refining...' : 'Refine Selection'}</button>
            </div>
            {writeMsg && <div>{writeMsg} {writeUndo && <button style={btn()} onClick={() => { try { const ok = writeUndo(); setWriteMsg(ok ? 'Undone ✓' : 'Undo failed'); } catch { setWriteMsg('Undo failed'); } setWriteUndo(null); }}>Undo</button>}</div>}
          </div>
        )}
        {tab === 'translate' && (
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={translatePageAction} disabled={translateBusy} style={btn()}>{translateBusy ? 'Translating...' : 'Translate Page'}</button>
              <button onClick={toggleParallelAction} disabled={translateBusy} style={btn()}>{parallelOn ? 'Parallel: ON' : 'Parallel: OFF'}</button>
              {targetLang && <span style={{ color: '#555' }}>Target: {targetLang}</span>}
            </div>
            {translateMsg && <div>{translateMsg}</div>}
          </div>
        )}
        {tab === 'analyze' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={runAnalyze} disabled={analyzeBusy} style={btn()}>{analyzeBusy ? 'Analyzing...' : 'Analyze this page'}</button>
              {(summary || keyPoints.length > 0) && (
                <button onClick={saveToMemo} style={btn()}>Save to Memo</button>
              )}
              {analyzeError && <span style={{ color: '#c00', fontSize: 12 }}> {analyzeError} </span>}
              {memoSaveStatus && <span style={{ color: memoSaveStatus.includes('✓') ? '#0a0' : '#555', fontSize: 12 }}>{memoSaveStatus}</span>}
            </div>
            {summary && <div style={{ marginTop: 8, fontSize: 13 }}>{summary}</div>}
            {keyPoints.length > 0 && (
              <ul style={{ margin: '8px 0 8px 18px', padding: 0, fontSize: 13 }}>
                {keyPoints.map((p, i) => <li key={i} style={{ margin: '2px 0' }}>{p}</li>)}
              </ul>
            )}
            {links.length > 0 && (
              <div style={{ marginTop: 6, maxHeight: 160, overflow: 'auto' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Top links</div>
                {links.slice(0, 10).map((h, i) => (
                  <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <a href={h} target="_blank" rel="noopener noreferrer">{h}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

// Style helper functions are now part of the component
// They will use the theme from the component scope
