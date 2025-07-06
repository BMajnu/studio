'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile, ActionType } from '@/lib/types';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw, Loader2, Edit3, Send, X, ChevronLeft, ChevronRight, CircleCheck, Copy, FolderOpen, Plus, PlusCircle, Zap, Check, SearchCheck, ClipboardSignature, ClipboardList, Palette, Lightbulb, Terminal, Search, Plane, Settings, Sparkles, FileImage, FileSpreadsheet, Trophy } from 'lucide-react';
import { TopDesignsResults } from './top-designs-results';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActionTypeLabel } from '@/lib/utils';
import { BilingualSplitView } from './bilingual-split-view';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { ActionButtonsPanel } from '@/components/chat/action-buttons';
import type { UserProfile } from '@/lib/types';
import { DesignPromptsTabs } from './design-prompts-tabs';
import { PromptToReplicate } from './prompt-to-replicate';

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => void;
  onConfirmEditAndResend?: (messageId: string, newContent: string, originalAttachments?: AttachedFile[], newActionType?: ActionType) => void;
  onOpenCustomSenseEditor?: (message: ChatMessage) => void;
  onStopRegeneration?: (messageId: string) => void;
  onPerformAction?: (originalRequest: ChatMessage['originalRequest'], actionType: ActionType) => void;
  onRegenerateCustomSense?: (message: ChatMessage) => void;
  isMobile: boolean;
  profile: UserProfile | null;
  activeActionButton: ActionType | null;
  lastSelectedActionButton: ActionType | null;
  isLoading: boolean;
  currentUserMessage: string;
  currentAttachedFilesDataLength: number;
}

function AttachedFileDisplay({ file }: { file: AttachedFile }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-primary/10 hover:border-primary/30 transition-all duration-300 animate-fade-in">
      {file.type?.startsWith('image/') && file.dataUri ? (
        <>
          <Image
            src={file.dataUri}
            alt={file.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      ) : file.type?.startsWith('text/') ? (
        <div className="flex items-center justify-center h-full bg-muted/20">
          <FileText className="h-5 w-5 text-secondary" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-muted/20">
          <Paperclip className="h-5 w-5 text-info" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-1 text-[8px] bg-background/80 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
        <span className="truncate">{file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}</span>
        {file.size && (
          <span className="text-muted-foreground/80 text-[7px] bg-muted/50 px-1 py-0.5 rounded-full shrink-0 ml-1">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        )}
      </div>
    </div>
  );
}

const getMessageText = (content: string | ChatMessageContentPart[] | undefined): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    // Use type narrowing to safely access properties
    const textParts = content.filter(part => {
      return part.type === 'text' && 'text' in part;
    });
    
    if (textParts.length > 0) {
      return textParts.map(part => {
        // Now TypeScript knows these parts have 'text' property
        return (part as { type: 'text', text: string }).text;
      }).join('\n');
    }
  }
  return ''; // Fallback for complex or empty content
};

// Add this helper function for Markdown processing
const processMarkdown = (text: string) => {
  // Process bold text (surrounded by **)
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

// Helper function to highlight search terms in text
const highlightSearchTerms = (text: string, searchQuery: string | null): React.ReactNode => {
  if (!searchQuery || !searchQuery.trim()) return text;
  
  const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(term => term.length >= 2);
  if (terms.length === 0) return text;
  
  // Sort terms by length (longest first) to ensure proper highlighting
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Split text by terms and create an array of text and highlighted spans
  let parts: React.ReactNode[] = [text];
  
  sortedTerms.forEach((term, termIndex) => {
    parts = parts.flatMap((part, partIndex) => {
      if (typeof part !== 'string') return [part];
      
      const splitParts = part.split(new RegExp(`(${term})`, 'gi'));
      return splitParts.map((subPart, i) => {
        const isMatch = i % 2 === 1; // Every odd index is a match
        // Create a unique key using termIndex, partIndex, and i
        const key = `${termIndex}-${partIndex}-${i}`;
        return isMatch ? (
          <mark 
            key={key} 
            className="bg-primary/20 text-primary-foreground dark:bg-primary/40 dark:text-primary-foreground px-0.5 py-0.5 rounded font-medium"
          >
            {subPart}
          </mark>
        ) : subPart;
      });
    });
  });
  
  return <>{parts}</>;
};

interface RenderContentPartProps {
  part: ChatMessageContentPart;
  index: number;
  searchQuery: string | null;
}

const RenderContentPart = ({ part, index, searchQuery }: RenderContentPartProps) => {
  if (part.type === 'text') {
    // Apply search term highlighting if there's a search query
        return (
      <div className="whitespace-pre-wrap mb-3 last:mb-0" key={`text-${index}`}>
        {searchQuery ? highlightSearchTerms(part.text, searchQuery) : part.text}
          </div>
        );
      }
  
  // For all other part types, render them without search highlighting
  // This avoids type errors with the specific part structures
  return null;
};

// Constants for localStorage keys
const SEARCH_QUERY_KEY = 'desainr_search_query';

export function ChatMessageDisplay({ message, onRegenerate, onConfirmEditAndResend, onOpenCustomSenseEditor, onStopRegeneration, onPerformAction, onRegenerateCustomSense, isMobile, profile, activeActionButton, lastSelectedActionButton, isLoading, currentUserMessage, currentAttachedFilesDataLength }: ChatMessageProps) {
  const [isEditingThisMessage, setIsEditingThisMessage] = useState(false);
  const [editedText, setEditedText] = useState<string>('');
  const [editedAttachments, setEditedAttachments] = useState<AttachedFile[]>([]);
  const [editedActionType, setEditedActionType] = useState<ActionType | undefined>(message.actionType);
  const [currentHistoryViewIndex, setCurrentHistoryViewIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isPermanentHighlight, setIsPermanentHighlight] = useState(false);
  
  const messageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  
  // Load search query from localStorage on mount
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(SEARCH_QUERY_KEY);
      if (savedQuery) {
        setSearchQuery(savedQuery);
        
        // Check if this message contains the search query
        const messageContent = getMessageText(message.content);
        if (messageContent.toLowerCase().includes(savedQuery.toLowerCase())) {
          setIsHighlighted(true);
          setIsPermanentHighlight(true);
          
          // Scroll to this message
          setTimeout(() => {
            messageRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error loading search query from localStorage:', error);
    }
  }, [message]);
  
  // Listen for search term highlight events
  useEffect(() => {
    const handleHighlightSearchTerms = (event: Event) => {
      const customEvent = event as CustomEvent<{ 
        searchQuery: string;
        sessionId?: string;
        timestamp?: number;
        effect?: string;
      }>;
      
      setSearchQuery(customEvent.detail.searchQuery);
      
      // Save to localStorage
      try {
        localStorage.setItem(SEARCH_QUERY_KEY, customEvent.detail.searchQuery);
      } catch (error) {
        console.error('Error saving search query to localStorage:', error);
      }
      
      // Check if this message contains the search query
      const messageContent = getMessageText(message.content);
      if (messageContent.toLowerCase().includes(customEvent.detail.searchQuery.toLowerCase())) {
        // Apply highlight effect
        setIsHighlighted(true);
        setIsPermanentHighlight(true);
        
        // Scroll to this message with a delay for better visibility
        setTimeout(() => {
          messageRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
          
          // If the effect is zoom-highlight, add a more dramatic effect
          if (customEvent.detail.effect === 'zoom-highlight' && messageRef.current) {
            messageRef.current.classList.add('scale-105');
            setTimeout(() => {
              messageRef.current?.classList.remove('scale-105');
            }, 1000);
          }
        }, 100);
      }
    };
    
    // Listen for clear highlight events
    const handleClearHighlights = () => {
      setSearchQuery(null);
      setIsHighlighted(false);
      setIsPermanentHighlight(false);
      
      // Clear from localStorage
      try {
        localStorage.removeItem(SEARCH_QUERY_KEY);
      } catch (error) {
        console.error('Error removing search query from localStorage:', error);
      }
    };
    
    window.addEventListener('highlight-search-terms', handleHighlightSearchTerms);
    window.addEventListener('clear-search-highlights', handleClearHighlights);
    
    return () => {
      window.removeEventListener('highlight-search-terms', handleHighlightSearchTerms);
      window.removeEventListener('clear-search-highlights', handleClearHighlights);
    };
  }, [message]);
  
  // Determine if this message has edit history
  const hasEditHistory = message.editHistory && message.editHistory.length > 0;
  const totalVersions = hasEditHistory ? message.editHistory!.length + 1 : 1;

  // Get the content to display based on currentHistoryViewIndex
  const displayContent = useMemo(() => {
    if (message.role === 'user' && hasEditHistory && currentHistoryViewIndex !== null) {
      return message.editHistory![currentHistoryViewIndex].content;
    } else {
      return message.content;
    }
  }, [message, hasEditHistory, currentHistoryViewIndex]);

  // Get attachments to display based on currentHistoryViewIndex
  const displayAttachments = useMemo(() => {
    if (message.role === 'user' && hasEditHistory && currentHistoryViewIndex !== null) {
      return message.editHistory![currentHistoryViewIndex].attachedFiles;
    } else {
      return message.attachedFiles;
    }
  }, [message, hasEditHistory, currentHistoryViewIndex]);

  // Track if action change should trigger regeneration (only for non-editing mode)
  const shouldRegenerateOnActionChange = isUser && !isEditingThisMessage && message.linkedAssistantMessageId;

  // Handler for action type change
  const handleActionTypeChange = (newActionType: ActionType) => {
    // Update the action type
    setEditedActionType(newActionType);
    
    // If we're not in edit mode and this is a user message with a linked assistant response,
    // trigger regeneration with the new action type
    if (shouldRegenerateOnActionChange && onConfirmEditAndResend) {
      // Get the current message content and attachments
      const currentContent = typeof message.content === 'string' ? 
        message.content : getMessageText(message.content);
      
      // Use the existing onConfirmEditAndResend function to trigger regeneration
      // with the same content but a new action type
      onConfirmEditAndResend(
        message.id,
        currentContent,
        message.attachedFiles,
        newActionType
      );
    }
  };

  const handleRegenerateClick = () => {
    if (message.originalRequest && onRegenerate) {
      onRegenerate({
        ...message.originalRequest,
        messageIdToRegenerate: message.id
      });
    }
  };

  const handleStartEdit = () => {
    const contentToEdit = typeof displayContent === 'string' ? displayContent : getMessageText(displayContent);
    setEditedText(contentToEdit);
    setEditedAttachments(displayAttachments || []);
    setEditedActionType(message.actionType);
    setIsEditingThisMessage(true);
  };

  const handleCancelEdit = () => {
    setIsEditingThisMessage(false);
  };

  const handleSaveAndSendEdited = () => {
    if (onConfirmEditAndResend) {
      onConfirmEditAndResend(message.id, editedText, editedAttachments, editedActionType);
    }
    setIsEditingThisMessage(false);
    setCurrentHistoryViewIndex(null); // Reset to view current version after edit
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const processedFiles: AttachedFile[] = [];
  
      for (const file of files) {
        const basicInfo: AttachedFile = {
          name: file.name,
          type: file.type,
          size: file.size
        };
  
        if (file.type.startsWith('image/')) {
          try { basicInfo.dataUri = await readFileAsDataURL(file); } 
          catch (e) { console.error("Error reading image file:", e); }
        } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json') {
          try { basicInfo.textContent = await readFileAsText(file); } 
          catch (e) { console.error("Error reading text file:", e); }
        }
        processedFiles.push(basicInfo);
      }
  
      setEditedAttachments([...editedAttachments, ...processedFiles]);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeAttachment = (index: number) => {
    setEditedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => {
    setEditedAttachments([]);
  };

  const handlePrevHistory = () => {
    if (hasEditHistory && message.editHistory && message.editHistory.length > 0) {
      setCurrentHistoryViewIndex(currentIdx => {
        if (currentIdx === null) return message.editHistory!.length - 1;
        return Math.max(0, currentIdx - 1);
      });
    }
  };

  const handleNextHistory = () => {
    if (hasEditHistory && message.editHistory && message.editHistory.length > 0) {
      setCurrentHistoryViewIndex(currentIdx => {
        if (currentIdx === null) return null;
        return currentIdx >= message.editHistory!.length - 1 ? null : currentIdx + 1;
      });
    }
  };

  // Add this helper function inside the component
  const getActionButtonIcon = (actionType: ActionType | undefined) => {
    switch (actionType) {
      case 'processMessage':
        return <Bot className="h-3 w-3 mr-1.5" />;
      case 'analyzeRequirements':
        return <SearchCheck className="h-3 w-3 mr-1.5" />;
      case 'generateEngagementPack':
        return <ClipboardSignature className="h-3 w-3 mr-1.5" />;
      case 'generateDeliveryTemplates':
        return <ClipboardList className="h-3 w-3 mr-1.5" />;
      case 'checkMadeDesigns':
        return <Palette className="h-3 w-3 mr-1.5" />;
      case 'generateRevision':
        return <RotateCcw className="h-3 w-3 mr-1.5" />;
      case 'generateDesignPrompts':
        return <Terminal className="h-3 w-3 mr-1.5" />;
      case 'generateEditingPrompts':
        return <Edit3 className="h-3 w-3 mr-1.5" />;
      case 'checkBestDesign':
        return <Trophy className="h-3 w-3 mr-1.5" />;
      case 'promptToReplicate':
        return <Copy className="h-3 w-3 mr-1.5" />;
      case 'promptWithCustomSense':
        return <Zap className="h-3 w-3 mr-1.5" />;
      case 'promptForMicroStockMarkets':
        return <ImageIcon className="h-3 w-3 mr-1.5" />;
      case 'search':
        return <Search className="h-3 w-3 mr-1.5" />;
      default:
        return <Bot className="h-3 w-3 mr-1.5" />;
    }
  };

  function ActionButton({ 
    actionType, 
    isEditing, 
    onActionChange 
  }: { 
    actionType?: ActionType, 
    isEditing: boolean, 
    onActionChange: (newType: ActionType) => void 
  }) {
    if (!actionType) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-1.5 px-3 font-medium hover:shadow-lg text-xs rounded-full transition-all bg-gradient-to-r text-white shadow-md from-blue-500 to-indigo-600 border border-blue-400"
            data-state="closed"
          >
            {getActionButtonIcon(actionType)}
            <span className="text-xs font-medium">{getActionTypeLabel(actionType)}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 shadow-lg rounded-lg z-50">
          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-zinc-400">
            {shouldRegenerateOnActionChange ? 'Change & Regenerate' : 'Change Action Type'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700 h-px" />
          
          {/* Main menu items */}
          <DropdownMenuItem onClick={() => onActionChange('processMessage')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
            {getActionButtonIcon('processMessage')}
            <span className="text-sm">Chat</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('analyzeRequirements')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
            {getActionButtonIcon('analyzeRequirements')}
            <span className="text-sm">Requirements</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('generateEngagementPack')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
            {getActionButtonIcon('generateEngagementPack')}
            <span className="text-sm">Fiverr Brief</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('generateRevision')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
            {getActionButtonIcon('generateRevision')}
            <span className="text-sm">Generate Revision Message</span>
          </DropdownMenuItem>

          {/* Design Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
              <Palette className="h-4 w-4" />
              <span className="text-sm">Design Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px] bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('generateDesignPrompts')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <Terminal className="h-4 w-4 text-teal-500" />
                  <span className="text-sm">Generate AI Prompts</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('checkBestDesign')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <SearchCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Check the best design</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Delivery Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
              <Plane className="h-4 w-4" />
              <span className="text-sm">Delivery Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px] bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('checkMadeDesigns')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <SearchCheck className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Check Designs</span>
                  <span className="ml-auto text-xs text-red-400">Needs Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('generateEditingPrompts')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <ClipboardSignature className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Editing Prompts</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('generateDeliveryTemplates')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <ClipboardList className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Delivery Templates</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* General Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[220px] bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('promptToReplicate')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt to Replicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('promptWithCustomSense')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <FileImage className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt with Custom Change</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('promptForMicroStockMarkets')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/70 text-zinc-100">
                  <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt for Micro Stock Markets (PMSM)</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (message.isLoading && !message.content) { // Skeleton for initial "Processing..."
    return (
      <div className={cn(
        "flex items-start w-full animate-slideUpSlightly",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5",
          "w-full", 
          isAssistant ? "bg-card/80 backdrop-blur-sm shadow-xl border border-primary/10" :
                       "bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground shadow-xl",
          isUser ? 'rounded-tr-none' : 'rounded-tl-none'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-md opacity-40"></div>
          <Skeleton className="h-4 w-32 mb-1 bg-primary/20 rounded-full" />
          <Skeleton className="h-3 w-full bg-primary/10 rounded-full" />
          <Skeleton className="h-3 w-3/4 bg-primary/10 rounded-full" />
          <Skeleton className="h-3 w-1/2 bg-primary/10 rounded-full" />
        </div>
      </div>
    );
  }

  const messageTime = new Date(message.timestamp
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const contentToRender = (typeof displayContent === 'string' && isUser) // Simple text for user message display (non-edit mode)
    ? [{ type: 'text' as const, text: displayContent }]
    : (message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...')) // AI "Processing..." state
    ? [{ type: 'text' as const, text: message.content }]
    : (Array.isArray(displayContent) ? displayContent : [{ type: 'text' as const, text: String(displayContent) }]); // AI content parts or fallback

  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start w-full animate-slideUpSlightly hover:shadow-sm transition-all duration-500",
        isUser ? 'justify-end gap-0' : 'justify-start gap-0',
        isHighlighted && "animate-pulse-highlight"
      )}
    >
      {isUser ? (
        <div className={cn(
          "group rounded-lg border backdrop-blur-sm shadow transition-all duration-300 w-full", // Added w-full here
          isEditingThisMessage ? "bg-card/80 border-primary/20" : "bg-card/50 border-primary/20",
          message.isError ? "border-destructive/30" : ""
        )}>
          <div className="px-4 py-3 flex items-start gap-3 w-full"> {/* Added w-full here */}
            <div className="flex-shrink-0 mt-1">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-grow min-w-0 w-full"> {/* Added w-full here */}
              <div className="flex justify-between items-start w-full"> {/* Added w-full here */}
                <div className="flex items-center mb-2 gap-2">
                  <span className="font-medium text-sm text-muted-foreground">You</span>
                  <div className="flex items-center gap-1.5 border border-primary/20 rounded-full p-1 bg-primary/5">
                    <ActionButton 
                      actionType={message.actionType || 'processMessage'} 
                      isEditing={isEditingThisMessage} 
                      onActionChange={handleActionTypeChange}
                    />
                  {isUser && !isEditingThisMessage && (
                    <>
                      {onConfirmEditAndResend && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleStartEdit}
                           className="group text-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full"
                          title="Edit & Resend this message"
                        >
                           <Edit3 className="h-4 w-4 mr-2 transition-all duration-300" />
                           <span>Edit & Resend</span>
                        </Button>
                      )}
                    </>
                  )}
                  </div>
                </div>
              </div>
              
              {isEditingThisMessage ? (
                <div className="space-y-2 relative z-10 w-full">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full resize-none min-h-[60px] bg-background/70 text-foreground focus-visible:ring-primary"
              rows={Math.max(2, editedText.split('\n').length)}
            />
                  
                  {/* Updated attachment section for edit mode */}
                  <div className="mt-2 w-full"> {/* Added w-full here */}
                    {editedAttachments.length > 0 && (
                      <div className="mt-1 mb-3 glass-panel bg-background/80 p-3 rounded-xl border border-primary/10 shadow-md animate-fade-in w-full"> {/* Added w-full here */}
                        <div className="flex items-center justify-between mb-2 w-full"> {/* Added w-full here */}
                          <span className="text-xs font-medium text-primary-foreground/80">
                            Attached files:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-full"
                            onClick={clearAttachments}
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Clear
                          </Button>
                        </div>
                        
                        <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
                          {editedAttachments.map((file, index) => (
                            <div 
                              key={index} 
                              className="inline-block align-top whitespace-normal w-20"
                              style={{ margin: 0, padding: 0 }}
                            >
                              <div className="group relative aspect-square overflow-hidden rounded-md border border-primary/10 hover:border-primary/30 transition-all duration-300">
                                {file.type?.startsWith('image/') && file.dataUri ? (
                                  <>
                                    <Image
                                      src={file.dataUri}
                                      alt={file.name}
                                      fill
                                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </>
                                ) : file.type?.startsWith('text/') ? (
                                  <div className="flex items-center justify-center h-full bg-muted/20">
                                    <FileText className="h-5 w-5 text-secondary" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-muted/20">
                                    <Paperclip className="h-5 w-5 text-info" />
                                  </div>
                                )}
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAttachment(index);
                                  }}
                                  className="absolute top-0 right-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-bl-md p-0.5 opacity-100 transition-opacity duration-300 z-10" // Changed from opacity-0 group-hover:opacity-100 to just opacity-100
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-0.5 text-[8px] bg-background/80 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {file.name.length > 10 ? file.name.substring(0, 8) + '...' : file.name}
                                </div>
                              </div>
                  </div>
                ))}
                        </div>
              </div>
            )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 w-full"> {/* Added w-full here */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                    >
                      <Paperclip className="h-3.5 w-3.5 mr-1" /> Add files
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*,application/pdf,.txt,.md,.json"
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancelEdit}
                        className="bg-transparent border border-gray-300 text-primary hover:bg-gray-100 hover:text-primary"
                      >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSaveAndSendEdited}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                <Send className="h-4 w-4 mr-1" /> Save & Send
              </Button>
            </div>
              </div>
            </div>
          ) : (
            <div className="stagger-animation relative z-10 w-full overflow-x-auto">
              {contentToRender.map((part, index) =>
                <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`} searchQuery={searchQuery} />
              )}
            </div>
              )}

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
                <div className="mt-3 relative z-10 w-full"> {/* Added w-full here */}
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2 bg-primary/10 text-primary">
              <span>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
              {displayAttachments.map((file, index) => (
                <div 
                  key={`${file.name}-${file.size || 0}-${index}`} 
                  className="inline-block align-top whitespace-normal w-24 animate-stagger" 
                  style={{ margin: 0, padding: 0, animationDelay: `${index * 50}ms` }}
                >
                  <AttachedFileDisplay file={file} />
                </div>
              ))}
            </div>
          </div>
        )}

              {/* Add back the history navigation buttons */}
              {!isEditingThisMessage && hasEditHistory && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-primary/10">
                  <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                      className="h-7 w-7 text-primary/70 hover:bg-primary/10"
                  onClick={handlePrevHistory}
                  disabled={currentHistoryViewIndex === 0}
                  title="Previous edit"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                    <span className="text-xs text-primary/80">
                  {currentHistoryViewIndex === null ? 1 : currentHistoryViewIndex + 1} / {totalVersions}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                      className="h-7 w-7 text-primary/70 hover:bg-primary/10"
                  onClick={handleNextHistory}
                  disabled={currentHistoryViewIndex === null}
                  title="Next edit / Current version"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                  </div>
              </div>
            )}
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5 shadow-lg text-sm transition-all duration-300",
          "w-full max-w-full overflow-hidden", 
          'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 rounded-tl-none',
          message.isError ? 'border-destructive border-2' : ''
        )}
      >
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-30",
          "bg-gradient-to-br from-emerald-200/30 to-teal-300/30 dark:from-emerald-700/10 dark:to-teal-700/10 blur-md"
        )}></div>
        
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 backdrop-blur-sm"
          )}>
            {messageTime}
          </span>
          {message.isError && !isEditingThisMessage && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded-full animate-pulse-slow">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-xs">Error processing request</span>
            </div>
          )}
        </div>

        {message.isLoading ? (
          <div className="relative z-10 whitespace-pre-wrap animate-pulse-slow glass-panel bg-background/40 p-3 rounded-xl border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p>{typeof message.content === 'string' ? message.content : 'Processing...'}</p>
            </div>
          </div>
        ) : (
          <div className="stagger-animation relative z-10 w-full overflow-x-auto">
            {contentToRender.map((part, index) =>
              <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`} searchQuery={searchQuery} />
            )}
          </div>
        )}

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
          <div className="mt-3 relative z-10 w-full">
            <div className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2",
                "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
              )}>
              <span>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
              {displayAttachments.map((file, index) => (
                <div 
                  key={`${file.name}-${file.size || 0}-${index}`} 
                  className="inline-block align-top whitespace-normal w-24 animate-stagger" 
                  style={{ margin: 0, padding: 0, animationDelay: `${index * 50}ms` }}
                >
                  <AttachedFileDisplay file={file} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons and Regenerate Area */}
        {!isEditingThisMessage && (
          <div className={cn(
            "mt-3 pt-2 border-t flex justify-between items-center gap-3 animate-fade-in relative z-10",
            "border-emerald-200/30 dark:border-emerald-800/30"
          )} style={{ animationDelay: '0.5s' }}>
            {isAssistant && message.originalRequest && onPerformAction && (
              <ActionButtonsPanel
                onAction={(actionType) => onPerformAction(message.originalRequest!, actionType)}
                isLoading={isLoading}
                currentUserMessage={currentUserMessage}
                profile={profile}
                currentAttachedFilesDataLength={currentAttachedFilesDataLength}
                isMobile={isMobile}
                activeButton={activeActionButton}
                lastSelectedButton={lastSelectedActionButton}
                flat
              />
            )}
            <div className="flex items-center gap-3">
              {isAssistant && message.canRegenerate && message.originalRequest && onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateClick}
                  className="text-xs backdrop-blur-sm border border-emerald-300/20 shadow-sm hover:shadow-md hover:scale-105 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all duration-300"
                  title="Regenerate response"
                  disabled={message.isLoading}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Regenerate
                </Button>
              )}
              {isAssistant && message.isLoading && onStopRegeneration && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStopRegeneration(message.id)}
                  className="text-xs backdrop-blur-sm border border-red-300/20 shadow-sm hover:shadow-md hover:scale-105 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-all duration-300"
                  title="Stop regeneration"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
