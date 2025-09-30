/**
 * Custom Actions Manager
 * Allows users to create, manage, and execute custom actions
 */

export interface CustomAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  shortcut?: string;
  isPinned: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'desainr.customActions';

/**
 * Get all custom actions from storage
 */
export async function getCustomActions(): Promise<CustomAction[]> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] || [];
  } catch (error) {
    console.error('Error getting custom actions:', error);
    return [];
  }
}

/**
 * Save a new custom action
 */
export async function saveCustomAction(action: Omit<CustomAction, 'id' | 'createdAt'>): Promise<CustomAction> {
  const newAction: CustomAction = {
    ...action,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const actions = await getCustomActions();
  actions.push(newAction);
  
  await chrome.storage.local.set({ [STORAGE_KEY]: actions });
  
  // Broadcast update to all tabs
  try {
    chrome.runtime.sendMessage({ type: 'CUSTOM_ACTIONS_UPDATED' });
  } catch {}
  
  return newAction;
}

/**
 * Update an existing custom action
 */
export async function updateCustomAction(id: string, updates: Partial<Omit<CustomAction, 'id' | 'createdAt'>>): Promise<boolean> {
  const actions = await getCustomActions();
  const index = actions.findIndex(a => a.id === id);
  
  if (index === -1) return false;
  
  actions[index] = { ...actions[index], ...updates };
  await chrome.storage.local.set({ [STORAGE_KEY]: actions });
  
  // Broadcast update
  try {
    chrome.runtime.sendMessage({ type: 'CUSTOM_ACTIONS_UPDATED' });
  } catch {}
  
  return true;
}

/**
 * Delete a custom action
 */
export async function deleteCustomAction(id: string): Promise<boolean> {
  const actions = await getCustomActions();
  const filtered = actions.filter(a => a.id !== id);
  
  if (filtered.length === actions.length) return false;
  
  await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
  
  // Broadcast update
  try {
    chrome.runtime.sendMessage({ type: 'CUSTOM_ACTIONS_UPDATED' });
  } catch {}
  
  return true;
}

/**
 * Toggle pin status of a custom action
 */
export async function togglePinCustomAction(id: string): Promise<boolean> {
  const actions = await getCustomActions();
  const action = actions.find(a => a.id === id);
  
  if (!action) return false;
  
  const newPinState = !action.isPinned;
  
  // Update the custom action
  await updateCustomAction(id, { isPinned: newPinState });
  
  // Also update global pinned actions list
  try {
    const result = await chrome.storage.sync.get(['desainr.pinnedActions']);
    let pinnedIds: string[] = result['desainr.pinnedActions'] || [];
    
    if (newPinState) {
      // Add to pinned list if not already there
      if (!pinnedIds.includes(id)) {
        pinnedIds.push(id);
      }
    } else {
      // Remove from pinned list
      pinnedIds = pinnedIds.filter(pid => pid !== id);
    }
    
    await chrome.storage.sync.set({ 'desainr.pinnedActions': pinnedIds });
  } catch {}
  
  return true;
}

/**
 * Execute a custom action with the given selection
 */
export async function executeCustomAction(actionId: string, selection: string): Promise<{ ok: boolean; result?: string; error?: string }> {
  const actions = await getCustomActions();
  const action = actions.find(a => a.id === actionId);
  
  if (!action) {
    return { ok: false, error: 'Custom action not found' };
  }
  
  try {
    const { actions: actionsAPI } = await import('./apiClient');
    const st = await chrome.storage?.local.get?.([
      'desainr.settings.modelId',
      'desainr.settings.thinkingMode',
      'desainr.settings.userApiKey'
    ]).catch(() => ({} as any));
    
    const modelId = st?.['desainr.settings.modelId'];
    const thinkingMode = st?.['desainr.settings.thinkingMode'] || 'none';
    const userApiKey = st?.['desainr.settings.userApiKey'];
    
    // Use the custom prompt as instruction
    const { ok, status, json, error } = await actionsAPI({ 
      selection, 
      clientMessage: selection, 
      customInstruction: action.prompt,
      modelId, 
      thinkingMode, 
      userApiKey 
    });
    
    if (ok && json?.result) {
      return { ok: true, result: json.result };
    } else {
      const msg = (json as any)?.error || error || 'unknown';
      return { ok: false, error: `Failed (${status}): ${msg}` };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

/**
 * Available icon options for custom actions
 */
export const AVAILABLE_ICONS = [
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '🎯', name: 'Target' },
  { emoji: '💡', name: 'Lightbulb' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '💎', name: 'Diamond' },
  { emoji: '🎨', name: 'Art' },
  { emoji: '📝', name: 'Memo' },
  { emoji: '🔧', name: 'Wrench' },
  { emoji: '⚙️', name: 'Gear' },
  { emoji: '🎭', name: 'Theater' },
  { emoji: '🌟', name: 'Star' },
  { emoji: '💫', name: 'Dizzy' },
  { emoji: '🎪', name: 'Circus' },
  { emoji: '🎬', name: 'Clapper' },
  { emoji: '📌', name: 'Pin' },
  { emoji: '🔖', name: 'Bookmark' },
  { emoji: '📍', name: 'Pushpin' },
  { emoji: '🎲', name: 'Dice' },
];
