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
  imagePrompts: z.array(z.string()).describe("An array of highly detailed prompts suitable for AI image generation, each corresponding to a design idea. Each prompt should be in its own string."),
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
    prompt: `You are an expert AI Prompt Engineer for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Convert design ideas (found in the client's current message or recent chat history from the assistant) into highly detailed prompts for AI image generation.

**Context:**
{{#if chatHistory.length}}
Previous conversation context (look for design ideas here, especially in recent assistant messages, if not in the current client message):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

{{#if attachedFiles.length}}
Attached Files (for additional context, if any):
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}(Image content: {{media url=this.dataUri}}){{/if}}
  {{#if this.textContent}}(Text content: {{{this.textContent}}}){{/if}}
---
{{/each}}
{{/if}}

**Client's Current Message (may contain design ideas or refer to previously generated ideas):**
"{{{clientMessage}}}"

**Task: Generate AI Image Generation Prompts**

1.  **Identify Design Ideas:**
    *   Carefully analyze the "Client's Current Message" and the "Previous conversation context" (especially the most recent assistant messages, which contain design ideas from a "Design Idea" generation step).
    *   Identify ALL design concepts in the conversation, categorized into three types:
        * Creative Design Ideas (5 ideas)
        * Typography Design Ideas (5 ideas)
        * Typography with Graphics Ideas (5 ideas)
    *   Generate prompts for ALL 15 ideas, creating a total of 15 detailed prompts (5 for each category).
    *   If the user's message specifies particular ideas to focus on, prioritize those while still covering all categories.

2.  **For EACH identified design idea, create ONE detailed image generation prompt:**
    *   **Extremely Detailed:** Each prompt must be highly detailed and comprehensive (150-200 words minimum). Include extensive specifics about:
        * Subject matter and core concept
        * Artistic style (e.g., vintage, minimalist, retro comic, abstract, geometric, illustrative, photographic)
        * Composition, layout, and visual hierarchy
        * Detailed color palette with specific color names and relationships
        * Lighting effects, shadows, and highlights
        * Texture and material qualities
        * Artistic medium and technique references
        * Artist influences or style references (e.g., "in the style of...")
        * Mood, emotional tone, and atmosphere
        * Any text elements and their typographic treatment
        * Background treatment in detail
    *   **Professional Formatting:** Structure the prompt with commas separating descriptive elements, with most important elements first.
    *   **Technical Specificity:** Use precise design terminology that would be recognized by professional designers and artists.
    *   **Use Professional Design Terminology:**
        *   Do NOT use terms like "T-shirt," "Mug," "POD," "poster," "flyer," etc.
        *   Instead, use expanded, detailed terminology like "sophisticated typography design with balanced hierarchy," "intricate vector illustration with detailed line work," "conceptual graphic design with symbolic elements," "authentic vintage aesthetic print with distressed textures," "refined minimalist graphic with negative space composition," "bold apparel graphic concept with dynamic flow," "intricate surface pattern design with repeating motifs," "distinctive product packaging graphic with harmonious visual language."
    *   **Detailed Background Treatment:** Don't simply specify a "solid background" - instead, describe the background in detail. For example: "Deep matte black background with subtle gradient vignetting to create depth," or "Clean white background with delicate off-white textural elements that create visual interest while maintaining simplicity." Choose a background approach (black, white, or a specific color palette if implied by the idea) that perfectly complements and enhances the design concept.
    *   **Front/Back Designs (If Applicable):**
        *   If a design idea explicitly mentions or implies separate front and back designs (common for apparel graphics), generate TWO separate prompts: one for the "front graphic concept" and one for the "back graphic concept." Clearly indicate this in the prompt (e.g., "Front graphic concept: ...", "Back graphic concept: ..."). If not mentioned, generate a single prompt for the overall design.
    *   **Focus:** The prompts should be for generating the *visual design itself*, not the mockup (e.g., not "a t-shirt with this design on it," but "a vector illustration of...").

3.  **Output Format:**
    *   The final output MUST be a JSON object with a single key "imagePrompts", which is an array of strings.
    *   Each string in the array is one complete, detailed image generation prompt.
    *   Do NOT number the prompts or add any headings within the strings in the "imagePrompts" array.

**Example of ONE output prompt string (within the array):**
"Highly detailed vector illustration of a majestic wolf with textured fur rendered in meticulous line art, howling dramatically at a geometric low-poly moon. Intricate cosmic background featuring swirling nebulae with star clusters and subtle sacred geometry patterns. Rich color palette of deep indigo blues transitioning to royal purples with silver metallic accents and subtle iridescent highlights. Dramatic lighting with moonlight casting cool blue highlights on the wolf's silhouette. Art style combines modern digital illustration with cosmic mysticism, influenced by artists like James R. Eads and Justin Maller. Emotional tone conveys wonder and primal connection. Composition places wolf in golden ratio position with balanced negative space. Design incorporates subtle textures resembling traditional printmaking. Negative space utilized intentionally in cosmic background. Solid matte black background for maximum contrast. Suitable for apparel graphic design with high detail preservation."

Generate the prompts based on the ideas you find. If no clear ideas are present, you can state that in a single prompt within the array, like "No specific design ideas found to generate prompts for. Please provide design ideas or use the 'Idea' feature first."
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
    
