# Firebase Studio

This is a Next.js starter project using Firebase, Genkit AI flows, and Google AI plugins to power an interactive design assistant.

## Prerequisites
- Node.js v16 or newer
- npm (or Yarn)

## Setup
1. Clone the repository and `cd studio`
2. Install dependencies:
   ```bash
   npm install
   # or yarn
   yarn install
   ```

## Environment Variables
Create a `.env.local` file in the root with the following keys:
```ini
# Firebase configuration (required for chat history and storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id  # optional

# Google Gemini / Genkit AI key (for AI flows)
GOOGLE_API_KEY=your_openai_or_google_api_key

# Next.js build version (automatically set)
APP_VERSION=${npm_package_version}
```

## Available Scripts
- `npm run dev` : Start development server at http://localhost:3000
- `npm run build` : Build for production
- `npm run start` : Start production server
- `npm run lint` : Run ESLint
- `npm run typecheck` : Run TypeScript compiler (no emit)
- `npm test` : Run Jest test suite

## Testing
- This project uses Jest for unit tests. Example tests are under `src/lib/firebase/__tests__`.
- To add more tests, create `*.test.ts` or `*.spec.ts` files and run `npm test`.

## Code Structure
- `src/app`: Next.js App Router pages and layouts
- `src/components`: Reusable UI components and chat flows
- `src/lib/hooks`: Custom React hooks (e.g., auth, chat history)
- `src/lib/firebase`: Firestore integration and chat storage service
- `src/ai/flows`: Definitions of server actions and AI flows (e.g., generate design ideas)

## Next Image
All raw `<img>` tags have been replaced with Next.js `<Image>` for optimized loading and LCP improvements.

## Contributing
Feel free to open issues or pull requests! Ensure you run lint and tests before submitting.

# Search API Integration

This project integrates with Google Custom Search API for better search results:

## Setting Up Search API Keys

To get complete and relevant search results, you'll need to set up an API key for Google Custom Search.

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
# Google Custom Search API
# Get from: https://developers.google.com/custom-search/v1/overview
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_CX=your_google_custom_search_engine_id_here
```

### How to obtain the API keys:

#### Google Custom Search:
1. Visit https://programmablesearchengine.google.com/
2. Create a new search engine
3. Get your Search Engine ID (CX)
4. Visit https://developers.google.com/custom-search/v1/overview to obtain an API key

Without these API keys, the application will fall back to simulated search results that may not be as comprehensive or relevant as real search results.
