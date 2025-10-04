'use client';

import { Button } from '@/components/ui/button';
import {
  Search, 
  Settings, 
  Lightbulb, 
  Package, 
  Sparkles,
  CheckSquare, 
  FileText, 
  RefreshCw, 
  Edit,
  Star,
  ImageIcon,
  MessageSquarePlus,
  BotMessageSquare,
  ClipboardSignature,
  ToggleLeft,
  Video,
  Plane,
  RotateCcw,
  ListChecks,
  ClipboardList,
  Terminal,
  Palette,
  AlertTriangle,
  Wrench,
  CircleCheck,
  Trophy,
  SearchCheck
} from 'lucide-react';
import type { UserProfile, ActionType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CHAT_MODELS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot } from 'lucide-react';
export type { ActionType } from '@/lib/types';

// ActionType is now the canonical union type from '@/lib/types'

interface ActionButtonConfig {
  id: ActionType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  isPrimaryAction?: boolean; // True for top-level buttons, false for sub-actions
}

interface DropdownActionConfig {
  id: string; // Unique ID for the dropdown trigger itself
  label: string; // Full label for the dropdown trigger button's tooltip
  shortLabel: string; // Short label for the dropdown trigger button
  icon: React.ElementType; // Icon for the dropdown trigger button
  description: string; // Description for the dropdown trigger button's tooltip
  subActions: ActionButtonConfig[];
}

export type AnyActionConfig = ActionButtonConfig | DropdownActionConfig;

const actionButtonsConfig: AnyActionConfig[] = [
  // FL Project Tool (new hover dropdown)
  {
    id: 'flProjectActions',
    label: 'FL Project Tool',
    shortLabel: 'FL Project Tool',
    icon: Settings,
    description: 'Frequently used actions for your FL project.',
    subActions: [
      { id: 'processMessage', label: 'Chat', shortLabel: 'Chat', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation.' },
      { id: 'analyzeRequirements', label: 'Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.' },
      { id: 'generateDesignPrompts', label: 'AI Prompts', shortLabel: 'AI prompts', icon: Terminal, description: 'Converts design ideas into detailed prompts for AI image generation.' },
      { id: 'checkBestDesign', label: 'Check the best design', shortLabel: 'Best design', icon: Trophy, description: 'Analyzes and identifies the best design based on requirements.' },
      { id: 'checkMadeDesigns', label: 'Check Designs', shortLabel: 'Check design', icon: SearchCheck, description: 'AI review of your design for mistakes (Bangla). Requires attached design.' },
      { id: 'generateEditingPrompts', label: 'Editing Prompts', shortLabel: 'Editing prompt', icon: Edit, description: 'Generate prompts to edit a design. Uses attached image if provided.' },
    ]
  },
  // Fiverr Tool dropdown: groups Delivery, Revision, Brief
  {
    id: 'fiverrActions',
    label: 'Fiverr Tools',
    shortLabel: 'Fiverr Tool',
    icon: ClipboardList,
    description: 'Delivery, Revision and Brief tools for Fiverr workflows.',
    subActions: [
      { id: 'generateDeliveryTemplates', label: 'Delivery Templates', shortLabel: 'Delivery', icon: ClipboardSignature, description: 'Generate Fiverr delivery messages and follow-ups.' },
      { id: 'generateRevision', label: 'Revision Message', shortLabel: 'Revision', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.' },
      { id: 'generateEngagementPack', label: 'Fiverr Brief', shortLabel: 'Brief', icon: ClipboardList, description: 'Generates a personalized intro, job reply, budget/timeline/software ideas, and clarifying questions.' },
    ]
  },
  // Removed Chat, Requirements, and Design as top-level buttons per request
  // Image Tools dropdown
  {
    id: 'toolsActions', // ID for the dropdown trigger
    label: 'Image Tools', // Tooltip for the trigger
    shortLabel: 'Image Tools',  // Text on the trigger button
    icon: ImageIcon,         // Icon for the trigger
    description: 'Access image tools for prompt generation and image replication.',
    subActions: [
      { id: 'promptToReplicate', label: 'Prompt to Replicate', shortLabel: 'Replicate', icon: Sparkles, description: 'Upload images and get prompts to replicate or create similar designs.', isPrimaryAction: false },
      { id: 'promptWithCustomSense', label: 'Prompt with Custom Changes', shortLabel: 'Custom', icon: MessageSquarePlus, description: 'Define design types and desired changes to generate varied prompts.', isPrimaryAction: false },
      { id: 'promptForMicroStockMarkets', label: 'Prompt for Micro Stock Markets (PMSM)', shortLabel: 'PMSM', icon: ClipboardSignature, description: 'Generate multiple prompts optimized for microstock markets, along with metadata.', isPrimaryAction: false },
    ]
  },
  // Video Tools button
  { id: 'videoTools', label: 'Video Tools', shortLabel: 'Video Tools', icon: Video, description: 'Generate video prompts (normal and JSON format) for Google Vio 3 and other platforms.' },
  // Chat button (renamed from Custom)
  { id: 'chat', label: 'AI Chat', shortLabel: 'AI Chat', icon: MessageSquarePlus, description: 'AI chatbot for graphic design advice and suggestions.' }
];

export interface ActionButtonsPanelProps {
  onAction: (actionType: ActionType) => void;
  isLoading: boolean;
  currentUserMessage?: string;
  profile?: UserProfile | null;
  currentAttachedFilesDataLength?: number;
  isMobile?: boolean;
  activeButton?: string | null;
  lastSelectedButton?: string | null;
  flat?: boolean;
  currentModelId?: string;
  onModelChange?: (modelId: string) => void;
}

export function ActionButtonsPanel({ 
  onAction, 
  isLoading, 
  currentUserMessage, 
  profile, 
  currentAttachedFilesDataLength, 
  isMobile,
  activeButton,
  lastSelectedButton,
  flat = false,
  currentModelId = 'gemini-2.0-flash-thinking-exp-01-21',
  onModelChange
}: ActionButtonsPanelProps) {
 
  // Track which dropdown is open (used to open FL Project on hover)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const isActionDisabled = (actionId?: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // "Check Designs" requires an image to be attached *before* clicking
    if (actionId === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0) {
      return true;
    }
    // "Editing Prompts" no longer has this client-side check, the flow will handle it.
    return false;
  };

  // Helper function to determine if button should appear selected
  const isButtonSelected = (buttonId: string): boolean => {
    /**
     * Button Selection Visual Logic:
     * ------------------------------
     * This determines which buttons appear visually selected in the UI, based on:
     * 
     * 1. Never auto-select the "Chat" button:
     *    - Only highlight it when explicitly selected
     * 
     * 2. Active button feedback (immediate visual response):
     *    - When a button is clicked, it briefly highlights (activeButton state)
     *    - This provides immediate visual feedback to the user's action
     * 
     * 3. Parent dropdown highlighting:
     *    - If any child action is the last selected action, highlight the parent dropdown
     *    - This helps users understand which category their last action came from
     * 
     * 4. Persistent selection state:
     *    - The lastSelectedButton state determines which button appears selected 
     *    - This visually indicates which action will be used for regeneration or edit
     */

    // Don't highlight processMessage/Chat by default - only when explicitly selected
    if (buttonId === 'processMessage' && !activeButton && !lastSelectedButton) {
      return false;
    }
    
    // Show as selected based on activeButton state (for immediate visual feedback)
    if (activeButton === buttonId) {
      return true;
    }
    
    // Dropdown containers are selected if any of their children are the lastSelectedButton
    
    if (buttonId === 'toolsActions' && 
        (lastSelectedButton === 'promptToReplicate' || 
         lastSelectedButton === 'promptWithCustomSense' || 
         lastSelectedButton === 'promptForMicroStockMarkets')) {
      return true;
    }
    
    // Fiverr Tools container: selected if any of its sub-actions were last chosen
    if (buttonId === 'fiverrActions' && (
      lastSelectedButton === 'generateDeliveryTemplates' ||
      lastSelectedButton === 'generateRevision' ||
      lastSelectedButton === 'generateEngagementPack'
    )) {
      return true;
    }
    
    // FL Project container: selected if any of its sub-actions were last chosen
    if (buttonId === 'flProjectActions' && (
      lastSelectedButton === 'processMessage' ||
      lastSelectedButton === 'analyzeRequirements' ||
      lastSelectedButton === 'generateDesignPrompts' ||
      lastSelectedButton === 'checkBestDesign' ||
      lastSelectedButton === 'checkMadeDesigns' ||
      lastSelectedButton === 'generateEditingPrompts'
    )) {
      return true;
    }
    
    // Regular buttons are selected if they are the lastSelectedButton
    return buttonId === lastSelectedButton;
  };

  // Prepare configs
  // In flat mode, show a single flat list of unique actions (no duplicates).
  // Prefer primary actions' labels by listing primaries first, then sub-actions, and de-duplicating by id.
  const mapConfigs = flat
    ? (() => {
        const primaryActions = actionButtonsConfig.filter((cfg): cfg is ActionButtonConfig => !('subActions' in cfg));
        const dropdownSubActions: ActionButtonConfig[] = actionButtonsConfig
          .filter((cfg): cfg is DropdownActionConfig => 'subActions' in cfg)
          .flatMap(cfg => cfg.subActions || []);
        const seen = new Set<ActionType>();
        const unique: ActionButtonConfig[] = [];
        for (const btn of [...primaryActions, ...dropdownSubActions]) {
          if (!seen.has(btn.id)) {
            seen.add(btn.id);
            unique.push(btn);
          }
        }
        return unique;
      })()
    : actionButtonsConfig;

  return (
    <TooltipProvider>
      <div className={cn(
          "flex items-center justify-end gap-2 stagger-animation",
          isMobile ? "flex-wrap" : "flex-nowrap overflow-x-auto px-3",
          isLoading && "opacity-60 pointer-events-none"
        )}
      >
        {/* AI Model Selector Dropdown */}
        {!flat && onModelChange && (
          <Select value={currentModelId} onValueChange={onModelChange}>
            <SelectTrigger className={cn(
              "h-auto transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary rounded-full shadow-md btn-glow",
              isMobile ? "p-2 w-auto" : "px-3 py-1.5 md:px-3.5 md:py-2 w-auto min-w-[140px]"
            )}>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 shrink-0" />
                {!isMobile && (
                  <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                    {CHAT_MODELS.find(m => m.id === currentModelId)?.name || 'Select Model'}
                  </span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="glass-panel border-primary/10 shadow-2xl rounded-lg animate-fade-in">
              {CHAT_MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3" />
                    <span>{model.name}</span>
                    {model.supportsThinking && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">Thinking</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {mapConfigs.map((actionConfig) => {
          // flat mode: render all actions as buttons, no dropdown
          if (flat) {
            const btn = actionConfig as ActionButtonConfig;
            const Icon = btn.icon;
            const isSelected = (activeButton === btn.id) || (lastSelectedButton === btn.id);
            const baseButtonClasses = cn(
              "h-auto transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary rounded-full shadow-md btn-glow",
              isMobile ? "p-2" : "px-3 py-1.5 md:px-3.5 md:py-2"
            );
            return (
              <Tooltip key={btn.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className={cn(
                      baseButtonClasses,
                      isSelected ? "bg-primary text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : ""
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" alignOffset={0} sideOffset={5} className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                  <p className="font-semibold text-gradient">{btn.label}</p>
                  <p className="text-xs text-foreground/80 max-w-xs mt-1">{btn.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          // default mode: respect dropdowns vs primary actions
          const baseButtonClasses = cn(
              "h-auto transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary rounded-full shadow-md btn-glow",
              isMobile ? "p-2" : "px-3 py-1.5 md:px-3.5 md:py-2"
          );

          if ('isPrimaryAction' in actionConfig && actionConfig.isPrimaryAction) {
            const btn = actionConfig as ActionButtonConfig;
            const isSelected = isButtonSelected(btn.id);
            
            return (
              <Tooltip key={btn.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className={cn(
                      baseButtonClasses,
                      // Apply highlight styles based on selection state
                      isSelected ? "bg-primary text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : "",
                      !isSelected && btn.id === 'analyzeRequirements' ? "hover:border-secondary hover:text-secondary" : "",
                      !isSelected && btn.id === 'generateEngagementPack' ? "hover:border-accent hover:text-accent" : "",
                      !isSelected && btn.id === 'generateRevision' ? "hover:border-info hover:text-info" : ""
                    )}
                  >
                    <btn.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1.5 md:mr-2")} />
                    {!isMobile && <span className="text-xs md:text-sm font-medium whitespace-nowrap">{btn.shortLabel}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" alignOffset={0} sideOffset={5} className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                  <p className="font-semibold text-gradient">{btn.label}</p>
                  <p className="text-xs text-foreground/80 max-w-xs mt-1">{btn.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          } else if ('subActions' in actionConfig) {
            const dropdown = actionConfig as DropdownActionConfig;
            const isDropdownSelected = isButtonSelected(dropdown.id);
            const isFlProject = dropdown.id === 'flProjectActions';
            
            return (
              <DropdownMenu 
                key={dropdown.id}
                {...(isFlProject ? {
                  open: openDropdownId === dropdown.id,
                  onOpenChange: (open: boolean) => setOpenDropdownId(open ? dropdown.id : null)
                } : {})}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onMouseEnter={() => isFlProject && setOpenDropdownId(dropdown.id)}
                      onMouseLeave={() => isFlProject && setOpenDropdownId(null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={isDropdownSelected ? "secondary" : "outline"}
                          size="sm"
                          disabled={isLoading || !profile} // General disable for dropdown trigger
                          className={cn(
                            baseButtonClasses,
                            isDropdownSelected ? "bg-primary/90 text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : "",
                            !isDropdownSelected && dropdown.id === 'toolsActions' ? "hover:border-primary hover:text-primary" : "",
                            !isDropdownSelected && dropdown.id === 'flProjectActions' ? "hover:border-primary hover:text-primary" : "",
                            !isDropdownSelected && dropdown.id === 'fiverrActions' ? "hover:border-primary hover:text-primary" : ""
                          )}
                        >
                          <dropdown.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1.5 md:mr-2")} />
                          {!isMobile && <span className="text-xs md:text-sm font-medium whitespace-nowrap">{dropdown.shortLabel}</span>}
                        </Button>
                      </DropdownMenuTrigger>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" alignOffset={0} sideOffset={5} className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                    <p className="font-semibold text-gradient">{dropdown.label}</p>
                    <p className="text-xs text-foreground/80 max-w-xs mt-1">{dropdown.description}</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Dropdown content */}
                <DropdownMenuContent 
                  align="end" 
                  className="glass-panel border-primary/10 shadow-2xl rounded-lg animate-fade-in"
                  onMouseEnter={() => isFlProject && setOpenDropdownId(dropdown.id)}
                  onMouseLeave={() => isFlProject && setOpenDropdownId(null)}
                >
                  <DropdownMenuLabel className="text-sm px-3 py-2 text-gradient font-semibold">{dropdown.label}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  {(dropdown.subActions || []).map(subAction => {
                    const isSubActionSelected = lastSelectedButton === subAction.id;
                    
                    return (
                    <DropdownMenuItem
                      key={subAction.id}
                      onClick={() => onAction(subAction.id)}
                      disabled={isActionDisabled(subAction.id)}
                        className={cn(
                          "text-sm cursor-pointer hover:bg-primary/10 focus:bg-primary/10 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none flex items-center gap-2 px-3 py-2 transition-all duration-200 rounded-md mx-1 my-0.5",
                          isSubActionSelected && "bg-primary/20"
                        )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-full",
                        dropdown.id === 'designActions' ? "bg-success/10 text-success" : 
                        (dropdown.id === 'toolsActions' || dropdown.id === 'flProjectActions') ? "bg-primary/10 text-primary" :
                        "bg-warning/10 text-warning"
                      )}>
                        <subAction.icon className="h-3.5 w-3.5 shrink-0" />
                      </div>
                      <span>{subAction.label}</span>
                      { (subAction.id === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0) && (
                        <span className="ml-auto text-xs text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                          Needs Image
                        </span>
                      )}
                    </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          } else {
            // Handle simple buttons that are neither primary actions nor dropdowns (e.g., Video Tools, Chat)
            const btn = actionConfig as ActionButtonConfig;
            const isSelected = isButtonSelected(btn.id);
            
            return (
              <Tooltip key={btn.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className={cn(
                      baseButtonClasses,
                      isSelected ? "bg-primary text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : ""
                    )}
                  >
                    <btn.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1.5 md:mr-2")} />
                    {!isMobile && <span className="text-xs md:text-sm font-medium whitespace-nowrap">{btn.shortLabel}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" alignOffset={0} sideOffset={5} className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                  <p className="font-semibold text-gradient">{btn.label}</p>
                  <p className="text-xs text-foreground/80 max-w-xs mt-1">{btn.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
        })}
      </div>
    </TooltipProvider>
  );
}