'use server';
/**
 * @fileOverview AI flow to select and rank the top 5 designs from a collection.
 * Evaluates designs based on predefined criteria and expert-level parameters.
 *
 * - checkBestDesign - A function to analyze and rank designs.
 * - CheckBestDesignInput - Input type.
 * - CheckBestDesignOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Schema for a design object
const DesignSchema = z.object({
  id: z.string().describe("The unique identifier or file name of the design."),
  imageDataUri: z.string().describe("A data URI of the design image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  generatedPrompt: z.string().optional().describe("The original prompt or requirements used to generate this design."),
  createdAt: z.date().optional().describe("When the design was created."),
  metadata: z.record(z.string(), z.any()).optional().describe("Additional metadata about the design.")
});
export type Design = z.infer<typeof DesignSchema>;

// Schema for the flow's input
const CheckBestDesignInputSchema = z.object({
  designs: z.array(DesignSchema).describe("Collection of designs to be evaluated and ranked."),
  clientRequirements: z.string().optional().describe("The original client requirements or brief for the designs."),
  chatHistory: z.array(z.object({ 
    role: z.enum(['user', 'assistant']), 
    text: z.string() 
  })).optional().describe("Conversation history for additional context about the design requirements."),
  userName: z.string().describe('The name of the user (designer).'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type CheckBestDesignInput = z.infer<typeof CheckBestDesignInputSchema>;

// Schema for design evaluation parameters
const DesignEvaluationParametersSchema = z.object({
  // Predefined criteria
  visualAttractiveness: z.number().min(0).max(10).describe("Score for visual appeal and engagement (0-10)."),
  simplicity: z.number().min(0).max(10).describe("Score for ease of understanding and lack of clutter (0-10)."),
  colorHarmony: z.number().min(0).max(10).describe("Score for appropriate and harmonious use of colors (0-10)."),
  textAccuracyAndReadability: z.number().min(0).max(10).describe("Score for text accuracy and readability, if applicable (0-10)."),
  requirementMatching: z.number().min(0).max(10).describe("Score for alignment with client requirements (0-10)."),
  alignmentAndComposition: z.number().min(0).max(10).describe("Score for element alignment and arrangement (0-10)."),
  
  // Expert-level parameters
  visualHierarchy: z.number().min(0).max(10).describe("Score for how well the design guides the viewer's attention to the most important elements first (0-10)."),
  brandConsistency: z.number().min(0).max(10).describe("Score for how well the design aligns with brand guidelines and maintains consistent brand identity (0-10)."),
  innovationAndCreativity: z.number().min(0).max(10).describe("Score for unique and creative aspects that make the design stand out (0-10)."),
  accessibilityCompliance: z.number().min(0).max(10).describe("Score for how well the design meets accessibility standards (contrast ratios, text size, etc.) (0-10)."),
  
  // Overall score (calculated from individual parameters)
  overallScore: z.number().describe("The calculated overall score based on weighted parameters."),
});

// Schema for the ranked design output
const RankedDesignSchema = z.object({
  rank: z.number().describe("The rank position (1-5) of this design."),
  designId: z.string().describe("The unique identifier or file name of the design."),
  evaluationParameters: DesignEvaluationParametersSchema,
  reasonSummary: z.string().describe("A summary of the reasons for this design's ranking based on evaluation parameters."),
});

// Schema for the flow's output
const CheckBestDesignOutputSchema = z.object({
  topDesigns: z.array(RankedDesignSchema).max(5).describe("The top 5 (or fewer) ranked designs."),
  evaluationSummary: z.string().describe("A summary of the evaluation process and key observations across all designs."),
});
export type CheckBestDesignOutput = z.infer<typeof CheckBestDesignOutputSchema>;

// Schema for the prompt's specific input
const CheckBestDesignPromptInputSchema = z.object({
  designs: z.array(DesignSchema),
  clientRequirements: z.string().optional(),
  chatHistory: z.array(z.object({ 
    role: z.enum(['user', 'assistant']), 
    text: z.string() 
  })).optional(),
  userName: z.string(),
});

/**
 * Function to evaluate and rank designs based on various parameters
 * @param flowInput Input containing designs and context
 * @returns The top ranked designs with evaluation parameters
 */
export async function checkBestDesign(flowInput: CheckBestDesignInput): Promise<CheckBestDesignOutput> {
  const { userApiKey, modelId, designs, clientRequirements, chatHistory, userName } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'checkBestDesign';
  
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

  // Prepare the prompt input data
  const promptInput = {
    designs: designs.map(design => ({
      id: design.id,
      imageDataUri: design.imageDataUri,
      generatedPrompt: design.generatedPrompt,
      createdAt: design.createdAt,
      metadata: design.metadata
    })),
    clientRequirements: clientRequirements || "",
    chatHistory: chatHistory,
    userName: userName,
  };

  // Define the prompt with the Genkit API
  const checkBestDesignPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: CheckBestDesignPromptInputSchema },
    output: { schema: CheckBestDesignOutputSchema },
    prompt: `
    You are an expert design evaluator specialized in ranking visual designs based on quality and alignment with requirements.
    Your task is to evaluate a collection of designs and rank the top 5 based on both predefined and expert-level criteria.
    
    # Evaluation Criteria
    
    ## Predefined Criteria
    - Visual Attractiveness: How appealing and engaging the design looks.
    - Simplicity: How easy the design is to understand; not overly cluttered.
    - Color Harmony: How well the colors are used and if they are appropriate for the design's purpose.
    - Text Accuracy and Readability: If text is present, is it accurate and easy to read?
    - Requirement Matching: How well the design aligns with the original client requirements.
    - Alignment and Composition: How well elements are aligned and arranged in the design.
    
    ## Expert-Level Parameters
    - Visual Hierarchy: How well the design guides the viewer's attention to the most important elements first. Effective hierarchy creates a clear path for the eye to follow.
    - Brand Consistency: How well the design aligns with brand guidelines and maintains consistent brand identity through appropriate use of colors, typography, and imagery.
    - Innovation and Creativity: Unique and creative aspects that make the design stand out while still serving its purpose effectively.
    - Accessibility Compliance: How well the design meets accessibility standards like adequate contrast ratios, text size, and color combinations that work for color-blind users.
    
    # Your Task
    1. Evaluate each design based on all criteria, assigning a score from 0-10 for each parameter.
    2. Calculate an overall weighted score for each design.
    3. Rank the designs based on their overall scores.
    4. Select the top 5 designs and provide a brief explanation for each ranking.
    5. Provide a summary of the evaluation process and key observations across all designs.
    
    {{#if clientRequirements}}
    Client Requirements:
    {{{clientRequirements}}}
    {{/if}}
    
    {{#if chatHistory.length}}
    Supporting Conversation History (for context on requirements):
    {{#each chatHistory}}
    {{this.role}}: {{{this.text}}}
    ---
    {{/each}}
    {{/if}}
    
    Designs to Evaluate:
    {{#each designs}}
    Design ID: {{this.id}}
    {{media url=this.imageDataUri}}
    {{#if this.generatedPrompt}}
    Original Prompt: {{{this.generatedPrompt}}}
    {{/if}}
    ---
    {{/each}}
    `
  });

  // Execute the prompt
  try {
    console.log(`INFO (${flowName}): Executing design evaluation prompt with ${apiKeySourceForLog}`);
    const {output} = await checkBestDesignPrompt(promptInput, { model: modelToUse });
    console.log(`INFO (${flowName}): Successfully completed evaluation of ${designs.length} designs.`);
    
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    
    return output;
  } catch (error) {
    console.error('Error in checkBestDesign flow:', error);
    throw new Error(`Failed to evaluate designs: ${error instanceof Error ? error.message : String(error)}`);
  }
}
