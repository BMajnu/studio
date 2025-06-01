/**
 * Conflict Resolver for Chat Session Data
 * 
 * Provides utilities for detecting and resolving conflicts between
 * local storage and Firebase data versions.
 */

import type { ChatSession, ChatMessage, ChatSessionMetadata } from '@/lib/types';

export enum ConflictResolutionStrategy {
  KEEP_NEWEST = 'keep_newest',
  KEEP_LOCAL = 'keep_local',
  KEEP_FIREBASE = 'keep_firebase',
  MERGE_MESSAGES = 'merge_messages',
  MANUAL = 'manual'
}

export interface ConflictDetectionResult {
  hasConflict: boolean;
  isLocalNewer: boolean;
  isFirebaseNewer: boolean;
  messageCountDiff: number;
  timeGapMs: number; // Time difference in ms
  localOnlyMessageIds: string[];
  firebaseOnlyMessageIds: string[];
  recommendedStrategy: ConflictResolutionStrategy;
}

/**
 * Detect if there's a conflict between local and Firebase versions of a session
 */
export function detectSessionConflict(
  localSession: ChatSession,
  firebaseSession: ChatSession
): ConflictDetectionResult {
  // Initial result object
  const result: ConflictDetectionResult = {
    hasConflict: false,
    isLocalNewer: false,
    isFirebaseNewer: false,
    messageCountDiff: 0,
    timeGapMs: 0,
    localOnlyMessageIds: [],
    firebaseOnlyMessageIds: [],
    recommendedStrategy: ConflictResolutionStrategy.KEEP_NEWEST
  };
  
  // Compare basic metadata
  const localUpdatedAt = localSession.updatedAt || 0;
  const firebaseUpdatedAt = firebaseSession.updatedAt || 0;
  
  result.timeGapMs = Math.abs(localUpdatedAt - firebaseUpdatedAt);
  
  result.isLocalNewer = localUpdatedAt > firebaseUpdatedAt;
  result.isFirebaseNewer = firebaseUpdatedAt > localUpdatedAt;
  
  // Compare message counts
  result.messageCountDiff = localSession.messages.length - firebaseSession.messages.length;
  
  // Get message IDs for comparing content
  const localMessageIds = new Set(localSession.messages.map(m => m.id));
  const firebaseMessageIds = new Set(firebaseSession.messages.map(m => m.id));
  
  // Find messages only in local storage
  result.localOnlyMessageIds = [...localMessageIds].filter(id => !firebaseMessageIds.has(id));
  
  // Find messages only in Firebase
  result.firebaseOnlyMessageIds = [...firebaseMessageIds].filter(id => !localMessageIds.has(id));
  
  // Detect conflicts
  result.hasConflict = result.localOnlyMessageIds.length > 0 || result.firebaseOnlyMessageIds.length > 0;
  
  // Additional conflict detection - check for message content differences
  // (even when IDs are the same)
  if (!result.hasConflict) {
    const sharedIds = [...localMessageIds].filter(id => firebaseMessageIds.has(id));
    
    for (const id of sharedIds) {
      const localMessage = localSession.messages.find(m => m.id === id)!;
      const firebaseMessage = firebaseSession.messages.find(m => m.id === id)!;
      
      // Compare timestamps or content to see if they differ
      if (localMessage.timestamp !== firebaseMessage.timestamp || 
          JSON.stringify(localMessage.content) !== JSON.stringify(firebaseMessage.content)) {
        result.hasConflict = true;
        break;
      }
    }
  }
  
  // Determine recommended strategy
  if (result.hasConflict) {
    if (result.isLocalNewer && result.messageCountDiff > 0) {
      // Local is newer and has more messages
      result.recommendedStrategy = ConflictResolutionStrategy.KEEP_LOCAL;
    } else if (result.isFirebaseNewer && result.messageCountDiff < 0) {
      // Firebase is newer and has more messages
      result.recommendedStrategy = ConflictResolutionStrategy.KEEP_FIREBASE;
    } else if (result.localOnlyMessageIds.length > 0 && result.firebaseOnlyMessageIds.length > 0) {
      // Both versions have unique messages, merge them
      result.recommendedStrategy = ConflictResolutionStrategy.MERGE_MESSAGES;
    } else {
      // Default to newest version
      result.recommendedStrategy = ConflictResolutionStrategy.KEEP_NEWEST;
    }
  }
  
  return result;
}

/**
 * Resolve a session conflict using the specified strategy
 */
export function resolveSessionConflict(
  localSession: ChatSession,
  firebaseSession: ChatSession,
  strategy: ConflictResolutionStrategy = ConflictResolutionStrategy.KEEP_NEWEST
): ChatSession {
  switch (strategy) {
    case ConflictResolutionStrategy.KEEP_LOCAL:
      return { ...localSession };
      
    case ConflictResolutionStrategy.KEEP_FIREBASE:
      return { ...firebaseSession };
      
    case ConflictResolutionStrategy.KEEP_NEWEST:
      return localSession.updatedAt >= firebaseSession.updatedAt 
        ? { ...localSession } 
        : { ...firebaseSession };
      
    case ConflictResolutionStrategy.MERGE_MESSAGES:
      return mergeSessionMessages(localSession, firebaseSession);
      
    case ConflictResolutionStrategy.MANUAL:
      // Return a copy of both for manual resolution
      return { ...localSession };
      
    default:
      // Default to keeping local version
      return { ...localSession };
  }
}

/**
 * Merge messages from two versions of the same session
 */
function mergeSessionMessages(localSession: ChatSession, firebaseSession: ChatSession): ChatSession {
  // Create a map of message IDs to messages from both sources
  const messageMap = new Map<string, ChatMessage>();
  
  // Add all firebase messages first
  firebaseSession.messages.forEach(message => {
    messageMap.set(message.id, { ...message });
  });
  
  // Then add/override with local messages (prioritizing local)
  localSession.messages.forEach(message => {
    messageMap.set(message.id, { ...message });
  });
  
  // Convert back to array and sort by timestamp
  const mergedMessages = Array.from(messageMap.values())
    .sort((a, b) => a.timestamp - b.timestamp);
  
  // Create merged session
  return {
    ...localSession,
    messages: mergedMessages,
    updatedAt: Math.max(localSession.updatedAt, firebaseSession.updatedAt)
  };
}

/**
 * Merge metadata from local and Firebase sources
 */
export function mergeSessionMetadata(
  localMetadata: ChatSessionMetadata[],
  firebaseMetadata: ChatSessionMetadata[]
): ChatSessionMetadata[] {
  const metadataMap = new Map<string, ChatSessionMetadata>();
  
  // Add all firebase metadata first
  firebaseMetadata.forEach(metadata => {
    metadataMap.set(metadata.id, { ...metadata });
  });
  
  // Then add/override with local metadata if it's newer
  localMetadata.forEach(metadata => {
    const existing = metadataMap.get(metadata.id);
    if (!existing || metadata.lastMessageTimestamp > existing.lastMessageTimestamp) {
      metadataMap.set(metadata.id, { ...metadata });
    }
  });
  
  // Convert back to array and sort by timestamp (newest first)
  return Array.from(metadataMap.values())
    .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
} 