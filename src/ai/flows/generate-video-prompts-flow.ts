'use server';
/**
 * @fileOverview Generates video prompts in normal and JSON formats, optimized for Google Veo 3 and other video generation models.
 *
 * - generateVideoPrompts - A function to generate video creation prompts.
 * - GenerateVideoPromptsInput - The input type for the generateVideoPrompts function.
 * - GenerateVideoPromptsOutput - The return type for the generateVideoPrompts function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import * as fs from 'fs';
import * as path from 'path';
import { classifyError } from '@/lib/errors';

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
    'Establishing shots; cultural authenticity; golden-hour',
  ],
  fitness: [
    'Form clarity; split-screen comparisons; motivational vibe',
  ],
  food: [
    'Overhead/45° angle; texture close-ups; minimal clutter',
  ],
  news: [
    'Neutral framing; structured information; source clarity',
  ],
};

/**
 * Loads JSON-based prompt examples from the Prompt-resourch-for-video.md file.
 * Returns a formatted string block for injection into the AI prompt.
 */
function loadResearchExamples(maxBlocks = 2): string {
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

// Input interfaces
export interface AttachedFile {
  name: string;
  type: string;
  dataUri?: string;
  textContent?: string;
}

export interface GenerateVideoPromptsInput {
  userMessage: string;
  userName: string;
  videoStyle?: 'cinematic' | 'animation' | 'documentary' | 'commercial' | 'music_video' | 'social_media';
  duration?: number;
  attachedFiles?: AttachedFile[];
  modelId?: string;
  userApiKey?: string;
  contentCategory?: 'shortform'|'youtube_vlog'|'educational'|'product_review'|'storytelling'|'gaming'|'travel'|'fitness'|'food'|'news';
  profile?: UserProfile;
}

// Output interfaces
export interface VideoPrompt {
  title: string;
  description: string;
  scenes: Array<{
    sceneNumber: number;
    duration: number;
    description: string;
    cameraMovement: string;
    lighting: string;
    mood: string;
    shotType: string;
    lens: string;
    location: string;
    timeOfDay: string;
    transition: string;
  }>;
  visualStyle: string;
  colorPalette: string[];
  audioNotes: string;
  totalDuration: number;
  postProcessing: string;
  negativePrompts: string[];
}

export interface GenerateVideoPromptsOutput {
  normalPromptEnglish: string;
  normalPromptBengali: string;
  jsonPrompt: VideoPrompt;
  veo3OptimizedPrompt: string;
  technicalNotes: string[];
  suggestedKeywords: string[];
  sceneBreakdown: string[];
  keywords: string[];
}

export async function generateVideoPrompts(flowInput: GenerateVideoPromptsInput): Promise<GenerateVideoPromptsOutput> {
  const flowName = 'generateVideoPrompts';
  logDebug('Starting flow with input', { ...flowInput, userApiKey: flowInput.userApiKey ? '***' : undefined });

  const { 
    modelId = DEFAULT_MODEL_ID, 
    userApiKey,
    userMessage,
    userName,
    videoStyle,
    duration,
    attachedFiles,
    contentCategory,
    profile
  } = flowInput;

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  const styleGuides: string[] = videoStyle ? (StyleGuidelines[videoStyle] ?? []) : [];
  const categoryGuides: string[] = contentCategory ? (CategoryGuidelines[contentCategory] ?? []) : [];
  const durationGuides: string[] = getDurationGuidance(duration);

  // Load example prompts from research (if available)
  const researchExamples = loadResearchExamples(2);

  const attachmentsSummary = (attachedFiles || [])
    .map((f, i) => `#${i+1} ${f.name} (${f.type})${f.textContent ? ' [text included]' : ''}${f.dataUri ? ' [image reference]' : ''}`)
    .join('\n');

  // Build system prompt
  const systemPrompt = `System Role: You are a senior video prompt engineer. Produce production-ready prompts optimized for AI video generators (Veo 3 primary). Be precise, visual, and actionable.`;

  // Build user prompt
  let userPrompt = `User Name: ${userName}\n`;
  userPrompt += `User Requirements: ${userMessage}\n`;
  if (videoStyle) userPrompt += `Style: ${videoStyle}\n`;
  if (contentCategory) userPrompt += `Content Category: ${contentCategory}\n`;
  if (duration) userPrompt += `Duration: ${duration} seconds\n`;
  if (attachedFiles && attachedFiles.length > 0) {
    userPrompt += `Attached Files (${attachedFiles.length}):\n${attachmentsSummary}\n`;
  }
  userPrompt += `\n`;

  userPrompt += `Quality Guidelines (must follow):\n`;
  userPrompt += `- Global:\n`;
  userPrompt += `  • Avoid brands, watermarks, copyrighted characters, and real identities\n`;
  userPrompt += `  • Use camera verbs (dolly/truck/crane/tilt/pan/orbit/rack focus) instead of vague phrasing\n`;
  userPrompt += `  • Specify lighting (key/fill/rim), time-of-day, atmosphere, and texture\n`;
  userPrompt += `  \n`;

  if (styleGuides.length > 0) {
    userPrompt += `- Style:\n`;
    styleGuides.forEach(g => userPrompt += `  • ${g}\n`);
  }

  if (categoryGuides.length > 0) {
    userPrompt += `- Category:\n`;
    categoryGuides.forEach(g => userPrompt += `  • ${g}\n`);
  }

  if (durationGuides.length > 0) {
    userPrompt += `- Duration:\n`;
    durationGuides.forEach(g => userPrompt += `  • ${g}\n`);
  }

  userPrompt += `\n`;
  userPrompt += researchExamples;
  
  userPrompt += `Your Tasks:\n`;
  userPrompt += `1) Write a flowing natural-language prompt in English.\n`;
  userPrompt += `2) Provide the same prompt in Bengali.\n`;
  userPrompt += `3) Provide a structured JSON prompt usable by code (see exact schema below).\n`;
  userPrompt += `4) Provide a Veo 3 optimized one-paragraph version (concise, cinematic grammar).\n`;
  userPrompt += `5) Provide technical notes and keyword list.\n`;
  userPrompt += `\n`;

  userPrompt += `Structured JSON must follow this exact top-level format (return JSON only, no extra text):\n`;
  userPrompt += `{\n`;
  userPrompt += `  "normalPromptEnglish": "...",\n`;
  userPrompt += `  "normalPromptBengali": "...",\n`;
  userPrompt += `  "jsonPrompt": {\n`;
  userPrompt += `    "title": "...",\n`;
  userPrompt += `    "description": "...",\n`;
  userPrompt += `    "scenes": [\n`;
  userPrompt += `      { "sceneNumber": 1, "duration": 4, "description": "...", "cameraMovement": "...", "lighting": "...", "mood": "...", "shotType": "...", "lens": "...", "location": "...", "timeOfDay": "...", "transition": "..." }\n`;
  userPrompt += `    ],\n`;
  userPrompt += `    "visualStyle": "...",\n`;
  userPrompt += `    "colorPalette": ["#...", "#..."],\n`;
  userPrompt += `    "audioNotes": "...",\n`;
  userPrompt += `    "totalDuration": ${duration || 0},\n`;
  userPrompt += `    "postProcessing": "Color grade and finishing notes",\n`;
  userPrompt += `    "negativePrompts": ["watermarks", "logos", "celebrity likeness"]\n`;
  userPrompt += `  },\n`;
  userPrompt += `  "veo3OptimizedPrompt": "...",\n`;
  userPrompt += `  "technicalNotes": ["Frame rate suggestions", "Shutter/ND hints", "Safe areas for text"],\n`;
  userPrompt += `  "suggestedKeywords": ["cinematic", "${videoStyle || 'style'}"],\n`;
  userPrompt += `  "sceneBreakdown": ["Scene 1 – ...", "Scene 2 – ..."],\n`;
  userPrompt += `  "keywords": ["cinematic", "high-contrast"]\n`;
  userPrompt += `}`;

  try {
    const output = await generateJSON<GenerateVideoPromptsOutput>({
      modelId,
      temperature: 0.8,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    logDebug('AI call succeeded');
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw classifyError(error);
  }
}
