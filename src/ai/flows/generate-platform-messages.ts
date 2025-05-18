
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

// Schema for the flow's input, including modelId
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
});
export type GeneratePlatformMessagesInput = z.infer<typeof GeneratePlatformMessagesFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId)
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

export async function generatePlatformMessages(input: GeneratePlatformMessagesInput): Promise<GeneratePlatformMessagesOutput> {
  return generatePlatformMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlatformMessagesPrompt',
  input: {schema: GeneratePlatformMessagesPromptInputSchema},
  output: {schema: GeneratePlatformMessagesOutputSchema},
  prompt: `You are an expert assistant for a graphic designer named {{name}}.
{{#if professionalTitle}}Their professional title is {{professionalTitle}}.{{/if}}
{{#if fiverrUsername}}Their Fiverr username is {{fiverrUsername}}.{{/if}}
{{#if services.length}}
Services offered by {{name}}:
{{#each services}}
- {{this}}
{{/each}}
{{/if}}

You are generating templates for the {{messageType}} process on a platform like Fiverr.

{{#if (eq messageType "delivery")}}
Context/Notes for this delivery: "{{#if deliveryNotes}}{{deliveryNotes}}{{else}}No specific notes provided.{{/if}}"
Designer's custom seller feedback base: "{{#if customSellerFeedbackTemplate}}{{customSellerFeedbackTemplate}}{{else}}Great client, outstanding experience, easy requirement. I love working with you and looking forward to working with you again.{{/if}}"
Designer's custom client feedback response base: "{{#if customClientFeedbackResponseTemplate}}{{customClientFeedbackResponseTemplate}}{{else}}Thanks for your great feedback. I hope we will continue doing more and more.{{/if}}"

Your task is to generate SEVEN distinct message templates for a DELIVERY. Each template should be a separate item in the "messages" array of the output JSON.

1.  **Delivery Message Option 1 (Detailed):**
    *   Generate a friendly, professional delivery message. Infer project details (e.g., "logo designs for Weptool.com") from deliveryNotes if available, otherwise use a generic placeholder like "your designs".
    *   Mention number of designs/concepts (e.g., "[eight different variations]", "[number] designs"). If not in notes, use placeholder like "[number of] designs".
    *   Offer revisions. Request acceptance and feedback.
    *   Example structure: "Hello, Mate, I'm excited to share the final [project/designs]! I've included [number/details of designs]. If you need any revisions or adjustments, please feel free to reach out. Once you’re satisfied, I kindly ask that you accept the delivery and consider leaving feedback. Your support means a lot! Thank you for the opportunity! Best regards, {{name}}"
    *   This message should be the FIRST item in the "messages" array. Set its "type" to "delivery_option_1".

2.  **Delivery Message Option 2 (Standard):**
    *   A slightly different but still professional version of the delivery message.
    *   This message should be the SECOND item. Set its "type" to "delivery_option_2".

3.  **Delivery Message Option 3 (Concise):**
    *   A very brief and direct delivery message.
    *   Example: "Hi! Here are your [project/designs]. Let me know if you need anything else. Please accept the delivery when ready. Thanks, {{name}}"
    *   This message should be the THIRD item. Set its "type" to "delivery_option_3".

4.  **Thank You Message (Order Completed WITH Tip):**
    *   Thank client for order AND tip.
    *   Include a list of other services offered by {{name}} (use provided service list).
    *   Include portfolio link: fiverr.com/users/{{fiverrUsername}}/portfolio (if fiverrUsername is available).
    *   Example: "Thanks a lot for your tip😍, [Client Name if known, otherwise omit]! I am looking forward to working with you again. I'm thrilled to share some exciting updates on the services I offer currently: {{#if services.length}}{{#each services}}\\n{{this}}{{/each}}{{else}}\\nA variety of other design services!{{/if}}\\nDive into my profile, gigs, reviews, and portfolio at fiverr.com/users/{{fiverrUsername}}/portfolio to see the dedication and quality I bring to every project. Interested in any of these services or have questions? Just send me a message—I’m here 24/7 to help your project exceed expectations. I’m eager to continue our creative partnership and bring your next project to life! Wishing you a wonderful day! Best regards, {{name}}"
    *   This message should be the FOURTH item. Set its "type" to "thank_you_with_tip".

5.  **Thank You Message (Order Completed WITHOUT Tip):**
    *   Thank client for order (no mention of tip).
    *   Include same service list and portfolio link as above.
    *   Example: "Thanks for your order and help, [Client Name if known, otherwise omit]! I am looking forward to working with you again🥰. I'm thrilled to share... [same service list and closing as above] ... Best regards, {{name}}"
    *   This message should be the FIFTH item. Set its "type" to "thank_you_no_tip".

6.  **Seller Feedback Template:**
    *   Use the custom seller feedback base. Add placeholder for {{name}} to insert a short, positive project description.
    *   Example: "{{#if customSellerFeedbackTemplate}}{{customSellerFeedbackTemplate}}{{else}}Great client, outstanding experience, easy requirement. I love working with you and looking forward to working with you again.{{/if}} [Add a short description about the project/order, e.g., 'The client was clear with requirements for the t-shirt design, making it a smooth process.']"
    *   This message should be the SIXTH item. Set its "type" to "seller_feedback_template".

7.  **Client Feedback Response Template:**
    *   Use the custom client feedback response base. Adapt slightly if context suggests, but stick close to the template.
    *   Example: "{{#if customClientFeedbackResponseTemplate}}{{customClientFeedbackResponseTemplate}}{{else}}Thanks for your great feedback. I hope we will continue doing more and more.{{/if}}"
    *   This message should be the SEVENTH item. Set its "type" to "client_feedback_response_template".
{{else if (eq messageType "revision")}}
Context/Notes for this revision: "{{#if revisionNotes}}{{revisionNotes}}{{else}}No specific notes provided.{{/if}}"
  Generate three distinct message options for providing a REVISION to the client.
  The third option should be very concise.
  Each message should be professional and clearly state that revisions have been made based on feedback.
  Set message "type" to "revision_option_1", "revision_option_2", "revision_option_3" respectively.
{{/if}}

Output Format:
{
  "messages": [
    // Array of message objects, each with "message" and "type" as described above.
    // For "delivery", there will be 7 messages. For "revision", there will be 3.
  ]
}
Ensure each "message" field contains the full text for that template.
`,
});

const generatePlatformMessagesFlow = ai.defineFlow(
  {
    name: 'generatePlatformMessagesFlow',
    inputSchema: GeneratePlatformMessagesFlowInputSchema,
    outputSchema: GeneratePlatformMessagesOutputSchema,
  },
  async (flowInput) => {
    const { modelId, ...actualPromptInput } = flowInput;
    const modelToUse = modelId || DEFAULT_MODEL_ID;

    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
