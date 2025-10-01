'use server';
/**
 * Viral Video Generator Flow
 * Produces bilingual prompts + structured JSON optimized for short-form viral content.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateViralVideo] ${label}`, ...args); } catch(_){}
};

const AttachedFileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUri: z.string().optional(),
  textContent: z.string().optional(),
});

const InputSchema = z.object({
  userName: z.string().default('Designer'),
  topic: z.string().min(1, 'Provide a topic'),
  targetAudience: z.string().optional(),
  duration: z.number().optional(),
  style: z.string().optional(),
  attachedFiles: z.array(AttachedFileSchema).optional(),
  selectedGalleryAssets: z.any().optional(),
});
export type GenerateViralVideoInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  normalPromptEnglish: z.string().optional(),
  normalPromptBengali: z.string().optional(),
  jsonPrompt: z.any().optional(),
  veo3OptimizedPrompt: z.string().optional(),
  technicalNotes: z.array(z.string()).optional(),
  sceneBreakdown: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});
export type GenerateViralVideoOutput = z.infer<typeof OutputSchema>;

export async function generateViralVideo(flowInput: GenerateViralVideoInput): Promise<GenerateViralVideoOutput> {
  const flowName = 'generateViralVideo';
  logDebug('input', flowInput);
  const modelToUse = DEFAULT_MODEL_ID;

  const profileStub = { userId: 'default', name: 'User', services: [], geminiApiKeys: [] as string[] } as any;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `System Role: Social content strategist + video prompt engineer. Create engaging, fast-paced short-form prompts optimized for Veo 3. Follow platform best practices. Avoid copyrighted brands/logos.

User: ${flowInput.userName}
Topic: ${flowInput.topic}
Target Audience: ${flowInput.targetAudience || 'general'}
${flowInput.duration ? `Duration: ${flowInput.duration} seconds` : ''}
${flowInput.style ? `Style: ${flowInput.style}` : ''}

Requirements:
- Hook in first 2 seconds, 3-7 concise scenes, strong CTA (if applicable).
- For each scene: sceneNumber, duration, on-screen action, overlay text (if any), cameraMovement, lighting, mood.
- Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords.`;

  try {
    const { data: output } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: InputSchema },
        output: { schema: OutputSchema },
        prompt: promptText,
      });
      const { output } = await promptDef(flowInput, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      // Inject gallery consistency instruction if assets provided
      let enriched = output as GenerateViralVideoOutput;
      const assets = (flowInput as { selectedGalleryAssets?: GalleryAsset[] }).selectedGalleryAssets || [];
      if (assets && assets.length) {
        const consistency = generateConsistencyInstruction(assets);
        enriched = {
          ...enriched,
          normalPromptEnglish: `${consistency}\n\n${enriched.normalPromptEnglish || ''}`.trim(),
          normalPromptBengali: `${consistency}\n\n${enriched.normalPromptBengali || ''}`.trim(),
          technicalNotes: [...(enriched.technicalNotes || []), 'Maintain asset consistency across all scenes as described above.'],
        };
      }
      return enriched as any;
    });
    return output as GenerateViralVideoOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
