
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks, ClipboardList, Sparkles, MessageSquarePlus, Palette, Lightbulb, Terminal } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export type ActionType = 
  | 'processMessage'
  | 'analyzeRequirements' 
  | 'generateEngagementPack'
  | 'generateDelivery'
  | 'generateRevision'
  | 'generateDesignIdeas'
  | 'generateDesignPrompts';

interface ActionButtonConfig {
  id: ActionType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  isPrimaryAction?: boolean; // True if it's a direct button, false if it's a dropdown item
}

interface DropdownActionConfig {
    id: string; // e.g., 'designActions'
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    description: string;
    subActions: ActionButtonConfig[];
}

export type AnyActionConfig = ActionButtonConfig | DropdownActionConfig;


const actionButtonsConfig: AnyActionConfig[] = [
  { id: 'processMessage', label: 'Process Client Message', shortLabel: 'Chat', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation, and English reply suggestions based on conversation.', isPrimaryAction: true },
  { id: 'analyzeRequirements', label: 'Analyze Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.', isPrimaryAction: true },
  { id: 'generateEngagementPack', label: 'Generate Engagement Pack', shortLabel: 'Brief', icon: ClipboardList, description: 'Generates a personalized intro, job reply, budget/timeline/software ideas, and clarifying questions.', isPrimaryAction: true },
  {
    id: 'designActions',
    label: 'Design Tools',
    shortLabel: 'Design',
    icon: Palette,
    description: 'Access tools to generate design ideas and AI prompts.',
    subActions: [
      { id: 'generateDesignIdeas', label: 'Generate Design Ideas', shortLabel: 'Idea', icon: Lightbulb, description: 'Generates creative design ideas, web inspiration, and typography concepts.', isPrimaryAction: false },
      { id: 'generateDesignPrompts', label: 'Generate AI Prompts', shortLabel: 'Prompt', icon: Terminal, description: 'Converts design ideas into detailed prompts for AI image generation.', isPrimaryAction: false },
    ]
  },
  { id: 'generateDelivery', label: 'Generate Delivery Message', shortLabel: 'Delivery', icon: Plane, description: 'Platform-ready delivery messages and follow-ups.', isPrimaryAction: true },
  { id: 'generateRevision', label: 'Generate Revision Message', shortLabel: 'Revision', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.', isPrimaryAction: true },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void;
  isLoading: boolean;
  currentUserMessage: string; 
  profile: UserProfile | null;
  currentAttachedFilesDataLength: number; 
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile, currentAttachedFilesDataLength }: ActionButtonsPanelProps) {
  
  const isActionDisabled = (actionId?: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // For sub-actions, they depend on the main dropdown not being disabled.
    // Individual sub-actions could have their own logic if needed, but for now, they follow the parent.
    return false; 
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", 
        (!profile || isLoading) && "opacity-60 pointer-events-none" 
      )}
    >
      {actionButtonsConfig.map((actionConfig) => {
        if ('isPrimaryAction' in actionConfig && actionConfig.isPrimaryAction) {
          // Render a direct button
          const btn = actionConfig as ActionButtonConfig;
          return (
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
                    <span className="text-xs md:text-sm">{btn.shortLabel}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="font-semibold">{btn.label}</p>
                  <p className="text-xs text-muted-foreground max-w-xs">{btn.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
          // Render a dropdown menu
          const dropdown = actionConfig as DropdownActionConfig;
          return (
            <DropdownMenu key={dropdown.id}>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isActionDisabled()} // Main dropdown disabled state
                            className="px-2.5 py-1.5 md:px-3 md:py-2 h-auto"
                        >
                            <dropdown.icon className="h-4 w-4 mr-1 md:mr-1.5" />
                            <span className="text-xs md:text-sm">{dropdown.shortLabel}</span>
                        </Button>
                     </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="font-semibold">{dropdown.label}</p>
                    <p className="text-xs text-muted-foreground max-w-xs">{dropdown.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="bg-background border-border shadow-lg">
                {dropdown.subActions.map(subAction => (
                  <DropdownMenuItem
                    key={subAction.id}
                    onClick={() => onAction(subAction.id)}
                    disabled={isActionDisabled(subAction.id)}
                    className="text-sm cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    <subAction.icon className="h-4 w-4 mr-2" />
                    {subAction.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      })}
    </div>
  );
}

    