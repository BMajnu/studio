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
import { SceneData, GalleryAsset, StoryFilmParams } from '@/lib/video/types';
import { SceneManager } from './shared/SceneManager';
import { PromptTabs } from './shared/PromptTabs';
import { Film, Sparkles, BookOpen, Users, MapPin, Clock } from 'lucide-react';

interface StoryFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: StoryFilmGenerationParams) => void;
  isLoading?: boolean;
}

export interface StoryFilmGenerationParams extends StoryFilmParams {
  scenes: SceneData[];
  selectedGalleryAssets: GalleryAsset[];
}

export function StoryFilmModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isLoading = false 
}: StoryFilmModalProps) {
  // Story/Film Input State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('drama');
  const [synopsis, setSynopsis] = useState('');
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [plotOutline, setPlotOutline] = useState('');
  const [targetDuration, setTargetDuration] = useState(300); // 5 minutes default
  const [targetAudience, setTargetAudience] = useState('general');
  
  // Scene Management State
  const [sceneMode, setSceneMode] = useState<'single' | 'multiple'>('multiple');
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
  
  // Gallery Assets State
  const [selectedGalleryAssets, setSelectedGalleryAssets] = useState<GalleryAsset[]>([]);
  
  // Video Parameters State
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1080p');
  const [frameRate, setFrameRate] = useState(24); // Cinematic default
  const [colorGrading, setColorGrading] = useState('cinematic');
  const [audioStyle, setAudioStyle] = useState('orchestral');
  
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
  
  const handleGenerateFromSynopsis = async () => {
    if (!synopsis.trim()) return;
    
    // TODO: Use AI to generate scenes from synopsis
    // For now, create a basic scene structure
    const generatedScenes: SceneData[] = [
      {
        id: 'scene-opening',
        sceneNumber: 1,
        normalPrompt: `Opening scene: ${title || 'Story'} begins. ${synopsis.substring(0, 100)}...`,
        jsonPrompt: { type: 'opening', mood: 'establishing' },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-development',
        sceneNumber: 2,
        normalPrompt: `Story development: Characters and conflict emerge`,
        jsonPrompt: { type: 'development', mood: 'rising_action' },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-climax',
        sceneNumber: 3,
        normalPrompt: `Climax: The turning point of the story`,
        jsonPrompt: { type: 'climax', mood: 'intense' },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-resolution',
        sceneNumber: 4,
        normalPrompt: `Resolution: Story concludes`,
        jsonPrompt: { type: 'resolution', mood: 'concluding' },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      }
    ];
    
    setScenes(generatedScenes);
    setSceneMode('multiple');
  };
  
  const handleGenerate = () => {
    const params: StoryFilmGenerationParams = {
      title,
      genre,
      synopsis,
      characters,
      setting,
      plotOutline,
      targetDuration,
      targetAudience,
      scenes,
      selectedGalleryAssets
    };
    onGenerate(params);
  };
  
  const isValidToGenerate = () => {
    return title.trim() && 
           synopsis.trim() && 
           scenes.length > 0 &&
           scenes.every(scene => 
             scene.normalPrompt.trim() || 
             (typeof scene.jsonPrompt === 'object' && Object.keys(scene.jsonPrompt).length > 0)
           );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          {/* Story Information */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Story Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter story/film title..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Synopsis</Label>
                  <Textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Write a brief synopsis of your story..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Characters
                  </Label>
                  <Textarea
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                    placeholder="Describe main characters..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Setting
                  </Label>
                  <Textarea
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    placeholder="Describe the setting/location..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Plot Outline</Label>
                  <Textarea
                    value={plotOutline}
                    onChange={(e) => setPlotOutline(e.target.value)}
                    placeholder="Outline the main plot points..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleGenerateFromSynopsis}
                disabled={!synopsis.trim()}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Scenes from Synopsis
              </Button>
            </div>
          </Card>
          
          {/* Production Settings */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Production Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Duration: {Math.floor(targetDuration / 60)}m {targetDuration % 60}s</Label>
                  <Slider
                    value={[targetDuration]}
                    onValueChange={([v]) => setTargetDuration(v)}
                    min={60}
                    max={1800}
                    step={30}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="teens">Teenagers</SelectItem>
                      <SelectItem value="adults">Adults</SelectItem>
                      <SelectItem value="mature">Mature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Color Grading</Label>
                  <Select value={colorGrading} onValueChange={setColorGrading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="noir">Noir</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="desaturated">Desaturated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Audio Style</Label>
                  <Select value={audioStyle} onValueChange={setAudioStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orchestral">Orchestral</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Scene Management */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Scenes</Label>
                <div className="text-sm text-muted-foreground">
                  {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <SceneManager
                scenes={scenes}
                sceneMode={sceneMode}
                onSceneAdd={handleSceneAdd}
                onSceneRemove={handleSceneRemove}
                onSceneUpdate={handleSceneUpdate}
                onSceneReorder={handleSceneReorder}
                renderSceneContent={(scene, index) => (
                  <PromptTabs
                    scene={scene}
                    sceneIndex={index}
                    onSceneUpdate={(updates) => handleSceneUpdate(scene.id, updates)}
                    selectedGalleryAssets={selectedGalleryAssets}
                    onGalleryAssetsChange={setSelectedGalleryAssets}
                  />
                )}
              />
            </div>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
