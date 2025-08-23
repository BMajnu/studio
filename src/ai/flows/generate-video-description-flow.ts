'use server';
/**
 * @fileOverview Generate an AI-powered random video description based on style, category, duration,
 * aspect ratio, output language, and format. Includes parameter-specific guidelines similar to other flows.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateVideoDescription] ${label}`, ...args); } catch (_) {}
};

const StyleGuidelines: Record<string, string[]> = {
  cinematic: [
    'Filmic language; dramatic composition; evocative lighting',
    'Camera: dolly, crane, slow pan, rack focus when relevant',
    'Color grade: teal-orange, rich contrast, subtle film grain',
  ],
  documentary: [
    'Naturalistic tone; authentic storytelling; observational shots',
    'Clarity of information; subject-context flow; minimal embellishment',
    'Steady framing; avoid overly flashy transitions',
  ],
  animation: [
    'Specify visual mode (2D/3D/cel/illustrative/toon-shaded)',
    'Exaggeration principles; clean timing cues; readable motion',
    'Palette and shape language to unify look',
  ],
  timelapse: [
    'Emphasize time progression, changing light, motion trails',
    'Compact beats; clear beginning and payoff',
  ],
  vlog: [
    'Personable tone; direct-to-camera; jump cuts acceptable',
    'Relatable scenes; ambient audio cues',
  ],
  explainer: [
    'Step-by-step clarity; simple analogies; avoid jargon',
    'On-screen labels/arrows; minimal but helpful motion graphics',
  ],
  shortform: [
    'Hook in first 2 seconds; ultra concise; fast pacing',
    'Large, readable visuals; immediate payoff',
  ],
  musicvideo: [
    'Beat-synced cuts; stylized visuals; strong mood/palette',
    'Transitions driven by rhythm; visual accents on downbeats',
  ],
  productdemo: [
    'Feature-first visual; clean backgrounds; macro details',
    'Use-cases and value; simple animated callouts',
  ],
  motiongraphics: [
    'Kinetic type; geometric shapes; smooth easing',
    'Plan transitions/overlays/layering for clarity',
  ],
  stopmotion: [
    'Tactile textures; handcrafted feel; frame-by-frame cues',
    'Simple readable actions; stable backgrounds',
  ],
  commercial: [
    'Product-centric framing and benefit clarity',
    'Polished look; neutral clean backgrounds; hero shot payoff',
    'Avoid brand names/logos; focus on attributes and outcomes',
  ],
};

const CategoryGuidelines: Record<string, string[]> = {
  shortform: [
    'Optimize for vertical scrolling context and thumb-stop hooks',
    'Deliver value in under 60 seconds; compress narrative density',
  ],
  youtube_vlog: [
    'Conversational pacing with narrative beats and b-roll inserts',
    'Maintain authenticity and clarity; include moments of reflection',
  ],
  educational: [
    'Use clear structure: intro, concept, example, recap',
    'Prioritize accuracy and simple explanations; add on-screen labels',
  ],
  product_review: [
    'Cover pros, cons, and verdict; show real usage and details',
    'Be objective and concise; include close-ups and sound cues',
  ],
  storytelling: [
    'Establish character, conflict, and resolution even in short runtime',
    'Use visual symbolism and coherent mood to support theme',
  ],
  gaming: [
    'Fast cuts for highlights; on-screen stats; reactive commentary',
    'Ensure UI readability; avoid clutter; keep flow exciting',
  ],
  travel: [
    'Show location identity: landmarks, textures, light, people',
    'Use establishing shots, transitions, and ambient sound cues',
  ],
  fitness: [
    'Demonstrate safe form; rep counts; set/rest guidance on-screen',
    'Energetic tone; clear angles; motivating pacing',
  ],
  food: [
    'Appetizing close-ups; ingredient prep; cooking process clarity',
    'Use sizzling/steam cues and final plating hero shot',
  ],
  news: [
    'Neutral tone; structured: headline, context, key facts',
    'On-screen lower-thirds; source mentions; avoid sensationalism',
  ],
};

const AspectRatioNotes: Record<string, string[]> = {
  '16:9': ['Widescreen composition; room for side-to-side action and b-roll'],
  '9:16': ['Vertical-first framing; subject centered; large readable overlays'],
  '1:1': ['Square framing; balanced central composition; minimal empty space'],
  '4:3': ['Classic framing; simpler compositions; avoid ultra-wide scenes'],
  '21:9': ['Cinematic ultra-wide; panoramic shots; careful subject placement'],
  '4:5': ['Portrait-friendly; emphasize vertical motion and hierarchy'],
};

function getDurationGuidance(duration: number): string[] {
  if (duration <= 15) return ['Ultra concise; 1-3 punchy beats; immediate hook'];
  if (duration <= 30) return ['Short narrative arc; distinct intro and payoff'];
  if (duration <= 60) return ['Compact multi-scene flow; avoid filler; clear climax'];
  return ['Long-form pacing not recommended here; compress ideas aggressively'];
}

const GenerateVideoDescriptionFlowInputSchema = z.object({
  style: z.string().describe('Selected video style'),
  contentCategory: z.string().describe('Selected content category'),
  duration: z.number().describe('Target duration (seconds)'),
  aspectRatio: z.string().describe('Aspect ratio e.g. 16:9, 9:16'),
  language: z.enum(['english', 'bengali', 'both']).describe('Output language for the description'),
  outputFormat: z.enum(['normal', 'json', 'both']).optional().describe('Prompt output format preference'),
  userName: z.string().optional().describe('Optional user name to personalize tone'),
});
export type GenerateVideoDescriptionInput = z.infer<typeof GenerateVideoDescriptionFlowInputSchema>;

const GenerateVideoDescriptionOutputSchema = z.object({
  descriptionEnglish: z.string().optional(),
  descriptionBengali: z.string().optional(),
});
export type GenerateVideoDescriptionOutput = z.infer<typeof GenerateVideoDescriptionOutputSchema>;

export async function generateVideoDescription(flowInput: GenerateVideoDescriptionInput): Promise<GenerateVideoDescriptionOutput> {
  const flowName = 'generateVideoDescription';
  logDebug('input', flowInput);

  const { language, style, contentCategory, duration, aspectRatio, outputFormat, userName } = flowInput;

  const styleGuides = StyleGuidelines[style] || [];
  const categoryGuides = CategoryGuidelines[contentCategory] || [];
  const ratioGuides = AspectRatioNotes[aspectRatio] || [];
  const durationGuides = getDurationGuidance(duration);

  const modelToUse = DEFAULT_MODEL_ID;
  // Use a profile stub so GeminiClient can safely initialize and include env key
  const profileStub = {
    userId: 'default',
    name: 'User',
    services: [],
    geminiApiKeys: [] as string[],
  } as any;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `System Role: You are a senior video prompt engineer. Produce production-ready descriptions optimized for AI video generators (e.g., Veo 3, Runway Gen-3, Luma). Be precise, visual, and actionable.

User: ${userName || 'Designer'}
Style: ${style}
Content Category: ${contentCategory}
Duration: ${duration} seconds
Aspect Ratio: ${aspectRatio}
Output Format Preference: ${outputFormat || 'normal'}

Quality Guidelines (follow all):
- Global:
  • Avoid brand names, watermarks, copyrighted characters, and real identities
  • Prefer verbs for motion: dolly, truck, crane, tilt, pan, orbit, rack focus
  • Describe lighting: key/fill/rim; golden hour, overcast softbox, neon practicals
  • Include mood and atmosphere cues; specify environment textures and depth
  • Ensure subject readability for ${aspectRatio}; prioritize composition safety areas
- Style: ${styleGuides.map(g => `• ${g}`).join('\n')}
- Category: ${categoryGuides.map(g => `• ${g}`).join('\n')}
- Duration: ${durationGuides.map(g => `• ${g}`).join('\n')}
- Aspect Ratio: ${ratioGuides.map(g => `• ${g}`).join('\n')}

Your task:
- Write a single, tightly crafted description that a video model can follow to produce a high-quality result.
- Include: subject, setting, camera motion, shot type (CU/WS/OS/etc.), lens cues (wide/normal/tele), lighting, color/mood, and a clear payoff.
- DO NOT include logos, on-screen text instructions, or external references.

Language:
- If language = "english": output only English.
- If language = "bengali": output only Bengali.
- If language = "both": output both languages.

Output strictly as JSON only (no extra text). Omit keys that do not apply:
{
  "descriptionEnglish": "...",
  "descriptionBengali": "..."
}`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: GenerateVideoDescriptionFlowInputSchema },
        output: { schema: GenerateVideoDescriptionOutputSchema },
        prompt: promptText,
      });
      const { output } = await promptDef(flowInput, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      return output;
    });
    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    return output as GenerateVideoDescriptionOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
