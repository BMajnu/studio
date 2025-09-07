'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification as fbSendVerificationEmail,
  signOut as fbSignOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  googleAccessToken: string | null; // To store Google API access token
  signUp: (email: string, pass: string) => Promise<any | null>;
  signIn: (email: string, pass: string) => Promise<any | null>;
  signInWithGoogle: () => Promise<any | null>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized. Check your NEXT_PUBLIC_FIREBASE_* env vars.');
      setUser(null);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signUp = async (_email: string, _pass: string): Promise<User | null> => {
    if (!auth) throw new Error('Auth not configured');
    const { user } = await createUserWithEmailAndPassword(auth, _email, _pass);
    return user;
  };

  const signIn = async (_email: string, _pass: string): Promise<User | null> => {
    if (!auth) throw new Error('Auth not configured');
    const { user } = await signInWithEmailAndPassword(auth, _email, _pass);
    return user;
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!auth) throw new Error('Auth not configured');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Try to extract OAuth access token (optional, may be null if not granted)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential && (credential as any).accessToken;
    setGoogleAccessToken(accessToken ?? null);
    return result.user ?? null;
  };

  const signOut = async () => {
    if (!auth) return;
    await fbSignOut(auth);
  };

  const sendVerificationEmail = async () => {
    if (!auth) return;
    const current = auth.currentUser;
    if (current) await fbSendVerificationEmail(current);
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
