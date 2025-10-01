// src/ai/flows/generate-platform-messages.ts
'use server';
/**
 * @fileOverview A flow for generating standardized platform messages for order delivery and revisions, tailored with the user's details.
 *
 * - generatePlatformMessages - A function that handles the generation of platform messages.
 * - GeneratePlatformMessagesInput - The input type for the generatePlatformMessages function.
 * - GeneratePlatformMessagesOutput - The return type for the generatePlatformMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Schema for the flow's input, including modelId and userApiKey
const GeneratePlatformMessagesFlowInputSchema = z.object({
  name: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  services: z.array(z.string()).optional().describe('A list of services offered by the designer.'),
  deliveryNotes: z.string().optional().describe('Any notes about the delivery (e.g., client message context, number of designs).'),
  revisionNotes: z.string().optional().describe('Any notes about the revision.'),
  fiverrUsername: z.string().optional().describe('The Fiverr username of the designer.'),
  customSellerFeedbackTemplate: z.string().optional().describe('Custom seller feedback template provided by the user.'),
  customClientFeedbackResponseTemplate: z.string().optional().describe('Custom client feedback response template provided by the user.'),
  messageType: z.enum(['delivery', 'revision']).describe('The type of message to generate (delivery or revision).'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GeneratePlatformMessagesInput = z.infer<typeof GeneratePlatformMessagesFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId or userApiKey)
const GeneratePlatformMessagesPromptInputSchema = z.object({
  name: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  services: z.array(z.string()).optional().describe('A list of services offered by the designer.'),
  deliveryNotes: z.string().optional().describe('Any notes about the delivery.'),
  revisionNotes: z.string().optional().describe('Any notes about the revision.'),
  fiverrUsername: z.string().optional().describe('The Fiverr username of the designer.'),
  customSellerFeedbackTemplate: z.string().optional().describe('Custom seller feedback template.'),
  customClientFeedbackResponseTemplate: z.string().optional().describe('Custom client feedback response template.'),
  messageType: z.enum(['delivery', 'revision']).describe('The type of message to generate (delivery or revision).'),
});

const PlatformMessageSchema = z.object({
  message: z.string().describe('The generated platform message content.'),
  type: z.string().describe('A specific type for the message, e.g., "delivery_option_1", "thank_you_with_tip", "revision_option_1", "seller_feedback_template".'),
});

const GeneratePlatformMessagesOutputSchema = z.object({
  messages: z.array(PlatformMessageSchema).describe("An array of generated messages, each with its content and specific type."),
});
export type GeneratePlatformMessagesOutput = z.infer<typeof GeneratePlatformMessagesOutputSchema>;

export async function generatePlatformMessages(flowInput: GeneratePlatformMessagesInput): Promise<GeneratePlatformMessagesOutput> {
  const { userApiKey, modelId, name, professionalTitle, services, deliveryNotes, revisionNotes, fiverrUsername, customSellerFeedbackTemplate, customClientFeedbackResponseTemplate, messageType } = flowInput;
  const actualPromptInputData = { name, professionalTitle, services, deliveryNotes, revisionNotes, fiverrUsername, customSellerFeedbackTemplate, customClientFeedbackResponseTemplate, messageType };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generatePlatformMessages';

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

  const platformMessagesPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: {schema: GeneratePlatformMessagesPromptInputSchema},
    output: {schema: GeneratePlatformMessagesOutputSchema},
    prompt: `You are an expert assistant for a graphic designer.

You are generating templates for the MESSAGE_TYPE process on a platform like Fiverr.
Designer's custom seller feedback base: "FEEDBACK_BASE"
Designer's custom client feedback response base: "RESPONSE_BASE"

SPECIFIC_INSTRUCTIONS

Output Format:
{
  "messages": [
    // Array of message objects, each with "message" and "type" as described above.
    // For "delivery" and "revision", there will be 7 messages.
  ]
}
Ensure each "message" field contains the full text for that template.
`
    .replace("MESSAGE_TYPE", messageType)
    .replace("FEEDBACK_BASE", customSellerFeedbackTemplate || "Great client, outstanding experience, easy requirement. I love working with you and looking forward to working with you again.")
    .replace("RESPONSE_BASE", customClientFeedbackResponseTemplate || "Thanks for your great feedback. I hope we will continue doing more and more.")
    .replace("SPECIFIC_INSTRUCTIONS", messageType === 'delivery' ? deliveryInstructions(name, deliveryNotes || 'No specific notes provided.', services || [], fiverrUsername || '') : revisionInstructions(name, revisionNotes || 'No specific notes provided.', services || [], fiverrUsername || '')),
  });

  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await platformMessagesPrompt(actualPromptInputData, { 
      model: modelToUse,
      // @ts-ignore - Handlebars options are supported but not properly typed in the Genkit type definitions
      handlebarsOptions: {
        knownHelpersOnly: false,
        knownHelpers: {
          eq: true
        },
        helpers: {
          eq: function(a: any, b: any): boolean {
            return a === b;
          }
        }
      }
    });
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}

// Helper functions for generating instruction blocks
function deliveryInstructions(name: string, notes: string, services: string[], fiverrUsername: string): string {
  const servicesList = services.length > 0 
    ? services.map(s => `\\n- ${s}`).join('') 
    : '\\n- A variety of design services!';
  
  return `Context/Notes for this delivery: "${notes}"

Your task is to generate SEVEN distinct message templates for a DELIVERY. Each template should be a separate item in the "messages" array of the output JSON.

1.  **Delivery Message Option 1 (Detailed):**
    *   Generate a friendly, professional delivery message. Infer project details (e.g., "logo designs for Weptool.com") from deliveryNotes if available, otherwise use a generic placeholder like "your designs".
    *   Mention number of designs/concepts (e.g., "[eight different variations]", "[number] designs"). If not in notes, use placeholder like "[number of] designs".
    *   Offer revisions. Request acceptance and feedback.
    *   Example structure: "Hello, Mate, I'm excited to share the final [project/designs]! I've included [number/details of designs]. If you need any revisions or adjustments, please feel free to reach out. Once you're satisfied, I kindly ask that you accept the delivery and consider leaving feedback. Your support means a lot! Thank you for the opportunity! Best regards, ${name}"
    *   This message should be the FIRST item in the "messages" array. Set its "type" to "delivery_option_1".

2.  **Delivery Message Option 2 (Standard):**
    *   A slightly different but still professional version of the delivery message.
    *   This message should be the SECOND item. Set its "type" to "delivery_option_2".

3.  **Delivery Message Option 3 (Concise):**
    *   A very brief and direct delivery message.
    *   Example: "Hi! Here are your [project/designs]. Let me know if you need anything else. Please accept the delivery when ready. Thanks, ${name}"
    *   This message should be the THIRD item. Set its "type" to "delivery_option_3".

4.  **Thank You Message (Order Completed WITH Tip):**
    *   Thank client for order AND tip.
    *   Include a list of other services offered by ${name} (use provided service list).
    *   Include portfolio link: fiverr.com/users/${fiverrUsername}/portfolio (if fiverrUsername is available).
    *   Example: "Thanks a lot for your tip😍, [Client Name if known, otherwise omit]! I am looking forward to working with you again. I'm thrilled to share some exciting updates on the services I offer currently: ${servicesList}\\nDive into my profile, gigs, reviews, and portfolio at fiverr.com/users/${fiverrUsername || 'your-username'}/portfolio to see the dedication and quality I bring to every project. I'm eager to continue our creative partnership! Best regards, ${name}"
    *   This message should be the FOURTH item. Set its "type" to "thank_you_with_tip".

5.  **Thank You Message (Order Completed WITHOUT Tip):**
    *   Thank client for order (no mention of tip).
    *   Include same service list and portfolio link as above.
    *   Example: "Thanks for your order and help! I am looking forward to working with you again🥰. Best regards, ${name}"
    *   This message should be the FIFTH item. Set its "type" to "thank_you_no_tip".

6.  **Seller Feedback Template:**
    *   Use the custom seller feedback base. Add placeholder for the designer to insert a short, positive project description.
    *   This message should be the SIXTH item. Set its "type" to "seller_feedback_template".

7.  **Client Feedback Response Template:**
    *   Use the custom client feedback response base. Adapt slightly if context suggests, but stick close to the template.
    *   This message should be the SEVENTH item. Set its "type" to "client_feedback_response_template".`;
}

function revisionInstructions(name: string, notes: string, services: string[], fiverrUsername: string): string {
  const servicesList = services.length > 0 
    ? services.map(s => `\\n- ${s}`).join('') 
    : '\\n- A variety of design services!';
    
  return `Context/Notes for this revision: "${notes}"

Your task is to generate SEVEN distinct message templates for a REVISION. The first three are revision delivery options, and the next four are standard follow-up messages. Each template should be a separate item in the "messages" array of the output JSON.

1.  **Revision Message Option 1 (Detailed):**
    *   Generate a friendly, professional message for delivering revisions. Infer project details from revisionNotes if available.
    *   Use this example as a base, but adapt it: "Hello, Mate, Thank you for your request for a revision. I'm pleased to share the updated version, and I trust it meets your expectations. If there's anything that still needs adjusting, please don't hesitate to let me know—I'm here to make sure it's just right. Once you're happy with the final product, I would greatly appreciate it if you could leave feedback. Your support truly means a lot to me! Thank you again, and I hope you have an excellent day! Best regards, ${name}"
    *   This message should be the FIRST item. Set its "type" to "revision_option_1".

2.  **Revision Message Option 2 (Standard):**
    *   A slightly different but still professional version of the revision delivery message.
    *   This message should be the SECOND item. Set its "type" to "revision_option_2".

3.  **Revision Message Option 3 (Concise):**
    *   A very brief and direct message for delivering revisions.
    *   Example: "Hi! Here are the updated [project/designs] based on your feedback. Let me know if further changes are needed. Thanks, ${name}"
    *   This message should be the THIRD item. Set its "type" to "revision_option_3".

4.  **Thank You Message (Order Completed WITH Tip - after revision):**
    *   Thank client for order AND tip.
    *   Include a list of other services offered by ${name} (use provided service list).
    *   Include portfolio link: fiverr.com/users/${fiverrUsername}/portfolio (if fiverrUsername is available).
    *   Example: "Thanks a lot for your tip😍! I am looking forward to working with you again. I'm thrilled to share some exciting updates on the services I offer currently: ${servicesList}\\nDive into my profile, gigs, reviews, and portfolio at fiverr.com/users/${fiverrUsername || 'your-username'}/portfolio to see the dedication and quality I bring to every project. I'm eager to continue our creative partnership! Best regards, ${name}"
    *   This message should be the FOURTH item. Set its "type" to "thank_you_with_tip".

5.  **Thank You Message (Order Completed WITHOUT Tip - after revision):**
    *   Thank client for order (no mention of tip).
    *   Include same service list and portfolio link as above.
    *   Example: "Thanks for your order and help! I am looking forward to working with you again🥰. Best regards, ${name}"
    *   This message should be the FIFTH item. Set its "type" to "thank_you_no_tip".

6.  **Seller Feedback Template (after revision):**
    *   Use the custom seller feedback base. Add placeholder for the designer to insert a short, positive project description (mentioning it was a revision if appropriate).
    *   This message should be the SIXTH item. Set its "type" to "seller_feedback_template".

7.  **Client Feedback Response Template (after revision):**
    *   Use the custom client feedback response base. Adapt slightly if context suggests, but stick close to the template.
    *   This message should be the SEVENTH item. Set its "type" to "client_feedback_response_template".`;
}
