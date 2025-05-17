
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks } from 'lucide-react'; // Added ListChecks
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export type ActionType = 
  | 'processMessage'
  | 'analyzeRequirements' // Added new action type
  | 'generateDelivery'
  | 'generateRevision';

interface ActionButton {
  id: ActionType;
  label: string;
  icon: React.ElementType;
  description: string;
  shortLabel?: string; 
}

const actionButtonsConfig: ActionButton[] = [
  { id: 'processMessage', label: 'Process Client Message', shortLabel: 'Process', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation, and English reply suggestions.' },
  { id: 'analyzeRequirements', label: 'Analyze Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.' },
  { id: 'generateDelivery', label: 'Generate Delivery Message', shortLabel: 'Delivery', icon: Plane, description: 'Platform-ready delivery messages and follow-ups.' },
  { id: 'generateRevision', label: 'Generate Revision Message', shortLabel: 'Revision', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.' },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void;
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
    // All buttons are active regardless of currentUserMessage or currentAttachedFilesDataLength,
    // unless loading or profile is missing.
    return false;
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", 
        (!profile || isLoading) && "opacity-60 pointer-events-none" 
      )}
    >
      {actionButtonsConfig.map((btn) => (
        <TooltipProvider key={btn.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm" 
                onClick={() => onAction(btn.id)}
                disabled={isActionDisabled(btn.id)}
                className="px-2.5 py-1.5 md:px-3 md:py-2 h-auto" 
              >
                <btn.icon className="h-4 w-4 mr-1 md:mr-1.5" />
                <span className="text-xs md:text-sm">{btn.shortLabel || btn.label}</span>
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
