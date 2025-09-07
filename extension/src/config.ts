const __envBase = (import.meta as any).env?.VITE_APP_BASE_URL as string | undefined;
const __isLocalEnv = typeof __envBase === 'string' && /^(https?:\/\/)?(localhost|127\.0\.0\.1)/i.test(__envBase);
export const APP_BASE_URL = (!__envBase || __isLocalEnv)
  ? 'https://desainr.vercel.app'
  : __envBase;
export const DEFAULT_TARGET_LANG = (import.meta as any).env?.VITE_DEFAULT_TARGET_LANG || 'en';

// Firebase config removed from extension (auth-free build)
