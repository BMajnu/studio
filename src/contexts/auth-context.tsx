
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  getAdditionalUserInfo, // To check for new users with Google Sign-In
} from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Firebase auth instance
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  googleAccessToken: string | null; // To store Google API access token
  signUp: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      console.warn("AuthContext: Firebase auth instance is not available. Auth features will be disabled.");
      setUser(null);
      setLoading(false);
      setGoogleAccessToken(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setGoogleAccessToken(null); // Clear token on logout
      }
      // Access token for Google Sign-In is handled within signInWithGoogle
      setLoading(false);
    }, (error) => {
      console.error("AuthContext: Error in onAuthStateChanged listener:", error);
      setUser(null);
      setGoogleAccessToken(null);
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
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user); // No need to await, let it happen in background
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your inbox to verify your email address.',
        });
      }
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing up (AuthContext):", error);
      throw error;
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
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in (AuthContext):", error);
      throw error;
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
      // Add scope for Google Drive appDataFolder access
      provider.addScope('https://www.googleapis.com/auth/drive.appdata');
      // Optionally, prompt for account selection every time
      // provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
        console.log("Google Access Token obtained and stored in AuthContext.");
      } else {
        console.warn("Google Sign-In: Access token not found in credential.");
        setGoogleAccessToken(null);
      }
      
      // Check if it's a new user
      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser && result.user && !result.user.emailVerified) {
        // New Google user, might want to trigger a welcome or specific onboarding
        console.log("New user signed up with Google:", result.user.email);
        // For Google sign-ups, email is usually pre-verified by Google.
        // If additional app-level verification is needed, handle here.
      }

      return result.user;
    } catch (error: any) {
      setGoogleAccessToken(null);
      if (error.code === 'auth/unauthorized-domain') {
        console.error("CRITICAL: Google Sign-In failed due to unauthorized domain. Ensure your project's domain and the [PROJECT_ID].firebaseapp.com domain are in Firebase Auth > Settings > Authorized domains.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log("Google Sign-In popup closed by user.");
      } else {
        console.error("Error signing in with Google (AuthContext):", error);
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
      setGoogleAccessToken(null); // Clear token on sign out
    } catch (error) {
      console.error("Error signing out (AuthContext):", error);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (userToSendTo?: FirebaseUser | null) => {
    const targetUser = userToSendTo || (auth ? auth.currentUser : null);
    if (!targetUser) {
      toast({
        title: 'Error',
        description: 'No user is currently signed in or auth service is unavailable to send verification.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendEmailVerification(targetUser);
      toast({
        title: 'Verification Email Sent',
        description: `A verification email has been sent to ${targetUser.email}. Please check your inbox.`,
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

  const value = { user, loading, googleAccessToken, signUp, signIn, signInWithGoogle, signOut, sendVerificationEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
