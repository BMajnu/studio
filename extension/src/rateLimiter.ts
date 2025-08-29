/**
 * Token bucket rate limiter for extension API calls
 * Implements client-side rate limiting using chrome.storage.local
 */

export interface RateLimitConfig {
  maxTokens: number;      // Maximum tokens in bucket
  refillRate: number;     // Tokens refilled per second
  costPerCall: number;    // Tokens consumed per API call
}

export interface RateLimitState {
  tokens: number;
  lastRefill: number;
}

// Default rate limits per API endpoint
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'rewrite': { maxTokens: 20, refillRate: 0.5, costPerCall: 1 },
  'translate-chunks': { maxTokens: 30, refillRate: 1, costPerCall: 1 },
  'analyze-page': { maxTokens: 10, refillRate: 0.2, costPerCall: 1 },
  'chat': { maxTokens: 30, refillRate: 0.5, costPerCall: 1 },
  'actions': { maxTokens: 20, refillRate: 0.5, costPerCall: 1 },
  'memo/save': { maxTokens: 50, refillRate: 1, costPerCall: 1 },
  'slash-prompts': { maxTokens: 10, refillRate: 0.5, costPerCall: 1 },
  'default': { maxTokens: 20, refillRate: 0.5, costPerCall: 1 }
};

const STORAGE_KEY_PREFIX = 'rateLimiter_';

function hasChromeStorage(): boolean {
  try {
    return typeof chrome !== 'undefined' && !!(chrome as any).storage && !!(chrome as any).storage.local;
  } catch {
    return false;
  }
}

/**
 * Get current rate limit state from storage
 */
async function getRateLimitState(endpoint: string): Promise<RateLimitState> {
  const key = `${STORAGE_KEY_PREFIX}${endpoint}`;
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;

  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (data: Record<string, any>) => {
        const stored = data[key];
        if (stored && stored.tokens !== undefined && stored.lastRefill !== undefined) {
          resolve(stored);
        } else {
          // Initialize with full bucket
          resolve({
            tokens: config.maxTokens,
            lastRefill: Date.now()
          });
        }
      });
    });
  }

  // Fallback to localStorage when chrome.storage is unavailable
  try {
    const raw = (globalThis as any)?.localStorage?.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.tokens !== undefined && parsed.lastRefill !== undefined) {
        return parsed as RateLimitState;
      }
    }
  } catch {}
  return { tokens: config.maxTokens, lastRefill: Date.now() };
}

/**
 * Save rate limit state to storage
 */
async function saveRateLimitState(endpoint: string, state: RateLimitState): Promise<void> {
  const key = `${STORAGE_KEY_PREFIX}${endpoint}`;
  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: state }, resolve);
    });
  }
  try {
    (globalThis as any)?.localStorage?.setItem(key, JSON.stringify(state));
  } catch {}
}

/**
 * Refill tokens based on elapsed time
 */
function refillTokens(state: RateLimitState, config: RateLimitConfig): RateLimitState {
  const now = Date.now();
  const elapsed = (now - state.lastRefill) / 1000; // Convert to seconds
  const tokensToAdd = elapsed * config.refillRate;
  
  return {
    tokens: Math.min(state.tokens + tokensToAdd, config.maxTokens),
    lastRefill: now
  };
}

/**
 * Check if an API call can be made within rate limits
 */
export async function canMakeCall(endpoint: string): Promise<boolean> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  let state = await getRateLimitState(endpoint);
  
  // Refill tokens based on elapsed time
  state = refillTokens(state, config);
  
  // Check if we have enough tokens
  const hasTokens = state.tokens >= config.costPerCall;
  
  // Save updated state (with refilled tokens)
  await saveRateLimitState(endpoint, state);
  
  return hasTokens;
}

/**
 * Consume tokens for an API call
 */
export async function consumeTokens(endpoint: string): Promise<boolean> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  let state = await getRateLimitState(endpoint);
  
  // Refill tokens based on elapsed time
  state = refillTokens(state, config);
  
  // Check if we have enough tokens
  if (state.tokens < config.costPerCall) {
    await saveRateLimitState(endpoint, state);
    return false;
  }
  
  // Consume tokens
  state.tokens -= config.costPerCall;
  await saveRateLimitState(endpoint, state);
  
  return true;
}

/**
 * Get remaining tokens and time until next refill
 */
export async function getRateLimitInfo(endpoint: string): Promise<{
  remainingTokens: number;
  maxTokens: number;
  timeUntilRefill: number;
  canMakeCall: boolean;
}> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  let state = await getRateLimitState(endpoint);
  
  // Refill tokens based on elapsed time
  state = refillTokens(state, config);
  
  const tokensNeeded = Math.max(0, config.costPerCall - state.tokens);
  const timeUntilRefill = tokensNeeded > 0 ? tokensNeeded / config.refillRate : 0;
  
  return {
    remainingTokens: Math.floor(state.tokens),
    maxTokens: config.maxTokens,
    timeUntilRefill: Math.ceil(timeUntilRefill),
    canMakeCall: state.tokens >= config.costPerCall
  };
}

/**
 * Reset rate limits for all endpoints (for testing/debugging)
 */
export async function resetAllRateLimits(): Promise<void> {
  const keys = Object.keys(RATE_LIMITS).map(endpoint => `${STORAGE_KEY_PREFIX}${endpoint}`);
  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, resolve);
    });
  }
  try {
    for (const k of keys) {
      (globalThis as any)?.localStorage?.removeItem(k);
    }
  } catch {}
}

/**
 * Get usage statistics for all endpoints
 */
export async function getUsageStats(): Promise<Record<string, {
  endpoint: string;
  remainingTokens: number;
  maxTokens: number;
  percentageUsed: number;
}>> {
  const stats: Record<string, any> = {};
  
  for (const endpoint of Object.keys(RATE_LIMITS)) {
    if (endpoint === 'default') continue;
    
    const info = await getRateLimitInfo(endpoint);
    stats[endpoint] = {
      endpoint,
      remainingTokens: info.remainingTokens,
      maxTokens: info.maxTokens,
      percentageUsed: Math.round((1 - info.remainingTokens / info.maxTokens) * 100)
    };
  }
  
  return stats;
}
