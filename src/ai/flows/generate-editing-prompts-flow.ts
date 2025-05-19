
'use server';
/**
 * @fileOverview AI flow to generate image editing prompts based on a design to edit,
 * previous "Check Made Designs" feedback from chat history, and current user instructions.
 *
 * - generateEditingPrompts - A function to generate various editing prompts.
 * - GenerateEditingPromptsInput - Input type.
 * - GenerateEditingPromptsOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const AttachedFileSchema = z.object({ // Only for consistency within ChatHistory type, not directly used as primary input file
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files."),
  textContent: z.string().optional().describe("Text content for text files.")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().describe("Full textual content of the message, including any structured data like analysis or previous AI responses."),
  // attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached with this historical message.") // Not directly needed for prompt, text is enough
});


// Schema for the flow's input
const GenerateEditingPromptsFlowInputSchema = z.object({
  designToEditDataUri: z.string().describe("A data URI of the design image to be edited. This is the primary image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  clientInstructionForEditingTheme: z.string().optional().describe("Optional: User's current general instruction or theme for editing (e.g., 'make it more vibrant', 'focus on fixing the text')."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history. The AI should look for the most recent 'Check Made Designs' output from the assistant to extract feedback."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateEditingPromptsInput = z.infer<typeof GenerateEditingPromptsFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateEditingPromptsPromptInputSchema = z.object({
  designToEditDataUri: z.string().describe("The design image to be edited."),
  clientInstructionForEditingTheme: z.string().optional().describe("User's current instruction/theme for editing."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history to find prior design check feedback."),
});

const EditingPromptSchema = z.object({
  type: z.string().describe("A category for the prompt, e.g., 'must_need_edits', 'all_edits', 'make_standout', 'make_colorful', 'new_variations'."),
  prompt: z.string().describe("The generated editing prompt for an AI image generation/editing tool."),
});

const GenerateEditingPromptsOutputSchema = z.object({
  editingPrompts: z.array(EditingPromptSchema).describe("An array of 5 distinct editing prompts based on different criteria."),
});
export type GenerateEditingPromptsOutput = z.infer<typeof GenerateEditingPromptsOutputSchema>;

export async function generateEditingPrompts(flowInput: GenerateEditingPromptsInput): Promise<GenerateEditingPromptsOutput> {
  const { userApiKey, modelId, designToEditDataUri, clientInstructionForEditingTheme, userName, communicationStyleNotes, chatHistory } = flowInput;
  const actualPromptInputData = { designToEditDataUri, clientInstructionForEditingTheme, userName, communicationStyleNotes, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateEditingPrompts';

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

  const generateEditingPromptsPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: GenerateEditingPromptsPromptInputSchema },
    output: { schema: GenerateEditingPromptsOutputSchema },
    prompt: `You are an expert AI Prompt Engineer for {{{userName}}}, a graphic designer.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Generate 5 distinct, detailed prompts for revising an existing design image using an AI image generation/editing tool.
The prompts should be based on a provided design image, any prior "Check Made Designs" feedback found in the chat history, and an optional current instruction from the user.

**Provided Design to Edit:**
{{media url=designToEditDataUri}}

**User's Current General Instruction/Theme for Editing (Optional):**
"{{{clientInstructionForEditingTheme}}}"

**Chat History (Analyze for recent 'Check Made Designs' feedback):**
{{#if chatHistory.length}}
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No chat history provided.
{{/if}}

**Tasks:**

1.  **Identify Prior Feedback:**
    *   Scan the \`chatHistory\` for the most recent assistant message that contains structured feedback from a "Check Made Designs" analysis. This feedback will be in Bangla and will include categories like "ভুল অবজেক্ট", "ভুল অবস্থান", "টাইপিং ভুল", "ভুল রঙ", "ভুল আকার", "বাদ পড়া উপাদান", and "অন্যান্য ভুল", along with terms like "অবশ্যই প্রয়োজনীয়" (Must Required) and "ঐচ্ছিক" (Optional).
    *   If such feedback is found, extract the "Must Required" and "Optional" points.

2.  **Generate 5 Editing Prompts:** Create prompts for the following scenarios. Each prompt should be a single paragraph suitable for AI image tools, focusing on *revising the provided image*, not creating a new one from scratch. Use terms like "Revise this image to...", "Modify the existing design by...".

    *   **Prompt 1: Must Need Edits (\`type: "must_need_edits"\`)**
        *   Generate a prompt incorporating *only* the "অবশ্যই প্রয়োজনীয়" (Must Required) changes identified from the "Check Made Designs" feedback. If no such feedback or no "Must Required" items are found, generate a general prompt for minor essential fixes based on the image.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 2: All Edits (\`type: "all_edits"\`)**
        *   Generate a prompt incorporating *all* identified changes ("অবশ্যই প্রয়োজনীয়" and "ঐচ্ছিক") from the "Check Made Designs" feedback. If no feedback, generate a general comprehensive revision prompt.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 3: Make Design More Standout (\`type: "make_standout"\`)**
        *   Generate a prompt to make the *existing design* more visually appealing, dynamic, and eye-catching, focusing on impact and uniqueness.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 4: Make Design More Colorful (\`type: "make_colorful"\`)**
        *   Generate a prompt to enhance or add colors to the *existing design* to make it more vibrant and visually interesting. Suggest colors that would be standout and suitable for the design's theme (if discernible).
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 5: Create New Variations with Tweaks (\`type: "new_variations"\`)**
        *   Generate a prompt to create a few subtle variations of the *current design*, perhaps by tweaking elements, layout, or minor stylistic details, while keeping the core concept intact.
        *   Also consider the \`clientInstructionForEditingTheme\`.

3.  **Prompt Guidelines:**
    *   Each prompt should be detailed but concise.
    *   Focus on revising the provided image.
    *   Avoid terms like "T-shirt," "Mug," "POD." Use "graphic," "illustration," "design element," "visual concept."
    *   Specify a solid background if not inherent (e.g., "on a clean white background," "with a transparent background").

**Output Format:**
Ensure the entire response is a single JSON object matching the \`GenerateEditingPromptsOutputSchema\`.
The \`editingPrompts\` array should contain 5 objects, each with a \`type\` (e.g., "must_need_edits") and a \`prompt\` string.
Example for one prompt object: \`{ "type": "must_need_edits", "prompt": "Revise the provided image to correct the text alignment for the headline and change the primary icon's color to #FF5733, maintaining all other elements. Ensure the background remains white." }\`
`,
  });

  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await generateEditingPromptsPrompt(actualPromptInputData, { model: modelToUse });
    if (!output || !output.editingPrompts || output.editingPrompts.length === 0) {
      console.error(`ERROR (${flowName}): AI returned empty or invalid editingPrompts output.`);
      // Return a default or error structure if needed, or throw
      return { editingPrompts: [{ type: "error", prompt: "Failed to generate editing prompts. No specific prompts were returned by the AI."}] };
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}
