import { GeminiKeyManager } from './gemini-key-manager';
import { UserProfile, ThinkingMode } from '@/lib/types';
import { GoogleGenAI } from '@google/genai';
import { AppError, classifyError } from '@/lib/errors';

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
    request: any,
    thinkingMode: ThinkingMode = 'default'
  ): AsyncGenerator<any> {
    const key = this.manager.getActiveKey();
    if (!key) {
      throw new AppError('NO_KEYS', 400, 'No active Gemini API key available.');
    }

    const ai = new GoogleGenAI({ apiKey: key });
    
    const config: any = {};
    if (thinkingMode === 'none') {
      config.thinkingConfig = { thinkingBudget: 0 };
    } else if (thinkingMode === 'default') {
      config.thinkingConfig = { thinkingBudget: -1 }; // Maximum thinking budget
    }
    // For other modes, use model's default

    try {
      const response = await ai.models.generateContentStream({
        model: modelId,
        config,
        contents: request.contents || [],
        ...request
      });
      
      for await (const chunk of response) {
        yield chunk;
      }
      this.manager.reportSuccess(key);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';
      if (msg.includes('429') || msg.includes('503') || msg.includes('resource_exhausted') || msg.includes('unavailable') || msg.includes('overloaded') || msg.includes('rate limit') || msg.includes('quota') || msg.includes('insufficient_quota')) {
        this.manager.reportQuotaError(key);
        if (this.autoRotate) {
          // Simple retry logic: try next key once.
          yield* this.generateContentStream(modelId, request, thinkingMode);
          return;
        }
      }
      const code = err?.code || err?.status || err?.error?.code || err?.error?.status;
      if (msg.includes('api key') || msg.includes('permission_denied') || msg.includes('forbidden') || msg.includes('leaked') || String(code).includes('403')) {
        this.manager.reportInvalidKey(key);
        if (this.autoRotate) {
          yield* this.generateContentStream(modelId, request, thinkingMode);
          return;
        }
      }
      throw classifyError(err);
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
        throw new AppError('NO_KEYS', 400, 'No Gemini API keys available (all cooling down or invalid)');
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

        const codeVar = err?.code || err?.status || err?.error?.code || err?.error?.status;
        if (msg.includes('api key') || msg.includes('permission_denied') || msg.includes('forbidden') || msg.includes('leaked') || String(codeVar).includes('403')) {
          this.manager.reportInvalidKey(key);
          if (!this.autoRotate) throw err;
          continue; // retry with next key
        }

        // Detect invalid key error (400 variants)
        if (msg.includes('400') && (msg.includes('api key not valid') || msg.includes('invalid api key'))) {
          this.manager.reportInvalidKey(key);
          if (!this.autoRotate) throw err;
          continue; // retry with next key
        }

        // other error types – map centrally
        throw classifyError(err);
      }
    }
    if (lastError) {
      throw classifyError(lastError);
    }
    throw new AppError('AI_EXHAUSTED', 503, 'All Gemini keys exhausted');
  }
}