// Fallback types for Chrome when @types/chrome isn't installed locally
// This avoids TS errors in CI/IDE before dependencies are installed.
declare const chrome: any;
