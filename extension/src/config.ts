// Central config for the DesAInR extension
// Update these as needed; background.ts will prefer APP_BASE_URL and cache the working one.

// Use production by default
export const APP_BASE_URL = 'https://desainr.vercel.app';

// Default fallback target language when none saved in storage
export const DEFAULT_TARGET_LANG = 'en';

// Firebase Web SDK configuration for the extension (client-side, NOT service account)
// API key and these identifiers are safe to be public and are required for web apps.
export const FIREBASE_WEB_CONFIG = {
  apiKey: 'AIzaSyDb3FPl9-DA_RiY_m8flV-gePeLFnXYVoA',
  authDomain: 'desainr.firebaseapp.com',
  projectId: 'desainr',
  storageBucket: 'desainr.firebasestorage.app',
  messagingSenderId: '897610202784',
  appId: '1:897610202784:web:b6a38c0fdf6b07bfe5d3c5',
};
