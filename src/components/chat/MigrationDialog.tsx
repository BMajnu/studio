import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ChatSession } from '@/lib/types';

interface MigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMigrate: () => Promise<void>;
  onSkip: () => void;
  isLoading: boolean;
  progress: { current: number; total: number };
  error: string | null;
}

export function MigrationDialog({
  open,
  onOpenChange,
  onMigrate,
  onSkip,
  isLoading,
  progress,
  error
}: MigrationDialogProps) {
  const [migrationStarted, setMigrationStarted] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setMigrationStarted(false);
      setMigrationComplete(false);
    }
  }, [open]);
  
  // Handle migration completion
  useEffect(() => {
    if (migrationStarted && progress.current > 0 && progress.current === progress.total) {
      setMigrationComplete(true);
    }
  }, [migrationStarted, progress]);
  
  const handleMigrate = async () => {
    setMigrationStarted(true);
    await onMigrate();
  };
  
  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Migrate Chat History</DialogTitle>
          <DialogDescription>
            {migrationComplete 
              ? "Migration complete! Your chats are now stored in Firebase." 
              : "Your chat history needs to be migrated from Google Drive to Firebase storage."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error && (
            <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md text-sm">
              Error: {error}
            </div>
          )}
          
          {migrationStarted && !migrationComplete && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Migrating chats...</span>
                <span>{progress.current} of {progress.total}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
          
          {migrationComplete && (
            <div className="text-green-600 bg-green-50 p-3 rounded-md text-sm">
              Successfully migrated {progress.current} chat sessions to Firebase storage.
            </div>
          )}
          
          {!migrationStarted && !migrationComplete && (
            <div className="space-y-2">
              <p className="text-sm">
                This will copy all your chat history from Google Drive to secure Firebase storage. 
                Your existing data will not be deleted from Google Drive.
              </p>
              <p className="text-sm font-medium">
                Benefits of Firebase storage:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Improved reliability and performance</li>
                <li>Better security for your data</li>
                <li>No need for Google Drive permissions</li>
                <li>Seamless synchronization across devices</li>
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!migrationStarted && !migrationComplete && (
            <>
              <Button variant="outline" onClick={onSkip}>
                Skip for Now
              </Button>
              <Button onClick={handleMigrate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  "Start Migration"
                )}
              </Button>
            </>
          )}
          
          {migrationStarted && !migrationComplete && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </Button>
          )}
          
          {migrationComplete && (
            <Button onClick={() => onOpenChange(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 