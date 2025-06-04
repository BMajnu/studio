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
  searchKeywords: z.array(z.string()).min(5).max(10).describe("Generate 5-10 search keywords that are highly relevant to this specific design request. These keywords should be specific enough for a Google search to return useful design inspiration. Consider the theme, style, purpose, and specific elements of the design."),
  graphicsCreativeIdeas: z.array(z.string()).length(4).describe("4 detailed graphics-focused creative design ideas for new designs based on the extracted text/saying. Include style, concept, visual elements, color palette suggestions, and how the text is incorporated. Focus on detailed, production-ready concepts with clear visual direction."),
  typographyDesignIdeas: z.array(z.string()).length(3).describe("3 typography-focused design ideas that creatively present the extracted text/saying. Include font suggestions, typography style, layout approach, and color recommendations. Focus on how the text itself becomes the primary visual element."),
  typographyWithGraphicsIdeas: z.array(z.string()).length(3).describe("3 ideas that combine interesting typography with graphic elements based on the extracted text/saying. Include how the text interacts with visual elements, style recommendations, composition approach, and color suggestions.")
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

**Objective:** Generate creative design ideas in 3 distinct categories based on the provided "Design Input Text".

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

Design Input Text: {{{designInputText}}}

**Instructions:**
1. First, identify or extract any specific text, saying, quote or theme that should be the focal point of designs.
2. Search the web (simulated) for 2-3 inspirational examples related to this text/saying/theme.
3. Generate 5-10 search keywords highly specific to this design request. These keywords should help the user find relevant design inspiration when searched on Google.
4. Generate 3 categories of design ideas:
   a. **Graphics-Focused Creative Ideas (4)**: Generate EXACTLY FOUR detailed graphics-focused design ideas. These should emphasize visual elements, with the text/saying incorporated into the overall design.
   b. **Typography-Focused Ideas (3)**: Generate EXACTLY THREE ideas where typography is the primary focus. The text itself should be the main visual element, using creative font choices and typographic treatments.
   c. **Typography with Graphics Ideas (3)**: Generate EXACTLY THREE ideas that blend interesting typography treatments with complementary graphic elements.

**For each idea, include:**
- Visual style and concept
- Key visual elements
- Color palette recommendations
- How the text is incorporated
- Any specific graphic techniques or effects
- Typography suggestions where relevant

**Example Format for Graphics-Focused Idea:**
"Flat Illustration Style: Coffee bean character holding a trophy against a sunrise background. Uses warm oranges and browns with teal accents. Text 'Coffee Beats Everything' curved around the trophy in a bold sans-serif font. Incorporates playful shadow effects and minimal shapes."

**Example Format for Typography-Focused Idea:**
"Dynamic Type Stack: The phrase 'Coffee Beats Everything' arranged in a stacked formation with varying font weights. 'COFFEE' in extra-bold condensed type, 'BEATS' in medium italic, and 'EVERYTHING' in extended type. Uses an espresso brown to cream gradient with textured distressing for a vintage feel."

**Example Format for Typography with Graphics Idea:**
"Neon Sign Concept: 'Coffee Beats Everything' in handwritten neon script, glowing blue against a dark background. Coffee cup silhouette in pink neon underneath with steam particles rising to form subtle musical notes, suggesting coffee's energizing rhythm."

Follow these examples for structure but create entirely original ideas based on the specific text/saying provided.

Output Format:
{
  "extractedTextOrSaying": "The specific text/saying from the input",
  "simulatedWebInspiration": [
    {
      "title": "Inspirational example title",
      "link": "example.com/inspirational-design",
      "snippet": "Brief description of this inspiration"
    }
  ],
  "searchKeywords": [
    "keyword1 relevant to this specific design",
    "keyword2 relevant to this design",
    "keyword3 specific to elements in this design",
    "keyword4 focused on style of this design",
    "keyword5 about similar designs"
  ],
  "graphicsCreativeIdeas": [
    "Detailed graphics-focused idea 1...",
    "Detailed graphics-focused idea 2...",
    "Detailed graphics-focused idea 3...",
    "Detailed graphics-focused idea 4..."
  ],
  "typographyDesignIdeas": [
    "Detailed typography-focused idea 1...",
    "Detailed typography-focused idea 2...",
    "Detailed typography-focused idea 3..."
  ],
  "typographyWithGraphicsIdeas": [
    "Detailed mixed typography and graphics idea 1...",
    "Detailed mixed typography and graphics idea 2...",
    "Detailed mixed typography and graphics idea 3..."
  ]
}
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