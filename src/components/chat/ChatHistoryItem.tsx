import React, { useState, useCallback } from 'react';
import { ChatSessionMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '../../lib/date-utils';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon, XIcon, Trash2 } from 'lucide-react';

interface ChatHistoryItemProps {
  session: ChatSessionMetadata;
  isActive: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  onRename?: (id: string, newName: string) => void; // Add rename handler
}

export function ChatHistoryItem({ session, isActive, onClick, onDelete, onRename }: ChatHistoryItemProps) {
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

  const relativeTime = formatRelativeTime(new Date(session.lastMessageTimestamp));

  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 active:scale-98 w-full',
        'hover:bg-primary/10 hover:shadow-md group border border-transparent',
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
      <div className="flex-1 min-w-0 max-w-[180px] overflow-hidden mr-1">
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
            <div className={cn(
              "text-sm font-medium truncate",
              isActive && "text-gradient"
            )}>
              {session.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {session.messageCount} msg - {session.preview}
            </div>
            <div className="text-xs text-muted-foreground/70">
              {relativeTime}
            </div>
          </>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex opacity-100 transition-opacity flex-shrink-0 ml-auto">
          {onRename && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0 hover:bg-primary/20 hover:text-primary transition-colors duration-200"
              onClick={handleEditClick}
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
} 