/**
 * Helper utilities for Google GenAI SDK
 * Replaces Genkit structured output with direct SDK calls
 */

import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '@/lib/types';
import { AVAILABLE_MODELS } from '@/lib/constants';
import { GeminiKeyManager } from './gemini-key-manager';
import { AppError, classifyError } from '@/lib/errors';

// Simple in-process rate limiter to avoid hitting provider quota aggressively
let __activeRequests = 0;
let __lastRequestTime = 0;
const __MAX_CONCURRENT = 1;
const __MIN_INTERVAL_MS = 1200;
function __sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
async function __acquireSlot() {
  // ensure single concurrent
  while (__activeRequests >= __MAX_CONCURRENT) { await __sleep(100); }
  // ensure minimum interval between calls
  const now = Date.now();
  const wait = Math.max(0, __MIN_INTERVAL_MS - (now - __lastRequestTime));
  if (wait > 0) await __sleep(wait);
  __activeRequests++;
  __lastRequestTime = Date.now();
}
function __releaseSlot() { __activeRequests = Math.max(0, __activeRequests - 1); }

export interface GenAIConfig {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingMode?: 'default' | 'none';
  profile?: UserProfile | null;
  useModelFallback?: boolean;
  preferStreaming?: boolean;
}

/** Normalize legacy/deprecated model IDs - currently just removes googleai/ prefix */
function normalizeModelId(modelId: string): string {
  // Remove any prefix like "googleai/" that might have been added
  // No other normalization - use model IDs as-is
  return modelId.replace(/^googleai\//, '');
}

/** Whether the given model supports thinking config */
function modelSupportsThinking(modelId: string): boolean {
  const info = AVAILABLE_MODELS.find((m: any) => m.id === modelId);
  return !!info?.supportsThinking;
}

/**
 * Make a JSON-mode request with automatic retry and key rotation
 */
export async function generateJSON<T = any>(
  config: GenAIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const { modelId, temperature = 0.7, maxOutputTokens = 8000, thinkingMode, profile, useModelFallback = false, preferStreaming = false } = config;
  const normalizedModelId = normalizeModelId(modelId);
  
  console.log(`💬 [CONTENT GENERATION] Original model ID: ${modelId}`);
  console.log(`💬 [CONTENT GENERATION] Normalized model ID: ${normalizedModelId}`);

  // Candidate models: by default ONLY the selected model.
  // If explicitly enabled via useModelFallback, try additional candidates for permission-restricted environments.
  const fallbackCandidates = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-1.5-flash',
    'gemini-2.5-flash-lite-preview-06-17',
    'gemini-2.0-flash-lite-preview-12-18',
    'gemini-1.5-flash-lite-preview',
  ];
  const modelCandidates = useModelFallback
    ? Array.from(new Set([normalizedModelId, ...fallbackCandidates])).filter(Boolean)
    : [normalizedModelId];

  const manager = new GeminiKeyManager(profile || null);
  const allKeys = manager.getAllKeys();
  try { console.log(`[CONTENT DEBUG] useModelFallback=${useModelFallback} candidates=${modelCandidates.join(',')} keys=${allKeys.length}`); } catch {}
  
  let attempts = 0;
  const maxRetries = Math.min(5, allKeys.length);
  let permissionOnlyKeys = 0;
  let quotaErrors = 0;

  while (attempts < maxRetries) {
    const key = manager.getActiveKey();
    if (!key) {
      throw new AppError('NO_KEYS', 400, 'No Gemini API keys available');
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });

      const baseModelConfig: any = {
        temperature,
        maxOutputTokens,
        responseMimeType: 'application/json',
      };

      const fullPrompt = systemPrompt + '\n\n' + userPrompt;
      // Try primary + fallback models with the SAME key if permission/403 restrictions occur
      let lastPermissionErr: any = null;
      for (const candidate of modelCandidates) {
        try {
          let responseText = '';
          console.log(`📡 [CONTENT API CALL] Calling AI with model: ${candidate}`);
          const modelConfig: any = { ...baseModelConfig };
          if (modelSupportsThinking(candidate)) {
            if (thinkingMode === 'none') {
              modelConfig.thinkingConfig = { thinkingBudget: 0 };
            } else if (thinkingMode === 'default') {
              modelConfig.thinkingConfig = { thinkingBudget: -1 };
            }
          }
          if (preferStreaming) {
            await __acquireSlot();
            try {
              const stream = await ai.models.generateContentStream({
                model: candidate,
                config: modelConfig,
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              });
              for await (const chunk of stream as any) {
                if (typeof chunk?.text === 'string') {
                  responseText += chunk.text;
                }
              }
            } catch (_streamErr) {
              try {
                console.log(`📡 [CONTENT API FALLBACK] Streaming failed, using non-streaming with model: ${candidate}`);
                const result = await ai.models.generateContent({
                  model: candidate,
                  config: modelConfig,
                  contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                });
                responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || JSON.stringify(result);
              } finally {
                __releaseSlot();
              }
            } finally {
              __releaseSlot();
            }
          } else {
            await __acquireSlot();
            try {
              const result = await ai.models.generateContent({
                model: candidate,
                config: modelConfig,
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              });
              responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || JSON.stringify(result);
            } finally {
              __releaseSlot();
            }
          }

          manager.reportSuccess(key);
          console.log(`✅ [CONTENT GENERATION] Success with model: ${candidate}`);
          try {
            return JSON.parse(responseText) as T;
          } catch (parseErr) {
            throw new AppError('BAD_AI_RESPONSE', 502, 'AI response parsing failed');
          }
        } catch (innerErr: any) {
          const msg = (innerErr?.message || '').toLowerCase();
          const code = innerErr?.code || innerErr?.status || innerErr?.error?.code || innerErr?.error?.status;
          const isPermission = (
            msg.includes('permission_denied') ||
            msg.includes('forbidden') ||
            msg.includes('leaked') ||
            msg.includes('api key') ||
            String(code).includes('403')
          );

          if (isPermission) {
            lastPermissionErr = innerErr;
            console.log(`🔐 [CONTENT MODEL FALLBACK] Permission/Key error on model: ${candidate}. Trying next model with same key.`);
            continue; // try next candidate model with SAME key
          }

          // Non-permission errors should be handled by outer catch (quota, 429/503, etc.)
          throw innerErr;
        }
      }

      if (lastPermissionErr) {
        attempts++;
        if (useModelFallback) {
          manager.reportInvalidKey(key);
        }
        permissionOnlyKeys++;
        console.log(`Permission error for selected model with current key. Trying next key.`);
        continue;
      }
      throw new AppError('UNKNOWN', 500, 'একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } catch (err: any) {
      attempts++;
      const msg = (err?.message || '').toLowerCase();
      const code = err?.code || err?.status || err?.error?.code || err?.error?.status;

      // Quota/availability issues → cool off and try next key
      if (
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('resource_exhausted') ||
        msg.includes('unavailable') ||
        msg.includes('overloaded') ||
        msg.includes('rate limit') ||
        msg.includes('quota') ||
        msg.includes('insufficient_quota')
      ) {
        quotaErrors++;
        manager.reportQuotaError(key);
        console.log(`Quota error, retrying with next key (attempt ${attempts}/${maxRetries})`);
        continue;
      }

      // Invalid/leaked/forbidden key → permanently exclude and try next
      if (
        msg.includes('api key') ||
        msg.includes('permission_denied') ||
        msg.includes('forbidden') ||
        msg.includes('leaked') ||
        String(code).includes('403')
      ) {
        if (useModelFallback) {
          manager.reportInvalidKey(key);
        } else {
          permissionOnlyKeys++;
        }
        console.log(`Permission error for selected model with current key. Trying next key.`);
        continue;
      }

      // Other errors - map centrally, but treat UNKNOWN as retryable overload
      try {
        const classified = classifyError(err);
        if (classified.code === 'UNKNOWN') {
          manager.reportQuotaError(key);
          console.warn(`[CONTENT API RETRYABLE] Unknown error treated as RATE_LIMIT; rotating key (attempt ${attempts}/${maxRetries})`);
          continue;
        }
        throw classified;
      } catch (e) {
        throw e;
      }
    }
  }

  if (permissionOnlyKeys >= maxRetries && maxRetries > 0) {
    throw new AppError('PERMISSION', 403, 'Selected model not permitted for available API key(s).');
  }
  if (quotaErrors > 0) {
    throw new AppError('RATE_LIMIT', 503, 'Service temporarily overloaded or quota exhausted.');
  }
  throw new AppError('AI_EXHAUSTED', 503, 'All API keys exhausted');
}

/**
 * Make a text-mode request with automatic retry
 */
export async function generateText(
  config: GenAIConfig,
  prompt: string
): Promise<string> {
  const { modelId, temperature = 0.7, maxOutputTokens = 2000, thinkingMode, profile } = config;
  const normalizedModelId = normalizeModelId(modelId);

  const manager = new GeminiKeyManager(profile || null);
  const allKeys = manager.getAllKeys();
  
  let attempts = 0;
  const maxRetries = Math.min(5, allKeys.length);

  while (attempts < maxRetries) {
    const key = manager.getActiveKey();
    if (!key) {
      throw new AppError('NO_KEYS', 400, 'No Gemini API keys available');
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      
      const config: any = {
        temperature,
        maxOutputTokens,
      };

      if (modelSupportsThinking(normalizedModelId)) {
        if (thinkingMode === 'none') {
          config.thinkingConfig = { thinkingBudget: 0 };
        } else if (thinkingMode === 'default') {
          config.thinkingConfig = { thinkingBudget: -1 };
        }
      }

      let responseText = '';
      try {
        const stream = await ai.models.generateContentStream({
          model: normalizedModelId,
          config: {
            temperature,
            maxOutputTokens,
            tools: [{ googleSearch: {} }],
            ...(modelSupportsThinking(normalizedModelId)
              ? thinkingMode === 'none'
                ? { thinkingConfig: { thinkingBudget: 0 } }
                : thinkingMode === 'default'
                ? { thinkingConfig: { thinkingBudget: -1 } }
                : {}
              : {}),
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        for await (const chunk of stream as any) {
          if (typeof chunk?.text === 'string') responseText += chunk.text;
        }
      } catch (_streamErr) {
        const result = await ai.models.generateContent({
          model: normalizedModelId,
          config: {
            temperature,
            maxOutputTokens,
            tools: [{ googleSearch: {} }],
            ...(modelSupportsThinking(normalizedModelId)
              ? thinkingMode === 'none'
                ? { thinkingConfig: { thinkingBudget: 0 } }
                : thinkingMode === 'default'
                ? { thinkingConfig: { thinkingBudget: -1 } }
                : {}
              : {}),
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || JSON.stringify(result);
      }

      manager.reportSuccess(key);
      
      return responseText;
    } catch (err: any) {
      attempts++;
      const msg = (err?.message || '').toLowerCase();
      const code = err?.code || err?.status || err?.error?.code || err?.error?.status;

      if (
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('resource_exhausted') ||
        msg.includes('unavailable') ||
        msg.includes('overloaded')
      ) {
        manager.reportQuotaError(key);
        console.log(`Quota error, retrying with next key (attempt ${attempts}/${maxRetries})`);
        continue;
      }

      if (
        msg.includes('api key') ||
        msg.includes('permission_denied') ||
        msg.includes('forbidden') ||
        msg.includes('leaked') ||
        String(code).includes('403')
      ) {
        manager.reportInvalidKey(key);
        console.log(`Permission/Key error (possibly leaked/invalid). Rotating to next key.`);
        continue;
      }

      throw classifyError(err);
    }
  }

  throw new AppError('AI_EXHAUSTED', 503, 'All API keys exhausted');
}

