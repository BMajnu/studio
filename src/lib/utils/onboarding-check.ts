import type { UserProfile } from '@/lib/types';

/**
 * Check if a user needs to complete onboarding setup
 * Returns true if:
 * 1. No valid API key is set
 * 2. Name is not set or is the default name "New User"
 */
export function needsOnboarding(profile: UserProfile | null): boolean {
  if (!profile) {
    return true;
  }

  // Check for valid API key
  const hasValidApiKey = 
    profile.geminiApiKeys && 
    profile.geminiApiKeys.length > 0 && 
    profile.geminiApiKeys[0] && 
    profile.geminiApiKeys[0].trim() !== '' &&
    profile.geminiApiKeys[0].length >= 20; // Minimum realistic API key length

  if (!hasValidApiKey) {
    return true;
  }

  // Check if name is set and not the default "New User"
  const hasValidName = 
    profile.name && 
    profile.name.trim() !== '' && 
    profile.name !== 'New User'; // Default name from constants

  if (!hasValidName) {
    return true;
  }

  return false;
}

/**
 * Check if API key looks valid (basic format validation)
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (!apiKey || apiKey.trim().length < 20) {
    return false;
  }

  // Google AI API keys typically start with "AI" 
  // OpenRouter keys typically start with "SK-"
  const trimmedKey = apiKey.trim();
  return trimmedKey.startsWith('AI') || trimmedKey.startsWith('SK-');
}
