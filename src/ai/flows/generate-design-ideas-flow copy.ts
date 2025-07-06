'use server';
/**
 * @fileOverview Generates creative design ideas, simulated web search results, and typography ideas.
 * Emphasizes highly detailed, specific, and well-directed outputs.
 *
 * - generateDesignIdeas - A function to generate design ideas.
 * - GenerateDesignIdeasInput - The input type for the function.
 * - GenerateDesignIdeasOutput - The return type for the function.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

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

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `You are an expert Design Idea Generator for a graphic designer named {{{userName}}}.
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
2. Generate 5-10 search keywords highly specific to this design request. These keywords should help the user find relevant design inspiration when searched on Google.
3. Generate 3 categories of design ideas:
   a. **Graphics-Focused Creative Ideas (4)**: Generate EXACTLY FOUR detailed graphics-focused design ideas but including text/saying in the design ideas. The graphics should present the text/saying in a creative way. These should emphasize visual elements, with the text/saying incorporated into the overall design.
   b. **Typography-Focused Ideas (3)**: Generate EXACTLY THREE ideas where typography is the primary focus. The text itself should be the main visual element, using creative font choices and typographic treatments but any accent, typographic organments and minimal decoration allowed. It should be as a creative and well aligned typography design format.
   c. **Typography with Graphics Ideas (3)**: Generate EXACTLY THREE detailed typography-focused design ideas but including small graphics or minimal graphic elements in the design ideas. The graphic elements should be minimal and not overdone. The ideas should blend interesting typography treatments with complementary graphic elements.

**For each idea, include:**
- Visual style and concept. Consider using one of the popular styles listed below.
- Key visual elements
- Color palette recommendations
- How the text is incorporated
- Any specific graphic techniques, effects, accents, typographic organments, decoration, etc.
- Typography suggestions where relevant

**Popular T-Shirt and POD Design Styles:**

Here are some of the most popular design styles for T-shirt and POD (Print on Demand) designs:

1.  **Minimalist Designs**: Simple, clean, and often monochrome designs. Focus on subtle typography, small graphics, or icons. Popular for modern, sleek looks.
2.  **Vintage/Retro Designs**: Inspired by the past, often featuring bold, faded, or distressed looks. Common themes include 80s/90s nostalgia, old-school logos, and typography. Uses retro fonts, faded colors, and vintage imagery like cassette tapes, vinyl records, etc.
3.  **Typography/Quote-Based Designs**: T-shirts with motivational, funny, or thought-provoking quotes. Focus on interesting fonts and creative typography. Great for personalized POD designs or niche markets.
4.  **Illustrative Designs**: Detailed and artistic illustrations of animals, nature, people, or abstract designs. Often hand-drawn or digital illustrations. Suitable for custom art and unique character designs.
5.  **Geometric Designs**: Abstract, clean lines, and geometric shapes like circles, triangles, squares, and lines. Popular for modern, stylish looks. Often combined with other design styles for a bold, contemporary aesthetic.
6.  **Nature and Adventure Themes**: Designs inspired by nature, outdoors, hiking, mountains, forests, or beach life. Popular for eco-conscious brands, outdoor lifestyle, and adventure seekers.
7.  **Pop Culture References**: Designs featuring famous quotes, characters, or symbols from movies, TV shows, music, and more. Highly popular among niche fandoms and collectors.
8.  **Hand-Drawn/Sketch Art**: Designs featuring hand-drawn sketches or doodles. Often feature whimsical, humorous, or detailed artistic expressions.
9.  **Graffiti/Street Art**: Urban-inspired designs with spray paint effects, graffiti tags, or street signs. Popular among younger audiences and fans of streetwear culture.
10. **Sports and Team Designs**: T-shirts related to sports teams, athletes, or fitness lifestyle. Often includes logos, jerseys, or motivational phrases related to training and competition.
11. **Funny and Sarcastic Designs**: Humor-based designs with witty, sarcastic, or meme-inspired quotes and graphics. Great for casual and novelty wear, perfect for lighthearted and trendy markets.
12. **Nature and Floral Patterns**: Feminine and nature-inspired designs, often featuring flowers, leaves, or botanical elements. Popular for boho, retro, and earthy looks.
13. **Abstract Art**: Non-representational designs that focus on color, shape, and form. Popular for high-fashion, modern art-inspired POD designs.
14. **Cartoon and Comic Style**: Designs that resemble comic book art or animated cartoons. Bold lines, exaggerated characters, and vibrant colors make these designs stand out.
15. **Grunge and Punk Rock**: Designs with distressed textures, band logos, skulls, and dark or rebellious themes. Popular among those who love alternative fashion.
16. **Bohemian Style**: Free-spirited, earthy, and often featuring mystical or spiritual elements. Commonly includes mandalas, feathers, and dreamcatchers.
17. **Animal Prints**: Designs featuring animal patterns (like leopard print, zebra stripes, etc.) or illustrations of animals. Popular for bold and trendy fashion looks.

These styles often overlap, and custom POD designs can feature combinations of these themes to create something unique. The key to success in T-shirt and POD design is knowing your target audience and catering to their interests, whether that's humor, culture, or aesthetic trends.

**Example Format for Graphics-Focused Idea:**
Design Concept: "The Champion Bean"

Visual Elements:
- Central imagery: A heroic cartoon coffee bean character flexing its arm, standing on a podium. A stylized "vs. Everything" is subtly defeated in the background.
- Style: Bold, graphic novel illustration style with dynamic lines and a sense of action.
- The coffee bean character will have a confident expression.
- Color palette: Warm browns and tans for the coffee bean, with vibrant reds and yellows for the action effects. A muted blue/grey background to make the character pop.

Typography:
- Typeface: A comic book-style font like "Bangers" or "Komika".
- The phrase "Coffee Beats Everything" is integrated into the scene. "Coffee" is in a large, impactful font above the character. "Beats Everything" could be in a sound-effect style bubble.
- Placement: The text is a core part of the action, not just a caption.

Layout and Composition:
- Asymmetrical composition to create a dynamic feel.
- The character is the main focus, with the text elements balancing the image.

Final Look:
- The design should feel energetic, powerful, and fun, clearly communicating the "Coffee Beats Everything" message with strong visual storytelling.

**Example Format for Typography-Focused Idea:**
Design Concept: "Vintage Type Declaration"

Visual Elements:
- Central imagery: The design is almost entirely text-based.
- Style: Inspired by vintage packaging and turn-of-the-century posters. Uses typographic ornaments like lines, stars, and decorative borders to frame the text.
- Minimal graphic elements: Perhaps a small, engraved-style coffee bean icon.
- Color palette: A simple two-color scheme, like cream text on a dark brown background, or a classic black and white.

Typography:
- Typeface: A mix of multiple vintage and script fonts. For example, a bold, condensed sans-serif for "COFFEE", a flowing script for "Beats", and a strong slab serif for "EVERYTHING".
- The words are arranged in a visually interesting stack, with variations in size, weight, and style to create hierarchy and rhythm.
- Placement: The entire phrase is the centerpiece of the design, filling the space.

Layout and Composition:
- Symmetrical and balanced layout, creating a sense of classic craftsmanship.
- Decorative elements are used to enhance and contain the typography.

Final Look:
- The design should feel timeless, elegant, and confident. It makes a statement using the power of words and classic design principles.

**Example Format for Typography with Graphics Idea:**
Design Concept: "Organic Sketch"

Visual Elements:
- Central imagery: A hand-drawn coffee plant branch with leaves and coffee cherries wrapping around the text.
- Style: Loose, organic, hand-sketched style with imperfect lines, giving it an authentic, rustic feel. Think of a sketch in a botanist's notebook.
- The graphic elements (plant) should feel natural and integrated with the typography.
- Color palette: Earthy tones. Monochromatic look using shades of dark brown or sepia on a cream or light paper-textured background.

Typography:
- Typeface: A friendly, casual, hand-written font that complements the sketchy style, like "Amatic SC" or a custom handwritten script.
- The phrase "Coffee Beats Everything" is woven into the illustration. The words might follow the curve of the branch or be nestled amongst the leaves.
- Placement: The text and illustration are deeply intertwined, creating a single, cohesive piece.

Layout and Composition:
- Asymmetrical and flowing layout that follows the natural shape of the plant branch.
- The composition should feel balanced but not rigid, embracing the imperfections of hand-drawn art.

Final Look:
- The design should feel warm, authentic, and artisanal. It connects the idea of coffee with its natural origins and has a personal, handcrafted touch.

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
`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: GenerateDesignIdeasPromptInputSchema },
        output: { schema: GenerateDesignIdeasOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      return output as GenerateDesignIdeasOutput;
    });
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}