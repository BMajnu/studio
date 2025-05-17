
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Edit3, MessageSquareText, Plane, RotateCcw } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export type ActionType = 
  | 'processMessage'
  | 'analyzePlan'
  | 'suggestReplies'
  | 'suggestRepliesTranslated'
  | 'generateDelivery'
  | 'generateRevision';

interface ActionButton {
  id: ActionType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const actionButtonsConfig: ActionButton[] = [
  { id: 'processMessage', label: 'Process Client Message', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation, and English reply suggestions.' },
  { id: 'analyzePlan', label: 'Analyze & Plan Request', icon: Edit3, description: 'Detailed analysis, simplification, steps, and Bengali translation.' },
  { id: 'suggestReplies', label: 'Suggest Client Replies', icon: MessageSquareText, description: 'Two English reply suggestions tailored to your style.' },
  { id: 'suggestRepliesTranslated', label: 'Suggest Replies (Translated)', icon: MessageSquareText, description: 'Two English replies with Bengali translations.' },
  { id: 'generateDelivery', label: 'Generate Delivery Message', icon: Plane, description: 'Platform-ready delivery messages and follow-ups.' },
  { id: 'generateRevision', label: 'Generate Revision Message', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.' },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void; // Notes are handled by modal in parent now
  isLoading: boolean;
  currentUserMessage: string;
  profile: UserProfile | null;
  currentAttachedFilesDataLength: number;
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile, currentAttachedFilesDataLength }: ActionButtonsPanelProps) {
  
  const isActionDisabled = (actionId: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // These actions can proceed even without a message, as they primarily rely on modal notes or profile data.
    if (actionId === 'generateDelivery' || actionId === 'generateRevision') {
      return false; 
    }
    // For other actions, disable if no message text AND no files are attached.
    if (!currentUserMessage.trim() && currentAttachedFilesDataLength === 0) {
      return true;
    }
    return false;
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", // justify-end aligns buttons to the right
        // General disabled state for the whole panel (e.g. during loading or if profile missing)
        // Individual buttons will also check their specific conditions
        (!profile || isLoading) && "opacity-60 pointer-events-none" 
      )}
    >
      {actionButtonsConfig.map((btn) => (
        <TooltipProvider key={btn.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon" 
                onClick={() => onAction(btn.id)}
                disabled={isActionDisabled(btn.id)}
                className="p-2 h-9 w-9 md:h-10 md:w-10" // Standard icon button sizes
              >
                <btn.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">{btn.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="font-semibold">{btn.label}</p>
              <p className="text-xs text-muted-foreground max-w-xs">{btn.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
