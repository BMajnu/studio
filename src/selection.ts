export type SelectionInfo = {
  text: string;
  rect: DOMRect;
};

/**
 * Returns the current selection text and a viewport-relative bounding rect.
 * If there is no non-empty selection, returns null.
 */
export function getSelectionInfo(): SelectionInfo | null {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!range || sel.isCollapsed || range.collapsed) return null;

    const text = sel.toString();
    if (!text || !text.trim()) return null;

    // Compute a robust bounding rect from client rects
    const rects = range.getClientRects();
    let rect: DOMRect;
    if (rects && rects.length > 0) {
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      for (let i = 0; i < rects.length; i++) {
        const r = rects.item(i)!;
        if (!r) continue;
        if (r.width === 0 && r.height === 0) continue;
        left = Math.min(left, r.left);
        top = Math.min(top, r.top);
        right = Math.max(right, r.right);
        bottom = Math.max(bottom, r.bottom);
      }
      if (!isFinite(left) || !isFinite(top) || !isFinite(right) || !isFinite(bottom)) {
        rect = range.getBoundingClientRect();
      } else {
        rect = new DOMRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
      }
    } else {
      rect = range.getBoundingClientRect();
    }

    return { text, rect };
  } catch {
    return null;
  }
}
