
'use server';
/**
 * @fileOverview Generates creative design ideas, simulated web search results, and typography ideas.
 *
 * - generateDesignIdeas - A function to generate design ideas.
 * - GenerateDesignIdeasInput - The input type for the function.
 * - GenerateDesignIdeasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files. Use {{media url=<dataUri>}} to reference in prompt."),
  textContent: z.string().optional().describe("Text content for text files (e.g., .txt, .md).")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input
const GenerateDesignIdeasFlowInputSchema = z.object({
  designInputText: z.string().describe("The primary text, saying, or theme for the design (e.g., 'Coffee Beats Everything', 'DesAInR company launch'). This should be extracted from the user's latest relevant message or input."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images as dataUris, text files as textContent. Analyze these for visual cues or requirements."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current designInputText may or may not be part of this history directly."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateDesignIdeasInput = z.infer<typeof GenerateDesignIdeasFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateDesignIdeasPromptInputSchema = z.object({
  designInputText: z.string().describe("The primary text, saying, or theme for the design."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Attached files for visual cues."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history for context."),
});

const WebSearchResultSchema = z.object({
  title: z.string().describe("A plausible title for a web search result or inspirational design."),
  link: z.string().describe("A conceptual or example URL (e.g., 'example.com/vintage-coffee-poster'). You are not browsing the web, so make these representative."),
  snippet: z.string().describe("A short description or snippet related to the inspirational link.")
});

const GenerateDesignIdeasOutputSchema = z.object({
  extractedTextOrSaying: z.string().describe("The specific text or saying identified from the input that the design ideas are based on. If input is a general theme, this might be a concise summary of it."),
  simulatedWebInspiration: z.array(WebSearchResultSchema).describe("Simulated web search results: 2-3 example links with titles and snippets for designs similar to the design's text/saying. You are not browsing; create plausible examples if real search is not possible or if the input doesn't provide enough specifics for actual search queries. If no text/saying is clear, provide general inspiration related to the broader theme if one can be inferred."),
  creativeDesignIdeas: z.array(z.string()).describe("Five detailed creative design ideas for new designs based on the extracted text/saying. Include style and concept details. Example: 'Coffee bean character joyfully holding a golden trophy, rendered in a retro comic book style, with the text 'Coffee Beats Everything' in a dynamic, slightly distressed font.'"),
  typographyDesignIdeas: z.array(z.string()).describe("Two creative typography-focused design ideas (graphics optional or minimal) for the extracted text/saying, emphasizing font style, layout, and typographic effects."),
});
export type GenerateDesignIdeasOutput = z.infer<typeof GenerateDesignIdeasOutputSchema>;

export async function generateDesignIdeas(flowInput: GenerateDesignIdeasInput): Promise<GenerateDesignIdeasOutput> {
  const { userApiKey, modelId, designInputText, userName, communicationStyleNotes, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { designInputText, userName, communicationStyleNotes, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateDesignIdeas';

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
  
  const generateDesignIdeasPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: GenerateDesignIdeasPromptInputSchema },
    output: { schema: GenerateDesignIdeasOutputSchema },
    prompt: `You are an expert Design Idea Generator for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Generate creative design ideas based on the provided "Design Input Text", conversation history, and any attached files.

**Context:**
{{#if chatHistory.length}}
Previous conversation context:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

{{#if attachedFiles.length}}
Attached Files (consider for visual cues, themes, or explicit requirements):
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}(Image content: {{media url=this.dataUri}}){{/if}}
  {{#if this.textContent}}(Text content: {{{this.textContent}}}){{/if}}
---
{{/each}}
{{/if}}

**Design Input Text (Primary focus for idea generation):**
"{{{designInputText}}}"

**Tasks:**

1.  **Identify Core Text/Saying:** Determine the core text, slogan, or saying from the "Design Input Text" that should be the focus of the design. If the input is more of a theme, summarize it concisely. Populate \`extractedTextOrSaying\`.

2.  **Simulate Web Inspiration (Field: \`simulatedWebInspiration\`):**
    *   Based on the \`extractedTextOrSaying\`, generate 2-3 *simulated* web search results or inspirational examples.
    *   Each result should have a plausible \`title\`, a conceptual \`link\` (e.g., "designspiration.net/coffee-poster-ideas", "pinterest.com/vintage-typography-examples"), and a brief \`snippet\`.
    *   You are NOT browsing the live web. Create realistic-sounding examples that would be helpful for inspiration. If the input text is too vague for specific examples, provide general design inspiration links relevant to a potential theme.

3.  **Creative Design Ideas (Field: \`creativeDesignIdeas\`):**
    *   Generate FIVE distinct and detailed creative design ideas based on the \`extractedTextOrSaying\`.
    *   For each idea, describe the concept, style (e.g., vintage, minimalist, bold, retro comic), visual elements, and how the text is incorporated.
    *   Example: "A coffee bean character wearing a crown, looking triumphant, with 'Coffee Beats Everything' in a bold, modern sans-serif font arched above. Style: Playful, modern."

4.  **Typography Design Ideas (Field: \`typographyDesignIdeas\`):**
    *   Generate TWO creative typography-focused design ideas for the \`extractedTextOrSaying\`.
    *   These ideas should primarily emphasize font choice, layout, text effects, and composition, with minimal or no additional graphical elements.
    *   Example: "'Coffee Beats Everything' rendered in an elegant, flowing script font, intertwined with subtle coffee steam wisps forming decorative ligatures. Color palette: Rich browns and creams."

Ensure your entire response is a single JSON object matching the \`GenerateDesignIdeasOutputSchema\`.
`,
  });
  
  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await generateDesignIdeasPrompt(actualPromptInputData, { model: modelToUse });
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
    
