'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChatSessionMetadata } from '@/lib/types';
import { formatShortRelativeTime } from '@/lib/date-utils';

interface FoldedHistoryItemProps {
  session: ChatSessionMetadata;
  isActive: boolean;
  onClick: (sessionId: string) => void;
}

// Removed random color hashing. All items share consistent style.

export function FoldedHistoryItem({ session, isActive, onClick }: FoldedHistoryItemProps) {
  const shortTime = formatShortRelativeTime(new Date(session.createdAt || session.lastMessageTimestamp));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => onClick(session.id)}
            className={cn(
              'h-9 w-9 mx-auto my-1 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 text-[10px] font-semibold',
              'transition-colors shadow-sm hover:shadow-md',
              'dark:bg-black dark:text-white dark:hover:bg-black/80 dark:border-primary/20',
              'light:bg-white light:text-black light:hover:bg-white/90 light:border-gray-800/30 border',
              isActive ? 'ring-2 ring-primary' : '',
              'hover:scale-105'
            )}
          >
            {shortTime}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1">
          <p className="font-bold">{session.name || 'Untitled Chat'}</p>
          <p className="text-xs text-muted-foreground">{session.preview}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 