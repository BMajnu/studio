import { GeminiClient } from '../ai/gemini-client';
import { UserProfile, ThinkingMode } from '@/lib/types';

// Configuration type for AI service
export type AIServiceConfig = {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  profile?: UserProfile | null;
  thinkingMode?: ThinkingMode;
};

// Common response format
export type AIResponse = {
  text: string;
};

/**
 * Google AI Service that uses GeminiClient with auto-retry and key rotation.
 * Simplified to use only @google/genai SDK through GeminiClient.
 */
export class GoogleAIService {
  private readonly config: AIServiceConfig;
  private readonly client: GeminiClient;

  constructor(config: AIServiceConfig) {
    this.config = {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: 'text/plain',
      ...config,
    };
    
    // Instantiate GeminiClient with profile for API key management
    this.client = new GeminiClient({ profile: this.config.profile ?? null });
  }

  /**
   * Generate content using the provided prompt.
   */
  async generateContent(prompt: string): Promise<AIResponse> {
    if (!this.config.profile) {
      throw new Error("AI Service requires a user profile for API key management.");
    }

    try {
      // This service is ONLY used by title generation (via generate-chat-title-flow)
      console.log(`🏷️  [GoogleAIService - TITLE ONLY] Generating with model: ${this.config.modelId}`);
      
      // Use GeminiClient request method for non-streaming
      const { data } = await this.client.request(async (apiKey) => {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const config: any = {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxOutputTokens,
          responseMimeType: this.config.responseMimeType,
        };
        
        // Apply thinking only when supported; keep defaults otherwise
        if (this.config.thinkingMode === 'none') {
          config.thinkingConfig = { thinkingBudget: 0 };
        } else if (this.config.thinkingMode === 'default') {
          config.thinkingConfig = { thinkingBudget: -1 };
        }
        
        const result = await ai.models.generateContent({
          model: this.config.modelId,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config,
        });
        
        return result.text || '';
      });
      
      return { text: data };
    } catch (error) {
      console.error(`AI generation failed (model: ${this.config.modelId}):`, error);
      throw error;
    }
  }

  /**
   * Generate content using streaming with auto-retry and key rotation.
   */
  async generateContentStream(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.config.profile) {
      throw new Error("AI Service requires a user profile for API key management.");
    }

    try {
      const stream = this.client.generateContentStream(
        this.config.modelId,
        { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
        this.config.thinkingMode
      );

      for await (const chunk of stream) {
        const text = (chunk as any).text();
        if (text) {
          onChunk(text);
        }
      }
    } catch (error) {
      console.error(`Error during streaming (model: ${this.config.modelId}):`, error);
      throw error;
    }
  }
}
