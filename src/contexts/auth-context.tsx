
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { 
  onAuthStateChanged, 
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
      console.error("AuthContext: Error in onAuthStateChanged listener:", error);
      setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); 

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth) {
      console.error("AuthContext: Cannot sign in with Google, Firebase auth not initialized.");
      throw new Error("Authentication service not available.");
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // setUser(result.user); // onAuthStateChanged will handle this
      return result.user;
    } catch (error: any) {
      console.error("Error signing in with Google (AuthContext):", error);
      if (error.code === 'auth/unauthorized-domain') {
        console.error("CRITICAL: Google Sign-In failed due to unauthorized domain. Ensure your project's domain and the [PROJECT_ID].firebaseapp.com domain are in Firebase Auth > Settings > Authorized domains.");
      }
      throw error; 
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
    } finally {
      setLoading(false);
    }
  };
  
  const value = { user, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
