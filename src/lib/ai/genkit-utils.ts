import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Returns a fresh Genkit AI instance configured with the given Gemini API key.
 * Use this when rotating keys via GeminiClient so each request gets its own
 * instance without mutating global state.
 */
export function createGeminiAiInstance(apiKey: string) {
  return genkit({ plugins: [googleAI({ apiKey })] });
} 