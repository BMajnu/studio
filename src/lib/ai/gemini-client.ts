import { GeminiKeyManager } from './gemini-key-manager';
import { UserProfile, ThinkingMode } from '@/lib/types';
import {
  GoogleGenerativeAI,
  GenerateContentRequest,
  Content,
  GenerateContentResponse,
} from '@google/generative-ai';

export type GeminiRequestFn<T> = (apiKey: string) => Promise<T>;

interface GeminiClientOptions {
  profile: UserProfile | null;
  autoRotate?: boolean;
}

export class GeminiClient {
  private manager: GeminiKeyManager;
  private autoRotate: boolean;
  private userId?: string;

  constructor({ profile, autoRotate = true }: GeminiClientOptions) {
    this.manager = new GeminiKeyManager(profile);
    this.autoRotate = autoRotate;
    this.userId = profile?.userId;

    // Removed environment key fallback to ensure only user-provided keys are used
  }

  /**
   * Generates content stream using @google/genai, with key rotation.
   */
  async *generateContentStream(
    modelId: string,
    request: Omit<GenerateContentRequest, 'model'>,
    thinkingMode: ThinkingMode = 'default'
  ): AsyncGenerator<GenerateContentResponse> {
    const key = this.manager.getActiveKey();
    if (!key) {
      throw new Error('No active Gemini API key available.');
    }

    const ai = new GoogleGenerativeAI(key);
    
    const config: any = {};
    if (thinkingMode === 'none') {
      config.thinkingConfig = { thinkingBudget: 0 };
    }
    // For 'default', we send no thinkingConfig to use the model's default.

    const model = ai.getGenerativeModel({ model: modelId });

    try {
      const result = await model.generateContentStream({ ...request, ...config });
      for await (const chunk of result.stream) {
        yield chunk;
      }
      this.manager.reportSuccess(key);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';
       if (msg.includes('429') || msg.includes('503') || msg.includes('resource_exhausted') || msg.includes('unavailable') || msg.includes('overloaded') || msg.includes('rate limit')) {
        this.manager.reportQuotaError(key);
        if (this.autoRotate) {
          // Simple retry logic: try next key once.
          yield* this.generateContentStream(modelId, request, thinkingMode);
          return;
        }
      }
      throw err;
    }
  }

  /**
   * Executes requestFn with active key, auto-retrying with next keys on quota error.
   */
  async request<T>(requestFn: GeminiRequestFn<T>, maxAttempts = 5): Promise<{ data: T; apiKeyUsed: string }> {
    let attempts = 0;
    let lastError: any;

    const allKeys = this.manager.getAllKeys();
    const maxRetries = Math.min(maxAttempts, allKeys.length);

    while (attempts < maxRetries) {
      const key = this.manager.getActiveKey();
      if (!key) {
        throw new Error('No Gemini API keys available (all cooling down or invalid)');
      }
      try {
        const data = await requestFn(key);
        this.manager.reportSuccess(key);
        if (this.userId && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`desainr_active_gemini_key_${this.userId}`, key);
          } catch {}
        }
        return { data, apiKeyUsed: key };
      } catch (err: any) {
        attempts++;
        lastError = err;
        const msg = err?.message?.toLowerCase() || '';

        // Detect quota / availability errors (429, 503, RESOURCE_EXHAUSTED, UNAVAILABLE, OVERLOADED, RATE LIMIT)
        if (msg.includes('429') || msg.includes('503') || msg.includes('resource_exhausted') || msg.includes('unavailable') || msg.includes('overloaded') || msg.includes('rate limit') || msg.includes('quota') || msg.includes('insufficient_quota')) {
          this.manager.reportQuotaError(key);
          // Tag exhaustion/quota-like errors for upstream handling
          try {
            (err as any).code = (err as any).code || 'AI_EXHAUSTED';
            (err as any).status = (err as any).status || 503;
          } catch {}
          if (!this.autoRotate) throw err;
          continue; // retry with next key
        }
        
        // Detect invalid key error
        if (msg.includes('400') && (msg.includes('api key not valid') || msg.includes('invalid api key'))) {
          this.manager.reportInvalidKey(key);
          if (!this.autoRotate) throw err;
          continue; // retry with next key
        }

        // other error types – rethrow immediately
        throw err;
      }
    }
    if (lastError) {
      // Ensure lastError is tagged if it looks like exhaustion
      try {
        const lm = lastError?.message?.toLowerCase?.() || '';
        if (lm.includes('429') || lm.includes('503') || lm.includes('resource_exhausted') || lm.includes('unavailable') || lm.includes('overloaded') || lm.includes('rate limit') || lm.includes('quota') || lm.includes('insufficient_quota') || lm.includes('all gemini keys exhausted')) {
          (lastError as any).code = (lastError as any).code || 'AI_EXHAUSTED';
          (lastError as any).status = (lastError as any).status || 503;
        }
      } catch {}
      throw lastError;
    }
    const e: any = new Error('All Gemini keys exhausted');
    e.code = 'AI_EXHAUSTED';
    e.status = 503;
    throw e;
  }
} 