
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Firebase auth instance

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signIn: (email: string, pass: string) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      // Consider using toast to show error to user
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, pass: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      // Consider using toast to show error to user
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Consider using toast to show error to user
    } finally {
      setLoading(false);
    }
  };
  
  const value = { user, loading, signUp, signIn, signOut };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
