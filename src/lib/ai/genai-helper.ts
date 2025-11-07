/**
 * Helper utilities for Google GenAI SDK
 * Replaces Genkit structured output with direct SDK calls
 */

import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '@/lib/types';
import { AVAILABLE_MODELS } from '@/lib/constants';
import { GeminiKeyManager } from './gemini-key-manager';

export interface GenAIConfig {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingMode?: 'default' | 'none';
  profile?: UserProfile | null;
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
  const { modelId, temperature = 0.7, maxOutputTokens = 8000, thinkingMode, profile } = config;
  const normalizedModelId = normalizeModelId(modelId);
  
  console.log(`💬 [CONTENT GENERATION] Original model ID: ${modelId}`);
  console.log(`💬 [CONTENT GENERATION] Normalized model ID: ${normalizedModelId}`);

  const manager = new GeminiKeyManager(profile || null);
  const allKeys = manager.getAllKeys();
  
  let attempts = 0;
  const maxRetries = Math.min(5, allKeys.length);

  while (attempts < maxRetries) {
    const key = manager.getActiveKey();
    if (!key) {
      throw new Error('No Gemini API keys available');
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });

      const modelConfig: any = {
        temperature,
        maxOutputTokens,
        responseMimeType: 'application/json',
      };

      if (modelSupportsThinking(modelId)) {
        if (thinkingMode === 'none') {
          modelConfig.thinkingConfig = { thinkingBudget: 0 };
        } else if (thinkingMode === 'default') {
          modelConfig.thinkingConfig = { thinkingBudget: -1 };
        }
      }

      const fullPrompt = systemPrompt + '\n\n' + userPrompt;

      // Prefer streaming API per latest SDK guidance
      let responseText = '';
      console.log(`📡 [CONTENT API CALL] Calling AI with model: ${normalizedModelId}`);
      try {
        const stream = await ai.models.generateContentStream({
          model: normalizedModelId,
          config: modelConfig,
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });

        for await (const chunk of stream as any) {
          // chunk.text is progressively built by the SDK
          if (typeof chunk?.text === 'string') {
            responseText += chunk.text;
          }
        }
      } catch (_streamErr) {
        // Fallback to non-streaming call for models that don't support streaming
        console.log(`📡 [CONTENT API FALLBACK] Streaming failed, using non-streaming with model: ${normalizedModelId}`);
        const result = await ai.models.generateContent({
          model: normalizedModelId,
          config: modelConfig,
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });
        responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || JSON.stringify(result);
      }

      manager.reportSuccess(key);
      console.log(`✅ [CONTENT GENERATION] Success with model: ${normalizedModelId}`);
      return JSON.parse(responseText) as T;
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
        msg.includes('overloaded')
      ) {
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
        manager.reportInvalidKey(key);
        console.log(`Permission/Key error (possibly leaked/invalid). Rotating to next key.`);
        continue;
      }

      // Other errors - rethrow
      throw err;
    }
  }

  throw new Error('All API keys exhausted');
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
      throw new Error('No Gemini API keys available');
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

      throw err;
    }
  }

  throw new Error('All API keys exhausted');
}

