import { replaceEditableSelection, isEditableElement } from './formSupport';

export async function applyReplacementOrCopyWithUndo(text: string): Promise<{ outcome: 'replaced' | 'copied' | 'none'; undo?: () => boolean }> {
  try {
    const ae = document.activeElement as HTMLElement | null;
    if (isEditableElement(ae)) {
      const res = replaceEditableSelection(text);
      if (res.outcome === 'replaced') return res;
    }
    try {
      await navigator.clipboard.writeText(text);
      return { outcome: 'copied' };
    } catch {
      return { outcome: 'none' };
    }
  } catch {
    return { outcome: 'none' };
  }
}
