'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, CloudCog, CloudLightning } from 'lucide-react';
import { getPendingSyncCount, syncAllPending } from '@/lib/firebase/sync-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('light');
  
  // Update theme based on system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);
  
  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check pending sync count periodically
  useEffect(() => {
    const checkPending = () => {
      setPendingCount(getPendingSyncCount());
    };
    
    // Check immediately
    checkPending();
    
    // Then set up interval
    const interval = setInterval(checkPending, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle manual sync
  const handleManualSync = async () => {
    if (isSyncing || !isOnline) return;
    
    try {
      setIsSyncing(true);
      await syncAllPending();
      // Update count after sync
      setPendingCount(getPendingSyncCount());
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Determine which icon to show
  const getStatusIcon = () => {
    if (!isOnline) return <CloudOff className="h-5 w-5 text-destructive" />;
    if (isSyncing) return <CloudLightning className="h-5 w-5 text-amber-500 animate-pulse" />;
    if (pendingCount > 0) return <CloudCog className="h-5 w-5 text-amber-500" />;
    return <Cloud className="h-5 w-5 text-green-500" />;
  };
  
  // Determine status text
  const getStatusText = () => {
    if (!isOnline) return 'Offline - Changes will sync when you reconnect';
    if (isSyncing) return 'Syncing data...';
    if (pendingCount > 0) return `${pendingCount} changes pending sync`;
    return 'All changes saved to cloud';
  };
  
  // Don't show if there's no sync pending and we're online
  if (isOnline && pendingCount === 0 && !isSyncing) return null;
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-md z-50",
              !isOnline ? "bg-destructive/10" : 
              pendingCount > 0 ? "bg-amber-500/10" : "bg-green-500/10",
              theme === 'dark' ? 'bg-opacity-20' : 'bg-opacity-30'
            )}
            onClick={handleManualSync}
            disabled={!isOnline || pendingCount === 0}
          >
            {getStatusIcon()}
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[300px]">
          <div className="text-sm font-medium">{getStatusText()}</div>
          {isOnline && pendingCount > 0 && (
            <p className="text-xs mt-1">Click to sync now</p>
          )}
          {!isOnline && (
            <p className="text-xs mt-1">Your changes are saved locally</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 