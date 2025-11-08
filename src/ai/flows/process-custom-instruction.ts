'use server';

/**
 * @fileOverview Processes custom user instructions for generating unique AI responses.
 * The flow takes a custom instruction from the user and applies it to the client message context.
 *
 * - processCustomInstruction - A function to process custom user instructions.
 * - ProcessCustomInstructionInput - The input type for the processCustomInstruction function.
 * - ProcessCustomInstructionOutput - The return type for the processCustomInstruction function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GoogleAIService } from '@/lib/services/google-ai-service';
import type { FirebaseApp } from 'firebase/app'; // Import FirebaseApp type
import { UserProfile } from '@/lib/types';
import { classifyError, AppError } from '@/lib/errors';

// Alternative import path for newer @google/genai package
// Used for reference to ensure compatibility
// import { GoogleGenAI } from '@google/genai';

export type ProcessCustomInstructionInput = {
  clientMessage: string;
  customInstruction: string;
  attachedFiles?: Array<{
    name: string;
    type: string;
    size?: number;
    textContent?: string;
    dimensions?: {
      width?: number;
      height?: number;
    };
  }>;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
    timestamp?: number;
  }>;
  language?: 'english' | 'bengali' | 'both';
  userName?: string;
  communicationStyleNotes?: string;
  userApiKey?: string;
  modelId?: string;
  profile?: UserProfile; // Add full profile
};

export type ProcessCustomInstructionOutput = {
  title: string;
  response: string;
};

/**
 * Formats model ID to ensure it's in the correct format for the Google Generative AI API
 */
function formatModelId(modelId: string): string {
  // Remove any 'googleai/' prefix if present
  let formattedId = modelId.replace(/^googleai\//, '');
  
  // Handle -latest suffix models
  if (formattedId.endsWith('-latest')) {
    // Remove -latest suffix and use the base model
    formattedId = formattedId.replace('-latest', '');
    console.log(`Removing '-latest' suffix from model ID: ${formattedId}`);
  }
  
  // List of known valid models that don't need modification
  const validModels = [
    'gemini-pro', 
    'gemini-1.0-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-ultra',
    // Preview/experimental models that should work
    'gemini-2.0-pro-exp',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-preview-image-generation',
    'gemini-2.5-flash-preview-04-17',
    'gemini-2.5-pro-exp-03-25',
    'gemini-2.5-pro-preview-05-06',
    'gemini-2.5-pro',
    'gemini-2.5-flash-preview-05-20'
  ];
  
  // If it's one of the known valid models, use it directly
  if (validModels.includes(formattedId)) {
    console.log(`Using selected model: ${formattedId}`);
    return formattedId;
  }
  
  // If the user has specifically chosen a preview or experimental model, respect that choice
  if (formattedId.includes('preview') || formattedId.includes('exp')) {
    console.log(`Using user-selected preview/experimental model: ${formattedId}`);
    return formattedId;
  }
  
  // Only fall back for unknown or unnamed models
  if (!formattedId || formattedId.trim() === '') {
    console.log(`Empty model ID provided, falling back to 'gemini-pro'`);
    return 'gemini-pro';
  }
  
  // Keep the original model ID if it doesn't match any known patterns
  console.log(`Using original model ID as-is: ${formattedId}`);
  return formattedId;
}

/**
 * Process a custom instruction from the designer to generate a unique response
 * based on the client's message and the designer's instruction.
 */
export async function processCustomInstruction(input: ProcessCustomInstructionInput): Promise<ProcessCustomInstructionOutput> {
  const { 
    clientMessage, 
    customInstruction, 
    attachedFiles, 
    chatHistory, 
    language = 'english', 
    userApiKey,
    modelId,
    profile, // Destructure profile
  } = input;
  
  // Format attached files information for the prompt
  let filesContext = '';
  if (attachedFiles && attachedFiles.length > 0) {
    filesContext = 'Attached files:\n' + attachedFiles.map((file) => {
      let fileInfo = `- ${file.name} (${file.type})`;
      if (file.textContent) {
        fileInfo += `\n  Content: ${file.textContent.substring(0, 500)}${file.textContent.length > 500 ? '...' : ''}`;
      }
      if (file.dimensions) {
        fileInfo += `\n  Dimensions: ${file.dimensions.width}x${file.dimensions.height}`;
      }
      return fileInfo;
    }).join('\n');
  }
  
  // Format chat history for context
  let historyContext = '';
  if (chatHistory && chatHistory.length > 0) {
    const relevantHistory = chatHistory.slice(-5); // Only use the most recent 5 messages for context
    historyContext = 'Recent conversation:\n' + relevantHistory.map((msg) => 
      `${msg.role.toUpperCase()}: ${msg.text.substring(0, 300)}${msg.text.length > 300 ? '...' : ''}`
    ).join('\n');
  }
  
  // Combine all context for the model
  const fullContext = `
You are a creative AI assistant for designers. You'll receive:
1. A client message (original request from the client)
2. A custom instruction from the designer (how to respond to the client)
3. Any attached files and chat history for context

Your job is to follow the designer's custom instruction precisely to create a response about the client's message.

For example:
- If the client asked for "a t-shirt design" and the designer's instruction is "Give a random idea for this",
  you should provide a creative, random t-shirt design idea.
- If the instruction is "Write a poem about this request", create a poem about the client's request.
- If the instruction is "List 5 questions to clarify this brief", generate 5 specific questions.

Be creative, helpful, and follow the designer's instruction exactly. Your response will be displayed in a special format
to distinguish it from standard responses.

Respond with:
1. A concise title that summarizes what you're providing (e.g., "Random T-shirt Design Idea", "Poem About Client's Request", "Clarification Questions")
2. The actual response following the custom instruction

Keep your response focused and directly addressing what was requested in the custom instruction.

CLIENT MESSAGE:
${clientMessage}

CUSTOM INSTRUCTION FROM DESIGNER:
${customInstruction}

${filesContext ? filesContext + '\n' : ''}
${historyContext ? historyContext + '\n' : ''}

Please follow the custom instruction precisely in relation to the client message.
`.trim();

  // Store the formatted model ID outside the try block so it's accessible in the catch block
  let formattedModelId = '';

  try {
    // Try to use the user's API key if provided, otherwise fall back to environment variable
    const apiKey = userApiKey || profile?.geminiApiKeys?.[0] || null;
    if (!apiKey) {
      throw new AppError('NO_KEYS', 400, 'No user API key configured. Please add your Gemini API key to your profile settings.');
    }
    
    // Format the model ID to ensure it's in the correct format
    const rawModelToUse = modelId || DEFAULT_MODEL_ID;
    formattedModelId = formatModelId(rawModelToUse);
    
    console.log(`Processing custom instruction using model: ${formattedModelId} (original: ${rawModelToUse})`);
    
    // Initialize the AI service with the appropriate configuration
    const aiService = new GoogleAIService({
      modelId: formattedModelId,
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: 'text/plain',
      profile, // Pass the full profile
      thinkingMode: profile?.thinkingMode, // Pass the thinking mode
    });
    
    // Generate content using the service
    const result = await aiService.generateContent(fullContext);
    const responseText = result.text;
    
    // Extract title and response
    let title = 'Custom Response';
    let response = responseText;
    
    // Try to extract a title if the response has a clear title format
    const titleMatch = responseText.match(/^#\s*(.*?)(?:\n|$)/) || 
                     responseText.match(/^Title:\s*(.*?)(?:\n|$)/) ||
                     responseText.match(/^(.*?)(?:\n|$)/);
    
    if (titleMatch) {
      title = titleMatch[1].trim();
      response = responseText.replace(titleMatch[0], '').trim();
    }
    
    return {
      title,
      response
    };
  } catch (error) {
    console.error('Error in processCustomInstruction:', error);
    throw classifyError(error);
  }
} 