"use client";

import { clearLocalStorageItems, getLocalStorageItem } from './storage-helpers';

// Key prefixes for identifying different types of data
const SESSION_PREFIX = 'desainr_chat_session_ls_v4_';
const INDEX_PREFIX = 'desainr_chat_history_index_ls_v4_';
const DELETED_PREFIX = 'desainr_deleted_sessions_';

// Storage management configuration
const MAX_SESSIONS_TO_KEEP = 50;        // Maximum number of sessions to keep by default
const SESSION_AGE_THRESHOLD = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const DEFAULT_CLEANUP_COUNT = 5;         // Default number of sessions to clean in one operation

/**
 * Clean up old chat sessions to free up storage space
 * @param userId The user ID to clean up sessions for
 * @param options Cleanup configuration options
 * @returns Promise resolving to the number of sessions cleaned up
 */
export async function cleanupOldSessions(
  userId: string, 
  options: {
    maxAge?: number,          // Max age in milliseconds (default 30 days)
    maxToKeep?: number,       // Max sessions to keep (default 50)
    maxToCleanup?: number     // Max sessions to clean in one operation
  } = {}
): Promise<number> {
  const maxAge = options.maxAge ?? SESSION_AGE_THRESHOLD;
  const maxToKeep = options.maxToKeep ?? MAX_SESSIONS_TO_KEEP;
  const maxToCleanup = options.maxToCleanup ?? DEFAULT_CLEANUP_COUNT;
  
  // Get the current timestamp for age comparison
  const now = Date.now();
  
  // Load the session metadata index
  const sessionIndex = loadSessionMetadataIndex(userId);
  if (sessionIndex.length <= maxToKeep) {
    console.log(`User ${userId} has ${sessionIndex.length} sessions, under limit of ${maxToKeep}`);
    return 0;
  }
  
  // Sort sessions by timestamp, oldest first
  sessionIndex.sort((a, b) => a.lastMessageTimestamp - b.lastMessageTimestamp);
  
  // Mark sessions for deletion
  const sessionsToDelete = [];
  for (const session of sessionIndex) {
    // Skip if we've marked enough sessions for deletion
    if (sessionsToDelete.length >= maxToCleanup) break;
    
    // Skip if keeping this session would still keep us under the limit
    if (sessionIndex.length - sessionsToDelete.length <= maxToKeep) break;
    
    const sessionAge = now - session.lastMessageTimestamp;
    // Only delete sessions that are old enough
    if (sessionAge > maxAge) {
      sessionsToDelete.push(session);
    }
  }
  
  // If we don't have any sessions eligible for deletion, return
  if (sessionsToDelete.length === 0) {
    console.log(`No sessions old enough to clean for user ${userId}`);
    return 0;
  }
  
  // Delete the marked sessions
  const deletedCount = await deleteSessionsBatch(userId, sessionsToDelete);
  
  // Update the metadata index to reflect deletions
  await updateSessionMetadataIndex(userId, sessionsToDelete.map(s => s.id));
  
  console.log(`Cleaned up ${deletedCount} old sessions for user ${userId}`);
  return deletedCount;
}

/**
 * Delete unused or orphaned sessions that aren't in the metadata index
 * @param userId The user ID to clean up sessions for
 * @returns Promise resolving to the number of orphaned sessions cleaned up
 */
export async function cleanupOrphanedSessions(userId: string): Promise<number> {
  // Get the session metadata index to find valid session IDs
  const sessionIndex = loadSessionMetadataIndex(userId);
  const validSessionIds = new Set(sessionIndex.map(s => s.id));
  
  // Find orphaned session keys in localStorage
  const orphanedKeys: string[] = [];
  const userSessionPrefix = `${SESSION_PREFIX}${userId}_`;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(userSessionPrefix)) continue;
    
    // Extract the session ID from the key
    const sessionId = key.replace(userSessionPrefix, '');
    
    // Skip compression flags
    if (sessionId.endsWith('_compressed')) continue;
    
    // Skip IndexedDB flags
    if (sessionId.endsWith('_idb')) continue;
    
    // If this session ID isn't in the metadata index, it's orphaned
    if (!validSessionIds.has(sessionId)) {
      orphanedKeys.push(key);
    }
  }
  
  // Delete orphaned keys
  for (const key of orphanedKeys) {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_compressed`);
      localStorage.removeItem(`${key}_idb`);
    } catch (e) {
      console.error(`Failed to remove orphaned key ${key}:`, e);
    }
  }
  
  console.log(`Cleaned up ${orphanedKeys.length} orphaned session keys for user ${userId}`);
  return orphanedKeys.length;
}

/**
 * Delete a batch of sessions
 * @param userId The user ID
 * @param sessions Array of session metadata to delete
 * @returns Promise resolving to number of sessions deleted
 */
async function deleteSessionsBatch(
  userId: string, 
  sessions: Array<{ id: string }>
): Promise<number> {
  let deletedCount = 0;
  
  for (const session of sessions) {
    try {
      // Keys to delete related to this session
      const sessionKey = `${SESSION_PREFIX}${userId}_${session.id}`;
      
      // Remove from localStorage
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(`${sessionKey}_compressed`);
      localStorage.removeItem(`${sessionKey}_idb`);
      
      // Mark as successfully deleted
      deletedCount++;
      
      // Add to deleted sessions tracking
      const deletedKey = `${DELETED_PREFIX}${userId}`;
      try {
        const deletedListRaw = localStorage.getItem(deletedKey);
        const deletedList = deletedListRaw ? JSON.parse(deletedListRaw) : [];
        deletedList.push({ id: session.id, deletedAt: Date.now() });
        
        // Keep only the last 100 deleted sessions
        if (deletedList.length > 100) {
          deletedList.splice(0, deletedList.length - 100);
        }
        
        localStorage.setItem(deletedKey, JSON.stringify(deletedList));
      } catch (e) {
        console.error("Failed to update deleted sessions tracking:", e);
      }
    } catch (e) {
      console.error(`Failed to delete session ${session.id}:`, e);
    }
  }
  
  return deletedCount;
}

/**
 * Load the session metadata index for a user
 * @param userId The user ID
 * @returns Array of session metadata
 */
function loadSessionMetadataIndex(userId: string): Array<{
  id: string;
  name: string;
  lastMessageTimestamp: number;
  preview: string;
  messageCount: number;
}> {
  try {
    const indexKey = `${INDEX_PREFIX}${userId}`;
    const indexRaw = getLocalStorageItem(indexKey);
    if (!indexRaw) return [];
    
    const index = JSON.parse(indexRaw);
    if (!Array.isArray(index)) return [];
    
    return index;
  } catch (e) {
    console.error("Failed to load session metadata index:", e);
    return [];
  }
}

/**
 * Update the session metadata index after deletions
 * @param userId The user ID
 * @param deletedIds Array of deleted session IDs
 */
async function updateSessionMetadataIndex(
  userId: string, 
  deletedIds: string[]
): Promise<boolean> {
  if (deletedIds.length === 0) return true;
  
  try {
    const indexKey = `${INDEX_PREFIX}${userId}`;
    const indexRaw = getLocalStorageItem(indexKey);
    if (!indexRaw) return false;
    
    let index = JSON.parse(indexRaw);
    if (!Array.isArray(index)) return false;
    
    // Remove the deleted sessions from the index
    const deletedSet = new Set(deletedIds);
    index = index.filter(session => !deletedSet.has(session.id));
    
    // Save the updated index
    localStorage.setItem(indexKey, JSON.stringify(index));
    return true;
  } catch (e) {
    console.error("Failed to update session metadata index:", e);
    return false;
  }
}

/**
 * Run comprehensive storage cleanup for a user
 * @param userId The user ID to clean up storage for
 * @returns Promise resolving to cleanup statistics
 */
export async function runComprehensiveCleanup(userId: string): Promise<{
  oldSessionsRemoved: number;
  orphanedSessionsRemoved: number;
  corruptedItemsRemoved: number;
}> {
  // Track cleanup statistics
  let stats = {
    oldSessionsRemoved: 0,
    orphanedSessionsRemoved: 0,
    corruptedItemsRemoved: 0
  };
  
  try {
    // Step 1: Clean up old sessions
    stats.oldSessionsRemoved = await cleanupOldSessions(userId);
    
    // Step 2: Clean up orphaned sessions
    stats.orphanedSessionsRemoved = await cleanupOrphanedSessions(userId);
    
    // Step 3: Clean up corrupted items
    stats.corruptedItemsRemoved = cleanupCorruptedItems();
    
  } catch (e) {
    console.error("Error during comprehensive cleanup:", e);
  }
  
  return stats;
}

/**
 * Clean up corrupted localStorage items
 * @returns Number of corrupted items removed
 */
function cleanupCorruptedItems(): number {
  let removedCount = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Skip non-DesAInR keys
      if (!key.startsWith('desainr_')) continue;
      
      // Skip compressed flags
      if (key.endsWith('_compressed')) continue;
      
      try {
        // Try to retrieve and parse the item
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        // Check for non-printable characters that might indicate corruption
        const hasBinaryPrefix = /^[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\xFF]/.test(value.substring(0, 10));
        
        if (hasBinaryPrefix && !key.endsWith('_compressed')) {
          // This is likely corrupted data (binary in a non-compressed key)
          console.warn(`Removing corrupted localStorage item: ${key}`);
          localStorage.removeItem(key);
          removedCount++;
        } else if (key.includes('history_index')) {
          // For history index, make sure it's valid JSON array
          try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
              console.warn(`Removing invalid history index (not an array): ${key}`);
              localStorage.removeItem(key);
              removedCount++;
            }
          } catch (parseError) {
            // If it's not valid JSON, remove it
            console.warn(`Removing corrupted history index: ${key}`);
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      } catch (itemError) {
        // If we can't even access the item, it might be corrupted
        console.warn(`Error accessing localStorage item ${key}:`, itemError);
        // Try to remove it
        try {
          localStorage.removeItem(key);
          removedCount++;
        } catch (e) {
          console.error(`Failed to remove corrupted item ${key}:`, e);
        }
      }
    }
  } catch (e) {
    console.error("Error during corrupted item cleanup:", e);
  }
  
  return removedCount;
} 