'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SceneData, PROMPT_TABS, GalleryAsset } from '@/lib/video/types';
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard';
import { Code, Image, Layers, ImageIcon } from 'lucide-react';
import { GalleryManager } from './GalleryManager';

interface PromptTabsProps {
  scene: SceneData;
  sceneIndex: number;
  onSceneUpdate: (updates: Partial<SceneData>) => void;
  selectedGalleryAssets?: GalleryAsset[];
  onGalleryAssetsChange?: (assets: GalleryAsset[]) => void;
}

export function PromptTabs({
  scene,
  sceneIndex,
  onSceneUpdate,
  selectedGalleryAssets = [],
  onGalleryAssetsChange
}: PromptTabsProps) {
  const [sceneImageMode, setSceneImageMode] = useState<'start' | 'end'>('start');
  
  const handleNormalPromptChange = (value: string) => {
    onSceneUpdate({ normalPrompt: value });
  };
  
  const handleJsonPromptChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      onSceneUpdate({ jsonPrompt: parsed });
    } catch {
      // Invalid JSON, still update the raw value for editing
      onSceneUpdate({ jsonPrompt: value as any });
    }
  };
  
  const handleSceneImageChange = (mode: 'start' | 'end', value: string) => {
    onSceneUpdate({
      sceneImage: {
        ...scene.sceneImage,
        [mode]: value
      }
    });
  };
  
  const handleGalleryAssetSelect = (asset: GalleryAsset) => {
    const updatedAssets = [...selectedGalleryAssets];
    const existingIndex = updatedAssets.findIndex(a => a.id === asset.id);
    
    if (existingIndex >= 0) {
      updatedAssets.splice(existingIndex, 1);
    } else {
      updatedAssets.push(asset);
    }
    
    onGalleryAssetsChange?.(updatedAssets);
    
    // Update scene gallery assets based on type
    const galleryAssets = { ...scene.galleryAssets };
    if (asset.type === 'character' || asset.type === 'subject') {
      galleryAssets.characters = updatedAssets
        .filter(a => a.type === 'character' || a.type === 'subject')
        .map(a => a.id);
    } else if (asset.type === 'object') {
      galleryAssets.objects = updatedAssets
        .filter(a => a.type === 'object')
        .map(a => a.id);
    } else if (asset.type === 'background') {
      galleryAssets.backgrounds = updatedAssets
        .filter(a => a.type === 'background')
        .map(a => a.id);
    }
    
    onSceneUpdate({ galleryAssets });
  };
  
  return (
    <Tabs defaultValue="normal" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="normal" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Normal Prompt
        </TabsTrigger>
        <TabsTrigger value="json" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          JSON Prompt
        </TabsTrigger>
        <TabsTrigger value="scene_image" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Scene Image
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Gallery
        </TabsTrigger>
      </TabsList>
      
      {/* Normal Prompt Tab */}
      <TabsContent value="normal" className="space-y-3 mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Scene {sceneIndex + 1} - Normal Prompt</Label>
            <CopyToClipboard 
              text={scene.normalPrompt}
              className="h-8 px-3"
            />
          </div>
          <Textarea
            value={scene.normalPrompt}
            onChange={(e) => handleNormalPromptChange(e.target.value)}
            placeholder="Enter your scene description in natural language..."
            className="min-h-[150px]"
          />
          
          {/* Gallery Tags Display */}
          {(scene.galleryAssets.characters.length > 0 || 
            scene.galleryAssets.objects.length > 0 || 
            scene.galleryAssets.backgrounds.length > 0) && (
            <div className="mt-3 p-3 bg-muted rounded-md space-y-2">
              <Label className="text-sm font-medium">Gallery Tags:</Label>
              <div className="flex flex-wrap gap-2">
                {scene.galleryAssets.characters.map((id, idx) => (
                  <span key={id} className="px-2 py-1 bg-background rounded text-xs">
                    Character {idx + 1}
                  </span>
                ))}
                {scene.galleryAssets.objects.map((id, idx) => (
                  <span key={id} className="px-2 py-1 bg-background rounded text-xs">
                    Object {idx + 1}
                  </span>
                ))}
                {scene.galleryAssets.backgrounds.map((id, idx) => (
                  <span key={id} className="px-2 py-1 bg-background rounded text-xs">
                    Background {idx + 1}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      {/* JSON Prompt Tab */}
      <TabsContent value="json" className="space-y-3 mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Scene {sceneIndex + 1} - JSON Prompt</Label>
            <CopyToClipboard 
              text={typeof scene.jsonPrompt === 'object' 
                ? JSON.stringify(scene.jsonPrompt, null, 2)
                : scene.jsonPrompt}
              className="h-8 px-3"
            />
          </div>
          <Textarea
            value={typeof scene.jsonPrompt === 'object' 
              ? JSON.stringify(scene.jsonPrompt, null, 2)
              : scene.jsonPrompt}
            onChange={(e) => handleJsonPromptChange(e.target.value)}
            placeholder='{\n  "scene": "description",\n  "camera": "movement",\n  "lighting": "setup"\n}'
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      </TabsContent>
      
      {/* Scene Image Tab */}
      <TabsContent value="scene_image" className="space-y-4 mt-4">
        <div className="space-y-3">
          <Label>Scene {sceneIndex + 1} - Image Prompts</Label>
          
          <RadioGroup value={sceneImageMode} onValueChange={(v) => setSceneImageMode(v as 'start' | 'end')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="start" id={`start-${scene.id}`} />
              <Label htmlFor={`start-${scene.id}`}>Starting Scene</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="end" id={`end-${scene.id}`} />
              <Label htmlFor={`end-${scene.id}`}>Ending Scene</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                {sceneImageMode === 'start' ? 'Starting Scene Prompt' : 'Ending Scene Prompt'}
              </Label>
              <CopyToClipboard 
                text={scene.sceneImage[sceneImageMode]}
                className="h-8 px-3"
              />
            </div>
            <Textarea
              value={scene.sceneImage[sceneImageMode]}
              onChange={(e) => handleSceneImageChange(sceneImageMode, e.target.value)}
              placeholder={`Enter the ${sceneImageMode}ing scene image generation prompt...`}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </TabsContent>
      
      {/* Gallery Tab */}
      <TabsContent value="gallery" className="mt-4">
        <GalleryManager
          sceneId={scene.id}
          sceneNumber={sceneIndex + 1}
          selectedAssets={selectedGalleryAssets}
          onAssetSelect={handleGalleryAssetSelect}
          galleryAssets={scene.galleryAssets}
        />
      </TabsContent>
    </Tabs>
  );
}
