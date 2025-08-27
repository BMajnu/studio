'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VIDEO_TOOLS, VideoToolType } from '@/lib/video/types';
import { Video, Film, Megaphone, TrendingUp } from 'lucide-react';

interface VideoToolsSelectorProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onToolSelectAction: (toolType: VideoToolType) => void;
}

// Map icon names to components
const iconMap = {
  'Video': Video,
  'Film': Film,
  'Megaphone': Megaphone,
  'TrendingUp': TrendingUp
};

// Color map for tool cards
const colorMap = {
  'blue': 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950',
  'purple': 'border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950',
  'green': 'border-green-500 hover:bg-green-50 dark:hover:bg-green-950',
  'orange': 'border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950'
};

export function VideoToolsSelector({ isOpen, onCloseAction, onToolSelectAction }: VideoToolsSelectorProps) {
  const handleToolSelect = (toolType: VideoToolType) => {
    onToolSelectAction(toolType);
    onCloseAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Select Video Tool
          </DialogTitle>
          <DialogDescription>
            Choose the type of video content you want to create
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {VIDEO_TOOLS.map((tool) => {
            const IconComponent = iconMap[tool.icon as keyof typeof iconMap];
            const colorClass = colorMap[tool.color as keyof typeof colorMap];
            
            return (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={`
                  group relative overflow-hidden rounded-lg border-2 p-6
                  transition-all duration-200 cursor-pointer
                  ${colorClass}
                  hover:shadow-lg hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                <div className="flex flex-col items-start space-y-3">
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <div className={`
                        p-2 rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/20
                        group-hover:scale-110 transition-transform
                      `}>
                        <IconComponent className={`h-6 w-6 text-${tool.color}-600 dark:text-${tool.color}-400`} />
                      </div>
                    )}
                    <h3 className="text-base font-semibold">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {tool.description}
                  </p>
                </div>
                
                {/* Hover effect overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-${tool.color}-500/5 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                `} />
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
