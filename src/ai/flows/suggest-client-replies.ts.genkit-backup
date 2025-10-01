
'use server';
/**
 * @fileOverview Generates personalized and styled professional replies for clients, considering conversation history.
 *
 * - suggestClientReplies - A function that generates client replies based on user profile and conversation history.
 * - SuggestClientRepliesInput - The input type for the suggestClientReplies function.
 * - SuggestClientRepliesOutput - The return type for the suggestClientReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input, including modelId and userApiKey
const SuggestClientRepliesFlowInputSchema = z.object({
  clientMessage: z.string().describe("The client's current message to the designer."),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type SuggestClientRepliesInput = z.infer<typeof SuggestClientRepliesFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId or userApiKey)
const SuggestClientRepliesPromptInputSchema = z.object({
  clientMessage: z.string().describe("The client's current message to the designer."),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});


const SuggestClientRepliesOutputSchema = z.object({
  englishReplies: z.array(z.string()).describe('Two suggested English replies, reflecting the user\'s style, name, and conversation context.'),
  bengaliTranslations: z.array(z.string()).optional().describe('Bengali translations of the English replies.'),
});
export type SuggestClientRepliesOutput = z.infer<typeof SuggestClientRepliesOutputSchema>;

export async function suggestClientReplies(flowInput: SuggestClientRepliesInput): Promise<SuggestClientRepliesOutput> {
  const { userApiKey, modelId, clientMessage, userName, professionalTitle, communicationStyleNotes, services, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, userName, professionalTitle, communicationStyleNotes, services, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'suggestClientReplies';

  let currentAiInstance = ai; // Global Genkit instance by default
  let apiKeySourceForLog = "GOOGLE_API_KEY from .env file";

  if (userApiKey) {
    console.log(`INFO (${flowName}): Using user-provided API key.`);
    currentAiInstance = genkit({ plugins: [googleAI({ apiKey: userApiKey })] });
    apiKeySourceForLog = "User-provided API key from profile";
  } else if (process.env.GOOGLE_API_KEY) {
    console.log(`INFO (${flowName}): User API key not provided. Using GOOGLE_API_KEY from .env file.`);
  } else {
    console.error(`CRITICAL_ERROR (${flowName}): No API key available. Neither a user-provided API key nor the GOOGLE_API_KEY in the .env file is set.`);
    throw new Error(`API key configuration error in ${flowName}. AI features are unavailable.`);
  }

  const suggestRepliesPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: {schema: SuggestClientRepliesPromptInputSchema},
    output: {schema: SuggestClientRepliesOutputSchema},
    prompt: `You are a professional assistant helping a graphic designer.
Designer's Name: {{userName}}
{{#if professionalTitle}}Designer's Title: {{professionalTitle}}{{/if}}
Designer's Communication Style: {{communicationStyleNotes}}
Designer's Services: {{#if services.length}}{{#each services}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}a variety of graphic design services{{/if}}.

**Your Task:** Generate two distinct, professional English replies to the "Client's Current Message". These replies MUST:
1.  Reflect the designer's name, style, and services.
2.  Directly address the "Client's Current Message".
3.  Be contextually appropriate, considering the "Previous conversation context" (if available). The replies should feel like a natural continuation of the dialogue.
4.  If the client's message introduces a new topic or shifts focus, the replies should acknowledge this.
5.  Include a relevant call to action if appropriate (e.g., asking for more details, suggesting next steps related to services).
Also, provide Bengali translations for these English replies.

{{#if chatHistory.length}}
Previous conversation context (generate replies that naturally follow this history):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No previous conversation history available. Base your replies solely on the current client message.
{{/if}}

Client's Current Message:
"{{{clientMessage}}}"

Return the replies and translations as a JSON object.
`,
  });
  
  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await suggestRepliesPrompt(actualPromptInputData, { model: modelToUse });
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}
