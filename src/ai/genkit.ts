
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check for GOOGLE_API_KEY environment variable
if (!process.env.GOOGLE_API_KEY) {
  console.warn(
    "WARNING: GOOGLE_API_KEY environment variable is not set. " +
    "Genkit's googleAI plugin may not function correctly for AI flows. " +
    "Ensure it is set in your .env file and the server is restarted."
  );
}

export const ai = genkit({
  plugins: [googleAI()], // This relies on GOOGLE_API_KEY env var by default
  // Default model removed from here; will be specified in flows or prompt calls
});

