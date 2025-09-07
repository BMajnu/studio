// Monica-inspired selection toolbar for DesAInR
import { MonicaTheme, FeatureIcons } from './MonicaStyleTheme.js';
import { DefaultActions as MenuDefaultActions } from './MonicaStyleContextMenu.js';

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  isPinned?: boolean;
  category?: string;
}

const DEFAULT_PINNED_IDS = ['refine', 'translate', 'rewrite', 'explain'];
const AllActions: ToolbarAction[] = MenuDefaultActions.map(a => ({
  id: a.id,
  label: a.label.replace(' Selection', ''),
  icon: a.icon,
  shortcut: a.shortcut,
  isPinned: a.isPinned,
  category: a.category,
}));

export class MonicaStyleToolbar {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private actions: ToolbarAction[] = AllActions;
  private onActionClick: ((action: ToolbarAction) => void) | null = null;
  private isVisible = false;
  private pinnedIds: string[] = DEFAULT_PINNED_IDS;

  constructor() {
    this.container = this.createContainer();
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });
    this.injectStyles();
    this.loadPinnedActions();
    try {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg?.type === 'SAVE_PINNED_ACTIONS') {
          this.loadPinnedActions().then(() => this.refreshToolbarUI());
        }
      });
    } catch {}
    try {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes['desainr.pinnedActions']) {
          this.loadPinnedActions().then(() => this.refreshToolbarUI());
        }
      });
    } catch {}
    
    // Listen for theme changes
    MonicaTheme.watchThemeChanges(() => {
      this.updateTheme();
    });
  }
  
  private updateTheme(): void {
    // Re-inject styles with updated theme
    if (this.shadowRoot) {
      const existingStyle = this.shadowRoot.querySelector('style');
      if (existingStyle) {
        existingStyle.remove();
      }
      this.injectStyles();
    }
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      z-index: ${MonicaTheme.zIndex.overlay};
      pointer-events: none;
      top: 0;
      left: 0;
    `;
    
    return container;
  }

  private injectStyles(): void {
    if (!this.shadowRoot) return;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        --monica-bg: ${MonicaTheme.colors.background};
        --monica-surface: ${MonicaTheme.colors.surface};
        --monica-surface-hover: ${MonicaTheme.colors.surfaceHover};
        --monica-primary: ${MonicaTheme.colors.primary};
        --monica-primary-hover: ${MonicaTheme.colors.primaryHover};
        --monica-text-primary: ${MonicaTheme.colors.textPrimary};
        --monica-text-secondary: ${MonicaTheme.colors.textSecondary};
        --monica-border: ${MonicaTheme.colors.border};
        --monica-shadow: ${MonicaTheme.shadows.lg};
        --monica-radius: ${MonicaTheme.borderRadius.lg};
        --monica-font: ${MonicaTheme.typography.fontFamily};
        --monica-transition: ${MonicaTheme.animation.fast};
      }
      
      .monica-toolbar {
        position: fixed;
        display: flex;
        align-items: center;
        gap: 4px;
        background: var(--monica-surface);
        border: 1px solid var(--monica-border);
        border-radius: 20px;
        padding: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: ${MonicaTheme.typography.fontFamily};
        font-size: 11px;
        opacity: 0;
        transform: scale(0.95) translateY(-4px);
        transition: all ${MonicaTheme.animation.fast};
        z-index: ${MonicaTheme.zIndex.overlay};
        pointer-events: auto;
        width: auto;
        height: 32px;
        user-select: none;
      }
      
      .monica-toolbar.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .toolbar-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all ${MonicaTheme.animation.fast};
        position: relative;
        color: var(--monica-text-secondary);
        padding: 0;
      }
      
      .toolbar-action:hover {
        background: var(--monica-surface-hover);
        color: var(--monica-text-primary);
      }
      
      .toolbar-action:active {
        background: var(--monica-surface-active);
      }
      
      .toolbar-action.featured {
        background: var(--monica-primary);
        color: white;
        box-shadow: 0 1px 4px rgba(139, 92, 246, 0.3);
      }
      
      .toolbar-action.featured:hover {
        background: var(--monica-primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }
      
      .action-icon {
        width: 16px;
        height: 16px;
        color: var(--monica-text-secondary);
        transition: color var(--monica-transition);
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .action-icon svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        vector-effect: non-scaling-stroke;
        display: block;
      }
      
      .action-label {
        display: none; /* Hide labels for minimal design */
      }
      
      .toolbar-action.featured .action-icon {
        color: white;
      }
      
      .toolbar-action:hover .action-icon {
        color: var(--monica-primary);
      }
      
      .toolbar-action.featured:hover .action-icon {
        color: white;
      }
      
      .action-shortcut {
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: var(--monica-primary);
        color: white;
        font-size: 8px;
        font-weight: ${MonicaTheme.typography.fontWeight.bold};
        padding: 1px 3px;
        border-radius: 2px;
        line-height: 1;
        opacity: 0;
        transition: opacity var(--monica-transition);
      }
      
      .toolbar-action:hover .action-shortcut {
        opacity: 1;
      }
      
      .toolbar-action.featured .action-shortcut {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .toolbar-divider {
        width: 1px;
        height: 16px;
        background: var(--monica-border);
        margin: 0 2px;
        opacity: 0.5;
      }
      
      .more-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all ${MonicaTheme.animation.fast};
        color: var(--monica-text-secondary);
        position: relative;
        padding: 0;
      }
      
      .more-button:hover {
        background: var(--monica-surface-hover);
        color: var(--monica-text-primary);
      }

      /* Ensure the three-dots glyph centers perfectly like SVG icons */
      .more-button .action-icon {
        line-height: 1;
      }
      
      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--monica-bg);
        color: var(--monica-text-primary);
        padding: ${MonicaTheme.spacing.xs} ${MonicaTheme.spacing.sm};
        border-radius: ${MonicaTheme.borderRadius.sm};
        font-size: ${MonicaTheme.typography.fontSize.xs};
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--monica-transition);
        margin-bottom: ${MonicaTheme.spacing.xs};
        border: 1px solid var(--monica-border);
        z-index: 1000;
      }
      
      .toolbar-action:hover .tooltip {
        opacity: 1;
      }
      
      /* Remove extra animations and glowing effects for cleaner UI */
      
      /* Mobile responsive */
      @media (max-width: 480px) {
        .monica-toolbar {
          min-width: 160px;
        }
        
        .toolbar-action {
          width: 32px;
          height: 32px;
        }
        
        .action-icon {
          width: 14px;
          height: 14px;
        }
      }
    `;
    
    this.shadowRoot.appendChild(style);
  }

  private async loadPinnedActions(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['desainr.pinnedActions']);
      const pinnedIds: string[] = result['desainr.pinnedActions'] || DEFAULT_PINNED_IDS;
      this.pinnedIds = pinnedIds.slice(0, 9);
      this.actions = AllActions.map(action => ({
        ...action,
        isPinned: pinnedIds.includes(action.id),
      }));
    } catch (error) {
      console.warn('Failed to load pinned actions:', error);
    }
  }

  private refreshToolbarUI(): void {
    if (!this.shadowRoot) return;
    const existing = this.shadowRoot.querySelector('.monica-toolbar') as HTMLDivElement | null;
    if (!existing) return;
    const { left, top } = existing.style as any;
    existing.remove();
    const toolbar = this.renderToolbar();
    this.shadowRoot.appendChild(toolbar);
    toolbar.classList.add('show');
    if (left) toolbar.style.left = left;
    if (top) toolbar.style.top = top;
  }

  private renderToolbar(): HTMLDivElement {
    const toolbar = document.createElement('div');
    toolbar.className = 'monica-toolbar';
    
    // Get pinned actions in storage order; show at most 10
    // Only show actually pinned actions. If none pinned, show none (More still appears).
    const displayActions = this.pinnedIds
      .map(id => this.actions.find(a => a.id === id && a.isPinned))
      .filter((a): a is ToolbarAction => Boolean(a))
      .slice(0, 10);
    
    // Render display actions
    displayActions.forEach((action, index) => {
      const actionEl = document.createElement('div');
      actionEl.className = `toolbar-action ${index === 0 ? 'featured' : ''}`;
      actionEl.innerHTML = `
        <div class="action-icon">${action.icon}</div>
        <div class="action-label">${action.label}</div>
        <div class="tooltip">${action.label}</div>
      `;
      
      actionEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Keep toolbar visible while popup is open; just trigger action
        this.onActionClick?.(action);
      });
      
      toolbar.appendChild(actionEl);
    });
    
    // Add divider if we have actions
    if (displayActions.length > 0) {
      const divider = document.createElement('div');
      divider.className = 'toolbar-divider';
      toolbar.appendChild(divider);
    }
    
    // Add "More" button
    const moreButton = document.createElement('div');
    moreButton.className = 'more-button';
    moreButton.innerHTML = `
      <div class="action-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
      <div class="action-label">More</div>
      <div class="tooltip">More actions</div>
    `;
    
    moreButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Show context menu with all actions
      const rect = moreButton.getBoundingClientRect();
      this.showContextMenu(rect.left, rect.bottom);
    });
    
    toolbar.appendChild(moreButton);
    
    return toolbar;
  }

  private showContextMenu(x: number, y: number): void {
    // Import and show Monica-style context menu
    import('./MonicaStyleContextMenu.js').then(({ MonicaStyleContextMenu }) => {
      const contextMenu = new MonicaStyleContextMenu();
      contextMenu.show(x, y, (action) => {
        // Keep toolbar visible; context menu hides itself on selection
        this.onActionClick?.(action);
      });
    }).catch(() => {
      // Fallback: show simple alert for now
      console.log('More actions menu clicked');
      alert('More actions menu - Context menu integration pending');
    });
  }

  public show(x: number, y: number, onAction: (action: ToolbarAction) => void): void {
    if (!this.container || !this.shadowRoot) return;
    
    this.onActionClick = onAction;
    this.isVisible = true;
    
    // Clear previous content
    const existingToolbar = this.shadowRoot.querySelector('.monica-toolbar');
    if (existingToolbar) existingToolbar.remove();
    
    // Create and position toolbar
    const toolbar = this.renderToolbar();
    this.shadowRoot.appendChild(toolbar);
    
    // Add to DOM
    if (!document.body) {
      return;
    }
    document.body.appendChild(this.container);
    
    // Position toolbar intelligently
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    const toolbarRect = toolbar.getBoundingClientRect();
    let finalX = x - toolbarRect.width / 2;
    let finalY = y - toolbarRect.height - 8;
    
    // Boundary checks
    if (finalX < 10) finalX = 10;
    if (finalX + toolbarRect.width > viewport.width - 10) {
      finalX = viewport.width - toolbarRect.width - 10;
    }
    if (finalY < 10) finalY = y + 8;
    
    toolbar.style.left = `${finalX}px`;
    toolbar.style.top = `${finalY}px`;
    
    // Animate in
    requestAnimationFrame(() => {
      toolbar.classList.add('show');
    });
    
    // Auto-hide on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      // Do not hide if clicking inside the result popup host
      const target = e.target as EventTarget | null;
      const asNode = (target && (target as Node)) || null;
      const popupHost = document.getElementById('desainr-result-popup');
      const path = (e as any).composedPath?.() as Node[] | undefined;
      const clickedInsidePopup = popupHost ? (path ? path.includes(popupHost) : (asNode ? popupHost.contains(asNode) : false)) : false;
      if (!asNode || (!toolbar.contains(asNode) && !clickedInsidePopup)) {
        this.hide();
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  }

  public hide(): void {
    const toolbar = this.shadowRoot?.querySelector('.monica-toolbar');
    if (toolbar) {
      this.isVisible = false;
      toolbar.classList.remove('show');
      setTimeout(() => {
        if (this.container?.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
      }, 150);
    }
  }

  public isShown(): boolean {
    return this.isVisible;
  }

  public destroy(): void {
    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.shadowRoot = null;
  }
}
