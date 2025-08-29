export function isEditableElement(el: any): el is HTMLInputElement | HTMLTextAreaElement | HTMLElement {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return true;
  try { return (el as HTMLElement).isContentEditable === true; } catch { return false; }
}

export function getEditableSelection(): { element: any; start?: number; end?: number; value?: string; html?: string } | null {
  const el = document.activeElement as any;
  if (!isEditableElement(el)) return null;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') {
    try {
      return { element: el, start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0, value: String(el.value ?? '') };
    } catch { return { element: el, value: String(el.value ?? '') }; }
  }
  // contenteditable
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return { element: el, html: (el as HTMLElement).innerHTML };
    return { element: el, html: (el as HTMLElement).innerHTML };
  } catch {
    return { element: el };
  }
}

export function replaceEditableSelection(text: string): { outcome: 'replaced' | 'copied' | 'none'; undo?: () => boolean } {
  const info = getEditableSelection();
  if (!info) return { outcome: 'none' };
  const el = info.element as any;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') {
    try {
      const prev = String(el.value ?? '');
      const s = info.start ?? 0, e = info.end ?? 0;
      const before = prev.slice(0, s);
      const after = prev.slice(e);
      el.value = before + text + after;
      const pos = (before + text).length;
      try {
        el.selectionStart = el.selectionEnd = pos;
      } catch {}
      return { outcome: 'replaced', undo: () => { try { el.value = prev; return true; } catch { return false; } } };
    } catch { return { outcome: 'none' }; }
  }
  // contenteditable: simple replace current selection range
  try {
    const sel = window.getSelection();
    const prevHtml = (el as HTMLElement).innerHTML;
    if (sel && sel.rangeCount > 0) {
      sel.deleteFromDocument();
      const tn = document.createTextNode(text);
      const range = sel.getRangeAt(0);
      range.insertNode(tn);
      sel.removeAllRanges();
      const r = document.createRange();
      r.setStartAfter(tn); r.setEndAfter(tn);
      sel.addRange(r);
    } else {
      (el as HTMLElement).textContent = text;
    }
    return { outcome: 'replaced', undo: () => { try { (el as HTMLElement).innerHTML = prevHtml; return true; } catch { return false; } } };
  } catch { return { outcome: 'none' }; }
}

export function enhanceFormSelection<T>(v: T): T { return v; }
