'use client';

import * as React from 'react';
import { FoldedHistoryItem } from './folded-history-item';
import type { ChatSessionMetadata } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FoldedHistoryPanelProps {
  sessions: ChatSessionMetadata[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}

export function FoldedHistoryPanel({ sessions, activeSessionId, onSelectSession }: FoldedHistoryPanelProps) {
  // Instead of trying to calculate the number of visible items,
  // we'll use ScrollArea to handle overflow properly
  return (
    <ScrollArea className="h-full px-2">
      <div className="flex flex-col items-center py-2">
        {sessions.slice(0, 20).map((session) => (
          <FoldedHistoryItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onClick={onSelectSession}
          />
        ))}
      </div>
    </ScrollArea>
  );
} 