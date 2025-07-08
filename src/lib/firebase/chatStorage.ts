// src/lib/firebase/chatStorage.ts
import { firebaseAppInstance } from './clientApp';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import type { ChatSession, ChatSessionMetadata } from '@/lib/types';

// Maximum document size for Firestore (1 MiB) -- using 950 KB safety buffer
const FIRESTORE_DOC_LIMIT = 950 * 1024;

// Helper: return a trimmed copy small enough for Firestore
const trimSessionForFirestore = (session: ChatSession): ChatSession => {
  // Deep clone to avoid mutating caller
  const clone: ChatSession = JSON.parse(JSON.stringify(session));

  // Generic recursive stripper to delete binary fields
  const stripBinary = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key === 'dataUri' || key === 'imageDataUri') {
        delete obj[key];
        continue;
      }
      const val = obj[key];
      if (Array.isArray(val)) {
        val.forEach(stripBinary);
      } else if (typeof val === 'object') {
        stripBinary(val);
      }
    }
  };

  stripBinary(clone);

  // Remove large binary data from message parts
  clone.messages = clone.messages.map((msg) => {
    const newMsg = { ...msg } as any;
    if (Array.isArray(newMsg.content)) {
      newMsg.content = newMsg.content.map((part: any) => {
        // Remove imageDataUri, or shorten long text
        if (part.imageDataUri) {
          return { ...part, imageDataUri: undefined };
        }
        if (part.text && typeof part.text === 'string' && part.text.length > 2000) {
          return { ...part, text: part.text.substring(0, 2000) + '... (truncated)' };
        }
        return part;
      });
    }
    if (newMsg.attachedFiles) {
      newMsg.attachedFiles = newMsg.attachedFiles.map((f: any) => {
        const { dataUri, textContent, ...rest } = f;
        // Strip base64 data but keep metadata
        const lean: any = { ...rest };
        if (textContent && textContent.length < 5000) {
          lean.textContent = textContent;
        }
        return lean;
      });
    }
    return newMsg;
  });

  // If still too large, keep only last 100 messages then 50 then 20
  const limits = [100, 50, 20, 5];
  for (const max of limits) {
    let str = JSON.stringify(clone);
    if (str.length <= FIRESTORE_DOC_LIMIT) break;
    clone.messages = clone.messages.slice(-max);
  }
  return clone;
};

// Initialize Firestore
const db = getFirestore(firebaseAppInstance);

/**
 * Firebase Chat Storage Service
 * Handles all CRUD operations for chat sessions in Firestore
 */
export class FirebaseChatStorage {
  /**
   * Save a chat session to Firestore
   * @param userId - The user ID
   * @param session - The chat session to save
   * @returns Promise resolving to true if successful
   */
  static async saveSession(userId: string, session: ChatSession): Promise<boolean> {
    try {
      // Sanitize session object by removing undefined fields recursively
      const sanitize = (val: any): any => {
        if (Array.isArray(val)) {
          // Recursively clean each element, then remove any that turned into undefined
          return val.map(sanitize).filter((item) => item !== undefined);
        }
        if (val && typeof val === 'object') {
          const cleaned: any = {};
          Object.keys(val).forEach((k) => {
            const v = (val as any)[k];
            if (v !== undefined) {
              const nested = sanitize(v);
              if (nested !== undefined) {
                cleaned[k] = nested;
              }
            }
          });
          return cleaned;
        }
        return val;
      };

      // Use JSON stringify/parse as final pass to guarantee no undefined remains
      let cleanedSession: ChatSession = JSON.parse(JSON.stringify(sanitize(session)));

      // Ensure size within Firestore limit
      if (JSON.stringify(cleanedSession).length > FIRESTORE_DOC_LIMIT) {
        cleanedSession = trimSessionForFirestore(cleanedSession);
      }

      // Get current timestamp for consistency
      const now = Date.now();
      
      // Create a lean copy of the session with metadata for efficient queries
      const sessionMetadata: ChatSessionMetadata = {
        id: cleanedSession.id,
        name: cleanedSession.name,
        lastMessageTimestamp: cleanedSession.messages.length > 0 
          ? cleanedSession.messages[cleanedSession.messages.length - 1].timestamp 
          : now,
        preview: cleanedSession.messages.length > 0 
          ? typeof cleanedSession.messages[0].content === 'string'
            ? (cleanedSession.messages[0].content as string).substring(0, 100)
            : 'Chat session' 
          : 'Empty chat',
        messageCount: cleanedSession.messages?.length || 0
      };

      // Reference to the session document
      const sessionRef = doc(db, `users/${userId}/chatSessions/${cleanedSession.id}`);
      
      // Save the session data
      await setDoc(sessionRef, {
        ...cleanedSession,
        updatedAt: now
      }, { merge: true });

      // Also save to a separate metadata collection for efficient listing
      const metadataRef = doc(db, `users/${userId}/chatSessionsMetadata/${cleanedSession.id}`);
      await setDoc(metadataRef, sessionMetadata);

      return true;
    } catch (error) {
      console.error("Error saving session to Firebase:", error);
      return false;
    }
  }

  /**
   * Get a chat session from Firestore
   * @param userId - The user ID
   * @param sessionId - The session ID to retrieve
   * @returns Promise resolving to ChatSession or null if not found
   */
  static async getSession(userId: string, sessionId: string): Promise<ChatSession | null> {
    try {
      const sessionRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
      const sessionDoc = await getDoc(sessionRef);

      if (!sessionDoc.exists()) {
        return null;
      }

      return sessionDoc.data() as ChatSession;
    } catch (error) {
      console.error("Error getting session from Firebase:", error);
      return null;
    }
  }

  /**
   * List all chat session metadata for a user
   * @param userId - The user ID
   * @returns Promise resolving to array of ChatSessionMetadata
   */
  static async listSessionsMetadata(userId: string): Promise<ChatSessionMetadata[]> {
    try {
      const metadataRef = collection(db, `users/${userId}/chatSessionsMetadata`);
      const metadataQuery = query(
        metadataRef,
        orderBy('lastMessageTimestamp', 'desc')
      );

      const snapshot = await getDocs(metadataQuery);
      return snapshot.docs.map(doc => doc.data() as ChatSessionMetadata);
    } catch (error) {
      console.error("Error listing sessions from Firebase:", error);
      return [];
    }
  }

  /**
   * Delete a chat session from Firestore
   * @param userId - The user ID
   * @param sessionId - The session ID to delete
   * @returns Promise resolving to true if successful
   */
  static async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      if (!userId || !sessionId) {
        console.error("Invalid userId or sessionId for deletion");
        return false;
      }
      
      console.log(`Deleting session ${sessionId} for user ${userId} from Firebase...`);
      
      // Delete the main session document
      const sessionRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
      await deleteDoc(sessionRef);
      
      // Delete the metadata document
      const metadataRef = doc(db, `users/${userId}/chatSessionsMetadata/${sessionId}`);
      await deleteDoc(metadataRef);
      
      // Verify deletion
      const checkSession = await getDoc(sessionRef);
      const checkMetadata = await getDoc(metadataRef);
      
      if (checkSession.exists() || checkMetadata.exists()) {
        console.error("Deletion verification failed - documents still exist");
        return false;
      }
      
      console.log(`Successfully deleted session ${sessionId} from Firebase`);
      return true;
    } catch (error) {
      console.error("Error deleting session from Firebase:", error);
      return false;
    }
  }

  /**
   * Migrate a session from local storage to Firebase
   * @param userId - The user ID
   * @param session - The chat session to migrate
   * @returns Promise resolving to true if successful
   */
  static async migrateSession(userId: string, session: ChatSession): Promise<boolean> {
    try {
      // Handle possible legacy fields by using spread operator
      const { ...cleanSession } = session;
      
      return await FirebaseChatStorage.saveSession(userId, cleanSession);
    } catch (error) {
      console.error("Error migrating session to Firebase:", error);
      return false;
    }
  }
} 