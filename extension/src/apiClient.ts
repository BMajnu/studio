import { callExtensionApi } from './api';

export type ApiResp<T> = { ok: boolean; status: number; json?: T; error?: string };

// Simple exponential backoff retry wrapper for background API calls
async function withRetry<T>(fn: () => Promise<ApiResp<T>>, attempts = 3, baseDelayMs = 300): Promise<ApiResp<T>> {
  let last: ApiResp<T> | undefined;
  for (let i = 0; i < attempts; i++) {
    const res = await fn();
    if (res.ok) return res;
    last = res;
    // Only retry on network or 5xx
    if (res.status && res.status < 500 && res.status !== 0) break;
    await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
  }
  return last ?? { ok: false, status: 0, error: 'Unknown error' };
}

// Typed wrappers
export type RewriteBody = { selection: string; url: string; task?: 'grammar'|'clarify'|'shorten'|'expand'|'tone' };
export type TranslateBody = { selection: string; url: string; targetLang?: string };
export type TranslateBatchBody = { chunks: string[]; url: string; targetLang?: string };
export type AnalyzeBody = { url: string; title?: string };
export type ChatHistoryMsg = { role: 'user'|'assistant'; text: string };
export type ChatBody = { message: string; userName?: string; chatHistory?: ChatHistoryMsg[]; modelId?: string };
export type SlashPrompt = { title: string; prompt: string };
export type ActionsBody = {
  selection?: string;
  clientMessage?: string;
  customInstruction?: string;
  templateId?: string;
  language?: 'english'|'bengali'|'both';
  modelId?: string;
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
