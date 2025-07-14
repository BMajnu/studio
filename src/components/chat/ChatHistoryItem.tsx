import React, { useState, useCallback, memo } from 'react';
import { ChatSessionMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatShortRelativeTime } from '../../lib/date-utils';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon, XIcon, Trash2 } from 'lucide-react';
import logger from '@/lib/utils/logger';
const { ui: uiLogger } = logger;

interface ChatHistoryItemProps {
  session: ChatSessionMetadata;
  isActive: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  onRename?: (id: string, newName: string) => void; // Add rename handler
}

// Create a comparison function for React.memo to determine if the component should re-render
const arePropsEqual = (prevProps: ChatHistoryItemProps, nextProps: ChatHistoryItemProps): boolean => {
  // Compare the session properties that matter for rendering
  const sessionChanged = 
    prevProps.session.id !== nextProps.session.id ||
    prevProps.session.name !== nextProps.session.name ||
    prevProps.session.preview !== nextProps.session.preview ||
    prevProps.session.lastMessageTimestamp !== nextProps.session.lastMessageTimestamp ||
    prevProps.session.messageCount !== nextProps.session.messageCount;
  
  // Compare other props
  const otherPropsChanged =
    prevProps.isActive !== nextProps.isActive;
  
  // Always return true if either changed
  const shouldUpdate = sessionChanged || otherPropsChanged;
  
  // If we're preventing a re-render, log it at debug level
  if (!shouldUpdate) {
    uiLogger.debug(`ChatHistoryItem ${nextProps.session.id}: Prevented unnecessary re-render`);
  }
  
  // Return false to indicate the component should re-render, true to prevent re-render
  return !shouldUpdate;
};

function ChatHistoryItemBase({ session, isActive, onClick, onDelete, onRename }: ChatHistoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(session.name);
  const [isClicking, setIsClicking] = useState(false);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEditing) return;
    
    // Visual feedback for clicking
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 200);
    
    // Call the parent's click handler with session ID
    onClick(session.id);
  }, [isEditing, onClick, session.id]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(session.id);
  }, [onDelete, session.id]);
  
  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditName(session.name);
    setIsEditing(true);
  }, [session.name]);
  
  const handleSaveEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRename && editName.trim()) {
      onRename(session.id, editName.trim());
    }
    setIsEditing(false);
  }, [editName, onRename, session.id]);
  
  const handleCancelEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  }, []);
  
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (onRename && editName.trim()) {
        onRename(session.id, editName.trim());
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  }, [editName, onRename, session.id]);

  const relativeTime = formatShortRelativeTime(new Date(session.createdAt));

  return (
    <div
      className={cn(
        'relative flex flex-col p-3 rounded-md cursor-pointer transition-all duration-200 active:scale-98 w-full',
        'hover:bg-primary/10 hover:shadow-md border border-transparent group',
        isActive ? 'bg-gradient-to-r from-primary/15 to-secondary/10 border-primary/20 shadow-sm' : 'bg-muted/30',
        isClicking && 'scale-98 bg-primary/20'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isActive}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isEditing) {
          e.preventDefault();
          e.stopPropagation();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {isEditing ? (
        <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={editName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 flex-shrink-0" 
            onClick={handleSaveEdit}
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 flex-shrink-0" 
            onClick={handleCancelEdit}
          >
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <div className="w-full pr-6"> {/* Add right padding to make room for delete button */}
            <div className={cn(
              "text-base font-medium truncate",
              isActive && "text-gradient"
            )}>
              {session.name}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {session.messageCount} msg - {session.preview}
            </div>
            <div className="text-sm text-muted-foreground/70">
              {relativeTime}
            </div>
          </div>
          
          {/* Delete button - positioned absolutely */}
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Export memoized version of the component to prevent unnecessary re-renders
export const ChatHistoryItem = memo(ChatHistoryItemBase, arePropsEqual); 