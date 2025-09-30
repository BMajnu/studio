'use server';
/**
 * @fileOverview Genkit flow to process designer's custom instruction relative to a client's message.
 *
 * - processCustomInstructionFlow - Runs a structured prompt to follow the designer's instruction
 * - ProcessCustomInstructionFlowInput - Input type
 * - ProcessCustomInstructionFlowOutput - Output type
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { getOrCreateGeminiAiInstance } from '@/lib/ai/genkit-utils';

// DEBUG helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[processCustomInstructionFlow] ${label}`, ...args); } catch(_) {}
};

const AttachedFileSchema = z.object({
  name: z.string().describe('Name of the file'),
  type: z.string().describe('MIME type of the file'),
  dataUri: z.string().optional().describe('Base64 data URI for image files; will be referenced with «media url=…»'),
  textContent: z.string().optional().describe('Text content for text files'),
  dimensions: z.object({ width: z.number().optional(), height: z.number().optional() }).optional()
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
  timestamp: z.number().optional()
});

// Flow input (includes modelId and userApiKey)
const ProcessCustomInstructionFlowInputSchema = z.object({
  clientMessage: z.string().describe("Original client message/content"),
  customInstruction: z.string().describe("Designer instruction describing how to respond"),
  userName: z.string().optional().describe("Designer name for tone/context"),
  professionalTitle: z.string().optional().describe("Professional title used to steer tone and expertise"),
  communicationStyleNotes: z.string().optional().describe("Notes about designer communication style"),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user"),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Recent chat history"),
  language: z.enum(['english','bengali','both']).optional().describe("Preferred output language(s)"),
  modelId: z.string().optional().describe('Genkit model to use'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key')
});
export type ProcessCustomInstructionFlowInput = z.infer<typeof ProcessCustomInstructionFlowInputSchema>;

// Prompt input (no model/user key)
const ProcessCustomInstructionPromptInputSchema = z.object({
  clientMessage: z.string(),
  customInstruction: z.string(),
  userName: z.string().optional(),
  professionalTitle: z.string().optional(),
  communicationStyleNotes: z.string().optional(),
  attachedFiles: z.array(AttachedFileSchema).optional(),
  chatHistory: z.array(ChatHistoryMessageSchema).optional(),
  language: z.enum(['english','bengali','both']).optional()
});

const ProcessCustomInstructionFlowOutputSchema = z.object({
  title: z.string().describe('Concise title summarizing the response'),
  response: z.string().describe('The response content following the custom instruction')
});
export type ProcessCustomInstructionFlowOutput = z.infer<typeof ProcessCustomInstructionFlowOutputSchema>;

export async function processCustomInstructionFlow(flowInput: ProcessCustomInstructionFlowInput): Promise<ProcessCustomInstructionFlowOutput> {
  const flowName = 'processCustomInstructionFlow';
  logDebug('Starting flow');

  const { modelId = DEFAULT_MODEL_ID, userApiKey, ...promptInputData } = flowInput;
  const modelToUse = modelId;

  // Prepare data for prompt: convert image dataUri for Genkit media
  const actualPromptInputData = {
    ...promptInputData,
    attachedFiles: promptInputData.attachedFiles?.map(f => ({
      ...f,
      // Use a non-template marker to avoid Handlebars parsing issues
      dataUri: f.dataUri ? `«media url=${f.dataUri}»` : undefined,
    }))
  };

  const promptText = `You are a creative AI assistant for designers. You'll receive:
1) A client message or text content
2) A custom instruction (what to do with that text)
3) Optional chat history and attached files for context

IMPORTANT: Follow the custom instruction PRECISELY. 
- If asked to TRANSLATE, translate the ENTIRE text completely (do not summarize or shorten)
- If asked to REFINE/REWRITE, transform the text directly (do not respond about it)
- If asked to SUMMARIZE, create a concise summary
- If asked to EXPLAIN, provide an explanation
- The "Client Message" is the INPUT TEXT to process, not a conversation message to respond to

Your job is to execute the instruction on the provided text and return the processed result.

If language preference is provided (english/bengali/both), write accordingly. If both, you may include both languages in sections.

If a designer name ({{{userName}}}) or communication style is given ({{{communicationStyleNotes}}}), keep the tone aligned.
If a professional title is provided ({{{professionalTitle}}}), implicitly adopt that role and domain expertise.

Attached files may include images referenced via «media url=…» tokens and/or text contents.

Respond with a concise title and the main response content. Do not include any extra metadata besides the required JSON fields.

Input Text:
{{{clientMessage}}}

Instruction to Follow:
{{{customInstruction}}}

{{#if chatHistory.length}}
Recent conversation (for context only):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

{{#if attachedFiles.length}}
Attached Files:
{{#each attachedFiles}}
- File: {{this.name}} ({{this.type}})
  {{#if this.dataUri}}
  Image: {{this.dataUri}}
  {{/if}}
  {{#if this.textContent}}
  Text Content:\n{{{this.textContent}}}
  {{/if}}
{{/each}}
{{/if}}

Return strictly as JSON matching this schema:
{
  "title": "Short title",
  "response": "Main response body following the designer's instruction"
}`;

  try {
    const profileStub = {
      userId: 'default',
      name: 'User',
      services: [],
      geminiApiKeys: userApiKey ? [userApiKey] : []
    } as any;

    const client = new GeminiClient({ profile: profileStub });

    // Cache prompt definitions per API key to avoid repeated definePrompt cost
    const promptCache = (globalThis as any).__desainr_prompt_cache__ as Map<string, any> | undefined;
    const ensureCache = () => {
      if (!(globalThis as any).__desainr_prompt_cache__) {
        (globalThis as any).__desainr_prompt_cache__ = new Map<string, any>();
      }
      return (globalThis as any).__desainr_prompt_cache__ as Map<string, any>;
    };

    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const cache = promptCache || ensureCache();
      const cacheKey = `${apiKey}|${flowName}`; // stable per key/flow
      let promptDef = cache.get(cacheKey);
      if (!promptDef) {
        const instance = getOrCreateGeminiAiInstance(apiKey);
        promptDef = instance.definePrompt({
          name: `${flowName}Prompt`,
          input: { schema: ProcessCustomInstructionPromptInputSchema },
          output: { schema: ProcessCustomInstructionFlowOutputSchema },
          prompt: promptText
        });
        cache.set(cacheKey, promptDef);
      }
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      return output;
    });

    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    return output as ProcessCustomInstructionFlowOutput;
  } catch (error: any) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    const e: any = new Error(`AI call failed in ${flowName}. ${error?.message || ''}`);
    try {
      if (error && typeof error === 'object') {
        if (error.code) e.code = error.code;
        if (error.status) e.status = error.status;
        const msg = String(error?.message || '').toLowerCase();
        if (!e.code && (msg.includes('resource_exhausted') || msg.includes('all gemini keys exhausted') || msg.includes('429') || msg.includes('503') || msg.includes('unavailable') || msg.includes('overloaded'))) {
          e.code = 'AI_EXHAUSTED';
          e.status = e.status || 503;
        }
      }
    } catch {}
    throw e;
  }
}
