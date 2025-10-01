/**
 * Helper utilities for Google GenAI SDK
 * Replaces Genkit structured output with direct SDK calls
 */

import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '@/lib/types';
import { GeminiKeyManager } from './gemini-key-manager';

export interface GenAIConfig {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingMode?: 'default' | 'none';
  profile?: UserProfile | null;
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
        // Note: Tools (like googleSearch) cannot be used with responseMimeType: 'application/json'
      };

      if (thinkingMode === 'none') {
        modelConfig.thinkingConfig = { thinkingBudget: 0 };
      } else if (thinkingMode === 'default') {
        modelConfig.thinkingConfig = { thinkingBudget: -1 };
      }

      const fullPrompt = systemPrompt + '\n\n' + userPrompt;

      // Prefer streaming API per latest SDK guidance
      let responseText = '';
      try {
        const stream = await ai.models.generateContentStream({
          model: modelId,
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
        const result = await ai.models.generateContent({
          model: modelId,
          config: modelConfig,
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });
        responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || JSON.stringify(result);
      }

      manager.reportSuccess(key);
      return JSON.parse(responseText) as T;
    } catch (err: any) {
      attempts++;
      const msg = err?.message?.toLowerCase() || '';

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

      if (msg.includes('400') && msg.includes('api key')) {
        manager.reportInvalidKey(key);
        console.log(`Invalid API key, trying next key`);
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

      if (thinkingMode === 'none') {
        config.thinkingConfig = { thinkingBudget: 0 };
      } else if (thinkingMode === 'default') {
        config.thinkingConfig = { thinkingBudget: -1 };
      }

      let responseText = '';
      try {
        const stream = await ai.models.generateContentStream({
          model: modelId,
          config: {
            temperature,
            maxOutputTokens,
            tools: [{ googleSearch: {} }],
            ...(thinkingMode === 'none'
              ? { thinkingConfig: { thinkingBudget: 0 } }
              : thinkingMode === 'default'
              ? { thinkingConfig: { thinkingBudget: -1 } }
              : {}),
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        for await (const chunk of stream as any) {
          if (typeof chunk?.text === 'string') responseText += chunk.text;
        }
      } catch (_streamErr) {
        const result = await ai.models.generateContent({
          model: modelId,
          config: {
            temperature,
            maxOutputTokens,
            tools: [{ googleSearch: {} }],
            ...(thinkingMode === 'none'
              ? { thinkingConfig: { thinkingBudget: 0 } }
              : thinkingMode === 'default'
              ? { thinkingConfig: { thinkingBudget: -1 } }
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
      const msg = err?.message?.toLowerCase() || '';

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

      if (msg.includes('400') && msg.includes('api key')) {
        manager.reportInvalidKey(key);
        console.log(`Invalid API key, trying next key`);
        continue;
      }

      throw err;
    }
  }

  throw new Error('All API keys exhausted');
}

