// Parallel translation mode: render original + translated spans and keep updated via MutationObserver
import { collectTextNodes } from './pageTranslate';

const WRAPPER_CLASS = 'desainr-parallel-wrapper';
const ORIG_CLASS = 'desainr-parallel-original';
const TRANS_CLASS = 'desainr-parallel-translated';
const STYLE_ID = 'desainr-parallel-style';

let enabled = false;
let observer: MutationObserver | null = null;

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${WRAPPER_CLASS} { display: inline; white-space: pre-wrap; }
    .${ORIG_CLASS} { opacity: 0.95; }
    .${TRANS_CLASS} { opacity: 0.75; color: #555; margin-left: 0.4em; }
  `;
  document.documentElement.appendChild(style);
}

async function translateOne(text: string, targetLang: string): Promise<string> {
  const { translateChunks } = await import('./apiClient');
  const resp = await translateChunks({ selection: text, url: location.href, targetLang });
  if (resp.ok && resp.json?.result) return resp.json.result as string;
  return text;
}

function wrapTextNode(t: Text, translated: string) {
  const parent = t.parentElement;
  if (!parent) return;
  // Avoid double-wrapping
  if (parent.closest && parent.closest(`.${WRAPPER_CLASS}`)) return;
  const original = t.data;
  const wrap = document.createElement('span');
  wrap.className = WRAPPER_CLASS;
  (wrap as any).dataset.orig = original;

  const origSpan = document.createElement('span');
  origSpan.className = ORIG_CLASS;
  origSpan.textContent = original;

  const transSpan = document.createElement('span');
  transSpan.className = TRANS_CLASS;
  transSpan.textContent = translated;

  wrap.appendChild(origSpan);
  wrap.appendChild(document.createTextNode(' '));
  wrap.appendChild(transSpan);

  parent.replaceChild(wrap, t);
}

function isWrapper(el: Element | null): el is HTMLElement {
  return !!el && el.classList.contains(WRAPPER_CLASS);
}

export function disableParallelMode() {
  if (!enabled) return;
  enabled = false;
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  // unwrap all wrappers
  const wraps = Array.from(document.querySelectorAll(`.${WRAPPER_CLASS}`)) as HTMLElement[];
  for (const w of wraps) {
    const orig = (w as any).dataset?.orig ?? '';
    const textNode = document.createTextNode(orig);
    if (w.parentNode) w.parentNode.replaceChild(textNode, w);
  }
}

export function isParallelModeEnabled() {
  return enabled;
}

export async function enableParallelMode(targetLang: string) {
  if (enabled) return;
  enabled = true;
  installStyle();
  // Initial pass
  const entries = collectTextNodes();
  const limit = 400;
  const batch = entries.slice(0, limit);
  const { DEFAULT_TARGET_LANG } = await import('./config');
  const lang = targetLang || DEFAULT_TARGET_LANG;
  // Try batch translate first
  let usedBatch = false;
  try {
    const { translateChunksBatch } = await import('./apiClient');
    const texts = batch.map((e) => e.text);
    const resp = await translateChunksBatch({ chunks: texts, url: location.href, targetLang: lang });
    const results = (resp as any).json?.results as string[] | undefined;
    if (resp.ok && Array.isArray(results) && results.length === batch.length) {
      for (let i = 0; i < batch.length; i++) {
        try { wrapTextNode(batch[i].node, results[i]); } catch { /*noop*/ }
      }
      usedBatch = true;
    }
  } catch {
    // ignore, fallback below
  }

  if (!usedBatch) {
    // Soft concurrency fallback
    const concurrency = 3;
    let i = 0;
    async function next() {
      if (!enabled) return;
      const idx = i++;
      if (idx >= batch.length) return;
      const e = batch[idx];
      try {
        const tr = await translateOne(e.text, lang);
        wrapTextNode(e.node, tr);
      } catch {
        // ignore
      }
      await next();
    }
    await Promise.all(new Array(concurrency).fill(0).map(() => next()));
  }

  // Observe DOM changes to translate newly added text nodes
  observer = new MutationObserver(async (mutations) => {
    if (!enabled) return;
    for (const m of mutations) {
      if (m.type === 'characterData' && m.target.nodeType === Node.TEXT_NODE) {
        const t = m.target as Text;
        const parent = t.parentElement;
        if (!parent) continue;
        if (isWrapper(parent)) continue;
        const text = t.data;
        if (text && text.trim()) {
          try {
            const tr = await translateOne(text, lang);
            if (!enabled) return;
            wrapTextNode(t, tr);
          } catch {
            // no-op
          }
        }
      } else if (m.type === 'childList') {
        m.addedNodes.forEach(async (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const t = node as Text;
            const parent = t.parentElement;
            if (!parent) return;
            if (isWrapper(parent)) return;
            const text = t.data;
            if (text && text.trim()) {
              try {
                const tr = await translateOne(text, lang);
                if (!enabled) return;
                wrapTextNode(t, tr);
              } catch { /* ignore */ }
            }
          }
        });
      }
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
}
