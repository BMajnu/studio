'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

interface AppHeaderContextProps {
  isAppHeaderCollapsed: boolean;
  toggleAppHeader: () => void;
  setIsAppHeaderCollapsed: (isCollapsed: boolean) => void;
}

const AppHeaderContext = createContext<AppHeaderContextProps | undefined>(undefined);

export function AppHeaderProvider({ children }: { children: React.ReactNode }) {
  const [isAppHeaderCollapsed, setIsAppHeaderCollapsed] = useState<boolean>(false);

  // Load saved preference on component mount
  useEffect(() => {
    try {
      const savedAppHeaderState = localStorage.getItem('desainr_app_header_collapsed');
      if (savedAppHeaderState !== null) {
        setIsAppHeaderCollapsed(JSON.parse(savedAppHeaderState));
      }
    } catch (e) {
      console.error('Failed to load app header collapse preference:', e);
    }
  }, []);

  // Save preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem('desainr_app_header_collapsed', JSON.stringify(isAppHeaderCollapsed));
    } catch (e) {
      console.error('Failed to save app header collapse preference:', e);
    }
  }, [isAppHeaderCollapsed]);

  const toggleAppHeader = () => {
    setIsAppHeaderCollapsed(prev => !prev);
  };

  return (
    <AppHeaderContext.Provider value={{ 
      isAppHeaderCollapsed, 
      toggleAppHeader, 
      setIsAppHeaderCollapsed 
    }}>
      {children}
    </AppHeaderContext.Provider>
  );
}

export function useAppHeader() {
  const context = useContext(AppHeaderContext);
  if (context === undefined) {
    throw new Error('useAppHeader must be used within an AppHeaderProvider');
  }
  return context;
} 