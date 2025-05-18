
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks, ClipboardList, Sparkles, MessageSquarePlus, Palette, Lightbulb, Terminal, SearchCheck, ClipboardSignature } from 'lucide-react';
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
  | 'generateDeliveryTemplates' 
  | 'checkMadeDesigns'          
  | 'generateRevision'
  | 'generateDesignIdeas'
  | 'generateDesignPrompts';

interface ActionButtonConfig {
  id: ActionType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  isPrimaryAction?: boolean; 
}

interface DropdownActionConfig {
    id: string; 
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
  {
    id: 'deliveryActions', 
    label: 'Delivery Tools',
    shortLabel: 'Delivery',
    icon: Plane,
    description: 'Tools for checking designs and generating delivery messages.',
    subActions: [
      { id: 'checkMadeDesigns', label: 'Check Made Designs', shortLabel: 'Check', icon: SearchCheck, description: 'AI review of your design for mistakes (Bangla). Requires attached design.', isPrimaryAction: false },
      { id: 'generateDeliveryTemplates', label: 'Delivery Templates', shortLabel: 'Templates', icon: ClipboardSignature, description: 'Generate Fiverr delivery messages and follow-ups.', isPrimaryAction: false },
    ]
  },
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
    if (actionId === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0) {
      return true;
    }
    return false; 
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", 
        isLoading && "opacity-60 pointer-events-none" 
      )}
    >
      {actionButtonsConfig.map((actionConfig) => {
        if ('isPrimaryAction' in actionConfig && actionConfig.isPrimaryAction) {
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
                   {btn.id === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0 && (
                     <p className="text-xs text-destructive mt-1">Requires an image file to be attached.</p>
                   )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
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
                            disabled={isLoading || !profile} 
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
