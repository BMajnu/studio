/**
 * Accessibility utilities for the overlay
 * Provides focus management, keyboard navigation, and ARIA helpers
 */

/**
 * Create a focus trap within an element
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  
  const getFocusableElements = (): HTMLElement[] => {
    const elements = container.querySelectorAll<HTMLElement>(focusableSelectors.join(','));
    return Array.from(elements).filter(el => {
      // Check if element is visible
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    const focusables = getFocusableElements();
    if (focusables.length === 0) return;
    
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    
    if (e.shiftKey) {
      // Shift+Tab - focus previous
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab - focus next
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  // Add event listener
  container.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  const focusables = getFocusableElements();
  if (focusables.length > 0) {
    focusables[0].focus();
  }
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Handle escape key to close overlay
 */
export function setupEscapeHandler(onClose: () => void): () => void {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  
  document.addEventListener('keydown', handleEscape, true);
  
  return () => {
    document.removeEventListener('keydown', handleEscape, true);
  };
}

/**
 * Add keyboard navigation for a list of items
 */
export function setupListNavigation(
  container: HTMLElement,
  onSelect: (index: number) => void,
  onCancel?: () => void
) {
  const items = container.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"]');
  let currentIndex = -1;
  
  const focusItem = (index: number) => {
    if (index < 0 || index >= items.length) return;
    
    // Remove previous selection
    items.forEach(item => {
      item.setAttribute('aria-selected', 'false');
      item.classList.remove('selected');
    });
    
    // Add new selection
    const item = items[index];
    item.setAttribute('aria-selected', 'true');
    item.classList.add('selected');
    item.focus();
    currentIndex = index;
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(Math.min(currentIndex + 1, items.length - 1));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        focusItem(Math.max(currentIndex - 1, 0));
        break;
        
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
        
      case 'End':
        e.preventDefault();
        focusItem(items.length - 1);
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentIndex >= 0) {
          onSelect(currentIndex);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        if (onCancel) {
          onCancel();
        }
        break;
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Click handlers for items
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      focusItem(index);
      onSelect(index);
    });
  });
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Get appropriate ARIA label for common actions
 */
export function getAriaLabel(action: string, context?: string): string {
  const labels: Record<string, string> = {
    'close': 'Close overlay',
    'send': 'Send message',
    'translate': 'Translate current page',
    'analyze': 'Analyze current page',
    'save-memo': 'Save to memo',
    'refine': 'Refine selected text',
    'undo': 'Undo last action',
    'toggle-parallel': 'Toggle parallel translation mode',
    'tab-chat': 'Switch to chat tab',
    'tab-write': 'Switch to write tab',
    'tab-translate': 'Switch to translate tab',
    'tab-analyze': 'Switch to analyze tab',
  };
  
  return context ? `${labels[action] || action} - ${context}` : labels[action] || action;
}

/**
 * Setup high contrast mode detection
 */
export function detectHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
}

/**
 * Setup reduced motion detection
 */
export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}
