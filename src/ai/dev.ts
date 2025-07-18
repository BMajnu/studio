import { config } from 'dotenv';
config();

import '@/ai/flows/process-client-message.ts';
import '@/ai/flows/generate-platform-messages.ts';
import '@/ai/flows/suggest-client-replies.ts';
import '@/ai/flows/generate-chat-name-flow.ts';
import '@/ai/flows/analyze-client-requirements.ts';
import '@/ai/flows/generate-engagement-pack-flow.ts';
import '@/ai/flows/generate-design-ideas-flow.ts';
import '@/ai/flows/generate-design-prompts-flow.ts';
import '@/ai/flows/check-made-designs-flow.ts';
import '@/ai/flows/generate-editing-prompts-flow.ts';
import '@/ai/flows/generate-brief-flow.ts';
import '@/ai/flows/process-custom-instruction.ts';
import '@/ai/flows/prompt-to-replicate-flow.ts';
import '@/ai/flows/prompt-with-custom-sense-flow.ts';
