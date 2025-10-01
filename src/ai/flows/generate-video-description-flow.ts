'use server';
/**
 * @fileOverview Generate an AI-powered random video description based on style, category, duration,
 * and output language. Includes parameter-specific guidelines similar to other flows.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';

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
  music: [
    'Match visual rhythm to audio; sync cuts and motion to beats',
    'Mood-driven transitions; showcase instruments/performance',
  ],
  commercial: [
    'Product/service at center; clear value proposition in visuals',
    'Polished look; brand-consistent color/style; CTA framing',
  ],
};

const CategoryGuidelines: Record<string, string[]> = {
  nature: [
    'Natural light preferred; authentic environment; wildlife behavior',
    'Depth cues: foreground plants, background landscapes',
    'Avoid artificial props or obvious staged elements',
  ],
  technology: [
    'Clean backgrounds; spotlight key device/product',
    'Macro close-ups to show detail; UI insets when relevant',
    'Modern lighting: cool tones, soft highlights',
  ],
  sports: [
    'Dynamic angles; motion blur for speed; subject tracking',
    'Capture peak action; slow-mo for dramatic moments',
    'Highlight athleticism, tension, and payoff',
  ],
  food: [
    'Overhead or 45° angle; shallow DOF; appetizing color palette',
    'Show texture; pouring/cutting/steaming motion; ambient props minimal',
  ],
  travel: [
    'Establishing shots; local culture; authentic locations',
    'Golden-hour or blue-hour; people-in-context; reveal narrative',
  ],
  fashion: [
    'Flattering angles; controlled/natural lighting; movement/flow',
    'Focus on fabric texture, silhouettes, and color harmony',
  ],
  education: [
    'Clear visuals; step-by-step demonstrations; whiteboard/diagram elements',
    'Steady framing; avoid distracting backgrounds',
  ],
  gaming: [
    'Specify game art style (realistic/stylized/retro/futuristic)',
    'Action-packed camera; HUD elements minimal or none; highlight gameplay',
  ],
  art: [
    'Creative compositions; close-ups on details; process reveals',
    'Controlled lighting; neutral or complementary backgrounds',
  ],
  health: [
    'Positive tone; well-lit, clean environments; subject-focus clear',
    'Avoid clutter; emphasize wellness cues',
  ],
  news: [
    'Neutral tone; structured: headline, context, key facts',
    'On-screen lower-thirds; source mentions; avoid sensationalism',
  ],
};

function getDurationGuidance(duration: number): string[] {
  if (duration <= 15) return ['Ultra concise; 1-3 punchy beats; immediate hook'];
  if (duration <= 30) return ['Short narrative arc; distinct intro and payoff'];
  if (duration <= 60) return ['Compact multi-scene flow; avoid filler; clear climax'];
  return ['Long-form pacing not recommended here; compress ideas aggressively'];
}

// Input interface
export interface GenerateVideoDescriptionInput {
  style: string;
  contentCategory: string;
  duration: number;
  language: 'english' | 'bengali' | 'both';
  userName?: string;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interface
export interface GenerateVideoDescriptionOutput {
  descriptionEnglish?: string;
  descriptionBengali?: string;
}

export async function generateVideoDescription(flowInput: GenerateVideoDescriptionInput): Promise<GenerateVideoDescriptionOutput> {
  const flowName = 'generateVideoDescription';
  logDebug('input', flowInput);

  const { 
    language, 
    style, 
    contentCategory, 
    duration, 
    userName,
    modelId = DEFAULT_MODEL_ID,
    userApiKey,
    profile
  } = flowInput;

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  const styleGuides = StyleGuidelines[style] || [];
  const categoryGuides = CategoryGuidelines[contentCategory] || [];
  const durationGuides = getDurationGuidance(duration);

  // Build system prompt
  const systemPrompt = `System Role: You are a senior video prompt engineer. Produce production-ready descriptions optimized for AI video generators (e.g., Veo 3, Runway Gen-3, Luma). Be precise, visual, and actionable.`;

  // Build user prompt
  let userPrompt = `User: ${userName || 'Designer'}\n`;
  userPrompt += `Style: ${style}\n`;
  userPrompt += `Content Category: ${contentCategory}\n`;
  userPrompt += `Duration: ${duration} seconds\n`;
  userPrompt += `\n`;

  userPrompt += `Quality Guidelines (follow all):\n`;
  userPrompt += `- Global:\n`;
  userPrompt += `  • Avoid brand names, watermarks, copyrighted characters, and real identities\n`;
  userPrompt += `  • Prefer verbs for motion: dolly, truck, crane, tilt, pan, orbit, rack focus\n`;
  userPrompt += `  • Describe lighting: key/fill/rim; golden hour, overcast softbox, neon practicals\n`;
  userPrompt += `  • Include mood and atmosphere cues; specify environment textures and depth\n`;
  
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
  userPrompt += `Your task:\n`;
  userPrompt += `- Write a single, tightly crafted description that a video model can follow to produce a high-quality result.\n`;
  userPrompt += `- Include: subject, setting, camera motion, shot type (CU/WS/OS/etc.), lens cues (wide/normal/tele), lighting, color/mood, and a clear payoff.\n`;
  userPrompt += `- DO NOT include logos, on-screen text instructions, or external references.\n`;
  userPrompt += `\n`;

  userPrompt += `Language:\n`;
  userPrompt += `- If language = "english": output only English.\n`;
  userPrompt += `- If language = "bengali": output only Bengali.\n`;
  userPrompt += `- If language = "both": output both languages.\n`;
  userPrompt += `\n`;

  userPrompt += `Output strictly as JSON only (no extra text). Omit keys that do not apply:\n`;
  userPrompt += `{\n`;
  userPrompt += `  "descriptionEnglish": "...",\n`;
  userPrompt += `  "descriptionBengali": "..."\n`;
  userPrompt += `}`;

  try {
    const output = await generateJSON<GenerateVideoDescriptionOutput>({
      modelId,
      temperature: 0.8,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    logDebug('AI call succeeded');
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
