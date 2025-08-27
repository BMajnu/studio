'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { GalleryAsset } from '@/lib/video/types';
import { Film, Sparkles } from 'lucide-react';

interface StoryFilmModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onGenerateAction: (params: StoryFilmGenerationParams) => void;
  isLoading?: boolean;
}

export interface StoryFilmGenerationParams {
  storylineIdea: string;
  sceneCount: number | 'auto';
  storyType: string;
  audioMode: 'speaking' | 'narration' | 'none';
  selectedGalleryAssets: GalleryAsset[];
}

export function StoryFilmModal({ 
  isOpen, 
  onCloseAction, 
  onGenerateAction, 
  isLoading = false 
}: StoryFilmModalProps) {
  // Story/Film Input State
  const [storylineIdea, setStorylineIdea] = useState('');
  const [sceneCount, setSceneCount] = useState<number | 'auto'>(5);
  const [storyType, setStoryType] = useState('realistic');
  const [audioMode, setAudioMode] = useState<'speaking' | 'narration' | 'none'>('speaking');
  
  // Gallery Assets State
  const [selectedGalleryAssets, setSelectedGalleryAssets] = useState<GalleryAsset[]>([]);
  
  const handleGenerate = () => {
    const params: StoryFilmGenerationParams = {
      storylineIdea,
      sceneCount,
      storyType,
      audioMode,
      selectedGalleryAssets
    };
    
    onGenerateAction(params);
  };
  
  const isValidToGenerate = () => {
    // User only needs to provide storyline idea
    return storylineIdea.trim().length > 0;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Story/Film Generator
          </DialogTitle>
          <DialogDescription>
            Create narrative-driven video content with character development and plot structure
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Story Input */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storyline">
                  <Film className="inline-block h-4 w-4 mr-1" />
                  Your Story Idea
                </Label>
                <Textarea
                  id="storyline"
                  placeholder="Describe your story or film idea. AI will generate the complete script and scenes for you..."
                  value={storylineIdea}
                  onChange={(e) => setStorylineIdea(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Provide your story concept, plot, or theme. AI will create professional scenes and dialogue.
                </p>
              </div>
            </div>
          </Card>
          {/* Story Settings */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <Label className="text-base font-medium">Story Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Scenes</Label>
                  {sceneCount === 'auto' ? (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => setSceneCount(5)}
                        className="w-full"
                      >
                        AI Decides (Currently Auto)
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Slider
                        value={[sceneCount as number]}
                        onValueChange={([v]) => setSceneCount(v)}
                        min={1}
                        max={20}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{sceneCount} scenes</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSceneCount('auto')}
                        >
                          Let AI Decide
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Story Type</Label>
                  <Select value={storyType} onValueChange={setStoryType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="animated">Animated</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Audio Mode</Label>
                  <RadioGroup value={audioMode} onValueChange={(v) => setAudioMode(v as typeof audioMode)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="speaking" id="speaking" />
                      <Label htmlFor="speaking">Character Dialogue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="narration" id="narration" />
                      <Label htmlFor="narration">Narrator Voice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">No Voice (Music Only)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Gallery Assets (Optional) */}
          <Card className="p-4 bg-card">
            <div className="space-y-3">
              <Label className="text-base font-medium">Gallery Assets (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                AI will generate all scenes and characters based on your story idea. You can optionally use gallery assets for character consistency.
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
            {isLoading ? 'Generating...' : 'Generate Story/Film'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
