"use client";

import * as LZString from 'lz-string';

/**
 * Helper utilities for browser storage with advanced fallbacks,
 * retry mechanism and storage monitoring
 */

// Constants for storage management
const MAX_RETRY_ATTEMPTS = 3;
const STORAGE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const STORAGE_MONITOR_KEY = 'desainr_storage_monitor';

// Storage quota thresholds (in bytes)
const QUOTA_WARNING_THRESHOLD = 4.5 * 1024 * 1024; // 4.5MB warning (5MB typical limit)
const MIN_REMAINING_QUOTA = 500 * 1024; // Keep at least 500KB free

// Estimated localStorage limit (most browsers have 5MB)
const ESTIMATED_QUOTA = 5 * 1024 * 1024;

// Store listeners for storage events
const storageListeners: Array<(event: StorageEvent) => void> = [];

// Add storage monitoring initialization
if (typeof window !== 'undefined') {
  initStorageMonitor();
}

// Initialize storage monitoring
function initStorageMonitor() {
  // Run storage check immediately and then periodically
  checkStorageUsage();
  setInterval(checkStorageUsage, STORAGE_CHECK_INTERVAL);
  
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (event) => {
    storageListeners.forEach(listener => listener(event));
  });
}

/**
 * Set an item to localStorage with retry mechanism and compression fallback
 * @param key - The localStorage key
 * @param value - The string value to store
 * @param options - Optional configuration
 * @returns Whether the operation was successful
 */
export function setLocalStorageItem(
  key: string, 
  value: string, 
  options: { 
    retryAttempts?: number,
    forceCompression?: boolean 
  } = {}
): Promise<boolean> {
  const retryAttempts = options.retryAttempts ?? MAX_RETRY_ATTEMPTS;
  
  return new Promise<boolean>(async (resolve) => {
    // If force compression is enabled, skip the uncompressed attempt
    if (options.forceCompression) {
      const compressed = compressString(value);
      const success = await setWithRetry(key, compressed, true, retryAttempts);
      resolve(success);
      return;
    }
    
    // First try without compression
    try {
      const success = await setWithRetry(key, value, false, 1);
      if (success) {
        // Remove compression flag if it exists
        try { localStorage.removeItem(`${key}_compressed`); } catch (e) {}
        resolve(true);
        return;
      }
    } catch (error) {
      // Continue to compression fallback
    }
    
    // If regular storage failed, try compression
    try {
      const compressed = compressString(value);
      const success = await setWithRetry(key, compressed, true, retryAttempts);
      resolve(success);
    } catch (error) {
      console.error("All storage attempts failed for key:", key, error);
      resolve(false);
    }
  });
}

/**
 * Helper to set item with retry logic
 */
async function setWithRetry(
  key: string, 
  value: string, 
  isCompressed: boolean,
  attemptsLeft: number
): Promise<boolean> {
  if (attemptsLeft <= 0) return false;
  
  try {
    localStorage.setItem(key, value);
    
    if (isCompressed) {
      localStorage.setItem(`${key}_compressed`, 'true');
    }
    
    return true;
  } catch (error) {
    // If we have retries left and hit a quota error, try cleanup
    if (attemptsLeft > 1 && isQuotaExceededError(error)) {
      const cleanedUp = await attemptStorageCleanup();
      if (cleanedUp) {
        // Try again after cleanup with one less attempt
        return setWithRetry(key, value, isCompressed, attemptsLeft - 1);
      }
    }
    
    // If it's the last attempt or cleanup didn't help, return failure
    console.error(`Storage attempt failed (${attemptsLeft} attempts left):`, error);
    return false;
  }
}

/**
 * Attempt to clean up storage to make room
 * @returns True if cleanup was performed, false otherwise
 */
async function attemptStorageCleanup(): Promise<boolean> {
  console.log("Storage quota exceeded, attempting cleanup");
  
  try {
    // Find old session data that might be expendable
    const oldSessions = findOldestSessions(5);
    if (oldSessions.length === 0) return false;
    
    // Remove the oldest sessions to free up space
    for (const key of oldSessions) {
      try {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_compressed`);
      } catch (e) {
        console.error("Error during cleanup:", e);
      }
    }
    
    console.log(`Cleaned up ${oldSessions.length} old sessions`);
    return true;
  } catch (e) {
    console.error("Error during storage cleanup:", e);
    return false;
  }
}

/**
 * Find the oldest chat sessions based on keys
 */
function findOldestSessions(count: number): string[] {
  const sessionKeys: {key: string, timestamp: number}[] = [];
  
  // Find all session keys and extract timestamps
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.includes('chat_session')) continue;
    
    // Try to extract timestamp from key or content
    let timestamp = 0;
    try {
      // Try to parse data to get timestamp
      const data = localStorage.getItem(key);
      if (data) {
        if (key.endsWith('_compressed')) {
          const actualKey = key.replace('_compressed', '');
          const decompressed = decompressString(data);
          const json = JSON.parse(decompressed);
          timestamp = json.updatedAt || json.createdAt || 0;
        } else {
          const json = JSON.parse(data);
          timestamp = json.updatedAt || json.createdAt || 0;
        }
      }
    } catch (e) {
      // If we can't extract timestamp, use a default old timestamp
      timestamp = 1; // Very old timestamp to prioritize for deletion
    }
    
    sessionKeys.push({key, timestamp});
  }
  
  // Sort by timestamp (oldest first) and return the specified count
  return sessionKeys
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, count)
    .map(item => item.key);
}

/**
 * Get an item from localStorage with decompression if needed
 * @param key - The localStorage key to retrieve
 * @returns The stored string or null if not found
 */
export function getLocalStorageItem(key: string): string | null {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    // Check if the item was compressed
    const isCompressed = localStorage.getItem(`${key}_compressed`) === 'true';
    if (isCompressed) {
      return decompressString(value);
    }
    
    return value;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

/**
 * Clear localStorage items with safe error handling
 * @param keyPrefix - The prefix of keys to remove
 */
export function clearLocalStorageItems(keyPrefix: string): void {
  try {
    // Get all keys that start with the prefix
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(keyPrefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all matched keys
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        // Also remove compression flag if exists
        localStorage.removeItem(`${key}_compressed`);
      } catch (e) {
        console.warn(`Failed to remove item ${key}:`, e);
      }
    });
  } catch (error) {
    console.error("Error clearing localStorage items:", error);
  }
}

/**
 * Check if an error is a storage quota exceeded error
 */
function isQuotaExceededError(error: any): boolean {
  if (!error) return false;
  
  if (error instanceof DOMException && 
     (error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
    return true;
  }
  
  // Check for error message content as a fallback
  if (error.message && typeof error.message === 'string' &&
     (error.message.includes('quota') || 
      error.message.includes('storage') || 
      error.message.includes('exceeded'))) {
    return true;
  }
  
  return false;
}

/**
 * Compress a string using LZ-String for efficient storage
 * With additional error handling for edge cases
 */
export function compressString(str: string): string {
  if (!str || typeof str !== 'string' || str.length === 0) {
    console.warn('Compression attempted on empty or non-string data');
    return str;
  }
  
  try {
    // Check if data is already compressed to avoid double compression
    // Look for non-JSON-like content at the start of the string
    if (str.charCodeAt(0) > 127 || // High Unicode character
        (str.charAt(0) !== '{' && str.charAt(0) !== '[' && str.charAt(0) !== '"')) {
      // Do additional check to confirm it's likely compressed
      const nonAsciiCount = str.substring(0, 10).split('')
        .filter(char => char.charCodeAt(0) > 127).length;
      
      if (nonAsciiCount > 2) { // If multiple high Unicode characters found
        console.warn('Data appears to be already compressed, skipping compression');
        return str;
      }
    }
    
    const compressed = LZString.compressToUTF16(str);
    
    // Verify compression was successful
    if (!compressed) {
      console.error('Compression returned null or empty result');
      return str; // Return original if compression fails
    }
    
    // Check if compression actually helped
    if (compressed.length >= str.length) {
      console.log('Compression did not reduce size, using original');
      return str;
    }
    
    return compressed;
  } catch (error) {
    console.error('Error compressing data:', error);
    return str; // Return original if compression fails
  }
}

/**
 * Decompress a string previously compressed with LZ-String
 * With improved error handling for corrupted data
 */
export function decompressString(str: string): string {
  if (!str || typeof str !== 'string' || str.length === 0) {
    console.warn('Decompression attempted on empty or non-string data');
    return '';
  }
  
  try {
    // Check if data actually appears to be compressed by looking at the first few characters
    // If it starts with JSON-like characters, it's probably not compressed
    if (str.charAt(0) === '{' || str.charAt(0) === '[' || str.charAt(0) === '"') {
      return str; // This looks like normal JSON, not compressed
    }
    
    // Look for high Unicode characters which would indicate compression
    const hasHighUnicode = str.substring(0, 10).split('')
      .some(char => char.charCodeAt(0) > 127);
    
    if (!hasHighUnicode) {
      // If no high Unicode characters found in the beginning, likely not compressed
      return str;
    }
    
    // Attempt decompression
    const decompressed = LZString.decompressFromUTF16(str);
    
    // Validate result
    if (!decompressed) {
      console.warn('Decompression returned null or empty result, trying fallbacks');
      
      // Try alternative methods as fallbacks
      try {
        const alt1 = LZString.decompress(str);
        if (alt1 && alt1.length > 0) return alt1;
        
        const alt2 = LZString.decompressFromBase64(str);
        if (alt2 && alt2.length > 0) return alt2;
        
        const alt3 = LZString.decompressFromEncodedURIComponent(str);
        if (alt3 && alt3.length > 0) return alt3;
      } catch (fallbackError) {
        console.error('All decompression fallbacks failed');
      }
      
      // If all fallbacks fail, return original or empty string to avoid breaking JSON parsing
      if (str.startsWith('{') || str.startsWith('[')) {
        return str; // Looks like JSON, might be uncompressed
      }
      console.error('Decompression failed completely');
      return '';
    }
    
    return decompressed;
  } catch (error) {
    console.error('Error decompressing data:', error);
    
    // If there's an exception, but string looks like valid JSON, return it
    if (str.startsWith('{') || str.startsWith('[')) {
      return str;
    }
    return '';
  }
}

/**
 * Check localStorage usage and emit warning if nearing quota
 * @returns Storage usage info object
 */
export function checkStorageUsage(): { 
  used: number, 
  total: number, 
  percentUsed: number 
} {
  const storageEstimate = getStorageEstimate();
  const percentUsed = (storageEstimate.used / storageEstimate.total) * 100;
  
  // Store the result for monitoring
  try {
    localStorage.setItem(STORAGE_MONITOR_KEY, JSON.stringify({
      used: storageEstimate.used,
      total: storageEstimate.total,
      percentUsed: percentUsed,
      timestamp: Date.now()
    }));
  } catch (e) {
    // If we can't even store the monitoring data, we're definitely out of space
    console.warn("Critical: Unable to store storage monitoring data - localStorage is full");
    
    // Emit storage critical event
    emitStorageEvent({
      type: 'critical',
      percentUsed: 100,
      bytesUsed: storageEstimate.used,
      bytesTotal: storageEstimate.total
    });
  }
  
  // Check thresholds and emit warnings if needed
  if (storageEstimate.used >= QUOTA_WARNING_THRESHOLD) {
    console.warn(`Storage usage warning: ${percentUsed.toFixed(1)}% used (${formatBytes(storageEstimate.used)}/${formatBytes(storageEstimate.total)})`);
    
    // Emit storage warning event
    emitStorageEvent({
      type: 'warning',
      percentUsed: percentUsed,
      bytesUsed: storageEstimate.used,
      bytesTotal: storageEstimate.total
    });
  }
  
  return {
    used: storageEstimate.used,
    total: storageEstimate.total,
    percentUsed: percentUsed
  };
}

/**
 * Estimate localStorage usage
 */
function getStorageEstimate(): { used: number, total: number } {
  let totalUsed = 0;
  
  try {
    // Calculate total bytes used in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          // Each character is 2 bytes in UTF-16
          totalUsed += (key.length + value.length) * 2;
        }
      }
    }
  } catch (e) {
    console.error("Error measuring storage usage:", e);
  }
  
  return {
    used: totalUsed,
    total: ESTIMATED_QUOTA
  };
}

/**
 * Format bytes into human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Emit a storage event for listeners
 */
function emitStorageEvent(data: {
  type: 'warning' | 'critical',
  percentUsed: number,
  bytesUsed: number,
  bytesTotal: number
}) {
  // Create and dispatch a custom event
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('storage-warning', { 
      detail: data 
    });
    window.dispatchEvent(event);
  }
}

/**
 * Add listener for storage warnings
 */
export function addStorageWarningListener(
  callback: (data: { 
    type: 'warning' | 'critical', 
    percentUsed: number,
    bytesUsed: number,
    bytesTotal: number
  }) => void
) {
  if (typeof window !== 'undefined') {
    const listener = (event: CustomEvent) => {
      if (event.type === 'storage-warning') {
        callback(event.detail);
      }
    };
    window.addEventListener('storage-warning', listener as EventListener);
    return () => {
      window.removeEventListener('storage-warning', listener as EventListener);
    };
  }
  return () => {};
}
