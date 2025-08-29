// Lightweight analyze flow without external HTML parsers
// - Fetches the URL with a custom UA
// - Checks robots.txt (basic * agent rules)
// - Extracts text via regex stripping
// - Pulls headings and links via regex

export type AnalyzeResult = {
  summary: string;
  keyPoints: string[];
  links?: string[];
};

function decodeEntities(txt: string): string {
  return txt
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchText(url: string, init?: RequestInit): Promise<string> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'User-Agent': 'DesAInRBot/0.1 (+https://desainr.example)'
    },
  } as any);
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) {
    // still return text for best-effort
  }
  return await res.text();
}

async function isAllowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const u = new URL(targetUrl);
    const robotsUrl = `${u.origin}/robots.txt`;
    const txt = await fetchText(robotsUrl).catch(() => '');
    if (!txt) return true; // assume allowed
    const lines = txt.split(/\r?\n/).map(l => l.trim());
    let inStar = false;
    const disallows: string[] = [];
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      const mUA = /^User-agent:\s*(.*)$/i.exec(line);
      if (mUA) {
        const agent = (mUA[1] || '').trim();
        inStar = agent === '*' ;
        continue;
      }
      if (!inStar) continue;
      const mDis = /^Disallow:\s*(.*)$/i.exec(line);
      if (mDis) {
        const path = (mDis[1] || '').trim();
        if (path) disallows.push(path);
      }
    }
    const path = u.pathname || '/';
    return !disallows.some(d => path.startsWith(d));
  } catch {
    return true; // be permissive on errors
  }
}

function stripHtml(html: string): { text: string; headings: string[]; links: string[] } {
  // remove scripts/styles/comments
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '');
  const headings: string[] = [];
  const links: string[] = [];
  // extract headings
  s.replace(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, _lvl, inner) => {
    const t = decodeEntities(inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    if (t) headings.push(t);
    return '';
  });
  // extract links
  let m: RegExpExecArray | null;
  const reHref = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  while ((m = reHref.exec(s))) {
    const href = m[1];
    if (href && !href.startsWith('javascript:')) links.push(href);
  }
  // strip tags
  s = s.replace(/<[^>]*>/g, ' ');
  s = decodeEntities(s).replace(/\s+/g, ' ').trim();
  return { text: s, headings, links };
}

function summarize(text: string, maxSentences = 3): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, maxSentences).join(' ');
}

export async function analyzeWebpageFlow(targetUrl: string): Promise<AnalyzeResult> {
  const allowed = await isAllowedByRobots(targetUrl);
  if (!allowed) {
    return {
      summary: 'Analysis blocked by robots.txt policy for this URL.',
      keyPoints: ['Robots policy: User-agent * disallows this path'],
    };
  }
  const html = await fetchText(targetUrl);
  const { text, headings, links } = stripHtml(html);
  const summary = summarize(text || headings.join(' • '));
  const points: string[] = [];
  if (headings.length) points.push(`Headings: ${headings.slice(0, 5).join(' • ')}`);
  if (text) points.push(`Text length: ${text.length}`);
  if (links.length) points.push(`Links found: ${links.length}`);
  return { summary: summary || 'Analysis complete', keyPoints: points, links: links.slice(0, 10) };
}
