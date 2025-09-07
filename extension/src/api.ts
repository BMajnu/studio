import { consumeTokens, getRateLimitInfo } from './rateLimiter';

export async function callExtensionApi(path: string, body?: any) {
  // Check rate limits before making the call
  const hasTokens = await consumeTokens(path);
  
  if (!hasTokens) {
    // Get info about when the call can be made
    const info = await getRateLimitInfo(path);
    const waitTime = info.timeUntilRefill;
    
    return {
      ok: false,
      status: 429,
      error: `Rate limit exceeded. Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before trying again.`
    };
  }
  
  return new Promise<{ ok: boolean; status: number; json?: any; error?: string }>((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'API_CALL', path, body },
      (resp: { ok: boolean; status: number; json?: any; error?: string }) => {
        if (!resp) return resolve({ ok: false, status: 0, error: 'No response from background' });
        resolve(resp);
      }
    );
  });
}
