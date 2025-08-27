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
import { Checkbox } from '@/components/ui/checkbox';
import { SceneData, GalleryAsset, ViralVideoParams, VIRAL_PLATFORMS } from '@/lib/video/types';
import { SceneManager } from './shared/SceneManager';
import { PromptTabs } from './shared/PromptTabs';
import { TrendingUp, Hash, Users, Zap, Target, Share2, Eye, Clock, Music, Heart, Sparkles } from 'lucide-react';
import { processScenesWithGalleryAssets } from '@/lib/video/gallery-prompt-helper';

interface ViralVideoModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onGenerateAction: (params: ViralVideoGenerationParams) => void;
  isLoading?: boolean;
}

export interface ViralVideoGenerationParams extends ViralVideoParams {
  scenes: SceneData[];
  selectedGalleryAssets: GalleryAsset[];
}

const VIRAL_FORMATS = [
  { value: 'challenge', label: 'Challenge/Trend' },
  { value: 'reaction', label: 'Reaction' },
  { value: 'tutorial', label: 'Tutorial/How-to' },
  { value: 'comedy', label: 'Comedy/Skit' },
  { value: 'transformation', label: 'Before/After' },
  { value: 'storytime', label: 'Story Time' },
  { value: 'dance', label: 'Dance' },
  { value: 'prank', label: 'Prank' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'educational', label: 'Educational' },
  { value: 'motivation', label: 'Motivational' },
  { value: 'asmr', label: 'ASMR' },
];

const HOOKS = [
  { value: 'question', label: 'Question Hook' },
  { value: 'shocking', label: 'Shocking Statement' },
  { value: 'visual', label: 'Visual Surprise' },
  { value: 'countdown', label: 'Countdown/Number' },
  { value: 'promise', label: 'Promise/Benefit' },
  { value: 'controversy', label: 'Controversial Opinion' },
  { value: 'relatable', label: 'Relatable Situation' },
  { value: 'challenge', label: 'Challenge Viewers' },
];

const ENGAGEMENT_TACTICS = [
  { value: 'comment_prompt', label: 'Ask for Comments' },
  { value: 'share_prompt', label: 'Encourage Sharing' },
  { value: 'follow_prompt', label: 'Follow for More' },
  { value: 'duet_prompt', label: 'Duet/Stitch Invitation' },
  { value: 'poll', label: 'Poll/Vote' },
  { value: 'contest', label: 'Contest/Giveaway' },
  { value: 'series', label: 'Part of Series' },
  { value: 'save_prompt', label: 'Save for Later' },
];

export function ViralVideoModal({ 
  isOpen, 
  onCloseAction, 
  onGenerateAction, 
  isLoading = false 
}: ViralVideoModalProps) {
  // Viral Content Configuration
  const [topic, setTopic] = useState('');
  const [trend, setTrend] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['tiktok']);
  const [viralFormat, setViralFormat] = useState('challenge');
  const [hookType, setHookType] = useState('question');
  const [engagementTactics, setEngagementTactics] = useState<string[]>(['comment_prompt']);
  
  // Content Details
  const [caption, setCaption] = useState('');
  const [musicChoice, setMusicChoice] = useState('trending');
  const [voiceoverStyle, setVoiceoverStyle] = useState('energetic');
  const [pacing, setPacing] = useState('fast');
  const [visualEffects, setVisualEffects] = useState('dynamic');
  
  // Timing & Duration
  const [duration, setDuration] = useState(30);
  const [optimalPostTime, setOptimalPostTime] = useState('evening');
  const [seriesNumber, setSeriesNumber] = useState('');
  
  // Scene Management State
  const [sceneMode, setSceneMode] = useState<'single' | 'multiple'>('multiple');
  const [scenes, setScenes] = useState<SceneData[]>([
    {
      id: 'scene-hook',
      sceneNumber: 1,
      normalPrompt: '',
      jsonPrompt: { type: 'hook', duration: 3 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    },
    {
      id: 'scene-main',
      sceneNumber: 2,
      normalPrompt: '',
      jsonPrompt: { type: 'main_content', duration: 20 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    },
    {
      id: 'scene-cta',
      sceneNumber: 3,
      normalPrompt: '',
      jsonPrompt: { type: 'engagement', duration: 7 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    }
  ]);
  
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
  
  const handleAnalyzeTrend = async () => {
    if (!trend.trim()) return;
    
    // TODO: Implement trend analysis using AI
    // For now, generate basic viral structure
    const viralScenes: SceneData[] = [
      {
        id: 'scene-hook',
        sceneNumber: 1,
        normalPrompt: `${hookType === 'question' ? 'POV: ' : ''}${trend} - attention grabbing opening`,
        jsonPrompt: { 
          type: 'hook', 
          duration: 2,
          effect: 'zoom_in',
          text_overlay: true 
        },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-build',
        sceneNumber: 2,
        normalPrompt: `Building tension/interest around ${topic || trend}`,
        jsonPrompt: { 
          type: 'build_up', 
          duration: Math.floor(duration * 0.3),
          pacing: 'increasing',
          music_sync: true
        },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-peak',
        sceneNumber: 3,
        normalPrompt: `Peak moment/reveal - the viral moment`,
        jsonPrompt: { 
          type: 'climax', 
          duration: Math.floor(duration * 0.4),
          effect: 'slow_motion',
          impact: 'high'
        },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      },
      {
        id: 'scene-engage',
        sceneNumber: 4,
        normalPrompt: `${engagementTactics.includes('comment_prompt') ? 'Comment your answer! ' : ''}Follow for part 2!`,
        jsonPrompt: { 
          type: 'call_to_action', 
          duration: 3,
          engagement: engagementTactics,
          loop_friendly: true
        },
        sceneImage: { start: '', end: '' },
        galleryAssets: { characters: [], objects: [], backgrounds: [] }
      }
    ];
    
    setScenes(viralScenes);
    setSceneMode('multiple');
  };
  
  const handleGenerateCaption = () => {
    // Generate viral caption based on inputs
    const hashtagList = hashtags.split(',').map(tag => tag.trim()).filter(Boolean);
    const formattedHashtags = hashtagList.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
    
    let generatedCaption = '';
    
    if (hookType === 'question') {
      generatedCaption = `${topic ? topic + ' - ' : ''}What would you do? 🤔\n\n`;
    } else if (hookType === 'shocking') {
      generatedCaption = `WAIT FOR IT... 😱\n\n`;
    } else if (hookType === 'promise') {
      generatedCaption = `How to ${topic || 'go viral'} in ${duration} seconds ⏰\n\n`;
    }
    
    if (engagementTactics.includes('comment_prompt')) {
      generatedCaption += 'Drop a ❤️ if you relate!\n';
    }
    if (engagementTactics.includes('follow_prompt')) {
      generatedCaption += 'Follow for more content like this! 🔥\n';
    }
    if (seriesNumber) {
      generatedCaption += `Part ${seriesNumber} ${engagementTactics.includes('series') ? '(check profile for full series)' : ''}\n`;
    }
    
    generatedCaption += `\n${formattedHashtags}`;
    
    setCaption(generatedCaption);
  };
  
  const handleGenerate = () => {
    // Process scenes with gallery assets for consistency
    const processedScenes = processScenesWithGalleryAssets(scenes, selectedGalleryAssets);
    
    const params: ViralVideoGenerationParams = {
      // Base video params
      description: `${topic} - ${trend}`,
      style: visualEffects,
      duration,
      language: 'english',
      contentCategory: viralFormat,
      // Viral specific params
      topic,
      trend,
      hashtags,
      targetPlatforms,
      viralFormat,
      hookType,
      engagementTactics,
      sceneMode,
      scenes: processedScenes,
      selectedGalleryAssets
    };
    onGenerateAction(params);
  };
  
  const isValidToGenerate = () => {
    return topic.trim() && 
           targetPlatforms.length > 0 &&
           scenes.length > 0 &&
           scenes.every(scene => 
             scene.normalPrompt.trim() || 
             (typeof scene.jsonPrompt === 'object' && Object.keys(scene.jsonPrompt).length > 0)
           );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Viral Video Generator
          </DialogTitle>
          <DialogDescription>
            Create engaging content optimized for social media virality
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Viral Content Setup */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Viral Content Setup
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topic/Niche</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Life hacks, Cooking, Fashion..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Current Trend</Label>
                  <Input
                    value={trend}
                    onChange={(e) => setTrend(e.target.value)}
                    placeholder="e.g., Trending sound, challenge name..."
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hashtags
                  </Label>
                  <Textarea
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="Enter hashtags separated by commas (e.g., fyp, viral, trending)"
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {VIRAL_PLATFORMS.map(platform => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.value}
                          checked={targetPlatforms.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTargetPlatforms([...targetPlatforms, platform.value]);
                            } else {
                              setTargetPlatforms(targetPlatforms.filter(p => p !== platform.value));
                            }
                          }}
                        />
                        <Label htmlFor={platform.value}>{platform.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Viral Strategy */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Viral Strategy
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Format</Label>
                  <Select value={viralFormat} onValueChange={setViralFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIRAL_FORMATS.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Hook Type</Label>
                  <Select value={hookType} onValueChange={setHookType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOOKS.map(hook => (
                        <SelectItem key={hook.value} value={hook.value}>
                          {hook.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Engagement Tactics</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {ENGAGEMENT_TACTICS.map(tactic => (
                      <div key={tactic.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={tactic.value}
                          checked={engagementTactics.includes(tactic.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEngagementTactics([...engagementTactics, tactic.value]);
                            } else {
                              setEngagementTactics(engagementTactics.filter(t => t !== tactic.value));
                            }
                          }}
                        />
                        <Label htmlFor={tactic.value} className="text-xs">
                          {tactic.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration: {duration}s
                  </Label>
                  <Slider
                    value={[duration]}
                    onValueChange={([v]) => setDuration(v)}
                    min={5}
                    max={180}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Series Part (optional)</Label>
                  <Input
                    value={seriesNumber}
                    onChange={(e) => setSeriesNumber(e.target.value)}
                    placeholder="e.g., 1, 2, 3..."
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleAnalyzeTrend}
                  disabled={!trend.trim()}
                  className="flex-1"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Trend & Generate Structure
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateCaption}
                  className="flex-1"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Generate Caption
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Production Style */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Music className="h-4 w-4" />
                Production Style
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Music Choice</Label>
                  <Select value={musicChoice} onValueChange={setMusicChoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending Audio</SelectItem>
                      <SelectItem value="original">Original Sound</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="voiceover">Voice Over Only</SelectItem>
                      <SelectItem value="background">Background Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Pacing</Label>
                  <Select value={pacing} onValueChange={setPacing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Visual Effects</Label>
                  <Select value={visualEffects} onValueChange={setVisualEffects}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Caption */}
          {caption && (
            <Card className="p-4 bg-card">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Generated Caption
                </Label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </Card>
          )}
          
          {/* Scene Management */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Video Scenes</Label>
                <div className="text-sm text-muted-foreground">
                  {scenes.length} scene{scenes.length !== 1 ? 's' : ''} • {duration}s total
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
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isLoading || !isValidToGenerate()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Viral Video'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
