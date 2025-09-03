export const APP_BASE_URL = (import.meta as any).env?.VITE_APP_BASE_URL || 'http://localhost:9003';
export const DEFAULT_TARGET_LANG = (import.meta as any).env?.VITE_DEFAULT_TARGET_LANG || 'en';

// IMPORTANT: Prefer environment variables; avoid shipping hardcoded Firebase keys.
export const FIREBASE_WEB_CONFIG = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || '', // set in .env.local
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'desainr.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'desainr',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'desainr.appspot.com',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || ''
};
