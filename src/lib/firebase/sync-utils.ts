/**
 * Firebase Sync Utilities
 * 
 * Provides background synchronization between local storage and Firebase
 * with debounced writes and batch operations.
 */

import { FirebaseChatStorage } from './chatStorage';
import type { ChatSession } from '@/lib/types';

// Queue for pending sync operations
interface SyncOperation {
  userId: string;
  sessionId: string;
  session: ChatSession;
  timestamp: number;
  retry?: number;
}

// In-memory queue of operations to sync
const syncQueue: SyncOperation[] = [];

// Track online status
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

// Config
const SYNC_DEBOUNCE_MS = 2000; // Wait 2 seconds before syncing
const BATCH_SIZE = 5; // Process up to 5 operations at once
const MAX_RETRIES = 3; // Maximum retry attempts for failed operations
const RETRY_DELAY_MS = 5000; // Wait 5 seconds before retrying

// Timers
let syncTimer: NodeJS.Timeout | null = null;
let batchProcessTimer: NodeJS.Timeout | null = null;

/**
 * Initialize the sync system and set up network listeners
 */
export function initSyncSystem(): void {
  if (typeof window !== 'undefined') {
    // Set up online/offline listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Start the batch processor
    startBatchProcessor();
  }
}

/**
 * Clean up sync system resources
 */
export function cleanupSyncSystem(): void {
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    
    if (syncTimer) {
      clearTimeout(syncTimer);
    }
    
    if (batchProcessTimer) {
      clearTimeout(batchProcessTimer);
    }
  }
}

/**
 * Handle coming back online
 */
function handleOnline() {
  console.log('Connection restored, resuming Firebase sync');
  isOnline = true;
  
  // Process any pending operations
  processBatchOperations();
}

/**
 * Handle going offline
 */
function handleOffline() {
  console.log('Connection lost, Firebase sync paused');
  isOnline = false;
}

/**
 * Start the batch processor that runs periodically
 */
function startBatchProcessor() {
  // Clear any existing timer
  if (batchProcessTimer) {
    clearInterval(batchProcessTimer);
  }
  
  // Set up periodic processing
  batchProcessTimer = setInterval(() => {
    if (syncQueue.length > 0 && isOnline) {
      processBatchOperations();
    }
  }, 10000); // Check every 10 seconds
}

/**
 * Process a batch of operations from the queue
 */
async function processBatchOperations() {
  if (!isOnline || syncQueue.length === 0) {
    return;
  }
  
  // Get operations to process, prioritizing by timestamp
  const sortedQueue = [...syncQueue].sort((a, b) => a.timestamp - b.timestamp);
  const batchToProcess = sortedQueue.slice(0, BATCH_SIZE);
  
  console.log(`Processing ${batchToProcess.length} Firebase sync operations`);
  
  // Process each operation
  for (const op of batchToProcess) {
    try {
      // Remove from queue before processing to avoid duplicates
      removeFromQueue(op.userId, op.sessionId);
      
      // Save to Firebase
      await FirebaseChatStorage.saveSession(op.userId, op.session);
    } catch (error) {
      console.error(`Error syncing session ${op.sessionId} to Firebase:`, error);
      
      // Add back to queue with retry count if under max retries
      if (!op.retry || op.retry < MAX_RETRIES) {
        syncQueue.push({
          ...op,
          retry: (op.retry || 0) + 1,
          timestamp: Date.now() + RETRY_DELAY_MS // Push it back in time
        });
      }
    }
  }
}

/**
 * Remove an operation from the queue
 */
function removeFromQueue(userId: string, sessionId: string) {
  const index = syncQueue.findIndex(op => 
    op.userId === userId && op.sessionId === sessionId
  );
  
  if (index !== -1) {
    syncQueue.splice(index, 1);
  }
}

/**
 * Queue a session for background sync to Firebase
 * This method debounces writes to avoid excessive Firebase operations
 */
export function queueSessionForSync(userId: string, session: ChatSession) {
  // Ensure we have valid data
  if (!userId || !session || !session.id) {
    console.error('Invalid data provided for Firebase sync');
    return;
  }
  
  // Remove any existing queue items for this session
  removeFromQueue(userId, session.id);
  
  // Add to queue
  syncQueue.push({
    userId,
    sessionId: session.id,
    session: { ...session }, // Clone to avoid reference issues
    timestamp: Date.now()
  });
  
  // Debounce processing
  if (syncTimer) {
    clearTimeout(syncTimer);
  }
  
  syncTimer = setTimeout(() => {
    if (isOnline) {
      processBatchOperations();
    }
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Immediately sync a session to Firebase, bypassing the queue
 * Use this for critical operations where immediate sync is required
 */
export async function forceSyncSession(userId: string, session: ChatSession): Promise<boolean> {
  if (!isOnline) {
    // Still queue it for later if offline
    queueSessionForSync(userId, session);
    return false;
  }
  
  try {
    // Remove from queue if present
    removeFromQueue(userId, session.id);
    
    // Save directly
    return await FirebaseChatStorage.saveSession(userId, session);
  } catch (error) {
    console.error('Error during force sync to Firebase:', error);
    
    // Add to queue for retry
    queueSessionForSync(userId, session);
    return false;
  }
}

/**
 * Get the number of pending sync operations
 */
export function getPendingSyncCount(): number {
  return syncQueue.length;
}

/**
 * Force process all pending operations immediately
 */
export async function syncAllPending(): Promise<number> {
  if (!isOnline || syncQueue.length === 0) {
    return 0;
  }
  
  // Process everything in the queue
  const operationsCount = syncQueue.length;
  await processBatchOperations();
  
  // Return how many we processed
  return operationsCount;
}

// Initialize sync system on module load
if (typeof window !== 'undefined') {
  initSyncSystem();
} 