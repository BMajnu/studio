'use server';
/**
 * @fileOverview Generates video prompts in normal and JSON formats, optimized for Google Veo 3 and other video generation models.
 *
 * - generateVideoPrompts - A function to generate video creation prompts.
 * - GenerateVideoPromptsInput - The input type for the generateVideoPrompts function.
 * - GenerateVideoPromptsOutput - The return type for the generateVideoPrompts function.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';
import * as fs from 'fs';
import * as path from 'path';

// DEBUG logging helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateVideoPrompts] ${label}`, ...args); } catch(_){}
};

// Guidance constants to steer consistent, high-quality outputs
const StyleGuidelines: Record<'cinematic'|'animation'|'documentary'|'commercial'|'music_video'|'social_media', string[]> = {
  cinematic: [
    'Filmic language; dramatic composition; evocative lighting',
    'Camera grammar: dolly, truck, crane, tilt, pan, orbit, rack focus',
    'Grade: teal-orange, rich contrast, gentle film grain',
  ],
  animation: [
    'Specify mode (2D/3D/cel/illustrative/toon-shaded)',
    'Exaggeration principles; clean timing; readable silhouettes',
    'Unified palette and shape language',
  ],
  documentary: [
    'Naturalistic tone; observational coverage; authenticity first',
    'Subject-context clarity; minimal embellishment',
    'Steady framing and intelligible pacing',
  ],
  commercial: [
    'Product-centric framing and benefit clarity',
    'Polished macro details; neutral clean backgrounds; hero payoff',
    'No brand names/logos; focus on attributes and outcomes',
  ],
  music_video: [
    'Beat-synced cuts; stylized visuals; bold palette',
    'Transitions driven by rhythm; accents on downbeats',
  ],
  social_media: [
    'Immediate hook (<2s); concise beats; high readability',
    'Large typography and safe areas for overlays',
  ],
};

const CategoryGuidelines: Record<'shortform'|'youtube_vlog'|'educational'|'product_review'|'storytelling'|'gaming'|'travel'|'fitness'|'food'|'news', string[]> = {
  shortform: [
    'Vertical-first, thumb-stop hook within 2 seconds',
    'Deliver value under 60s; compress narrative density',
  ],
  youtube_vlog: [
    'Conversational pacing; b-roll inserts; authenticity',
    'Clear narrative beats with relatable moments',
  ],
  educational: [
    'Intro → concept → example → recap structure',
    'Use simple analogies; on-screen labels for clarity',
  ],
  product_review: [
    'Pros, cons, verdict; real usage; macro details',
    'Objective tone and clear shots of features',
  ],
  storytelling: [
    'Character, conflict, resolution within runtime',
    'Visual symbolism and consistent mood',
  ],
  gaming: [
    'Fast highlight cuts; readable UI; reactive commentary',
  ],
  travel: [
    'Establishing shots; textures; ambient sound cues',
  ],
  fitness: [
    'Demonstrate safe form; rep counts; set/rest overlay',
  ],
  food: [
    'Appetizing close-ups; process clarity; steam/sizzle cues',
  ],
  news: [
    'Neutral tone; headline → context → key facts',
  ],
};

const AspectRatioNotes: Record<'16:9'|'9:16'|'1:1'|'4:3', string[]> = {
  '16:9': ['Widescreen composition; room for lateral motion and b-roll'],
  '9:16': ['Vertical-first framing; centered subjects; oversized overlays'],
  '1:1': ['Central balance; minimize empty corners; strong hierarchy'],
  '4:3': ['Classic framing; simpler compositions; avoid ultra-wide pans'],
};

// Load up to N JSON code blocks from the research file to use as reference examples
function loadResearchExamples(maxBlocks: number = 2): string {
  try {
    const researchPath = path.resolve(process.cwd(), 'Prompt-resourch-for-video.md');
    if (!fs.existsSync(researchPath)) return '';
    const md = fs.readFileSync(researchPath, 'utf8');
    const regex = /```json\s*([\s\S]*?)\s*```/g;
    const blocks: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(md)) && blocks.length < maxBlocks) {
      const block = (m[1] || '').trim();
      if (block) blocks.push(block);
    }
    if (blocks.length === 0) return '';
    // Limit each block length to avoid prompt bloat
    const trimmed = blocks.map((b, i) => {
      const limit = 2200; // chars per block safeguard
      const text = b.length > limit ? b.slice(0, limit) + '\n…' : b;
      return `Example JSON ${i + 1}:\n${text}`;
    });
    return `\nReference Examples (from research; follow structure and tone, adapt content):\n${trimmed.join('\n\n')}\n`;
  } catch (_) {
    return '';
  }
}

function getDurationGuidance(duration?: number): string[] {
  if (!duration || duration <= 0) return ['Default to concise pacing with clear beginning and payoff'];
  if (duration <= 15) return ['Ultra concise; 1–3 punchy beats; immediate hook'];
  if (duration <= 30) return ['Short arc; distinct intro and payoff; minimize filler'];
  if (duration <= 60) return ['Compact multi-scene flow; maintain momentum; clear climax'];
  return ['Long-form pacing discouraged; compress ideas aggressively'];
}

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files"),
  textContent: z.string().optional().describe("Text content for text files")
});

// Schema for the flow's input
const GenerateVideoPromptsFlowInputSchema = z.object({
  userMessage: z.string().describe('The user message describing video requirements'),
  userName: z.string().describe('The name of the user'),
  videoStyle: z.enum(['cinematic', 'animation', 'documentary', 'commercial', 'music_video', 'social_media']).optional().describe('Preferred video style'),
  duration: z.number().optional().describe('Target video duration in seconds'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:3']).optional().describe('Video aspect ratio'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Reference files attached by the user"),
  modelId: z.string().optional().describe('The Genkit model ID to use'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key'),
  contentCategory: z.enum([
    'shortform','youtube_vlog','educational','product_review','storytelling','gaming','travel','fitness','food','news'
  ]).optional().describe('Content category to steer tone and structure'),
});
export type GenerateVideoPromptsInput = z.infer<typeof GenerateVideoPromptsFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateVideoPromptsPromptInputSchema = z.object({
  userMessage: z.string().describe('The user message describing video requirements'),
  userName: z.string().describe('The name of the user'),
  videoStyle: z.enum(['cinematic', 'animation', 'documentary', 'commercial', 'music_video', 'social_media']).optional(),
  duration: z.number().optional(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:3']).optional(),
  attachedFiles: z.array(AttachedFileSchema).optional(),
  contentCategory: z.enum(['shortform','youtube_vlog','educational','product_review','storytelling','gaming','travel','fitness','food','news']).optional(),
});

// Video prompt schema for structured output
const VideoPromptSchema = z.object({
  title: z.string().describe('Title for the video prompt'),
  description: z.string().describe('Detailed description of the video'),
  scenes: z.array(z.object({
    sceneNumber: z.number(),
    duration: z.number().describe('Duration in seconds'),
    description: z.string(),
    cameraMovement: z.string().optional(),
    lighting: z.string().optional(),
    mood: z.string().optional(),
    shotType: z.string().optional().describe('CU/MCU/MS/WS/OTS/etc'),
    lens: z.string().optional().describe('Wide/normal/tele or focal length hint'),
    location: z.string().optional(),
    timeOfDay: z.string().optional(),
    transition: z.string().optional(),
  })).describe('Individual scenes breakdown'),
  visualStyle: z.string().describe('Overall visual style and aesthetic'),
  colorPalette: z.array(z.string()).describe('Suggested color palette'),
  audioNotes: z.string().optional().describe('Audio and music suggestions'),
  aspectRatio: z.string().optional().describe('Aspect ratio for composition safety'),
  totalDuration: z.number().optional().describe('Total target duration in seconds'),
  postProcessing: z.string().optional().describe('Color grade, grain, vignettes, overlays'),
  negativePrompts: z.array(z.string()).optional().describe('Things to avoid'),
});

// Output schema
const GenerateVideoPromptsOutputSchema = z.object({
  normalPromptEnglish: z.string().describe('Natural language video prompt in English'),
  normalPromptBengali: z.string().describe('Natural language video prompt in Bengali'),
  jsonPrompt: VideoPromptSchema.describe('Structured JSON format prompt for video generation'),
  veo3OptimizedPrompt: z.string().describe('Prompt specifically optimized for Google Veo 3'),
  technicalNotes: z.array(z.string()).describe('Technical considerations for video creation'),
  suggestedKeywords: z.array(z.string()).describe('Keywords for better AI understanding'),
  sceneBreakdown: z.array(z.string()).optional().describe('Readable scene list for UI display'),
  keywords: z.array(z.string()).optional().describe('Alias of suggested keywords if needed'),
});
export type GenerateVideoPromptsOutput = z.infer<typeof GenerateVideoPromptsOutputSchema>;

export async function generateVideoPrompts(flowInput: GenerateVideoPromptsInput): Promise<GenerateVideoPromptsOutput> {
  const flowName = 'generateVideoPrompts';
  logDebug('Starting flow with input', { ...flowInput, userApiKey: flowInput.userApiKey ? '***' : undefined });

  const { modelId = DEFAULT_MODEL_ID, userApiKey, ...promptInputData } = flowInput;
  const modelToUse = modelId;
  
  const profileStub = {
    userId: 'default',
    name: 'User',
    services: [],
    geminiApiKeys: userApiKey ? [userApiKey] : [],
  };

  const client = new GeminiClient({ profile: profileStub });
  
  const actualPromptInputData = {
    ...promptInputData,
    attachedFiles: promptInputData.attachedFiles?.map(file => ({
      ...file,
      dataUri: file.dataUri ? `{{media url=${file.dataUri}}}` : undefined,
    })),
  };

  const styleGuides: string[] = promptInputData.videoStyle ? (StyleGuidelines[promptInputData.videoStyle] ?? []) : [] as string[];
  const categoryGuides: string[] = promptInputData.contentCategory ? (CategoryGuidelines[promptInputData.contentCategory] ?? []) : [] as string[];
  const ratioGuides: string[] = promptInputData.aspectRatio ? (AspectRatioNotes[promptInputData.aspectRatio] ?? []) : [] as string[];
  const durationGuides: string[] = getDurationGuidance(promptInputData.duration);

  // Load example prompts from research (if available)
  const researchExamples = loadResearchExamples(2);

  const attachmentsSummary = (promptInputData.attachedFiles || [])
    .map((f, i) => `#${i+1} ${f.name} (${f.type})${f.textContent ? ' [text included]' : ''}${f.dataUri ? ' [image reference]' : ''}`)
    .join('\n');

  const promptText = `System Role: You are a senior video prompt engineer. Produce production-ready prompts optimized for AI video generators (Veo 3 primary). Be precise, visual, and actionable.

User Name: ${promptInputData.userName}
User Requirements: ${promptInputData.userMessage}
${promptInputData.videoStyle ? `Style: ${promptInputData.videoStyle}` : ''}
${promptInputData.contentCategory ? `Content Category: ${promptInputData.contentCategory}` : ''}
${promptInputData.duration ? `Duration: ${promptInputData.duration} seconds` : ''}
${promptInputData.aspectRatio ? `Aspect Ratio: ${promptInputData.aspectRatio}` : ''}
${promptInputData.attachedFiles?.length ? `Attached Files (${promptInputData.attachedFiles.length}):\n${attachmentsSummary}` : ''}

Quality Guidelines (must follow):
- Global:
  • Avoid brands, watermarks, copyrighted characters, and real identities
  • Use camera verbs (dolly/truck/crane/tilt/pan/orbit/rack focus) instead of vague phrasing
  • Specify lighting (key/fill/rim), time-of-day, atmosphere, and texture
  • Ensure composition readability for the target aspect ratio
- Style: ${styleGuides.map((g: string) => `• ${g}`).join('\n')}
- Category: ${categoryGuides.map((g: string) => `• ${g}`).join('\n')}
- Duration: ${durationGuides.map((g: string) => `• ${g}`).join('\n')}
- Aspect Ratio: ${ratioGuides.map((g: string) => `• ${g}`).join('\n')}

${researchExamples}
Your Tasks:
1) Write a flowing natural-language prompt in English.
2) Provide the same prompt in Bengali.
3) Provide a structured JSON prompt usable by code (see exact schema below).
4) Provide a Veo 3 optimized one-paragraph version (concise, cinematic grammar).
5) Provide technical notes and keyword list.

Structured JSON must follow this exact top-level format (return JSON only, no extra text):
{
  "normalPromptEnglish": "...",
  "normalPromptBengali": "...",
  "jsonPrompt": {
    "title": "...",
    "description": "...",
    "scenes": [
      { "sceneNumber": 1, "duration": 4, "description": "...", "cameraMovement": "...", "lighting": "...", "mood": "...", "shotType": "...", "lens": "...", "location": "...", "timeOfDay": "...", "transition": "..." }
    ],
    "visualStyle": "...",
    "colorPalette": ["#...", "#..."],
    "audioNotes": "...",
    "aspectRatio": "${promptInputData.aspectRatio || ''}",
    "totalDuration": ${promptInputData.duration || 0},
    "postProcessing": "Color grade and finishing notes",
    "negativePrompts": ["watermarks", "logos", "celebrity likeness"]
  },
  "veo3OptimizedPrompt": "...",
  "technicalNotes": ["Frame rate suggestions", "Shutter/ND hints", "Safe areas for text"],
  "suggestedKeywords": ["cinematic", "${promptInputData.videoStyle || 'style'}", "${promptInputData.aspectRatio || 'ratio'}"],
  "sceneBreakdown": ["Scene 1 – ...", "Scene 2 – ..."],
  "keywords": ["cinematic", "high-contrast"]
}`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: GenerateVideoPromptsPromptInputSchema },
        output: { schema: GenerateVideoPromptsOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      return output;
    });
    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    return output as GenerateVideoPromptsOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
