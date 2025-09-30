/**
 * Custom Action Modal
 * UI for creating and editing custom actions
 */

import { saveCustomAction, updateCustomAction, AVAILABLE_ICONS, type CustomAction } from '../customActions';

export class CustomActionModal {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private onSave: ((action: CustomAction) => void) | null = null;
  private editingAction: CustomAction | null = null;

  constructor() {
    this.container = this.createContainer();
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });
    this.injectStyles();
    this.renderModal();
  }

  private createContainer(): HTMLDivElement {
    const div = document.createElement('div');
    div.id = 'desainr-custom-action-modal';
    Object.assign(div.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      display: 'none',
    });
    document.documentElement.appendChild(div);
    return div;
  }

  private injectStyles(): void {
    if (!this.shadowRoot) return;
    
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; }
      
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .modal {
        background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow: auto;
        animation: slideUp 0.3s ease;
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
      
      .header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px 16px 0 0;
      }
      
      .title {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }
      
      .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 8px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        font-size: 20px;
        transition: background 0.2s;
      }
      
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .body {
        padding: 24px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #374151;
        font-size: 14px;
      }
      
      .input, .textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #d1d5db;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        transition: all 0.2s;
        background: white;
      }
      
      .input:focus, .textarea:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
      
      .textarea {
        resize: vertical;
        min-height: 80px;
        line-height: 1.5;
      }
      
      .hint {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }
      
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
        gap: 8px;
        margin-top: 8px;
      }
      
      .icon-btn {
        width: 48px;
        height: 48px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon-btn:hover {
        border-color: #a5b4fc;
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
      }
      
      .icon-btn.selected {
        border-color: #6366f1;
        background: #eef2ff;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
      
      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #6366f1;
      }
      
      .footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        background: #f9fafb;
        border-radius: 0 0 16px 16px;
      }
      
      .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .btn-secondary {
        background: white;
        color: #374151;
        border: 1.5px solid #d1d5db;
      }
      
      .btn-secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
      }
      
      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .error {
        color: #dc2626;
        font-size: 13px;
        margin-top: 8px;
        display: none;
      }
      
      .error.show {
        display: block;
      }
    `;
    
    this.shadowRoot.appendChild(style);
  }

  private renderModal(): void {
    if (!this.shadowRoot) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="header">
          <h2 class="title">Create Custom Action</h2>
          <button class="close-btn" id="close-btn">×</button>
        </div>
        <div class="body">
          <div class="form-group">
            <label class="label" for="action-name">Action Name</label>
            <input 
              type="text" 
              id="action-name" 
              class="input" 
              placeholder="e.g., Make Professional"
              maxlength="50"
            />
            <div class="hint">This will appear in the action menu</div>
            <div class="error" id="name-error"></div>
          </div>
          
          <div class="form-group">
            <label class="label" for="action-prompt">AI Prompt</label>
            <textarea 
              id="action-prompt" 
              class="textarea" 
              placeholder="e.g., Make this text more professional and polished while keeping the core message"
            ></textarea>
            <div class="hint">Tell AI what to do with the selected text</div>
            <div class="error" id="prompt-error"></div>
          </div>
          
          <div class="form-group">
            <label class="label">Icon</label>
            <div class="icon-grid" id="icon-grid"></div>
            <div class="error" id="icon-error"></div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="pin-action" class="checkbox" />
              <label for="pin-action" class="label" style="margin: 0;">Pin to quick access</label>
            </div>
            <div class="hint">Pinned actions appear directly in the toolbar</div>
          </div>
        </div>
        <div class="footer">
          <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="save-btn">Create Action</button>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(overlay);
    
    // Populate icon grid
    const iconGrid = this.shadowRoot.getElementById('icon-grid');
    if (iconGrid) {
      AVAILABLE_ICONS.forEach((icon, index) => {
        const btn = document.createElement('button');
        btn.className = 'icon-btn';
        btn.textContent = icon.emoji;
        btn.title = icon.name;
        btn.dataset.icon = icon.emoji;
        if (index === 0) btn.classList.add('selected');
        iconGrid.appendChild(btn);
      });
    }
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.shadowRoot) return;
    
    // Close button
    const closeBtn = this.shadowRoot.getElementById('close-btn');
    closeBtn?.addEventListener('click', () => this.hide());
    
    // Cancel button
    const cancelBtn = this.shadowRoot.getElementById('cancel-btn');
    cancelBtn?.addEventListener('click', () => this.hide());
    
    // Click outside to close
    const overlay = this.shadowRoot.querySelector('.overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.hide();
    });
    
    // Icon selection
    const iconBtns = this.shadowRoot.querySelectorAll('.icon-btn');
    iconBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        iconBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    
    // Save button
    const saveBtn = this.shadowRoot.getElementById('save-btn');
    saveBtn?.addEventListener('click', () => this.handleSave());
    
    // Enter to save (on inputs)
    const nameInput = this.shadowRoot.getElementById('action-name') as HTMLInputElement;
    nameInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSave();
    });
  }

  private async handleSave(): Promise<void> {
    if (!this.shadowRoot) return;
    
    const nameInput = this.shadowRoot.getElementById('action-name') as HTMLInputElement;
    const promptInput = this.shadowRoot.getElementById('action-prompt') as HTMLTextAreaElement;
    const pinInput = this.shadowRoot.getElementById('pin-action') as HTMLInputElement;
    const selectedIcon = this.shadowRoot.querySelector('.icon-btn.selected') as HTMLElement;
    
    const nameError = this.shadowRoot.getElementById('name-error');
    const promptError = this.shadowRoot.getElementById('prompt-error');
    const iconError = this.shadowRoot.getElementById('icon-error');
    
    // Clear previous errors
    nameError?.classList.remove('show');
    promptError?.classList.remove('show');
    iconError?.classList.remove('show');
    
    // Validation
    let hasError = false;
    
    if (!nameInput.value.trim()) {
      if (nameError) {
        nameError.textContent = 'Action name is required';
        nameError.classList.add('show');
      }
      hasError = true;
    }
    
    if (!promptInput.value.trim()) {
      if (promptError) {
        promptError.textContent = 'AI prompt is required';
        promptError.classList.add('show');
      }
      hasError = true;
    }
    
    if (!selectedIcon) {
      if (iconError) {
        iconError.textContent = 'Please select an icon';
        iconError.classList.add('show');
      }
      hasError = true;
    }
    
    if (hasError) return;
    
    const actionData = {
      label: nameInput.value.trim(),
      prompt: promptInput.value.trim(),
      icon: selectedIcon.dataset.icon || '✨',
      isPinned: pinInput.checked,
    };
    
    try {
      if (this.editingAction) {
        // Update existing
        await updateCustomAction(this.editingAction.id, actionData);
      } else {
        // Create new
        const newAction = await saveCustomAction(actionData);
        if (this.onSave) this.onSave(newAction);
      }
      this.hide();
    } catch (error) {
      console.error('Error saving custom action:', error);
      if (promptError) {
        promptError.textContent = 'Failed to save action. Please try again.';
        promptError.classList.add('show');
      }
    }
  }

  show(callback?: (action: CustomAction) => void, editAction?: CustomAction): void {
    if (!this.container) return;
    
    this.onSave = callback || null;
    this.editingAction = editAction || null;
    
    // Update title and button text if editing
    if (this.shadowRoot) {
      const title = this.shadowRoot.querySelector('.title');
      const saveBtn = this.shadowRoot.getElementById('save-btn');
      
      if (this.editingAction) {
        if (title) title.textContent = 'Edit Custom Action';
        if (saveBtn) saveBtn.textContent = 'Save Changes';
        
        // Populate fields with existing data
        const nameInput = this.shadowRoot.getElementById('action-name') as HTMLInputElement;
        const promptInput = this.shadowRoot.getElementById('action-prompt') as HTMLTextAreaElement;
        const pinInput = this.shadowRoot.getElementById('pin-action') as HTMLInputElement;
        
        if (nameInput) nameInput.value = this.editingAction.label;
        if (promptInput) promptInput.value = this.editingAction.prompt;
        if (pinInput) pinInput.checked = this.editingAction.isPinned;
        
        // Select the icon
        const iconBtns = this.shadowRoot.querySelectorAll('.icon-btn');
        iconBtns.forEach(btn => {
          btn.classList.remove('selected');
          if ((btn as HTMLElement).dataset.icon === this.editingAction!.icon) {
            btn.classList.add('selected');
          }
        });
      } else {
        if (title) title.textContent = 'Create Custom Action';
        if (saveBtn) saveBtn.textContent = 'Create Action';
        
        // Reset fields
        const nameInput = this.shadowRoot.getElementById('action-name') as HTMLInputElement;
        const promptInput = this.shadowRoot.getElementById('action-prompt') as HTMLTextAreaElement;
        const pinInput = this.shadowRoot.getElementById('pin-action') as HTMLInputElement;
        
        if (nameInput) nameInput.value = '';
        if (promptInput) promptInput.value = '';
        if (pinInput) pinInput.checked = false;
        
        // Select first icon by default
        const iconBtns = this.shadowRoot.querySelectorAll('.icon-btn');
        iconBtns.forEach((btn, index) => {
          btn.classList.toggle('selected', index === 0);
        });
      }
      
      // Clear errors
      const errors = this.shadowRoot.querySelectorAll('.error');
      errors.forEach(err => err.classList.remove('show'));
    }
    
    this.container.style.display = 'block';
    
    // Focus name input
    setTimeout(() => {
      const nameInput = this.shadowRoot?.getElementById('action-name') as HTMLInputElement;
      nameInput?.focus();
    }, 100);
  }

  hide(): void {
    if (!this.container) return;
    this.container.style.display = 'none';
    this.onSave = null;
    this.editingAction = null;
  }

  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.shadowRoot = null;
  }
}
