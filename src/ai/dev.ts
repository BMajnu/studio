import { config } from 'dotenv';
config();

import '@/ai/flows/process-client-message.ts';
import '@/ai/flows/generate-platform-messages.ts';
import '@/ai/flows/suggest-client-replies.ts';