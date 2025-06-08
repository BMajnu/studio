// src/lib/hooks/use-user-profile.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_ID } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const USER_PROFILE_STORAGE_KEY_PREFIX = 'desainr_user_profile_'; // For localStorage fallback for anonymous

export function useUserProfile() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLocalStorageProfileKey = (userId: string) => `${USER_PROFILE_STORAGE_KEY_PREFIX}${userId}`;

  // Function to create a default profile, ensuring timestamps are correct
  const createDefaultProfile = (userIdToUse: string): UserProfile => {
    const now = new Date().toISOString();
    return {
      ...DEFAULT_USER_PROFILE, // Spread defaults first
      userId: userIdToUse,    // Override userId
      createdAt: now,
      updatedAt: now,
      // Ensure all fields from UserProfile are present, falling back to DEFAULT_USER_PROFILE values
      name: DEFAULT_USER_PROFILE.name,
      professionalTitle: DEFAULT_USER_PROFILE.professionalTitle,
      yearsOfExperience: DEFAULT_USER_PROFILE.yearsOfExperience,
      portfolioLink: DEFAULT_USER_PROFILE.portfolioLink,
      communicationStyleNotes: DEFAULT_USER_PROFILE.communicationStyleNotes,
      services: [...DEFAULT_USER_PROFILE.services],
      fiverrUsername: DEFAULT_USER_PROFILE.fiverrUsername,
      geminiApiKeys: DEFAULT_USER_PROFILE.geminiApiKeys,
      selectedGenkitModelId: DEFAULT_USER_PROFILE.selectedGenkitModelId,
      customSellerFeedbackTemplate: DEFAULT_USER_PROFILE.customSellerFeedbackTemplate,
      customClientFeedbackResponseTemplate: DEFAULT_USER_PROFILE.customClientFeedbackResponseTemplate,
      rawPersonalStatement: DEFAULT_USER_PROFILE.rawPersonalStatement,
    };
  };

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);

    if (authUser && db) { // User is logged in, use Firestore
      const profileRef = doc(db, 'userProfiles', authUser.uid);
      getDoc(profileRef).then(async (docSnap) => {
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          // Convert Firestore Timestamps to ISO strings if they exist
          const profileData = {
            ...firestoreData,
            createdAt: firestoreData.createdAt instanceof Timestamp ? firestoreData.createdAt.toDate().toISOString() : firestoreData.createdAt,
            updatedAt: firestoreData.updatedAt instanceof Timestamp ? firestoreData.updatedAt.toDate().toISOString() : firestoreData.updatedAt,
          } as UserProfile;
          setProfile(profileData);
        } else {
          // No profile in Firestore, create default and save it
          console.log(`No profile found in Firestore for user ${authUser.uid}. Creating default.`);
          const defaultNewUserProfile = createDefaultProfile(authUser.uid);
          try {
            await setDoc(profileRef, {
              ...defaultNewUserProfile,
              createdAt: serverTimestamp(), // Use server timestamp for creation
              updatedAt: serverTimestamp(), // Use server timestamp for update
            });
            // For local state, use ISO string immediately
            setProfile(defaultNewUserProfile); 
          } catch (error) {
            console.error("Error creating default profile in Firestore:", error);
            // Fallback to local default if Firestore save fails initially
            setProfile(defaultNewUserProfile);
          }
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching profile from Firestore:", error);
        // Fallback: create a local default profile for the user
        setProfile(createDefaultProfile(authUser.uid));
        setIsLoading(false);
      });
    } else { // No user logged in or Firestore not available, use localStorage for DEFAULT_USER_ID
      try {
        const localStorageKey = getLocalStorageProfileKey(DEFAULT_USER_ID);
        const storedProfile = localStorage.getItem(localStorageKey);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          const defaultAnonProfile = createDefaultProfile(DEFAULT_USER_ID);
          setProfile(defaultAnonProfile);
          localStorage.setItem(localStorageKey, JSON.stringify(defaultAnonProfile));
        }
      } catch (error) {
        console.error("Failed to load profile from localStorage for anonymous user:", error);
        setProfile(createDefaultProfile(DEFAULT_USER_ID));
      } finally {
        setIsLoading(false);
      }
    }
  }, [authUser, authLoading]);

  const updateProfile = useCallback(async (updatedProfileData: Partial<UserProfile>) => {
    if (authLoading) {
      console.warn("Auth is still loading, cannot update profile yet.");
      return;
    }

    const now = new Date().toISOString();
    
    if (authUser && db) { // Logged-in user, update Firestore
      const profileRef = doc(db, 'userProfiles', authUser.uid);
      // Ensure 'userId' isn't accidentally changed if it's part of updatedProfileData
      const dataToSave = {
        ...updatedProfileData,
        userId: authUser.uid, // Always enforce the correct userId
        updatedAt: serverTimestamp(), // Use server timestamp for updates
      };
      // Remove createdAt from update if it's there, as it should only be set once
      if ('createdAt' in dataToSave) {
        delete (dataToSave as any).createdAt;
      }

      try {
        await setDoc(profileRef, dataToSave, { merge: true });
        setProfile(prevProfile => {
          const newLocalProfile = {
            ...(prevProfile || createDefaultProfile(authUser.uid)), // Ensure prevProfile exists
            ...updatedProfileData, // Apply updates
            userId: authUser.uid,   // Ensure correct userId
            updatedAt: now, // Update local state with ISO string for consistency
             // Keep existing createdAt if prevProfile had it, otherwise it comes from default
            createdAt: prevProfile?.createdAt || (updatedProfileData.createdAt as string) || DEFAULT_USER_PROFILE.createdAt || now,
          };
          return newLocalProfile;
        });
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
        // Optionally, notify user about the failure
      }
    } else { // Anonymous user, update localStorage
      setProfile(prevProfile => {
        const baseProfile = prevProfile || createDefaultProfile(DEFAULT_USER_ID);
        const newProfileForStorage = {
          ...baseProfile,
          ...updatedProfileData,
          userId: DEFAULT_USER_ID, // Enforce default user ID for anonymous
          updatedAt: now,
          createdAt: baseProfile.createdAt || now, // Preserve or set createdAt
        };
        try {
          localStorage.setItem(getLocalStorageProfileKey(DEFAULT_USER_ID), JSON.stringify(newProfileForStorage));
        } catch (e) {
          console.error("Error saving anonymous profile to localStorage:", e);
        }
        return newProfileForStorage;
      });
    }
  }, [authUser, authLoading]);
  
  // This function becomes less critical if profile is always loaded into state.
  // It can serve as a synchronous getter for the current state if needed.
  const getProfile = useCallback((): UserProfile => {
    if (profile) return profile;
    
    // Fallback logic if state isn't populated (should be rare with useEffect)
    if (authUser && db) {
      // This would be a synchronous fetch if we absolutely needed it, but not recommended.
      // For now, return a default based on auth state.
      return createDefaultProfile(authUser.uid);
    } else {
      const localStorageKey = getLocalStorageProfileKey(DEFAULT_USER_ID);
      const stored = localStorage.getItem(localStorageKey);
      if (stored) return JSON.parse(stored);
      return createDefaultProfile(DEFAULT_USER_ID);
    }
  }, [profile, authUser]);


  return { profile, updateProfile, isLoading, getProfile };
}
