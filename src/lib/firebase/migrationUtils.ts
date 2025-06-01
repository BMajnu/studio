import type { ChatSession, ChatSessionMetadata } from '@/lib/types';
import { FirebaseChatStorage } from './chatStorage';

/**
 * Processes a chat session before migration
 * Removes legacy specific fields and ensures proper formatting
 */
export function prepareChatSessionForMigration(session: ChatSession): ChatSession {
  // Create a new object without any legacy specific fields
  // Use destructuring with rest to safely exclude any legacy fields that might be present
  const { ...cleanSession } = session;
  
  // Ensure required fields exist with proper types
  const preparedSession: ChatSession = {
    ...cleanSession,
    id: cleanSession.id,
    name: cleanSession.name,
    messages: cleanSession.messages,
    createdAt: typeof cleanSession.createdAt === 'string' 
      ? new Date(cleanSession.createdAt).getTime()
      : cleanSession.createdAt,
    updatedAt: Date.now(),
    userId: cleanSession.userId,
    modelId: cleanSession.modelId
  };
  
  return preparedSession;
}

/**
 * Migrates all sessions for a user from local storage to Firebase
 * @param userId - The user ID
 * @param sessions - Local sessions to migrate
 * @param progressCallback - Optional callback for migration progress updates
 * @returns Number of successfully migrated sessions
 */
export async function migrateSessionsToFirebase(
  userId: string,
  sessions: ChatSession[],
  progressCallback?: (current: number, total: number) => void
): Promise<number> {
  let successCount = 0;
  
  for (let i = 0; i < sessions.length; i++) {
    try {
      const preparedSession = prepareChatSessionForMigration(sessions[i]);
      const success = await FirebaseChatStorage.saveSession(userId, preparedSession);
      
      if (success) {
        successCount++;
      }
      
      // Update progress if callback provided
      if (progressCallback) {
        progressCallback(i + 1, sessions.length);
      }
    } catch (error) {
      console.error(`Error migrating session ${sessions[i].id}:`, error);
    }
  }
  
  return successCount;
}

/**
 * Check if a user's data has been migrated to Firebase
 * @param userId - The user ID
 * @returns Promise resolving to boolean indicating if migration is needed
 */
export async function checkMigrationStatus(userId: string): Promise<boolean> {
  try {
    // Check if any sessions exist in Firebase
    const metadata = await FirebaseChatStorage.listSessionsMetadata(userId);
    
    // If we have sessions, migration has occurred
    return metadata.length > 0;
  } catch (error) {
    console.error("Error checking migration status:", error);
    return false;
  }
} 