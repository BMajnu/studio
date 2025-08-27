'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { SceneData, GalleryAsset, AdsParams } from '@/lib/video/types';
import { SceneManager } from './shared/SceneManager';
import { PromptTabs } from './shared/PromptTabs';
import { Megaphone, Target, DollarSign, Users, MessageSquare, Package, TrendingUp, Sparkles } from 'lucide-react';
import { processScenesWithGalleryAssets } from '@/lib/video/gallery-prompt-helper';

interface AdsGeneratorModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onGenerateAction: (params: AdsGenerationParams) => void;
  isLoading?: boolean;
}

export interface AdsGenerationParams extends AdsParams {
  scenes: SceneData[];
  selectedGalleryAssets: GalleryAsset[];
}

const AD_LENGTHS = [
  { value: '6', label: '6 seconds (Bumper)' },
  { value: '15', label: '15 seconds (Short)' },
  { value: '30', label: '30 seconds (Standard)' },
  { value: '60', label: '60 seconds (Long)' },
  { value: '90', label: '90 seconds (Extended)' },
];

const AD_FORMATS = [
  { value: 'product_showcase', label: 'Product Showcase' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'explainer', label: 'Explainer' },
  { value: 'brand_story', label: 'Brand Story' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'social_proof', label: 'Social Proof' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'tv', label: 'Television' },
  { value: 'web', label: 'Web Display' },
];

export function AdsGeneratorModal({ 
  isOpen, 
  onCloseAction, 
  onGenerateAction, 
  isLoading = false 
}: AdsGeneratorModalProps) {
  // Product/Brand Information
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [brandGuidelines, setBrandGuidelines] = useState('');
  
  // Ad Configuration
  const [adLength, setAdLength] = useState('30');
  const [adFormat, setAdFormat] = useState('product_showcase');
  const [platform, setPlatform] = useState('youtube');
  const [tone, setTone] = useState('professional');
  const [urgency, setUrgency] = useState('medium');
  const [emotionalAppeal, setEmotionalAppeal] = useState('trust');
  
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
      id: 'scene-problem',
      sceneNumber: 2,
      normalPrompt: '',
      jsonPrompt: { type: 'problem', duration: 5 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    },
    {
      id: 'scene-solution',
      sceneNumber: 3,
      normalPrompt: '',
      jsonPrompt: { type: 'solution', duration: 15 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    },
    {
      id: 'scene-cta',
      sceneNumber: 4,
      normalPrompt: '',
      jsonPrompt: { type: 'call_to_action', duration: 7 },
      sceneImage: { start: '', end: '' },
      galleryAssets: { characters: [], objects: [], backgrounds: [] }
    }
  ]);
  
  // Gallery Assets State
  const [selectedGalleryAssets, setSelectedGalleryAssets] = useState<GalleryAsset[]>([]);
  
  // Visual Style
  const [visualStyle, setVisualStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('brand');
  const [typography, setTypography] = useState('sans-serif');
  const [animationStyle, setAnimationStyle] = useState('smooth');
  
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
  
  const handleGenerateAdStructure = async () => {
    if (!productName.trim() || !productDescription.trim()) return;
    
    // Generate ad structure based on format and length
    const structuredScenes: SceneData[] = [];
    const totalDuration = parseInt(adLength);
    
    if (adFormat === 'product_showcase') {
      structuredScenes.push(
        {
          id: 'scene-attention',
          sceneNumber: 1,
          normalPrompt: `Eye-catching opening showcasing ${productName}`,
          jsonPrompt: { type: 'attention_grabber', duration: Math.floor(totalDuration * 0.15) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-features',
          sceneNumber: 2,
          normalPrompt: `Highlight key features: ${keyFeatures}`,
          jsonPrompt: { type: 'feature_showcase', duration: Math.floor(totalDuration * 0.4) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-benefits',
          sceneNumber: 3,
          normalPrompt: `Show benefits and USPs: ${uniqueSellingPoints}`,
          jsonPrompt: { type: 'benefits', duration: Math.floor(totalDuration * 0.3) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-cta',
          sceneNumber: 4,
          normalPrompt: `Call to action: ${callToAction}`,
          jsonPrompt: { type: 'call_to_action', duration: Math.floor(totalDuration * 0.15) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        }
      );
    } else if (adFormat === 'testimonial') {
      structuredScenes.push(
        {
          id: 'scene-problem',
          sceneNumber: 1,
          normalPrompt: `Present common problem that ${productName} solves`,
          jsonPrompt: { type: 'problem_statement', duration: Math.floor(totalDuration * 0.2) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-testimonial',
          sceneNumber: 2,
          normalPrompt: `Customer testimonial about ${productName}`,
          jsonPrompt: { type: 'testimonial', duration: Math.floor(totalDuration * 0.5) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-results',
          sceneNumber: 3,
          normalPrompt: `Show results and transformation`,
          jsonPrompt: { type: 'results', duration: Math.floor(totalDuration * 0.2) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        },
        {
          id: 'scene-cta',
          sceneNumber: 4,
          normalPrompt: `${callToAction} with special offer`,
          jsonPrompt: { type: 'call_to_action', duration: Math.floor(totalDuration * 0.1) },
          sceneImage: { start: '', end: '' },
          galleryAssets: { characters: [], objects: [], backgrounds: [] }
        }
      );
    }
    
    setScenes(structuredScenes);
    setSceneMode('multiple');
  };
  
  const handleGenerate = () => {
    // Process scenes with gallery assets for consistency
    const processedScenes = processScenesWithGalleryAssets(scenes, selectedGalleryAssets);
    
    const params: AdsGenerationParams = {
      // Base video params
      description: productDescription,
      style: 'productdemo', // Default style for ads
      duration: parseInt(adLength) || 30,
      language: 'english',
      contentCategory: 'advertisement',
      
      // Ads specific params
      productName,
      brandName,
      productDescription,
      keyFeatures,
      uniqueSellingPoints,
      targetAudience,
      callToAction,
      brandGuidelines,
      adLength,
      adFormat,
      platform,
      sceneMode,
      scenes: processedScenes,
      selectedGalleryAssets
    };
    onGenerateAction(params);
  };
  
  const isValidToGenerate = () => {
    return productName.trim() && 
           brandName.trim() && 
           productDescription.trim() &&
           callToAction.trim() &&
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
            <Megaphone className="h-5 w-5" />
            Ads Generator
          </DialogTitle>
          <DialogDescription>
            Create compelling advertisement videos for products and services
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Product/Brand Information */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name..."
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Product Description</Label>
                  <Textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product or service..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Key Features
                  </Label>
                  <Textarea
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    placeholder="List key features (one per line)..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Unique Selling Points
                  </Label>
                  <Textarea
                    value={uniqueSellingPoints}
                    onChange={(e) => setUniqueSellingPoints(e.target.value)}
                    placeholder="What makes your product unique?"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Audience
                  </Label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Young professionals, 25-35..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Call to Action</Label>
                  <Input
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="e.g., Shop Now, Learn More, Sign Up..."
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Ad Configuration */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ad Configuration</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Ad Length</Label>
                  <Select value={adLength} onValueChange={setAdLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_LENGTHS.map(length => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Ad Format</Label>
                  <Select value={adFormat} onValueChange={setAdFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_FORMATS.map(format => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="emotional">Emotional</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="inspiring">Inspiring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Visual Style</Label>
                  <Select value={visualStyle} onValueChange={setVisualStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="tech">Tech/Futuristic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Animation Style</Label>
                  <Select value={animationStyle} onValueChange={setAnimationStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smooth">Smooth</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="energetic">Energetic</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleGenerateAdStructure}
                disabled={!productName.trim() || !productDescription.trim()}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Ad Structure
              </Button>
            </div>
          </Card>
          
          {/* Scene Management */}
          <Card className="p-4 bg-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Ad Scenes</Label>
                <div className="text-sm text-muted-foreground">
                  {scenes.length} scene{scenes.length !== 1 ? 's' : ''} • {adLength}s total
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
            {isLoading ? 'Generating...' : 'Generate Ad'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
