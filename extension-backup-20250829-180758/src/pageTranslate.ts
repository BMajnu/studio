// Utilities for Page Translation: text node collection with safe filters
// Phase 4.1.1: Text node collector via TreeWalker with safe filters

export type TextNodeEntry = {
  node: Text;
  text: string;
  index: number; // stable index within the returned list
  parent: Element;
  path: string; // lightweight CSS-like path for debugging
};

const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'template',
  'textarea', 'input', 'select', 'option',
  'code', 'pre', 'kbd', 'samp', 'var',
  'svg', 'canvas', 'math', 'video', 'audio'
]);

function isContentEditable(el: Element | null): boolean {
  if (!el) return false;
  const editable = (el as HTMLElement).isContentEditable;
  if (editable) return true;
  const attr = el.getAttribute('contenteditable');
  return attr === '' || attr === 'true';
}

function isFormControl(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'option';
}

function isSkippableElement(el: Element | null): boolean {
  if (!el) return true;
  if (SKIP_TAGS.has(el.tagName.toLowerCase())) return true;
  if (isFormControl(el)) return true;
  if (isContentEditable(el)) return true;
  return false;
}

function isElementHidden(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return true;
  if ((el as HTMLElement).hidden) return true;
  // Skip elements fully collapsed
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return true;
  return false;
}

function hasHiddenAncestor(el: Element | null): boolean {
  let cur: Element | null = el;
  while (cur) {
    if (isSkippableElement(cur)) return true;
    if (isElementHidden(cur)) return true;
    cur = cur.parentElement;
  }
  return false;
}

function cssPath(el: Element | null, maxDepth = 5): string {
  const parts: string[] = [];
  let cur: Element | null = el;
  let depth = 0;
  while (cur && depth < maxDepth) {
    const name = cur.tagName.toLowerCase();
    const id = cur.id ? `#${cur.id}` : '';
    const cls = (cur.className && typeof cur.className === 'string') ? `.${cur.className.trim().split(/\s+/).slice(0,2).join('.')}` : '';
    parts.unshift(`${name}${id}${cls}`);
    cur = cur.parentElement;
    depth++;
  }
  return parts.join('>');
}

export function collectTextNodes(root: ParentNode = document.body): TextNodeEntry[] {
  const entries: TextNodeEntry[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return NodeFilter.FILTER_REJECT;
      const text = (node as Text).data;
      if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node.parentElement as Element | null);
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Skip if inside our parallel rendering wrapper
      if (parent.closest && parent.closest('.desainr-parallel-wrapper')) return NodeFilter.FILTER_REJECT;
      if (hasHiddenAncestor(parent)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  } as any);

  let n: Node | null = walker.nextNode();
  while (n) {
    const t = n as Text;
    const parent = t.parentElement as Element;
    entries.push({ node: t, text: t.data, index: entries.length, parent, path: cssPath(parent) });
    n = walker.nextNode();
  }
  return entries;
}

// Convenience: return only the texts
export function snapshotTexts(entries: TextNodeEntry[]): string[] {
  return entries.map(e => e.text);
}

async function mapLimit<T, R>(items: T[], limit: number, mapper: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  let active = 0;
  return new Promise((resolve, reject) => {
    const launch = () => {
      while (active < limit && next < items.length) {
        const i = next++;
        active++;
        Promise.resolve(mapper(items[i], i)).then((res) => {
          results[i] = res;
          active--;
          if (next >= items.length && active === 0) resolve(results);
          else launch();
        }).catch((err) => {
          // record error, continue by storing original type
          results[i] = undefined as unknown as R;
          active--;
          if (next >= items.length && active === 0) resolve(results);
          else launch();
        });
      }
    };
    if (items.length === 0) resolve(results);
    else launch();
  });
}

export type PageTranslateResult = {
  totalNodes: number;
  translated: number;
  skipped: number;
};

export async function translatePageAll(targetLang: string, maxConcurrent = 3, maxNodes = 400): Promise<PageTranslateResult> {
  const { translateChunksBatch, translateChunks } = await import('./apiClient');
  const entries = collectTextNodes();
  const limited = entries.slice(0, maxNodes);
  const texts = snapshotTexts(limited);

  let results: string[] = [];
  let usedBatch = false;
  try {
    const resp = await translateChunksBatch({ chunks: texts, url: location.href, targetLang });
    if (resp.ok && Array.isArray((resp as any).json?.results)) {
      results = ((resp as any).json.results as string[]) ?? [];
      usedBatch = true;
    }
  } catch {
    // ignore and fallback
  }

  if (!usedBatch || results.length !== texts.length) {
    // Fallback: per-text calls with limited concurrency
    results = await mapLimit(texts, maxConcurrent, async (text) => {
      const resp = await translateChunks({ selection: text, url: location.href, targetLang });
      if (resp.ok && resp.json?.result) return resp.json.result as string;
      return text; // fallback
    });
  }

  let translated = 0;
  for (let i = 0; i < limited.length; i++) {
    try {
      const out = results[i];
      if (typeof out === 'string' && out !== limited[i].text) {
        limited[i].node.data = out;
        translated++;
      }
    } catch {
      // skip
    }
  }
  return { totalNodes: entries.length, translated, skipped: limited.length - translated };
}
