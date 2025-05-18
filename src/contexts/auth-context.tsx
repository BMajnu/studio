
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Firebase auth instance
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>; // New method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Initialize toast

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

  const signUp = async (email: string, pass: string): Promise<FirebaseUser | null> => {
    if (!auth) {
      console.error("AuthContext: Cannot sign up, Firebase auth not initialized.");
      throw new Error("Authentication service not available.");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // setUser(userCredential.user); // onAuthStateChanged will handle this
      // Send verification email immediately after successful signup
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your inbox to verify your email address.',
        });
      }
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing up (AuthContext):", error);
      throw error; // Re-throw the error to be caught by the form
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
      // setUser(userCredential.user); // onAuthStateChanged will handle this
      return userCredential.user;
    } catch (error: any) {
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
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // setUser(result.user); // onAuthStateChanged will handle this
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        console.error("CRITICAL: Google Sign-In failed due to unauthorized domain. Ensure your project's domain and the [PROJECT_ID].firebaseapp.com domain are in Firebase Auth > Settings > Authorized domains.");
      }
      console.error("Error signing in with Google (AuthContext):", error);
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

  const sendVerificationEmail = async () => {
    if (!auth || !auth.currentUser) {
      toast({
        title: 'Error',
        description: 'No user is currently signed in or auth service is unavailable.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your inbox to verify your email address.',
      });
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast({
        title: 'Error Sending Email',
        description: error.message || 'Could not send verification email. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const value = { user, loading, signUp, signIn, signInWithGoogle, signOut, sendVerificationEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
