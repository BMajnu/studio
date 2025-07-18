'use server';
/**
 * @fileOverview AI flow to generate image editing prompts based on a design to edit,
 * previous "Check Made Designs" feedback from chat history, and current user instructions.
 * Will use a currently attached image if provided, otherwise attempts to find the last user-uploaded image in history.
 *
 * - generateEditingPrompts - A function to generate various editing prompts.
 * - GenerateEditingPromptsInput - Input type.
 * - GenerateEditingPromptsOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

const AttachedFileSchema = z.object({ // Only for consistency within ChatHistory type, not directly used as primary input file
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files."),
  textContent: z.string().optional().describe("Text content for text files.")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().describe("Full textual content of the message, including any structured data like analysis or previous AI responses."),
});


// Schema for the flow's input
const GenerateEditingPromptsFlowInputSchema = z.object({
  designToEditDataUri: z.string().optional().describe("Optional: A data URI of the design image to be edited if one is currently attached by the user. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  clientInstructionForEditingTheme: z.string().optional().describe("Optional: User's current general instruction or theme for editing (e.g., 'make it more vibrant', 'focus on fixing the text')."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history. The AI should look for the most recent 'Check Made Designs' output from the assistant to extract feedback, and potentially the last user-uploaded image if designToEditDataUri is not provided."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateEditingPromptsInput = z.infer<typeof GenerateEditingPromptsFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateEditingPromptsPromptInputSchema = z.object({
  designToEditDataUri: z.string().optional().describe("The design image to be edited, if one was directly provided for this action."),
  clientInstructionForEditingTheme: z.string().optional().describe("User's current instruction/theme for editing."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history to find prior design check feedback and potentially the last user image."),
});

const EditingPromptSchema = z.object({
  type: z.string().describe("A category for the prompt, e.g., 'must_need_edits', 'all_edits', 'make_standout', 'make_colorful', 'new_variations', or 'error_no_image_found'."),
  prompt: z.string().describe("The generated editing prompt for an AI image generation/editing tool, or an error message if no image was found."),
});

const GenerateEditingPromptsOutputSchema = z.object({
  editingPrompts: z.array(EditingPromptSchema).describe("An array of 5 distinct editing prompts based on different criteria, or a single error prompt if no image was found."),
});
export type GenerateEditingPromptsOutput = z.infer<typeof GenerateEditingPromptsOutputSchema>;

export async function generateEditingPrompts(flowInput: GenerateEditingPromptsInput): Promise<GenerateEditingPromptsOutput> {
  const { userApiKey, modelId, designToEditDataUri, clientInstructionForEditingTheme, userName, communicationStyleNotes, chatHistory } = flowInput;
  const actualPromptInputData = { designToEditDataUri, clientInstructionForEditingTheme, userName, communicationStyleNotes, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateEditingPrompts';

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;

  const client = new GeminiClient({ profile: profileStub });

  const promptText = `You are an expert AI Prompt Engineer for {{{userName}}}, a graphic designer.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Generate 5 distinct, detailed prompts for revising an existing design image using an AI image generation/editing tool.
The prompts should be based on a provided design image (either directly via \`designToEditDataUri\` or found in history), any prior "Check Made Designs" feedback found in the chat history, and an optional current instruction from the user.

**Image to Edit:**
{{#if designToEditDataUri}}
Primary Design to Edit (directly provided):
{{media url=designToEditDataUri}}
{{else}}
No design was directly provided with this request. You MUST search the 'Chat History' below for the MOST RECENT image uploaded by the USER (role: 'user') that includes a data URI (e.g., {{media url=...}}). This will be the image to edit. If no such image is found in the recent history, you MUST indicate this in your output by returning a single prompt object with type "error_no_image_found" and a prompt message explaining that an image is needed.
{{/if}}

**User's Current General Instruction/Theme for Editing (Optional):**
"{{{clientInstructionForEditingTheme}}}"

**Chat History (Analyze for recent 'Check Made Designs' feedback and, if necessary, the last user-uploaded image):**
{{#if chatHistory.length}}
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No chat history provided.
{{/if}}

**Tasks:**

1.  **Identify Image to Edit:**
    *   If \`designToEditDataUri\` is provided, use that image.
    *   If not, search the \`chatHistory\` for the most recent image provided by the 'user' role that has a viewable data URI.
    *   If NO image can be identified (neither directly provided nor found in history), your output MUST be a single prompt object: \`{ "type": "error_no_image_found", "prompt": "No image was provided for editing, and no recent image could be found in the chat history. Please attach an image or refer to one." }\`. Do not proceed to step 2 or 3 if no image is found.

2.  **Identify Prior Feedback (If Image Found):**
    *   Scan the \`chatHistory\` for the most recent assistant message that contains structured feedback from a "Check Made Designs" analysis. This feedback will be in Bangla and will include categories like "ভুল অবজেক্ট", "ভুল অবস্থান", "টাইপিং ভুল", "ভুল রঙ", "ভুল আকার", "বাদ পড়া উপাদান", and "অন্যান্য ভুল", along with terms like "অবশ্যই প্রয়োজনীয়" (Must Required) and "ঐচ্ছিক" (Optional).
    *   If such feedback is found, extract the "Must Required" and "Optional" points.

3.  **Generate 5 Editing Prompts (If Image Found):** Create prompts for the following scenarios. Each prompt should be a single paragraph suitable for AI image tools, focusing on *revising the identified image*, not creating a new one from scratch. Use terms like "Revise this image to...", "Modify the existing design by...".

    *   **Prompt 1: Must Need Edits (\`type: "must_need_edits"\`)**
        *   Generate a prompt incorporating *only* the "অবশ্যই প্রয়োজনীয়" (Must Required) changes identified from the "Check Made Designs" feedback. If no such feedback or no "Must Required" items are found, generate a general prompt for minor essential fixes based on the image.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 2: All Edits (\`type: "all_edits"\`)**
        *   Generate a prompt incorporating *all* identified changes ("অবশ্যই প্রয়োজনীয়" and "ঐচ্ছিক") from the "Check Made Designs" feedback. If no feedback, generate a general comprehensive revision prompt.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 3: Make Design More Standout (\`type: "make_standout"\`)**
        *   Generate a prompt to make the *identified design* more visually appealing, dynamic, and eye-catching, focusing on impact and uniqueness.
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 4: Make Design More Colorful (\`type: "make_colorful"\`)**
        *   Generate a prompt to enhance or add colors to the *identified design* to make it more vibrant and visually interesting. Suggest colors that would be standout and suitable for the design's theme (if discernible).
        *   Also consider the \`clientInstructionForEditingTheme\`.

    *   **Prompt 5: Create New Variations with Tweaks (\`type: "new_variations"\`)**
        *   Generate a prompt to create a few subtle variations of the *identified design*, perhaps by tweaking elements, layout, or minor stylistic details, while keeping the core concept intact.
        *   Also consider the \`clientInstructionForEditingTheme\`.

4.  **Prompt Guidelines (If Image Found):**
    *   Each prompt should be detailed but concise.
    *   Focus on revising the identified image.
    *   Avoid terms like "T-shirt," "Mug," "POD." Use "graphic," "illustration," "design element," "visual concept."
    *   Specify a solid background if not inherent (e.g., "on a clean white background," "with a transparent background").

**Output Format:**
Ensure the entire response is a single JSON object matching the \`GenerateEditingPromptsOutputSchema\`.
If an image is found, the \`editingPrompts\` array should contain 5 objects, each with a \`type\` (e.g., "must_need_edits") and a \`prompt\` string.
If no image is found, the \`editingPrompts\` array should contain a single object as described in Task 1.
Example for one prompt object: \`{ "type": "must_need_edits", "prompt": "Revise the provided image to correct the text alignment for the headline and change the primary icon's color to #FF5733, maintaining all other elements. Ensure the background remains white." }\`
`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: GenerateEditingPromptsPromptInputSchema },
        output: { schema: GenerateEditingPromptsOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      return output as GenerateEditingPromptsOutput;
    });

    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    if (!output || !output.editingPrompts || output.editingPrompts.length === 0) {
      console.error(`ERROR (${flowName}): AI returned empty or invalid editingPrompts output.`);
      // Return a default or error structure if needed, or throw
      return { editingPrompts: [{ type: "error", prompt: "Failed to generate editing prompts. No specific prompts were returned by the AI."}] };
    }
    // If AI returns the specific no_image_found error, ensure it's structured correctly
    if (output.editingPrompts.length === 1 && output.editingPrompts[0].type === "error_no_image_found") {
        console.warn(`WARN (${flowName}): AI indicated no image found for editing.`);
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed after rotating through available keys. Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}