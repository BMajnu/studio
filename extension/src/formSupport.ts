/**
 * Enhanced support for forms and contenteditable elements
 */

export function isEditableElement(element: Element | null): boolean {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  
  // Check for input/textarea
  if (tagName === 'input' || tagName === 'textarea') {
    const input = element as HTMLInputElement | HTMLTextAreaElement;
    return !input.disabled && !input.readOnly;
  }
  
  // Check for contenteditable
  if (element.getAttribute('contenteditable') === 'true') {
    return true;
  }
  
  // Check for contenteditable parent
  let parent = element.parentElement;
  while (parent) {
    if (parent.getAttribute('contenteditable') === 'true') {
      return true;
    }
    parent = parent.parentElement;
  }
  
  return false;
}

export function getEditableSelection(): { element: HTMLElement; text: string; start: number; end: number } | null {
  const activeElement = document.activeElement;
  
  if (!activeElement || !isEditableElement(activeElement)) {
    return null;
  }
  
  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
    const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = input.value.substring(start, end);
    
    if (text) {
      return {
        element: input,
        text,
        start,
        end
      };
    }
  } else if (activeElement.getAttribute('contenteditable') === 'true') {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString();
      if (text) {
        return {
          element: activeElement as HTMLElement,
          text,
          start: 0, // For contenteditable, we'll use range replacement
          end: 0
        };
      }
    }
  }
  
  return null;
}

export function replaceEditableSelection(element: HTMLElement, newText: string, start: number, end: number): () => void {
  const originalText = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
    ? (element as HTMLInputElement | HTMLTextAreaElement).value.substring(start, end)
    : element.textContent || '';
    
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const input = element as HTMLInputElement | HTMLTextAreaElement;
    const originalValue = input.value;
    
    // Replace the selection
    input.value = input.value.substring(0, start) + newText + input.value.substring(end);
    
    // Set cursor position after replacement
    input.setSelectionRange(start + newText.length, start + newText.length);
    
    // Trigger input event for frameworks
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Return undo function
    return () => {
      input.value = originalValue;
      input.setSelectionRange(start, end);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
  } else if (element.getAttribute('contenteditable') === 'true') {
    const selection = window.getSelection();
    const originalHtml = element.innerHTML;
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(newText);
      range.insertNode(textNode);
      
      // Move cursor after inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger input event
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Return undo function
      return () => {
        element.innerHTML = originalHtml;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      };
    }
  }
  
  // Fallback no-op undo
  return () => false;
}

export function enhanceFormSelection(callback: (text: string, element: HTMLElement) => void) {
  // Listen for selection in forms
  document.addEventListener('mouseup', (e) => {
    const target = e.target as HTMLElement;
    if (isEditableElement(target)) {
      const selection = getEditableSelection();
      if (selection && selection.text) {
        callback(selection.text, selection.element);
      }
    }
  });
  
  // Listen for keyboard selection (Shift+Arrow keys)
  document.addEventListener('keyup', (e) => {
    if (e.shiftKey && (e.key.includes('Arrow') || e.key === 'Home' || e.key === 'End')) {
      const selection = getEditableSelection();
      if (selection && selection.text) {
        callback(selection.text, selection.element);
      }
    }
  });
}
