// src/lib/hooks/use-user-profile.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_ID } from '@/lib/constants';

const USER_PROFILE_STORAGE_KEY = 'desainr_user_profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        // Set default profile if nothing is stored
        const defaultProfileWithDate = {
          ...DEFAULT_USER_PROFILE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProfile(defaultProfileWithDate);
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(defaultProfileWithDate));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage:", error);
      // Fallback to default profile in case of error
      const defaultProfileWithDate = {
        ...DEFAULT_USER_PROFILE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProfile(defaultProfileWithDate);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updatedProfileData: Partial<UserProfile>) => {
    setProfile(prevProfile => {
      if (!prevProfile) { // Should not happen if initialized correctly
        const newProfile = {
          ...DEFAULT_USER_PROFILE,
          ...updatedProfileData,
          userId: DEFAULT_USER_ID,
          updatedAt: new Date().toISOString(),
          createdAt: prevProfile?.createdAt || new Date().toISOString(),
        };
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
        return newProfile;
      }
      const newProfile = {
        ...prevProfile,
        ...updatedProfileData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);
  
  const getProfile = useCallback((): UserProfile => {
    if (profile) return profile;
    // This is a fallback, should ideally not be hit if useEffect runs first
    const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (storedProfile) return JSON.parse(storedProfile);
    return DEFAULT_USER_PROFILE;
  }, [profile]);


  return { profile, updateProfile, isLoading, getProfile };
}
