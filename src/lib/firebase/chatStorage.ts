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
      // Get current timestamp for consistency
      const now = Date.now();
      
      // Create a lean copy of the session with metadata for efficient queries
      const sessionMetadata: ChatSessionMetadata = {
        id: session.id,
        name: session.name,
        lastMessageTimestamp: session.messages.length > 0 
          ? session.messages[session.messages.length - 1].timestamp 
          : now,
        preview: session.messages.length > 0 
          ? typeof session.messages[0].content === 'string'
            ? session.messages[0].content.substring(0, 100)
            : "Chat session" 
          : "Empty chat",
        messageCount: session.messages?.length || 0
      };

      // Reference to the session document
      const sessionRef = doc(db, `users/${userId}/chatSessions/${session.id}`);
      
      // Save the session data
      await setDoc(sessionRef, {
        ...session,
        updatedAt: now
      }, { merge: true });

      // Also save to a separate metadata collection for efficient listing
      const metadataRef = doc(db, `users/${userId}/chatSessionsMetadata/${session.id}`);
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
      // Delete the main session document
      const sessionRef = doc(db, `users/${userId}/chatSessions/${sessionId}`);
      await deleteDoc(sessionRef);
      
      // Delete the metadata document
      const metadataRef = doc(db, `users/${userId}/chatSessionsMetadata/${sessionId}`);
      await deleteDoc(metadataRef);
      
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