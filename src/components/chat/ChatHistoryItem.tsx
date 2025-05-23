import React, { useState } from 'react';
import { ChatSessionMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '../../lib/date-utils';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

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
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isEditing) {
      onClick(session.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(session.id);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditName(session.name);
    setIsEditing(true);
  };
  
  const handleSaveEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRename && editName.trim()) {
      onRename(session.id, editName.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (onRename && editName.trim()) {
        onRename(session.id, editName.trim());
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const relativeTime = formatRelativeTime(new Date(session.lastMessageTimestamp));

  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted group',
        isActive && 'bg-muted'
      )}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0 max-w-full pr-1">
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
            <div className="text-sm font-medium truncate max-w-[85%]">{session.name}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[90%]">
              {session.preview} · {relativeTime}
            </div>
          </>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
          {onRename && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={handleEditClick}
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleDeleteClick}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
} 