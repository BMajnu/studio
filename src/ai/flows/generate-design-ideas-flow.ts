
'use server';
/**
 * @fileOverview Generates creative design ideas, simulated web search results, and typography ideas.
 * Emphasizes highly detailed, specific, and well-directed outputs.
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
  creativeDesignIdeas: z.array(z.string()).describe("Five highly detailed, specific, and well-directed creative design ideas for new designs based on the extracted text/saying. Include style, concept, visual elements, color palette suggestions, and how the text is incorporated. Aim for production-ready concepts."),
  typographyDesignIdeas: z.array(z.string()).describe("Two highly detailed and specific creative typography-focused design ideas (graphics optional or minimal) for the extracted text/saying, emphasizing font style, layout, typographic effects, and overall aesthetic. Aim for unique and impactful typographic treatments."),
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

**Objective:** Generate highly detailed, specific, well-directed, and creative design ideas based on the provided "Design Input Text", considering the full conversation history and any attached files. If multiple distinct design themes or texts are evident in the input or history, attempt to generate ideas for each.

**Context:**
{{#if chatHistory.length}}
Previous conversation context (use this to understand the full scope of the request, including any evolving requirements or themes):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

{{#if attachedFiles.length}}
Attached Files (analyze for visual cues, specific elements, style preferences, or explicit requirements mentioned in text):
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}(Image content: {{media url=this.dataUri}}){{/if}}
  {{#if this.textContent}}(Text content: {{{this.textContent}}}){{/if}}
---
{{/each}}
{{/if}}

**Design Input Text (Primary focus for idea generation, interpret within the full context above):**
"{{{designInputText}}}"

**Tasks:**

1.  **Identify Core Text(s)/Saying(s)/Theme(s):** Determine the core text(s), slogan(s), saying(s), or theme(s) from the "Design Input Text" AND the "Previous conversation context" that should be the focus of the design(s). If multiple distinct subjects for design are apparent, acknowledge them. Populate \`extractedTextOrSaying\` with a concise summary or the primary text.

2.  **Simulated Web Inspiration (Field: \`simulatedWebInspiration\`):**
    *   Based on the identified core text(s)/theme(s), generate 2-3 *simulated* web search results or inspirational examples.
    *   Each result must have a plausible \`title\`, a conceptual \`link\` (e.g., "dribbble.com/coffee-logo-concepts", "behance.net/minimalist-typography-posters"), and a brief, relevant \`snippet\`.
    *   You are NOT browsing the live web. Create realistic-sounding examples. If input is too vague, provide general design inspiration relevant to potential themes.

3.  **Creative Design Ideas (Field: \`creativeDesignIdeas\`):**
    *   Generate FIVE distinct, **highly detailed, specific, and well-directed** creative design ideas. These should be production-ready concepts.
    *   For each idea:
        *   **Concept:** Clearly describe the core concept and narrative.
        *   **Style:** Specify the artistic style (e.g., vintage, minimalist, retro comic, abstract, geometric, illustrative, photographic).
        *   **Visual Elements:** Detail all key visual elements, objects, characters, or symbols. Describe their appearance and interaction.
        *   **Color Palette:** Suggest a specific color palette (e.g., "monochromatic blues with a gold accent," "earthy tones of brown, green, and terracotta").
        *   **Text Incorporation:** Explain how the text/saying is integrated into the design (e.g., "arched above the central graphic," "interwoven with illustrative elements," "boldly centered").
        *   **Overall Mood/Feeling:** Describe the intended emotional impact (e.g., "playful and energetic," "sophisticated and modern," "nostalgic and warm").
    *   Example: "Idea 1: A majestic wolf silhouette against a vibrant geometric aurora borealis. Style: Modern geometric, slightly abstract. Visual Elements: Wolf head composed of interconnected triangles, sharp lines for aurora, subtle starbursts. Color Palette: Deep blues, purples, teals for aurora, with a contrasting silver or white for the wolf outline and stars. Text Incorporation: 'Northern Soul' (example text) in a clean, sans-serif font, subtly placed at the bottom. Mood: Mysterious, powerful, serene."

4.  **Typography Design Ideas (Field: \`typographyDesignIdeas\`):**
    *   Generate TWO distinct, **highly detailed and specific** creative typography-focused design ideas. These should emphasize unique and impactful typographic treatments with minimal or optional graphics.
    *   For each idea:
        *   **Font Style:** Describe the specific font style (e.g., "bold condensed sans-serif," "elegant flowing script," "distressed vintage serif," "futuristic display font").
        *   **Layout & Composition:** Detail how the text is arranged (e.g., "stacked vertically," "circular arrangement," "text forming a specific shape").
        *   **Typographic Effects:** Mention any effects (e.g., "3D extrusion," "neon glow," "letterpress deboss," "interlocking ligatures").
        *   **Color & Treatment:** Suggest colors for the text and any subtle background treatments.
        *   **Overall Aesthetic:** (e.g., "Clean and corporate," "Grungy and urban," "Playful and whimsical").
    *   Example: "Typography Idea 1: 'Coffee Beats Everything' (example text) rendered in a dynamic, hand-drawn script font that mimics steam rising from a coffee cup. Layout: Text flows upwards, with ligatures connecting letters like wisps of steam. Effects: Subtle textured background resembling parchment, text has a slightly imperfect, hand-lettered feel. Color: Rich dark brown for text on a cream background. Aesthetic: Warm, inviting, artisanal."

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
    
