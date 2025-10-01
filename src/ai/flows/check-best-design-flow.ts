'use server';
/**
 * @fileOverview AI flow to select and rank the top 5 designs from a collection.
 * Evaluates designs based on predefined criteria and expert-level parameters.
 *
 * - checkBestDesign - A function to analyze and rank designs.
 * - CheckBestDesignInput - Input type.
 * - CheckBestDesignOutput - Output type.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';

// Design type
export interface Design {
  id: string;
  imageDataUri: string;
  generatedPrompt?: string;
  createdAt?: Date;
  metadata?: Record<string, any>;
}

// Input interface
export interface CheckBestDesignInput {
  designs: Design[];
  clientRequirements?: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  userName: string;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Evaluation parameters
interface DesignEvaluationParameters {
  visualAttractiveness: number;
  simplicity: number;
  colorHarmony: number;
  textAccuracyAndReadability: number;
  requirementMatching: number;
  alignmentAndComposition: number;
  visualHierarchy: number;
  brandConsistency: number;
  innovationAndCreativity: number;
  accessibilityCompliance: number;
  overallScore: number;
}

// Ranked design
interface RankedDesign {
  rank: number;
  designId: string;
  evaluationParameters: DesignEvaluationParameters;
  reasonSummary: string;
}

// Output interface
export interface CheckBestDesignOutput {
  topDesigns: RankedDesign[];
  evaluationSummary: string;
}

/**
 * Function to evaluate and rank designs based on various parameters
 * @param flowInput Input containing designs and context
 * @returns The top ranked designs with evaluation parameters
 */
export async function checkBestDesign(flowInput: CheckBestDesignInput): Promise<CheckBestDesignOutput> {
  const { 
    userApiKey, 
    modelId, 
    designs, 
    clientRequirements = '', 
    chatHistory = [], 
    userName,
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'checkBestDesign';
  
  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert design evaluator specialized in ranking visual designs based on quality and alignment with requirements.
Your task is to evaluate a collection of designs and rank the top 5 based on both predefined and expert-level criteria.

# Evaluation Criteria

## Predefined Criteria (0-10 each)
- Visual Attractiveness: How appealing and engaging the design looks
- Simplicity: How easy the design is to understand; not overly cluttered
- Color Harmony: How well the colors are used and if they are appropriate
- Text Accuracy and Readability: If text is present, is it accurate and easy to read?
- Requirement Matching: How well the design aligns with the original client requirements
- Alignment and Composition: How well elements are aligned and arranged

## Expert-Level Parameters (0-10 each)
- Visual Hierarchy: How well the design guides the viewer's attention to important elements
- Brand Consistency: How well the design aligns with brand guidelines
- Innovation and Creativity: Unique and creative aspects that make the design stand out
- Accessibility Compliance: How well the design meets accessibility standards`;

  // Build user prompt
  let userPrompt = '';
  
  if (clientRequirements) {
    userPrompt += `**Client Requirements:**\n${clientRequirements}\n\n`;
  }

  if (chatHistory.length > 0) {
    userPrompt += '**Supporting Conversation History:**\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
    userPrompt += '\n';
  }

  userPrompt += `**Designs to Evaluate (${designs.length} total):**\n`;
  designs.forEach((design, idx) => {
    userPrompt += `\nDesign ${idx + 1} - ID: ${design.id}\n`;
    userPrompt += `[IMAGE PROVIDED - analyze visually]\n`;
    if (design.generatedPrompt) {
      userPrompt += `Original Prompt: ${design.generatedPrompt}\n`;
    }
    userPrompt += '---\n';
  });

  userPrompt += `\n**Your Task:**
1. Evaluate each design based on all 10 criteria, assigning scores from 0-10
2. Calculate an overall weighted score for each design
3. Rank the designs based on their overall scores
4. Select the top 5 designs and provide a brief explanation for each ranking
5. Provide a summary of the evaluation process and key observations

**Output Format:** Return ONLY a valid JSON object:
{
  "topDesigns": [
    {
      "rank": 1,
      "designId": "design_id_here",
      "evaluationParameters": {
        "visualAttractiveness": 9,
        "simplicity": 8,
        "colorHarmony": 9,
        "textAccuracyAndReadability": 9,
        "requirementMatching": 10,
        "alignmentAndComposition": 9,
        "visualHierarchy": 9,
        "brandConsistency": 8,
        "innovationAndCreativity": 9,
        "accessibilityCompliance": 8,
        "overallScore": 88
      },
      "reasonSummary": "This design excels in all key areas..."
    }
  ],
  "evaluationSummary": "Overall evaluation summary..."
}

Return up to 5 top designs ranked by overall score.`;

  try {
    const output = await generateJSON<CheckBestDesignOutput>({
      modelId: modelToUse,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, evaluated ${designs.length} designs, ranked top ${output.topDesigns.length}`);
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed:`, error);
    throw new Error(`Failed to evaluate designs: ${(error as Error).message}`);
  }
}
