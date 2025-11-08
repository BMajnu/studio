'use server';
/**
 * @fileOverview AI flow to check a user-made design for mistakes based on a client's prompt/requirements.
 * Provides feedback in Bangla.
 *
 * - checkMadeDesigns - A function to analyze a design.
 * - CheckMadeDesignsInput - Input type.
 * - CheckMadeDesignsOutput - Output type.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// Input interface
export interface CheckMadeDesignsInput {
  clientPromptOrDescription: string;
  designToCheckDataUri: string;
  userName: string;
  communicationStyleNotes: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interfaces
interface MistakeAnalysis {
  wrongObjectOrElements: string;
  wrongPositions: string;
  typingMistakes: string;
  wrongColors: string;
  wrongSizes: string;
  missingElements: string;
  otherMistakes: string;
}

export interface CheckMadeDesignsOutput {
  mistakeAnalysis: MistakeAnalysis;
  overallSummary: string;
}

export async function checkMadeDesigns(flowInput: CheckMadeDesignsInput): Promise<CheckMadeDesignsOutput> {
  const { 
    userApiKey, 
    modelId, 
    clientPromptOrDescription, 
    designToCheckDataUri, 
    userName, 
    communicationStyleNotes, 
    chatHistory = [],
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'checkMadeDesigns';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert design reviewer assisting a designer named ${userName}. Their communication style is: ${communicationStyleNotes}.
The designer made a design based on a client's requirements and wants you to check it thoroughly for mistakes.
Your entire response MUST be in Bangla.`;

  // Build user prompt
  let userPrompt = `Client's Original Requirements/Prompt:
"${clientPromptOrDescription}"

`;

  if (chatHistory.length > 0) {
    userPrompt += 'Supporting Conversation History (for context on requirements):\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
    userPrompt += '\n';
  }

  userPrompt += `Design to Check: [IMAGE PROVIDED]
NOTE: The design image should be analyzed visually.

Please analyze the design from top to bottom based on the client's requirements and the provided image.
Identify errors or mistakes and categorize them. For each mistake type, specify if the suggested change is "Must Required" (অবশ্যই প্রয়োজনীয়) or "Optional" (ঐচ্ছিক).

Mistake Categories (Provide detailed feedback for each in Bangla):
1.  **ভুল অবজেক্ট, গ্রাফিক্স বা উপাদান (Wrong object, graphics or any elements):** [ভুল থাকলে বিস্তারিত লিখুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
2.  **অবজেক্ট, গ্রাফিক্স বা উপাদানের ভুল অবস্থান (Wrong positions of object, graphics or any elements):** [ভুল থাকলে বিস্তারিত লিখুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
3.  **টাইপিং ভুল, ভুল টেক্সট, অপ্রয়োজনীয় টেক্সট (Typing mistake, wrong text, unnecessary text):** [ভুল থাকলে বিস্তারিত লিখুন, প্রয়োজনে লাইন বাই লাইন উল্লেখ করুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
4.  **অবজেক্ট, গ্রাফিক্স বা উপাদানের ভুল রঙ (Wrong color of object, graphics or any elements):** [ভুল থাকলে বিস্তারিত লিখুন, সম্ভব হলে কালার কোড উল্লেখ করুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
5.  **অবজেক্ট, গ্রাফিক্স বা উপাদানের ভুল আকার (Wrong size of object, graphics or any elements):** [ভুল থাকলে বিস্তারিত লিখুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
6.  **বাদ পড়া টেক্সট, অবজেক্ট, গ্রাফিক্স বা উপাদান (Missing text, object, graphics or any elements):** [কিছু বাদ পড়লে তার অবস্থান, রঙ, ফন্ট এবং অন্যান্য নির্দিষ্ট তথ্য বর্ণনা করুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]
7.  **অন্যান্য ভুল (Other mistakes):** [অন্য কোনো ভুল থাকলে বিস্তারিত লিখুন। এটি 'অবশ্যই প্রয়োজনীয়' না 'ঐচ্ছিক' উল্লেখ করুন।]

Finally, provide an **সামগ্রিক সারসংক্ষেপ (Overall Summary)** of your findings in Bangla.

Output Format (ensure your entire response is a single JSON object matching this structure):
{
  "mistakeAnalysis": {
    "wrongObjectOrElements": "...",
    "wrongPositions": "...",
    "typingMistakes": "...",
    "wrongColors": "...",
    "wrongSizes": "...",
    "missingElements": "...",
    "otherMistakes": "..."
  },
  "overallSummary": "..."
}`;
  
  try {
    const output = await generateJSON<CheckMadeDesignsOutput>({
      modelId: modelToUse,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, output size: ${JSON.stringify(output).length} bytes`);
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw classifyError(error);
  }
}
