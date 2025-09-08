import { callExtensionApi } from './api';

export type ApiResp<T> = { ok: boolean; status: number; json?: T; error?: string };

// Detect signals that likely indicate Gemini key/quota exhaustion or capacity issues
function hasGeminiExhaustionSignal(status: number, json?: any, error?: string): boolean {
  const msg = `${(json && (json.error || (json.message ?? ''))) || ''} ${error || ''}`.toLowerCase();
  // Common phrases from Google/Gemini when quota/capacity exhausted
  const patterns = [
    'quota',
    'exhausted',
    'insufficient',
    'rate limit',
    'resource has been exhausted',
    'insufficient_quota',
    '429',
    'capacity',
  ];
  if (status === 429) return true;
  if (status >= 500 && patterns.some(p => msg.includes(p))) return true;
  return false;
}

// Detect invalid/missing API key or permission issues distinct from capacity
function hasInvalidKeySignal(status: number, json?: any, error?: string): boolean {
  const raw = (json && (json.error || (json.message ?? ''))) || '';
  const msg = `${raw} ${error || ''}`.toLowerCase();
  // If the server explicitly says UNAUTHORIZED (auth/session issue), do not mark as invalid key
  if (typeof raw === 'string' && raw.startsWith('UNAUTHORIZED')) return false;
  if (status === 401 || status === 403) return true;
  const patterns = [
    'invalid api key',
    'api key not valid',
    'key invalid',
    'missing api key',
    'no api key',
    'invalid authentication',
    'unauthorized',
    'forbidden',
    'permission denied',
  ];
  return patterns.some(p => msg.includes(p));
}

// Detect billing/configuration issues for the provided key/project
function hasBillingIssueSignal(_status: number, json?: any, error?: string): boolean {
  const msg = `${(json && (json.error || (json.message ?? ''))) || ''} ${error || ''}`.toLowerCase();
  const patterns = [
    'billing',
    'access not configured',
    'permission not configured',
    'project has been blocked',
    'enable billing',
  ];
  return patterns.some(p => msg.includes(p));
}

function makeFriendlyError(status: number, json?: any, error?: string): string | undefined {
  const raw = (json && (json.error || (json.message ?? ''))) || '';
  if (typeof raw === 'string' && raw.startsWith('UNAUTHORIZED')) {
    return 'Sign in is required or provide a Gemini API key in Settings (userApiKey).';
  }
  if (hasInvalidKeySignal(status, json, error)) {
    return 'Invalid or unauthorized API key. Update your Gemini API key in Settings or sign in again.';
  }
  if (hasBillingIssueSignal(status, json, error)) {
    return 'Billing or API access is not configured for this key/project. Enable billing in Google AI Studio or use another API key.';
  }
  if (hasGeminiExhaustionSignal(status, json, error)) {
    return 'AI capacity exhausted right now. Please try again in a bit, or switch the model/API key in settings.';
  }
  // Fallbacks
  if (status === 401 || status === 403) return 'Unauthorized. Please sign in again.';
  if (status === 429) return 'Too many requests. Please slow down and try again shortly.';
  if (status >= 500) return 'Server error. Please try again shortly.';
  return undefined;
}

// Simple exponential backoff retry wrapper for background API calls
async function withRetry<T>(fn: () => Promise<ApiResp<T>>, attempts = 3, baseDelayMs = 100): Promise<ApiResp<T>> {
  let last: ApiResp<T> | undefined;
  for (let i = 0; i < attempts; i++) {
    let res = await fn();
    if (res.ok) return res;

    // Normalize error to a user-friendly message
    const friendly = makeFriendlyError(res.status, (res as any).json, res.error);
    if (friendly) res = { ...res, error: friendly };
    last = res;

    // Decide if we should retry
    const isNetworkOr5xx = !res.status || res.status === 0 || res.status >= 500;
    const exhaustion = hasGeminiExhaustionSignal(res.status, (res as any).json, res.error);
    const invalidKey = hasInvalidKeySignal(res.status, (res as any).json, res.error);
    const billingIssue = hasBillingIssueSignal(res.status, (res as any).json, res.error);
    if (!isNetworkOr5xx || exhaustion || invalidKey || billingIssue || res.status === 401 || res.status === 403 || res.status === 400) break; // non-retriable

    await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
  }
  return last ?? { ok: false, status: 0, error: 'Unknown error' };
}

// Typed wrappers
export type RewriteBody = { selection: string; url: string; task?: 'grammar'|'clarify'|'shorten'|'expand'|'tone'; modelId?: string; thinkingMode?: 'default'|'none'; userApiKey?: string };
export type TranslateBody = { selection: string; url: string; targetLang?: string; modelId?: string; thinkingMode?: 'default'|'none'; userApiKey?: string };
export type TranslateBatchBody = { chunks: string[]; url: string; targetLang?: string; modelId?: string; thinkingMode?: 'default'|'none'; userApiKey?: string };
export type AnalyzeBody = { url: string; title?: string };
export type ChatHistoryMsg = { role: 'user'|'assistant'; text: string };
export type ChatBody = { message: string; userName?: string; chatHistory?: ChatHistoryMsg[]; modelId?: string; thinkingMode?: 'default'|'none'; userApiKey?: string };
export type SlashPrompt = { title: string; prompt: string };
export type ActionsBody = {
  selection?: string;
  clientMessage?: string;
  customInstruction?: string;
  templateId?: string;
  language?: 'english'|'bengali'|'both';
  modelId?: string;
  thinkingMode?: 'default'|'none';
  userApiKey?: string;
};
export type MemoBody = {
  title: string;
  content: string;
  url?: string;
  type?: 'text' | 'analysis' | 'selection';
  metadata?: Record<string, any>;
  tags?: string[];
  userApiKey?: string;
};

export async function rewrite(body: RewriteBody) {
  return withRetry(() => callExtensionApi('rewrite', body));
}

export async function translateChunks(body: TranslateBody) {
  return withRetry(() => callExtensionApi('translate-chunks', body));
}

export async function translateChunksBatch(body: TranslateBatchBody) {
  return withRetry(() => callExtensionApi('translate-chunks', body));
}

export async function analyzePage(body: AnalyzeBody) {
  return withRetry(() => callExtensionApi('analyze-page', body));
}

export async function chat(body: ChatBody) {
  return withRetry(() => callExtensionApi('chat', body));
}

export async function getSlashPrompts(limit = 50) {
  return withRetry<{ ok: boolean; endpoint: string; uid: string; prompts: SlashPrompt[] }>(
    () => callExtensionApi('slash-prompts', { limit })
  );
}

export async function actions(body: ActionsBody) {
  return withRetry(() => callExtensionApi('actions', body));
}

export async function saveMemo(body: MemoBody) {
  return withRetry<{ success: boolean; memoId: string; message: string }>(
    () => callExtensionApi('memo/save', body)
  );
}
