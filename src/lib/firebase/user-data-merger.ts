/**
 * User Data Merger
 * 
 * Provides utilities for merging chat data between anonymous and authenticated users.
 * This allows seamless transition when a user logs in after using the app anonymously.
 */

import { FirebaseChatStorage } from './chatStorage';
import type { ChatSession, ChatSessionMetadata } from '@/lib/types';
import { mergeSessionMetadata } from './conflict-resolver';

/**
 * Key for anonymous user data in localStorage
 */
const ANON_USER_KEY = 'desainr_anonymous_user_id';

/**
 * Get the anonymous user ID from localStorage
 */
export function getAnonymousUserId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  
  // Try to get existing anonymous ID
  let anonymousId = localStorage.getItem(ANON_USER_KEY);
  
  // If no anonymous ID exists, don't create one - just return null
  return anonymousId;
}

/**
 * Create a new anonymous user ID and store it in localStorage
 */
export function createAnonymousUserId(): string {
  const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem(ANON_USER_KEY, anonymousId);
  return anonymousId;
}

/**
 * Clear the anonymous user ID from localStorage
 */
export function clearAnonymousUserId(): void {
  localStorage.removeItem(ANON_USER_KEY);
}

/**
 * Check if there is anonymous user data that could be merged
 */
export async function hasAnonymousData(): Promise<boolean> {
  const anonymousId = getAnonymousUserId();
  if (!anonymousId) return false;
  
  // Check for sessions in localStorage
  let hasLocalData = false;
  try {
    const localDataJson = localStorage.getItem(`firebase_chat_sessions_${anonymousId}`);
    if (localDataJson) {
      const localData = JSON.parse(localDataJson);
      hasLocalData = Array.isArray(localData) && localData.length > 0;
    }
  } catch (e) {
    console.error('Error checking for anonymous data:', e);
  }
  
  return hasLocalData;
}

/**
 * Merge anonymous user data with authenticated user data
 * @param authenticatedUserId The user ID of the logged-in user
 * @returns Object containing merge statistics
 */
export async function mergeAnonymousDataWithUser(
  authenticatedUserId: string
): Promise<{ 
  sessionsMerged: number, 
  anonymousId: string | null 
}> {
  // Get the anonymous user ID
  const anonymousId = getAnonymousUserId();
  if (!anonymousId || !authenticatedUserId) {
    return { 
      sessionsMerged: 0,
      anonymousId 
    };
  }
  
  // Track statistics
  let sessionsMerged = 0;
  
  try {
    // Get anonymous user metadata from localStorage
    const localDataJson = localStorage.getItem(`firebase_chat_sessions_${anonymousId}`);
    if (!localDataJson) {
      return { 
        sessionsMerged,
        anonymousId 
      };
    }
    
    const localMetadata = JSON.parse(localDataJson) as ChatSessionMetadata[];
    if (!Array.isArray(localMetadata) || localMetadata.length === 0) {
      return { 
        sessionsMerged,
        anonymousId 
      };
    }
    
    // Get authenticated user metadata from Firebase
    const authenticatedMetadata = await FirebaseChatStorage.listSessionsMetadata(authenticatedUserId);
    
    // Create a set of authenticated session names to avoid duplicates
    const existingNameSet = new Set(authenticatedMetadata.map(meta => meta.name.toLowerCase()));
    
    // Process each anonymous session
    for (const meta of localMetadata) {
      try {
        // Get the full session data from localStorage
        const sessionJson = localStorage.getItem(`firebase_chat_session_${anonymousId}_${meta.id}`);
        if (!sessionJson) continue;
        
        const session = JSON.parse(sessionJson) as ChatSession;
        
        // Skip empty sessions
        if (!session.messages || session.messages.length === 0) continue;
        
        // Create a new session for the authenticated user
        // Use original name if unique, otherwise add suffix
        let sessionName = session.name;
        if (existingNameSet.has(sessionName.toLowerCase())) {
          sessionName = `${sessionName} (Imported)`;
        }
        
        // Create a new session with the authenticated user ID
        const newSession: ChatSession = {
          ...session,
          id: `${authenticatedUserId}_${Date.now()}_${sessionsMerged}`,
          userId: authenticatedUserId,
          name: sessionName,
          updatedAt: Date.now()
        };
        
        // Save to Firebase
        const success = await FirebaseChatStorage.saveSession(
          authenticatedUserId,
          newSession
        );
        
        if (success) {
          sessionsMerged++;
          existingNameSet.add(sessionName.toLowerCase());
        }
      } catch (e) {
        console.error(`Error merging session ${meta.id}:`, e);
      }
    }
    
    console.log(`Merged ${sessionsMerged} sessions from anonymous user ${anonymousId} to authenticated user ${authenticatedUserId}`);
    
    return {
      sessionsMerged,
      anonymousId
    };
  } catch (error) {
    console.error('Error merging anonymous data:', error);
    return { 
      sessionsMerged,
      anonymousId 
    };
  }
}

/**
 * Clean up anonymous user data after successful merge
 * Call this only after confirming the data has been successfully merged
 */
export function cleanupAnonymousDataAfterMerge(anonymousId: string): void {
  if (!anonymousId) return;
  
  try {
    // Remove metadata
    localStorage.removeItem(`firebase_chat_sessions_${anonymousId}`);
    
    // Find and remove all session data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`firebase_chat_session_${anonymousId}_`)) {
        localStorage.removeItem(key);
      }
    }
    
    // Clear anonymous user ID
    clearAnonymousUserId();
    
    console.log(`Cleaned up anonymous user data for ${anonymousId}`);
  } catch (e) {
    console.error('Error cleaning up anonymous data:', e);
  }
} 