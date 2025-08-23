// Safe text replacement utilities for selections in the page

function isEditable(el: Element | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea';
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function replaceSelectionSafely(newText: string): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;

  const active = document.activeElement as Element | null;
  if (isEditable(active)) {
    try {
      const input = active as HTMLInputElement | HTMLTextAreaElement;
      const start = (input as any).selectionStart ?? 0;
      const end = (input as any).selectionEnd ?? start;
      const value = input.value ?? '';
      input.value = value.slice(0, start) + newText + value.slice(end);
      const caret = start + newText.length;
      (input as any).selectionStart = (input as any).selectionEnd = caret;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    } catch {
      // fall through
    }
  }

  try {
    const range = sel.getRangeAt(0);
    // Avoid replacing across multiple elements with complex structure
    const contents = range.cloneContents();
    const hasComplexNodes = Array.from(contents.childNodes).some((n) => n.nodeType !== Node.TEXT_NODE);
    if (hasComplexNodes && (range.endContainer !== range.startContainer)) {
      return false;
    }
    range.deleteContents();
    const textNode = document.createTextNode(newText);
    range.insertNode(textNode);
    // Move caret to end of inserted text
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  } catch {
    return false;
  }
}

export async function applyReplacementOrCopy(newText: string): Promise<'replaced' | 'copied' | 'failed'> {
  if (replaceSelectionSafely(newText)) return 'replaced';
  if (await copyToClipboard(newText)) return 'copied';
  return 'failed';
}

export type UndoHandle = { undo: () => boolean };

export function replaceSelectionSafelyWithUndo(newText: string): UndoHandle | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const active = document.activeElement as Element | null;
  if (isEditable(active)) {
    try {
      const input = active as HTMLInputElement | HTMLTextAreaElement;
      const start = (input as any).selectionStart ?? 0;
      const end = (input as any).selectionEnd ?? start;
      const before = input.value ?? '';
      input.value = before.slice(0, start) + newText + before.slice(end);
      const caret = start + newText.length;
      (input as any).selectionStart = (input as any).selectionEnd = caret;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return {
        undo: () => {
          try {
            input.value = before;
            (input as any).selectionStart = start;
            (input as any).selectionEnd = end;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          } catch {
            return false;
          }
        }
      };
    } catch {
      // fall through
    }
  }

  try {
    const range = sel.getRangeAt(0);
    const prevFrag = range.cloneContents();
    const contents = range.cloneContents();
    const hasComplexNodes = Array.from(contents.childNodes).some((n) => n.nodeType !== Node.TEXT_NODE);
    const across = range.endContainer !== range.startContainer;
    if (hasComplexNodes && across) return null;

    range.deleteContents();
    const textNode = document.createTextNode(newText);
    range.insertNode(textNode);
    // Move caret to end of inserted text
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    return {
      undo: () => {
        try {
          const parent = textNode.parentNode;
          if (!parent) return false;
          const clone = prevFrag.cloneNode(true) as DocumentFragment;
          parent.insertBefore(clone, textNode);
          parent.removeChild(textNode);
          return true;
        } catch {
          return false;
        }
      }
    };
  } catch {
    return null;
  }
}

export async function applyReplacementOrCopyWithUndo(newText: string): Promise<{ outcome: 'replaced' | 'copied' | 'failed', undo?: () => boolean }>{
  const handle = replaceSelectionSafelyWithUndo(newText);
  if (handle) return { outcome: 'replaced', undo: handle.undo };
  if (await copyToClipboard(newText)) return { outcome: 'copied' };
  return { outcome: 'failed' };
}
