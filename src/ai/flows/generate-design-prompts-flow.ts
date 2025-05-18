
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

export async function generateDesignPrompts(input: GenerateDesignPromptsInput): Promise<GenerateDesignPromptsOutput> {
  return generateDesignPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDesignPromptsPrompt',
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
    *   Carefully analyze the "Client's Current Message" and the "Previous conversation context" (especially the most recent 1-2 assistant messages, which might contain output from a "Design Idea" generation step).
    *   Identify up to 7 design concepts (e.g., 5 creative design ideas + 2 typography ideas that might have been generated previously). If the user's current message specifies ideas, prioritize those.

2.  **For EACH identified design idea, create ONE detailed image generation prompt:**
    *   **Highly Detailed:** Each prompt must be very descriptive. Include details about subject, style, composition, colors, lighting, artistic medium, artist influences (if applicable), mood, and any specific text to be incorporated.
    *   **Skip Unnecessary Words:** Be concise but comprehensive. Avoid conversational fluff in the prompt itself.
    *   **Use Suitable Alternatives:**
        *   Do NOT use terms like "T-shirt," "Mug," "POD," "poster," "flyer," etc.
        *   Instead, use terms like "typography design," "vector illustration," "graphic design," "vintage aesthetic print," "minimalist graphic," "apparel graphic concept," "surface pattern design," "product packaging graphic."
    *   **Backgrounds:** Specify a solid color background. Aim for mostly black or white backgrounds. If the design idea seems suited for a mug or light-colored item, explicitly state "white background." For other designs, choose a background color (black, white, or a specific color if implied by the idea) that complements the design.
    *   **Front/Back Designs (If Applicable):**
        *   If a design idea explicitly mentions or implies separate front and back designs (common for apparel graphics), generate TWO separate prompts: one for the "front graphic concept" and one for the "back graphic concept." Clearly indicate this in the prompt (e.g., "Front graphic concept: ...", "Back graphic concept: ..."). If not mentioned, generate a single prompt for the overall design.
    *   **Focus:** The prompts should be for generating the *visual design itself*, not the mockup (e.g., not "a t-shirt with this design on it," but "a vector illustration of...").

3.  **Output Format:**
    *   The final output MUST be a JSON object with a single key "imagePrompts", which is an array of strings.
    *   Each string in the array is one complete, detailed image generation prompt.
    *   Do NOT number the prompts or add any headings within the strings in the "imagePrompts" array.

**Example of ONE output prompt string (within the array):**
"Epic vector illustration of a majestic wolf howling at a geometric moon, intricate line art, cosmic background with swirling nebulae, color palette of deep blues, purples, and silver. Graphic design for apparel. Solid black background."

Generate the prompts based on the ideas you find. If no clear ideas are present, you can state that in a single prompt within the array, like "No specific design ideas found to generate prompts for. Please provide design ideas or use the 'Idea' feature first."
`,
});

const generateDesignPromptsFlow = ai.defineFlow(
  {
    name: 'generateDesignPromptsFlow',
    inputSchema: GenerateDesignPromptsFlowInputSchema,
    outputSchema: GenerateDesignPromptsOutputSchema,
  },
  async (flowInput) => {
    const { modelId, ...actualPromptInput } = flowInput;
    const modelToUse = modelId || DEFAULT_MODEL_ID;
    
    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);

    
