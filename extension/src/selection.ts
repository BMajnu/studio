export type SelectionInfo = {
  text: string;
  rect: DOMRect;
  pageX: number;
  pageY: number;
};

export function getSelectionInfo(): SelectionInfo | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const text = sel.toString();
  if (!text.trim()) return null;
  const pageX = rect.left + window.scrollX;
  const pageY = rect.top + window.scrollY;
  return { text, rect, pageX, pageY };
}
