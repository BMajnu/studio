import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Cache instances per API key to avoid heavy per-request initialization
const instanceCache = new Map<string, ReturnType<typeof genkit>>();

/**
 * Returns a cached Genkit AI instance configured with the given Gemini API key.
 * Avoids re-initializing plugins on every request.
 */
export function getOrCreateGeminiAiInstance(apiKey: string) {
  let inst = instanceCache.get(apiKey);
  if (!inst) {
    inst = genkit({ plugins: [googleAI({ apiKey })] });
    instanceCache.set(apiKey, inst);
  }
  return inst;
}

/**
 * Legacy helper: returns a fresh instance. Prefer getOrCreateGeminiAiInstance.
 */
export function createGeminiAiInstance(apiKey: string) {
  return genkit({ plugins: [googleAI({ apiKey })] });
}