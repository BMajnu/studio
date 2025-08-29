'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SceneData } from '@/lib/video/types';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { CopyToClipboard } from '@/components/copy-to-clipboard';

interface SceneManagerProps {
  scenes: SceneData[];
  sceneMode: 'single' | 'multiple';
  onSceneAdd?: () => void;
  onSceneRemove?: (sceneId: string) => void;
  onSceneUpdate?: (sceneId: string, data: Partial<SceneData>) => void;
  onSceneReorder?: (sceneId: string, direction: 'up' | 'down') => void;
  renderSceneContent: (scene: SceneData, index: number) => React.ReactNode;
}

export function SceneManager({
  scenes,
  sceneMode,
  onSceneAdd,
  onSceneRemove,
  onSceneUpdate,
  onSceneReorder,
  renderSceneContent
}: SceneManagerProps) {
  
  if (sceneMode === 'single') {
    // Single scene mode - simplified display
    const scene = scenes[0];
    if (!scene) return null;
    
    return (
      <div className="space-y-4">
        {renderSceneContent(scene, 0)}
      </div>
    );
  }
  
  // Multiple scene mode - list with management controls
  return (
    <div className="space-y-4">
      {/* Scene List */}
      <div className="space-y-3">
        {scenes.map((scene, index) => (
          <Card key={scene.id} className="p-4 bg-card border-border">
            {/* Scene Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">
                Scene {index + 1}
              </h3>
              
              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                {scenes.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSceneReorder?.(scene.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSceneReorder?.(scene.id, 'down')}
                      disabled={index === scenes.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Copy Scene Button */}
                <CopyToClipboard
                  textToCopy={JSON.stringify({
                    sceneNumber: index + 1,
                    normalPrompt: scene.normalPrompt,
                    jsonPrompt: scene.jsonPrompt,
                    sceneImage: scene.sceneImage,
                    galleryAssets: scene.galleryAssets
                  }, null, 2)}
                  className="h-8 w-8 p-0"
                />
                
                {/* Remove Button */}
                {scenes.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSceneRemove?.(scene.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Scene Content */}
            <div className="space-y-3">
              {renderSceneContent(scene, index)}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Add Scene Button */}
      {onSceneAdd && (
        <Button
          onClick={onSceneAdd}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Scene
        </Button>
      )}
    </div>
  );
}
