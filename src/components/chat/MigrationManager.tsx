import React, { useEffect } from 'react';
import { useLocalToFirebaseMigration } from '@/lib/hooks/use-drive-to-firebase-migration';
import { MigrationDialog } from './MigrationDialog';
import { Button } from '@/components/ui/button';
import { CloudIcon } from 'lucide-react';

/**
 * Component that manages the migration process and provides UI for user interaction
 */
export function MigrationManager() {
  const {
    isMigrationNeeded,
    isMigrationDialogOpen,
    setIsMigrationDialogOpen,
    migrationError,
    isPreparing,
    runMigration,
    skipMigration,
    openMigrationDialog,
    migrationProgress,
    isMigrationInProgress,
    checkMigration
  } = useLocalToFirebaseMigration();

  // Show manual migration button if needed
  const showMigrationButton = isMigrationNeeded === true;

  return (
    <>
      {/* Migration Dialog */}
      <MigrationDialog
        open={isMigrationDialogOpen}
        onOpenChange={setIsMigrationDialogOpen}
        onMigrate={runMigration}
        onSkip={skipMigration}
        isLoading={isPreparing}
        progress={migrationProgress}
        error={migrationError}
      />

      {/* Migration Button (shown if migration is needed but dialog is not automatically shown) */}
      {showMigrationButton && !isMigrationDialogOpen && (
        <div className="flex items-center justify-center w-full my-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openMigrationDialog}
            className="text-xs gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <CloudIcon size={14} />
            Migrate Chat History
          </Button>
        </div>
      )}
    </>
  );
} 