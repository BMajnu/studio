import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import { FirebaseApp } from 'firebase/app';
// Trying a more direct Firebase AI import, assuming firebase v10+
import { getGenerativeModel as getFirebaseAISdkModel, getAI as getFirebaseAIInstance } from "firebase/ai"; // Simpler import path if available
import type { VertexAI } from "firebase/ai"; // Type import

// Configuration type for AI service
export type AIServiceConfig = {
  apiKey?: string; // Optional: Still needed for direct Google SDK fallbacks
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  useFirebaseAI?: boolean;
  useAlternativeImpl?: boolean; // For @google/genai as a fallback
  firebaseApp?: FirebaseApp; // Optional: Needed if useFirebaseAI is true
};

// Common response format regardless of implementation used
export type AIResponse = {
  text: string;
};

/**
 * Google AI Service that handles multiple implementation versions with fallbacks:
 * 1. Firebase AI (if configured and firebaseApp provided)
 * 2. @google/genai (alternative Google SDK)
 * 3. @google/generative-ai (original Google SDK)
 */
export class GoogleAIService {
  private readonly config: AIServiceConfig;
  private firebaseAI?: any; // Using any for now due to import issues, will cast later

  constructor(config: AIServiceConfig) {
    this.config = {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: 'text/plain',
      ...config,
    };

    if (this.config.useFirebaseAI && this.config.firebaseApp) {
      try {
        this.firebaseAI = getFirebaseAIInstance(this.config.firebaseApp);
      } catch (error) {
        console.error("Failed to initialize Firebase AI SDK:", error);
        // Proceed without Firebase AI if initialization fails
        this.config.useFirebaseAI = false; 
      }
    }
  }

  /**
   * Generate content using the provided prompt with fallback logic.
   */
  async generateContent(prompt: string): Promise<AIResponse> {
    if (this.config.useFirebaseAI && this.firebaseAI) {
      try {
        console.log(`Attempting content generation with Firebase AI (model: ${this.config.modelId})`);
        return await this.generateWithFirebaseAI(prompt, this.firebaseAI as VertexAI);
      } catch (error) {
        console.warn(`Firebase AI generation failed (model: ${this.config.modelId}). Error: ${error}. Falling back...`);
        // Fallback proceeds in the order defined below
      }
    }

    if (this.config.useAlternativeImpl && this.config.apiKey) {
      try {
        console.log(`Attempting content generation with @google/genai (model: ${this.config.modelId})`);
        return await this.generateWithAlternativeGoogle(prompt);
      } catch (error) {
        console.warn(`@google/genai generation failed (model: ${this.config.modelId}). Error: ${error}. Falling back...`);
      }
    }

    if (this.config.apiKey) {
      try {
        console.log(`Attempting content generation with @google/generative-ai (model: ${this.config.modelId})`);
        return await this.generateWithOriginalGoogle(prompt);
      } catch (error) {
        console.error(`All AI generation methods failed (model: ${this.config.modelId}). Last error with @google/generative-ai: ${error}`);
        throw error; // Re-throw the last error if all fallbacks fail
      }
    }
    
    console.error(`AI Service: No valid API key or Firebase setup provided for model ${this.config.modelId}.`);
    throw new Error("AI Service not configured. No API key or Firebase app.");
  }

  /**
   * Generate content with Firebase AI.
   */
  private async generateWithFirebaseAI(prompt: string, firebaseAIInstance: VertexAI): Promise<AIResponse> {
    // Note: The modelId for Firebase AI might need to be just the name, e.g., 'gemini-1.5-flash'
    // Ensure your modelId in constants.ts is compatible or transformed before this call if needed.
    const model = getFirebaseAISdkModel(firebaseAIInstance, {
      model: this.config.modelId, // This model ID needs to be compatible with Firebase Vertex AI
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens,
        responseMimeType: this.config.responseMimeType,
      },
    });

    const chat = model.startChat({ history: [] }); 
    const result = await chat.sendMessage(prompt);
    return {
      text: result.response.text() || '',
    };
  }

  /**
   * Generate content with the @google/genai (alternative) implementation.
   */
  private async generateWithAlternativeGoogle(prompt: string): Promise<AIResponse> {
    if (!this.config.apiKey) throw new Error("API Key missing for @google/genai");
    const ai = new GoogleGenAI({ apiKey: this.config.apiKey });
    
    // Define the config object for @google/genai
    const genAIConfig = {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens,
        responseMimeType: this.config.responseMimeType,
        // safetySettings: [] // Add if needed
    };

    const result = await ai.models.generateContent({
      model: this.config.modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: genAIConfig, // Pass the config object here
    });
    return { text: result.text || '' }; // Access text as a property
  }

  /**
   * Generate content with the original @google/generative-ai implementation.
   */
  private async generateWithOriginalGoogle(prompt: string): Promise<AIResponse> {
    if (!this.config.apiKey) throw new Error("API Key missing for @google/generative-ai");
    const genAI = new GoogleGenerativeAI(this.config.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.config.modelId,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens,
        responseMimeType: this.config.responseMimeType || 'text/plain',
      },
    });

    const result = await model.generateContent(
      {contents: [{ role: 'user', parts: [{ text: prompt }] }]}
    );
    return { text: result.response.text() }; // This SDK has response.text()
  }

  /**
   * Generate content using streaming with fallback logic.
   * Note: Streaming is primarily implemented for @google/genai.
   * Firebase AI streaming is different; direct Google SDK streaming is also different.
   * This function will prioritize @google/genai if useAlternativeImpl is true.
   * Otherwise, it falls back to a non-streaming call via the main generateContent method.
   */
  async generateContentStream(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // Firebase AI streaming has a different pattern (model.generateContentStream)
    // For simplicity in this refactor, if Firebase is primary, we'll use its non-streaming version
    // or fallback to Google GenAI if that's preferred for streaming.
    
    if (this.config.useFirebaseAI && this.firebaseAI) {
       try {
        console.log(`Attempting stream (via non-streaming Firebase AI then chunking) (model: ${this.config.modelId})`);
        const response = await this.generateWithFirebaseAI(prompt, this.firebaseAI as VertexAI);
        onChunk(response.text); // Simulate single chunk for non-streaming
        return;
      } catch (error) {
        console.warn(`Firebase AI (simulated stream) failed (model: ${this.config.modelId}). Error: ${error}. Falling back...`);
      }
    }
    
    // Prioritize @google/genai for streaming if enabled
    if (this.config.useAlternativeImpl && this.config.apiKey) {
      try {
        console.log(`Attempting stream with @google/genai (model: ${this.config.modelId})`);
        const ai = new GoogleGenAI({ apiKey: this.config.apiKey });
        
        // Define the config object for @google/genai stream
        const genAIConfigStream = {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxOutputTokens,
            responseMimeType: this.config.responseMimeType,
            // safetySettings: [] // Add if needed
        };

        const streamResult = await ai.models.generateContentStream({
          model: this.config.modelId, 
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: genAIConfigStream, // Pass the config object here
        });
        for await (const chunk of streamResult) { 
          onChunk(chunk.text || ''); // Access text as a property
        }
        return;
      } catch (error) {
        console.warn(`@google/genai streaming failed (model: ${this.config.modelId}). Error: ${error}. Falling back...`);
      }
    }

    // Fallback to original Google SDK (non-streaming, single chunk)
    if (this.config.apiKey) {
        try {
            console.log(`Attempting stream (via non-streaming @google/generative-ai then chunking) (model: ${this.config.modelId})`);
            const response = await this.generateWithOriginalGoogle(prompt);
            onChunk(response.text); // Simulate single chunk
            return;
        } catch (error) {
            console.error(`All AI streaming methods failed (model: ${this.config.modelId}). Last error with @google/generative-ai: ${error}`);
            throw error;
        }
    }
    
    console.error(`AI Service (Stream): No valid API key or Firebase setup for model ${this.config.modelId}.`);
    throw new Error("AI Service not configured for streaming. No API key or Firebase app.");
  }
} 