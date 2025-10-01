import { GoogleGenAI } from '@google/genai';
import { GeminiKeyManager } from './gemini-key-manager';
import { UserProfile } from '@/lib/types';
import mime from 'mime';

export interface GeneratedImageData {
  data: string; // base64
  mimeType: string;
}

export interface ImageGenResult {
  images: GeneratedImageData[];
  textResponse?: string;
}

/**
 * Gemini Image Generation Client with auto-retry and key rotation.
 * Supports models like gemini-2.5-flash-image-preview that can generate images.
 */
export class GeminiImageGenClient {
  private manager: GeminiKeyManager;
  private userId?: string;

  constructor(profile: UserProfile | null) {
    this.manager = new GeminiKeyManager(profile);
    this.userId = profile?.userId;
  }

  /**
   * Generate images using Gemini with responseModalities: ['IMAGE', 'TEXT']
   * Auto-retries with different API keys on quota/rate limit errors.
   */
  async generateImages(
    modelId: string,
    prompt: string,
    maxAttempts = 5
  ): Promise<ImageGenResult> {
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
        const ai = new GoogleGenAI({ apiKey: key });
        
        const config: any = {
          responseModalities: ['IMAGE', 'TEXT'],
        };

        const contents = [
          {
            role: 'user' as const,
            parts: [{ text: prompt }],
          },
        ];

        const response = await ai.models.generateContent({
          model: modelId,
          config,
          contents,
        });

        // Parse response for images and text
        const images: GeneratedImageData[] = [];
        let textResponse = '';

        if (response.candidates && response.candidates[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if ((part as any).inlineData) {
              const inlineData = (part as any).inlineData;
              images.push({
                data: inlineData.data || '',
                mimeType: inlineData.mimeType || 'image/png',
              });
            } else if ((part as any).text) {
              textResponse += (part as any).text;
            }
          }
        }

        this.manager.reportSuccess(key);
        
        if (this.userId && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`desainr_active_gemini_key_${this.userId}`, key);
          } catch {}
        }

        return { images, textResponse };
      } catch (err: any) {
        attempts++;
        lastError = err;
        const msg = err?.message?.toLowerCase() || '';

        // Detect quota / availability errors
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
          this.manager.reportQuotaError(key);
          console.log(`Image gen quota error with key ${key.substring(0, 10)}..., trying next key`);
          continue; // retry with next key
        }

        // Detect invalid key error
        if (msg.includes('400') && (msg.includes('api key not valid') || msg.includes('invalid api key'))) {
          this.manager.reportInvalidKey(key);
          console.log(`Invalid API key detected, trying next key`);
          continue; // retry with next key
        }

        // other error types – rethrow immediately
        throw err;
      }
    }

    if (lastError) {
      throw lastError;
    }

    const e: any = new Error('All Gemini keys exhausted for image generation');
    e.code = 'AI_EXHAUSTED';
    e.status = 503;
    throw e;
  }

  /**
   * Generate images with streaming support (for progress updates)
   */
  async *generateImagesStream(
    modelId: string,
    prompt: string
  ): AsyncGenerator<{ images?: GeneratedImageData[]; text?: string }> {
    const key = this.manager.getActiveKey();
    if (!key) {
      throw new Error('No active Gemini API key available.');
    }

    const ai = new GoogleGenAI({ apiKey: key });

    const config: any = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const contents = [
      {
        role: 'user' as const,
        parts: [{ text: prompt }],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model: modelId,
        config,
        contents,
      });

      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
          continue;
        }

        const images: GeneratedImageData[] = [];
        let text = '';

        for (const part of chunk.candidates[0].content.parts) {
          if ((part as any).inlineData) {
            const inlineData = (part as any).inlineData;
            images.push({
              data: inlineData.data || '',
              mimeType: inlineData.mimeType || 'image/png',
            });
          } else if ((part as any).text) {
            text += (part as any).text;
          }
        }

        yield { 
          images: images.length > 0 ? images : undefined,
          text: text || undefined
        };
      }

      this.manager.reportSuccess(key);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';
      if (
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('resource_exhausted') ||
        msg.includes('unavailable') ||
        msg.includes('overloaded') ||
        msg.includes('rate limit')
      ) {
        this.manager.reportQuotaError(key);
        // Retry with next key
        yield* this.generateImagesStream(modelId, prompt);
        return;
      }
      throw err;
    }
  }

  /**
   * Save generated image to file system (helper for Node.js environments)
   */
  static async saveImageToFile(_imageData: GeneratedImageData, _fileName: string): Promise<string> {
    // Intentionally a no-op in browser bundles to avoid pulling Node.js 'fs'
    // If you need to save to disk on the server, implement a server-only helper.
    throw new Error('saveImageToFile is server-only and not available in the browser');
  }

  /**
   * Convert image data to Data URL for browser display
   */
  static imageToDataUrl(imageData: GeneratedImageData): string {
    return `data:${imageData.mimeType};base64,${imageData.data}`;
  }
}

