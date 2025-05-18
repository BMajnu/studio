
'use server';
/**
 * @fileOverview AI flow to check a user-made design for mistakes based on a client's prompt/requirements.
 * Provides feedback in Bangla.
 *
 * - checkMadeDesigns - A function to analyze a design.
 * - CheckMadeDesignsInput - Input type.
 * - CheckMadeDesignsOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

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
const CheckMadeDesignsFlowInputSchema = z.object({
  clientPromptOrDescription: z.string().describe("The original client prompt or description of requirements the design was based on. This may come from chat history or user input."),
  designToCheckDataUri: z.string().describe("A data URI of the design image to be checked. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history for additional context about the design requirements."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
});
export type CheckMadeDesignsInput = z.infer<typeof CheckMadeDesignsFlowInputSchema>;

// Schema for the prompt's specific input
const CheckMadeDesignsPromptInputSchema = z.object({
  clientPromptOrDescription: z.string().describe("The original client prompt or description of requirements."),
  designToCheckDataUri: z.string().describe("The design image to be checked."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history."),
});

const MistakeAnalysisSchema = z.object({
  wrongObjectOrElements: z.string().describe("Mistakes related to incorrect objects, graphics, or elements. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  wrongPositions: z.string().describe("Mistakes related to incorrect positioning of objects, graphics, or elements. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  typingMistakes: z.string().describe("Typing mistakes, wrong text, or unnecessary text. Provide corrections line by line if applicable. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  wrongColors: z.string().describe("Mistakes related to wrong colors. Mention specific color codes if possible. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  wrongSizes: z.string().describe("Mistakes related to wrong sizes of objects, graphics, or elements. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  missingElements: z.string().describe("Identify any missing text, objects, graphics, or elements. Describe their expected positions, colors, fonts, etc. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
  otherMistakes: z.string().describe("Any other mistakes not covered above. Specify if changes are 'Must Required' or 'Optional'. Output in Bangla."),
});

const CheckMadeDesignsOutputSchema = z.object({
  mistakeAnalysis: MistakeAnalysisSchema,
  overallSummary: z.string().describe("A final summary of the design check. Output in Bangla."),
});
export type CheckMadeDesignsOutput = z.infer<typeof CheckMadeDesignsOutputSchema>;

export async function checkMadeDesigns(input: CheckMadeDesignsInput): Promise<CheckMadeDesignsOutput> {
  return checkMadeDesignsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkMadeDesignsPrompt',
  input: { schema: CheckMadeDesignsPromptInputSchema },
  output: { schema: CheckMadeDesignsOutputSchema },
  prompt: `You are an expert design reviewer assisting a designer named {{{userName}}}. Their communication style is: {{{communicationStyleNotes}}}.
The designer made a design based on a client's requirements and wants you to check it thoroughly for mistakes.
Your entire response MUST be in Bangla.

Client's Original Requirements/Prompt:
"{{{clientPromptOrDescription}}}"

{{#if chatHistory.length}}
Supporting Conversation History (for context on requirements):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

Design to Check:
{{media url=designToCheckDataUri}}

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
}
`,
});

const checkMadeDesignsFlow = ai.defineFlow(
  {
    name: 'checkMadeDesignsFlow',
    inputSchema: CheckMadeDesignsFlowInputSchema,
    outputSchema: CheckMadeDesignsOutputSchema,
  },
  async (flowInput) => {
    const { modelId, ...actualPromptInput } = flowInput;
    const modelToUse = modelId || DEFAULT_MODEL_ID;
    
    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
