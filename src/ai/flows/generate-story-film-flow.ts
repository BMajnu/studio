'use server';
// ✅ MIGRATED to @google/genai SDK (from Genkit)
/**
 * Story/Film Generator Flow
 * Produces bilingual natural prompts + structured JSON with scenes for story/film.
 */

// MIGRATED: Using TypeScript types instead of Genkit zod
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON, generateText } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';';
// MIGRATED: Using genai-helper instead
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateStoryFilm] ${label}`, ...args); } catch(_){}
};

const AttachedFileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUri: z.string().optional(),
  textContent: z.string().optional(),
});

const InputSchema = z.object({
  userName: z.string().default('Designer'),
  storylineIdea: z.string().min(1, 'Provide a story idea or synopsis'),
  sceneCount: z.number().int().min(1).max(30).optional(),
  decideByAI: z.boolean().optional(),
  storyType: z.string().optional(),
  audioMode: z.enum(['speaking','narration','none']).optional(),
  duration: z.number().optional(),
  attachedFiles: z.array(AttachedFileSchema).optional(),
  selectedGalleryAssets: z.any().optional(),
});
export type GenerateStoryFilmInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  normalPromptEnglish: z.string().optional(),
  normalPromptBengali: z.string().optional(),
  jsonPrompt: z.any().optional(),
  veo3OptimizedPrompt: z.string().optional(),
  technicalNotes: z.array(z.string()).optional(),
  sceneBreakdown: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});
export type GenerateStoryFilmOutput = z.infer<typeof OutputSchema>;

export async function generateStoryFilm(flowInput: GenerateStoryFilmInput): Promise<GenerateStoryFilmOutput> {
  const flowName = 'generateStoryFilm';
  logDebug('input', flowInput);
  const modelToUse = DEFAULT_MODEL_ID;

  const profileStub = { userId: 'default', name: 'User', services: [], geminiApiKeys: [] as string[] } as any;
  const client = new GeminiClient({ profile: profileStub });

  const desiredScenes = flowInput.decideByAI ? 'Decide scene count based on pacing' : (flowInput.sceneCount ? `${flowInput.sceneCount} scenes` : '5-8 scenes by default');

  const promptText = `System Role: Senior film prompt engineer. Create production-ready prompts for narrative video generation (Veo 3 primary).

User: ${flowInput.userName}
Story Idea: ${flowInput.storylineIdea}
Story Type: ${flowInput.storyType || 'auto'}
Audio Mode: ${flowInput.audioMode || 'auto'}
Target Scenes: ${desiredScenes}
${flowInput.duration ? `Total Duration: ${flowInput.duration} seconds` : ''}

Requirements:
- Generate a clear list of scenes with: sceneNumber, duration (approx), description, cameraMovement, lighting, mood, shotType, lens, location, timeOfDay, transition.
- Maintain character/subject consistency across scenes; avoid brands and real identities.
- Output bilingual natural prompts (English and Bengali), a structured JSON prompt, Veo3-optimized concise paragraph, technical notes, keywords, and a scene breakdown list.

Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords`;

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
      let enriched = output as GenerateStoryFilmOutput;
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
    return output as GenerateStoryFilmOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
