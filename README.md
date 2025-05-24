# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# Search API Integration

This project integrates with Google Custom Search API for better search results:

## Setting Up Search API Keys

To get complete and relevant search results, you'll need to set up an API key for Google Custom Search.

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
# Google Custom Search API
# Get from: https://developers.google.com/custom-search/v1/overview
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_CX=your_google_custom_search_engine_id_here
```

### How to obtain the API keys:

#### Google Custom Search:
1. Visit https://programmablesearchengine.google.com/
2. Create a new search engine
3. Get your Search Engine ID (CX)
4. Visit https://developers.google.com/custom-search/v1/overview to obtain an API key

Without these API keys, the application will fall back to simulated search results that may not be as comprehensive or relevant as real search results.
