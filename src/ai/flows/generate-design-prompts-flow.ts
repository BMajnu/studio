'use server';
/**
 * @fileOverview Converts design ideas into detailed prompts for AI image generation.
 *
 * - generateDesignPrompts - A function to generate image prompts.
 * - GenerateDesignPromptsInput - The input type for the function.
 * - GenerateDesignPromptsOutput - The return type for the function.
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
const GenerateDesignPromptsFlowInputSchema = z.object({
  clientMessage: z.string().describe("The user's current message, which might contain design ideas or refer to ideas in history."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Analyze for context."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history. Look for design ideas shared by the assistant in recent turns if not in clientMessage."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateDesignPromptsInput = z.infer<typeof GenerateDesignPromptsFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateDesignPromptsPromptInputSchema = z.object({
  clientMessage: z.string().describe("The user's current message, which might contain design ideas or refer to ideas in history."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Attached files for context."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history, especially recent assistant messages containing design ideas."),
});

const GenerateDesignPromptsOutputSchema = z.object({
  graphicsPrompts: z.array(z.string()).length(4).describe("Exactly 4 detailed prompts for graphics-focused designs, matching the style, concept, and elements of the graphics creative ideas."),
  typographyPrompts: z.array(z.string()).length(3).describe("Exactly 3 detailed prompts for typography-focused designs, matching the style, concept, and elements of the typography design ideas."),
  mixedPrompts: z.array(z.string()).length(3).describe("Exactly 3 detailed prompts for designs combining typography and graphics, matching the style, concept, and elements of the typography with graphics ideas.")
});
export type GenerateDesignPromptsOutput = z.infer<typeof GenerateDesignPromptsOutputSchema>;

export async function generateDesignPrompts(flowInput: GenerateDesignPromptsInput): Promise<GenerateDesignPromptsOutput> {
  const { userApiKey, modelId, clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateDesignPrompts';

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

  const generateDesignPromptsPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: GenerateDesignPromptsPromptInputSchema },
    output: { schema: GenerateDesignPromptsOutputSchema },
    prompt: `You are an expert AI Image Prompt Generator for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Create detailed AI image generation prompts for three categories of design ideas: Graphics-Focused, Typography-Focused, and Mixed Typography with Graphics.

**Context:**
{{#if chatHistory.length}}
Previous conversation context:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

{{#if attachedFiles.length}}
Attached Files:
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}
    (This is an image. Analyze its content for design inspiration: {{media url=this.dataUri}})
  {{else if this.textContent}}
    Content of {{this.name}}:
    {{{this.textContent}}}
  {{else}}
    (This file content is not directly viewable, but its existence might be relevant to the design needs.)
  {{/if}}
{{/each}}
{{/if}}

Client's Message: {{{clientMessage}}}

**Instructions:**
1. Based on the client's message and any recent conversation history, identify the key design ideas in three categories:
   - Graphics-Focused Creative Ideas (4 ideas)
   - Typography-Focused Ideas (3 ideas)
   - Typography with Graphics Ideas (3 ideas)

2. For each category, create detailed AI image generation prompts that would produce high-quality, professional results:
   - For GRAPHICS-FOCUSED designs: Create EXACTLY 4 detailed prompts with clear visual descriptions, style references, color palettes, and composition details.
   - For TYPOGRAPHY-FOCUSED designs: Create EXACTLY 3 detailed prompts emphasizing font styles, text layouts, typographic treatments, and minimal supporting graphics.
   - For MIXED TYPOGRAPHY WITH GRAPHICS designs: Create EXACTLY 3 detailed prompts that balance both typography and graphic elements in an integrated design.

3. Each prompt should follow this structure:
   - Start with a clear art direction (e.g., "Professional corporate logo", "Minimalist poster design")
   - Include specific style references (e.g., "in the style of Swiss Design", "with Art Deco influences")
   - Specify composition details (e.g., "centered composition with negative space", "asymmetrical layout")
   - Mention color palette (e.g., "using a monochromatic blue palette", "with vibrant complementary colors")
   - Include technical specifications (e.g., "high contrast", "with subtle texture", "sharp focus")
   - End with quality indicators (e.g., "professional quality", "award-winning design", "trending on Behance")

**Example Prompt Format:**
"Professional branding design for a coffee shop, featuring a stylized coffee bean character holding a trophy, in flat illustration style, warm orange and brown color palette with teal accents, centered composition with the text 'Coffee Beats Everything' curved around the trophy in bold sans-serif font, incorporating playful shadow effects and minimal shapes, high-quality vector style, trending on Dribbble, professional graphic design"

Output Format:
{
  "graphicsPrompts": [
    "Detailed graphics-focused prompt 1...",
    "Detailed graphics-focused prompt 2...",
    "Detailed graphics-focused prompt 3...",
    "Detailed graphics-focused prompt 4..."
  ],
  "typographyPrompts": [
    "Detailed typography-focused prompt 1...",
    "Detailed typography-focused prompt 2...",
    "Detailed typography-focused prompt 3..."
  ],
  "mixedPrompts": [
    "Detailed mixed typography and graphics prompt 1...",
    "Detailed mixed typography and graphics prompt 2...",
    "Detailed mixed typography and graphics prompt 3..."
  ]
}
`,
  });
  
  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await generateDesignPromptsPrompt(actualPromptInputData, { model: modelToUse });
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