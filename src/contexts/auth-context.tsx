'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Firebase auth instance

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { 
      console.warn("AuthContext: Firebase auth instance is not available. Authentication features will be disabled.");
      setUser(null); 
      setLoading(false); 
      return; 
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      // Handle potential errors during onAuthStateChanged subscription
      console.error("AuthContext: Error in onAuthStateChanged listener:", error);
      setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const signUp = async (email: string, pass: string): Promise<FirebaseUser | null> => {
    if (!auth) {
      console.error("AuthContext: Cannot sign up, Firebase auth not initialized.");
      throw new Error("Authentication service not available.");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // setUser(userCredential.user); // onAuthStateChanged will handle this
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up (AuthContext):", error);
      throw error; // Re-throw the error to be handled by the calling component
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, pass: string): Promise<FirebaseUser | null> => {
    if (!auth) {
      console.error("AuthContext: Cannot sign in, Firebase auth not initialized.");
      throw new Error("Authentication service not available.");
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // setUser(userCredential.user);  // onAuthStateChanged will handle this
      return userCredential.user;
    } catch (error) { 
      console.error("Error signing in (AuthContext):", error);
      throw error; // Re-throw the error
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth) {
      console.error("AuthContext: Cannot sign in with Google, Firebase auth not initialized.");
      throw new Error("Authentication service not available.");
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    // Optional: You can add custom parameters if needed
    // provider.addScope('profile');
    // provider.addScope('email');
    // provider.setCustomParameters({
    //   'login_hint': 'user@example.com'
    // });
    try {
      const result = await signInWithPopup(auth, provider);
      // setUser(result.user); // onAuthStateChanged will handle this
      return result.user;
    } catch (error: any) {
      console.error("Error signing in with Google (AuthContext):", error);
      // Specific error handling for common Google Sign-In issues
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, this is not necessarily an "error" to bubble up aggressively
        // It will be caught by the LoginForm and handled with a toast
      } else if (error.code === 'auth/unauthorized-domain') {
        // This is a critical configuration error
        console.error("CRITICAL: Google Sign-In failed due to unauthorized domain. Ensure your project's domain and the [PROJECT_ID].firebaseapp.com domain are in Firebase Auth > Settings > Authorized domains.");
      }
      throw error; // Re-throw the error to be handled by the calling component
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) {
      console.error("AuthContext: Cannot sign out, Firebase auth not initialized.");
      return;
    }
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // setUser(null); // onAuthStateChanged will handle this
    } catch (error) {
      console.error("Error signing out (AuthContext):", error);
      // Optionally re-throw or handle as needed
    } finally {
      setLoading(false);
    }
  };
  
  const value = { user, loading, signUp, signIn, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};