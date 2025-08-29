import { translateChunks } from './apiClient';

function isVisibleTextNode(n: Node): n is Text {
  if (n.nodeType !== Node.TEXT_NODE) return false;
  const t = (n as Text).data;
  if (!t || !t.trim()) return false;
  // Ignore script/style or hidden via CSS by checking parent visibility
  const p = (n.parentElement as HTMLElement | null);
  if (!p) return false;
  const cs = window.getComputedStyle(p);
  if (cs && (cs.visibility === 'hidden' || cs.display === 'none')) return false;
  return true;
}

export async function translatePageAll(targetLang: string): Promise<{ totalNodes: number; translated: number; skipped: number }> {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let total = 0, translated = 0, skipped = 0;
  const url = location.href;
  const maxLen = 5000; // protect against very large text blocks
  const nodes: Text[] = [];
  let cur: Node | null;
  while ((cur = walker.nextNode())) {
    if (isVisibleTextNode(cur)) nodes.push(cur as Text);
  }
  for (const tn of nodes) {
    total++;
    const txt = tn.data?.trim?.() || '';
    if (!txt || txt.length < 2 || txt.length > maxLen) { skipped++; continue; }
    try {
      const { ok, json } = await translateChunks({ selection: txt, url, targetLang });
      if (ok && json?.result) {
        tn.data = json.result;
        translated++;
      } else {
        skipped++;
      }
    } catch { skipped++; }
  }
  return { totalNodes: total, translated, skipped };
}
