// Monica-inspired context menu component for DesAInR
import { MonicaTheme, FeatureIcons } from './MonicaStyleTheme.js';

export interface MenuAction {
  id: string;
  label: string;
  icon: string;
  category: string;
  shortcut?: string;
  isPinned?: boolean;
}

export const DefaultActions: MenuAction[] = [
  // Quick Actions (Monica-style)
  { id: 'refine', label: 'Refine Selection', category: 'Quick Actions', icon: FeatureIcons.refine, shortcut: 'R', isPinned: true },
  { id: 'translate', label: 'Translate Selection', category: 'Quick Actions', icon: FeatureIcons.translate, shortcut: 'T', isPinned: true },
  { id: 'rewrite', label: 'Rewrite Selection', category: 'Quick Actions', icon: FeatureIcons.rewrite, shortcut: 'W', isPinned: true },
  
  // Content Tools
  { id: 'analyze', label: 'Analyze Page', category: 'Content Tools', icon: FeatureIcons.analyze, shortcut: 'A', isPinned: false },
  { id: 'explain', label: 'Explain Selection', category: 'Content Tools', icon: FeatureIcons.explain, shortcut: 'E', isPinned: false },
  { id: 'correct', label: 'Correct Grammar', category: 'Content Tools', icon: FeatureIcons.grammar, shortcut: 'C', isPinned: false },
  { id: 'expand', label: 'Expand Text', category: 'Content Tools', icon: FeatureIcons.expand, shortcut: 'X', isPinned: false },
  
  // AI Chat
  { id: 'chat-personal', label: 'Personal Chat', category: 'AI Chat', icon: FeatureIcons.chat, shortcut: 'P', isPinned: false },
  { id: 'chat-pro', label: 'Pro Chat', category: 'AI Chat', icon: FeatureIcons.question, shortcut: 'O', isPinned: false },
  
  // Advanced
  { id: 'settings', label: 'Extension Settings', category: 'Advanced', icon: FeatureIcons.custom, shortcut: 'S', isPinned: false },
  { id: 'customize', label: 'Customize Actions', category: 'Advanced', icon: FeatureIcons.custom, shortcut: 'M', isPinned: false },
];

export class MonicaStyleContextMenu {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private actions: MenuAction[] = DefaultActions;
  private onActionClick: ((action: MenuAction) => void) | null = null;
  private readonly maxPinned: number = 9;

  constructor() {
    this.container = this.createContainer();
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });
    this.injectStyles();
    this.loadPinnedActions();
    
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
    // Create container with Shadow DOM for style isolation
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      z-index: ${MonicaTheme.zIndex.max};
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
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
        --monica-surface-active: ${MonicaTheme.colors.surfaceActive};
        --monica-primary: ${MonicaTheme.colors.primary};
        --monica-primary-hover: ${MonicaTheme.colors.primaryHover};
        --monica-primary-active: ${MonicaTheme.colors.primaryActive};
        --monica-text-primary: ${MonicaTheme.colors.textPrimary};
        --monica-text-secondary: ${MonicaTheme.colors.textSecondary};
        --monica-text-muted: ${MonicaTheme.colors.textMuted};
        --monica-border: ${MonicaTheme.colors.border};
        --monica-shadow: ${MonicaTheme.colors.shadow};
        --monica-transition: ${MonicaTheme.animation.fast};
        --monica-radius: ${MonicaTheme.borderRadius.md};
      }
      
      .monica-menu {
        position: fixed;
        background: var(--monica-surface);
        color: var(--monica-text-primary);
        font-size: 0.95em;
        border: 1px solid var(--monica-border);
        border-radius: ${MonicaTheme.borderRadius.lg};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        min-width: 260px;
        max-width: 380px;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden; /* remove bottom scrollbar */
        scrollbar-width: thin; /* Firefox minimal scrollbar */
        scrollbar-color: var(--monica-border) transparent;
        padding: ${MonicaTheme.spacing.sm} 0;
        opacity: 0;
        transform: scale(0.98) translateY(-4px);
        transition: all ${MonicaTheme.animation.fast};
        pointer-events: auto;
        z-index: ${MonicaTheme.zIndex.max};
      }

      /* WebKit minimal scrollbar styling */
      .monica-menu::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .monica-menu::-webkit-scrollbar-track {
        background: transparent;
      }
      .monica-menu::-webkit-scrollbar-thumb {
        background: var(--monica-border);
        border-radius: 8px;
      }
      .monica-menu::-webkit-scrollbar-thumb:hover {
        background: var(--monica-text-muted);
      }

      .monica-menu.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .menu-category {
        margin-bottom: ${MonicaTheme.spacing.xs};
      }
      
      .category-header {
        display: flex;
        align-items: center;
        gap: ${MonicaTheme.spacing.xs};
        padding: ${MonicaTheme.spacing.xs} ${MonicaTheme.spacing.sm};
        font-size: ${MonicaTheme.typography.fontSize.xs};
        font-weight: ${MonicaTheme.typography.fontWeight.semibold};
        color: var(--monica-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: ${MonicaTheme.spacing.xs};
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: ${MonicaTheme.spacing.sm};
        padding: ${MonicaTheme.spacing.sm} ${MonicaTheme.spacing.md};
        border-radius: ${MonicaTheme.borderRadius.md};
        cursor: pointer;
        transition: all ${MonicaTheme.animation.fast};
        position: relative;
        overflow: hidden;
      }
      
      .menu-item:hover {
        background: var(--monica-surface-hover);
        transform: translateX(2px);
      }
      
      .menu-item:active {
        background: var(--monica-surface-active);
        transform: translateX(1px);
      }
      
      .menu-item.featured {
        background: linear-gradient(135deg, var(--monica-primary), var(--monica-primary-hover));
        color: white;
      }
      
      .menu-item.featured:hover {
        background: linear-gradient(135deg, var(--monica-primary-hover), var(--monica-primary-active));
        box-shadow: var(--monica-shadow-glow);
      }
      
      .item-icon {
        width: 15px;
        height: 15px;
        color: var(--monica-primary);
        flex-shrink: 0;
        transition: color ${MonicaTheme.animation.fast};
      }

      .item-icon svg {
        width: 15px;
        height: 15px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        vector-effect: non-scaling-stroke;
        display: block;
      }
      
      .menu-item.featured .item-icon {
        color: white;
      }
      
      .item-label {
        flex: 1;
        font-weight: ${MonicaTheme.typography.fontWeight.medium};
        line-height: ${MonicaTheme.typography.lineHeight.tight};
        min-width: 0; /* allow flex item to shrink to avoid horizontal overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .item-shortcut {
        font-size: ${MonicaTheme.typography.fontSize.xs};
        color: var(--monica-text-muted);
        font-weight: ${MonicaTheme.typography.fontWeight.normal};
        background: var(--monica-surface-hover);
        padding: 1px 5px;
        border-radius: ${MonicaTheme.borderRadius.sm};
      }

      .menu-item.featured .item-shortcut {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .item-pin {
        margin-left: ${MonicaTheme.spacing.sm};
        color: var(--monica-text-muted);
        background: transparent;
        border: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${MonicaTheme.borderRadius.sm};
        cursor: pointer;
        flex-shrink: 0;
      }

      .item-pin:hover {
        color: var(--monica-primary);
        background: var(--monica-surface-hover);
      }

      .menu-item.featured .item-pin {
        color: rgba(255, 255, 255, 0.85);
        background: transparent;
      }

      .item-pin svg {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 1.75;
        display: block;
      }

      /* Filled state for pinned bookmark */
      .item-pin svg.filled path {
        fill: currentColor;
        stroke: none;
      }

      .pin-indicator {
        width: 4px;
        height: 4px;
        background: var(--monica-primary);
        border-radius: 50%;
        position: absolute;
        top: 6px;
        right: 6px;
        opacity: 0;
        transition: opacity ${MonicaTheme.animation.fast};
      }
      
      .menu-item.pinned .pin-indicator {
        opacity: 1;
      }
      
      .menu-item.pinned .pin-indicator {
        opacity: 1;
      }
      
      .menu-divider {
        height: 1px;
        background: var(--monica-border);
        margin: ${MonicaTheme.spacing.sm} 0;
      }
      
      .menu-footer {
        padding: ${MonicaTheme.spacing.sm} ${MonicaTheme.spacing.lg};
        text-align: center;
        font-size: ${MonicaTheme.typography.fontSize.xs};
        color: var(--monica-text-muted);
        border-top: 1px solid var(--monica-border);
        margin-top: ${MonicaTheme.spacing.sm};
      }
      
      .powered-by {
        opacity: 0.7;
        transition: opacity ${MonicaTheme.animation.fast};
      }
      
      .powered-by:hover {
        opacity: 1;
      }
      
      /* Enhanced animations */
      .menu-item {
        position: relative;
        overflow: hidden;
      }
      
      .menu-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
        transition: left ${MonicaTheme.animation.normal};
      }
      
      .menu-item:hover::before {
        left: 100%;
      }
      
      /* Responsive design */
      @media (max-width: 480px) {
        .monica-menu {
          min-width: 200px;
          max-width: 280px;
        }
        
        .menu-item {
          padding: ${MonicaTheme.spacing.sm} ${MonicaTheme.spacing.md};
        }
      }
    `;
    
    this.shadowRoot.appendChild(style);
  }

  private async loadPinnedActions(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['desainr.pinnedActions']);
      const pinnedIds = result['desainr.pinnedActions'] || [];
      
      this.actions = this.actions.map(action => ({
        ...action,
        isPinned: pinnedIds.includes(action.id)
      }));
    } catch (error) {
      console.warn('Failed to load pinned actions:', error);
    }
  }

  private async savePinnedActions(): Promise<void> {
    try {
      const pinnedIds = this.actions.filter(a => a.isPinned).map(a => a.id).slice(0, this.maxPinned);
      await chrome.storage.sync.set({ 'desainr.pinnedActions': pinnedIds });
      try {
        chrome?.runtime?.sendMessage?.({ type: 'SAVE_PINNED_ACTIONS', pinnedIds });
      } catch (e) {
        console.warn('Broadcast SAVE_PINNED_ACTIONS failed:', e);
      }
    } catch (error) {
      console.warn('Failed to save pinned actions:', error);
    }
  }

  private togglePin(actionId: string): void {
    const idx = this.actions.findIndex(a => a.id === actionId);
    if (idx === -1) return;
    const action = this.actions[idx];
    if (action.isPinned) {
      action.isPinned = false;
    } else {
      const count = this.actions.filter(a => a.isPinned).length;
      if (count >= this.maxPinned) {
        // silently ignore beyond limit; could add subtle feedback later
        return;
      }
      action.isPinned = true;
    }
    // Persist and refresh UI
    void this.savePinnedActions();
    this.refreshMenuUI();
  }

  private refreshMenuUI(): void {
    if (!this.shadowRoot) return;
    const existing = this.shadowRoot.querySelector('.monica-menu') as HTMLDivElement | null;
    if (!existing) return;
    const left = existing.style.left;
    const top = existing.style.top;
    existing.remove();
    const menu = this.renderMenu();
    this.shadowRoot.appendChild(menu);
    menu.classList.add('show');
    if (left) menu.style.left = left;
    if (top) menu.style.top = top;
  }

  private renderMenu(): HTMLDivElement {
    const menu = document.createElement('div');
    menu.className = 'monica-menu';
    
    // Group actions by category
    const groupedActions = this.actions.reduce((groups, action) => {
      const categoryInfo = MonicaTheme.featureCategories[action.category as keyof typeof MonicaTheme.featureCategories];
      if (!groups[action.category]) groups[action.category] = [];
      groups[action.category].push(action);
      return groups;
    }, {} as Record<string, MenuAction[]>);

    // Render categories
    Object.entries(groupedActions).forEach(([categoryId, actions]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'menu-category';
      
      // Category header
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerHTML = `
        <div class="category-icon">${MonicaTheme.featureCategories[categoryId as keyof typeof MonicaTheme.featureCategories]?.icon || ''}</div>
        <div class="category-title">${MonicaTheme.featureCategories[categoryId as keyof typeof MonicaTheme.featureCategories]?.title || categoryId}</div>
      `;
      categoryDiv.appendChild(header);
      
      // Category actions
      actions.forEach((action, index) => {
        const item = document.createElement('div');
        item.className = `menu-item ${action.isPinned ? 'pinned' : ''} ${index === 0 && categoryId === 'Quick Actions' ? 'featured' : ''}`;
        // Use Heroicons-style memo icon for pin/unpin to match previous Copy Selection icon
        const pinSvg = FeatureIcons.memo;
        item.innerHTML = `
          <div class="item-icon">${action.icon}</div>
          <div class="item-label">${action.label}</div>
          ${action.shortcut ? `<div class="item-shortcut">${action.shortcut}</div>` : ''}
          <button class="item-pin" title="${action.isPinned ? 'Unpin' : 'Pin'}" aria-label="${action.isPinned ? 'Unpin' : 'Pin'}">
            ${pinSvg}
          </button>
          <div class="pin-indicator"></div>
        `;
        
        item.addEventListener('click', () => {
          this.hide();
          this.onActionClick?.(action);
        });
        const pinBtn = item.querySelector('.item-pin') as HTMLButtonElement | null;
        if (pinBtn) {
          // Reflect pinned state for accessibility and visuals
          pinBtn.setAttribute('aria-pressed', action.isPinned ? 'true' : 'false');
          const pinSvgEl = pinBtn.querySelector('svg');
          if (pinSvgEl) {
            if (action.isPinned) {
              pinSvgEl.classList.add('filled');
            } else {
              pinSvgEl.classList.remove('filled');
            }
          }

          pinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.togglePin(action.id);
          });
        }
        
        categoryDiv.appendChild(item);
      });
      
      menu.appendChild(categoryDiv);
    });

    // Add footer
    const footer = document.createElement('div');
    footer.className = 'menu-footer';
    footer.innerHTML = `
      <div class="powered-by">Powered by DesAInR ✨</div>
    `;
    menu.appendChild(footer);
    
    return menu;
  }

  public show(x: number, y: number, onAction: (action: MenuAction) => void): void {
    if (!this.container || !this.shadowRoot) return;
    
    this.onActionClick = onAction;
    
    // Clear previous content
    const existingMenu = this.shadowRoot.querySelector('.monica-menu');
    if (existingMenu) existingMenu.remove();
    
    // Create and position menu
    const menu = this.renderMenu();
    this.shadowRoot.appendChild(menu);
    
    // Position menu intelligently
    document.body.appendChild(this.container);
    
    // Get viewport dimensions
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Position menu with smart boundary detection
    const menuRect = menu.getBoundingClientRect();
    let finalX = x;
    let finalY = y;
    
    // Horizontal boundary check
    if (x + menuRect.width > viewport.width - 20) {
      finalX = Math.max(20, x - menuRect.width);
    }
    
    // Vertical boundary check
    if (y + menuRect.height > viewport.height - 20) {
      finalY = Math.max(20, y - menuRect.height);
    }
    
    menu.style.left = `${finalX}px`;
    menu.style.top = `${finalY}px`;
    
    // Animate in
    requestAnimationFrame(() => {
      menu.classList.add('show');
    });
    
    // Auto-hide on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        this.hide();
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  }

  public hide(): void {
    const menu = this.shadowRoot?.querySelector('.monica-menu');
    if (menu) {
      menu.classList.remove('show');
      setTimeout(() => {
        if (this.container?.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
      }, 150);
    }
  }

  public updateActions(newActions: MenuAction[]): void {
    this.actions = newActions;
  }

  public destroy(): void {
    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.shadowRoot = null;
  }
}
