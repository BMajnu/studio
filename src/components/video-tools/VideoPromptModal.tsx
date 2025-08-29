'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { SceneData, GalleryAsset, VIDEO_STYLES, AUDIO_MODES } from '@/lib/video/types';
import { SceneManager } from './shared/SceneManager';
import { PromptTabs } from './shared/PromptTabs';
import { Video, Sparkles, Wand2 } from 'lucide-react';
import { processScenesWithGalleryAssets } from '@/lib/video/gallery-prompt-helper';

interface VideoPromptModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onGenerateAction: (params: VideoPromptGenerationParams) => void;
  isLoading?: boolean;
}

export interface VideoPromptGenerationParams {
  sceneMode: 'single' | 'multiple';
  scenes: SceneData[];
  selectedGalleryAssets: GalleryAsset[];
  videoStyle: string;
  contentCategory: string;
  duration: number;
  audioMode: string;
  userIdea?: string;  // User provides idea, AI generates prompts
}

export function VideoPromptModal({ 
  isOpen, 
  onCloseAction, 
  onGenerateAction, 
  isLoading = false 
}: VideoPromptModalProps) {
  // Scene Management State
  const [sceneMode, setSceneMode] = useState<'single' | 'multiple'>('single');
  const [scenes, setScenes] = useState<SceneData[]>([
    {
      id: 'scene-1',
      sceneNumber: 1,
      normalPrompt: '',
      jsonPrompt: {},
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    }
  ]);
  
  // Video Parameters State
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [contentCategory, setContentCategory] = useState('general');
  const [duration, setDuration] = useState(15);
  const [audioMode, setAudioMode] = useState('auto');
  const [userIdea, setUserIdea] = useState(''); // User describes their idea
  
  // Gallery Assets State
  const [selectedGalleryAssets, setSelectedGalleryAssets] = useState<GalleryAsset[]>([]);
  
  const handleSceneAdd = () => {
    const newScene: SceneData = {
      id: `scene-${Date.now()}`,
      sceneNumber: scenes.length + 1,
      normalPrompt: '',
      jsonPrompt: {},
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    };
    setScenes([...scenes, newScene]);
  };
  
  const handleSceneRemove = (sceneId: string) => {
    setScenes(scenes.filter(s => s.id !== sceneId));
  };
  
  const handleSceneUpdate = (sceneId: string, updates: Partial<SceneData>) => {
    setScenes(scenes.map(s => 
      s.id === sceneId ? { ...s, ...updates } : s
    ));
  };
  
  const handleSceneReorder = (sceneId: string, direction: 'up' | 'down') => {
    const index = scenes.findIndex(s => s.id === sceneId);
    if (index === -1) return;
    
    const newScenes = [...scenes];
    if (direction === 'up' && index > 0) {
      [newScenes[index - 1], newScenes[index]] = [newScenes[index], newScenes[index - 1]];
    } else if (direction === 'down' && index < scenes.length - 1) {
      [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];
    }
    
    // Update scene numbers
    newScenes.forEach((scene, idx) => {
      scene.sceneNumber = idx + 1;
    });
    
    setScenes(newScenes);
  };
  
  const handleGenerate = () => {
    // Process scenes with gallery assets for consistency
    const processedScenes = processScenesWithGalleryAssets(scenes, selectedGalleryAssets);
    
    onGenerateAction({
      sceneMode,
      scenes: processedScenes,
      selectedGalleryAssets,
      videoStyle,
      contentCategory,
      duration,
      audioMode,
      userIdea
    });
  };
  
  const handleGenerateRandomIdea = async () => {
    // TODO: Implement random idea generation using AI
    const randomPrompts = [
      "A cinematic journey through a futuristic city at night",
      "Nature documentary style footage of ocean waves",
      "Time-lapse of clouds moving across mountain peaks",
      "Abstract visual art with geometric shapes and colors",
      "Street photography montage in black and white"
    ];
    
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    handleSceneUpdate(scenes[0].id, { normalPrompt: randomPrompt });
  };
  
  const isValidToGenerate = () => {
    // User only needs to provide an idea, AI will generate prompts
    return userIdea.trim().length > 0;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Prompt Generator
          </DialogTitle>
          <DialogDescription>
            Create detailed prompts for video generation with scene management and gallery assets
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Scene Mode Selection */}
          <Card className="p-4 bg-card">
            <div className="space-y-3">
              <Label>Scene Mode</Label>
              <RadioGroup value={sceneMode} onValueChange={(v) => setSceneMode(v as 'single' | 'multiple')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single Scene</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Multiple Scenes</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>
          
          {/* User Idea Input */}
          <Card className="p-4 bg-card">
            <div className="space-y-3">
              <Label htmlFor="user-idea">Describe Your Video Idea</Label>
              <Textarea
                id="user-idea"
                placeholder="Describe what you want to create. AI will generate the detailed prompts for you..."
                value={userIdea}
                onChange={(e) => setUserIdea(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Provide your idea or concept, and AI will generate professional video prompts
              </p>
            </div>
          </Card>
          
          {/* Video Parameters */}
          <Card className="p-4 bg-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video Style</Label>
                <Select value={videoStyle} onValueChange={setVideoStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_STYLES.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Content Category</Label>
                <Select value={contentCategory} onValueChange={setContentCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Duration (seconds): {duration}s</Label>
                <Slider
                  value={[duration]}
                  onValueChange={([v]) => setDuration(v)}
                  min={5}
                  max={180}
                  step={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Audio Mode</Label>
                <Select value={audioMode} onValueChange={setAudioMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIO_MODES.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          {/* Gallery Management (for consistency) */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Gallery Assets (Optional)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateRandomIdea}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Random Idea
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                AI will generate scene prompts based on your idea. You can optionally use gallery assets for consistency.
              </p>
            </div>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isLoading || !isValidToGenerate()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Video Prompts'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
