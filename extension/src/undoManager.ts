/**
 * Undo manager for DOM changes
 * Tracks and manages reversible DOM operations
 */

export interface UndoableAction {
  id: string;
  timestamp: number;
  description: string;
  undo: () => boolean;
  redo?: () => boolean;
}

export class UndoManager {
  private history: UndoableAction[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;
  private listeners: Set<(history: UndoableAction[], canUndo: boolean, canRedo: boolean) => void> = new Set();

  constructor(maxSize = 50) {
    this.maxHistorySize = maxSize;
  }

  /**
   * Add an undoable action to the history
   */
  addAction(action: Omit<UndoableAction, 'id' | 'timestamp'>): string {
    const id = `undo-${Date.now()}-${Math.random()}`;
    const fullAction: UndoableAction = {
      ...action,
      id,
      timestamp: Date.now()
    };

    // Remove any actions after current index (no redo after new action)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new action
    this.history.push(fullAction);
    this.currentIndex++;

    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
      this.currentIndex = this.history.length - 1;
    }

    this.notifyListeners();
    return id;
  }

  /**
   * Undo the last action
   */
  undo(): boolean {
    if (!this.canUndo()) return false;

    const action = this.history[this.currentIndex];
    const success = action.undo();

    if (success) {
      this.currentIndex--;
      this.notifyListeners();
    }

    return success;
  }

  /**
   * Redo the next action
   */
  redo(): boolean {
    if (!this.canRedo()) return false;

    const action = this.history[this.currentIndex + 1];
    if (!action.redo) return false;

    const success = action.redo();

    if (success) {
      this.currentIndex++;
      this.notifyListeners();
    }

    return success;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1 && 
           this.history[this.currentIndex + 1]?.redo !== undefined;
  }

  /**
   * Get the current history
   */
  getHistory(): UndoableAction[] {
    return [...this.history];
  }

  /**
   * Get recent actions for display
   */
  getRecentActions(count = 5): UndoableAction[] {
    return this.history.slice(Math.max(0, this.currentIndex - count + 1), this.currentIndex + 1).reverse();
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.notifyListeners();
  }

  /**
   * Clear old actions (older than specified milliseconds)
   */
  clearOld(maxAgeMs: number): void {
    const cutoff = Date.now() - maxAgeMs;
    const validIndex = this.history.findIndex(action => action.timestamp >= cutoff);
    
    if (validIndex > 0) {
      this.history = this.history.slice(validIndex);
      this.currentIndex = Math.max(-1, this.currentIndex - validIndex);
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to history changes
   */
  subscribe(listener: (history: UndoableAction[], canUndo: boolean, canRedo: boolean) => void): () => void {
    this.listeners.add(listener);
    
    // Immediately notify new listener
    listener(this.getHistory(), this.canUndo(), this.canRedo());
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const history = this.getHistory();
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    
    this.listeners.forEach(listener => {
      listener(history, canUndo, canRedo);
    });
  }
}

// Singleton instance for the extension
let globalUndoManager: UndoManager | null = null;

export function getGlobalUndoManager(): UndoManager {
  if (!globalUndoManager) {
    globalUndoManager = new UndoManager();
  }
  return globalUndoManager;
}

/**
 * Create an undoable DOM text replacement
 */
export function createUndoableTextReplace(
  element: Node,
  oldText: string,
  newText: string,
  description: string
): UndoableAction {
  const originalContent = element.textContent;
  
  return {
    id: '',
    timestamp: 0,
    description,
    undo: () => {
      if (element.textContent === newText) {
        element.textContent = oldText;
        return true;
      }
      return false;
    },
    redo: () => {
      if (element.textContent === oldText) {
        element.textContent = newText;
        return true;
      }
      return false;
    }
  };
}

/**
 * Create an undoable DOM element replacement
 */
export function createUndoableElementReplace(
  oldElement: Element,
  newElement: Element,
  description: string
): UndoableAction {
  const parent = oldElement.parentElement;
  const nextSibling = oldElement.nextSibling;
  
  return {
    id: '',
    timestamp: 0,
    description,
    undo: () => {
      if (parent && newElement.parentElement === parent) {
        parent.replaceChild(oldElement, newElement);
        return true;
      }
      return false;
    },
    redo: () => {
      if (parent && oldElement.parentElement === parent) {
        parent.replaceChild(newElement, oldElement);
        return true;
      }
      return false;
    }
  };
}

/**
 * Create an undoable attribute change
 */
export function createUndoableAttributeChange(
  element: Element,
  attribute: string,
  oldValue: string | null,
  newValue: string | null,
  description: string
): UndoableAction {
  return {
    id: '',
    timestamp: 0,
    description,
    undo: () => {
      if (oldValue === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, oldValue);
      }
      return true;
    },
    redo: () => {
      if (newValue === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, newValue);
      }
      return true;
    }
  };
}
