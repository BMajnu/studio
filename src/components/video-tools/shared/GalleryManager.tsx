'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GalleryAsset, GALLERY_SUB_TABS } from '@/lib/video/types';
import { Plus, Upload, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryManagerProps {
  sceneId: string;
  sceneNumber: number;
  selectedAssets: GalleryAsset[];
  onAssetSelect: (asset: GalleryAsset) => void;
  galleryAssets: {
    characters: string[];
    objects: string[];
    backgrounds: string[];
  };
}

export function GalleryManager({
  sceneId,
  sceneNumber,
  selectedAssets,
  onAssetSelect,
  galleryAssets
}: GalleryManagerProps) {
  const [activeTab, setActiveTab] = useState<string>(GALLERY_SUB_TABS[0].value);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<GalleryAsset[]>([]);
  const [savedAssets, setSavedAssets] = useState<GalleryAsset[]>([]);
  
  const handleGenerateAssets = async () => {
    if (!generationPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // TODO: Call API to generate assets using Gemini 2.0 Flash Preview
      // For now, create mock assets
      const mockAssets: GalleryAsset[] = Array.from({ length: 4 }, (_, i) => ({
        id: `${sceneId}-${activeTab}-${Date.now()}-${i}`,
        type: activeTab as GalleryAsset['type'],
        name: `${activeTab} ${i + 1}`,
        prompt: generationPrompt,
        imageUrl: `https://placehold.co/256x256?text=${activeTab}+${i + 1}`,
        thumbnailUrl: `https://placehold.co/128x128?text=${activeTab}+${i + 1}`,
        metadata: {
          sceneId,
          generatedAt: new Date().toISOString()
        }
      }));
      
      setGeneratedAssets(mockAssets);
    } catch (error) {
      console.error('Error generating assets:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveAsset = (asset: GalleryAsset) => {
    setSavedAssets([...savedAssets, asset]);
    setGeneratedAssets(generatedAssets.filter(a => a.id !== asset.id));
  };
  
  const handleUploadAsset = async (file: File) => {
    // TODO: Implement file upload to Firebase Storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const newAsset: GalleryAsset = {
        id: `${sceneId}-${activeTab}-upload-${Date.now()}`,
        type: activeTab as GalleryAsset['type'],
        name: file.name,
        prompt: 'Uploaded file',
        imageUrl: e.target?.result as string,
        thumbnailUrl: e.target?.result as string,
        metadata: {
          sceneId,
          uploadedAt: new Date().toISOString(),
          fileName: file.name
        }
      };
      setSavedAssets([...savedAssets, newAsset]);
    };
    reader.readAsDataURL(file);
  };
  
  const isAssetSelected = (assetId: string) => {
    return selectedAssets.some(a => a.id === assetId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Scene {sceneNumber} - Gallery Assets
        </Label>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          {GALLERY_SUB_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {GALLERY_SUB_TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4 mt-4">
            {/* Generation Section */}
            <Card className="p-4 bg-card">
              <div className="space-y-3">
                <Label>Generate {tab.label}</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder={`Describe the ${tab.label.toLowerCase()} you want to generate...`}
                    className="flex-1 min-h-[80px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateAssets}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className="flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`upload-${tab.value}`)?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    id={`upload-${tab.value}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadAsset(file);
                    }}
                  />
                </div>
              </div>
            </Card>
            
            {/* Generated Assets Preview */}
            {generatedAssets.length > 0 && (
              <Card className="p-4 bg-card">
                <div className="space-y-3">
                  <Label>Generated Options - Select to Save</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {generatedAssets.map((asset) => (
                      <div key={asset.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={asset.imageUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSaveAsset(asset)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setGeneratedAssets(generatedAssets.filter(a => a.id !== asset.id))}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
            
            {/* Saved Assets */}
            <Card className="p-4 bg-card">
              <div className="space-y-3">
                <Label>Saved {tab.label}</Label>
                {savedAssets.filter(a => a.type === tab.value).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No saved {tab.label.toLowerCase()} yet
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {savedAssets
                      .filter(a => a.type === tab.value)
                      .map((asset) => (
                        <div
                          key={asset.id}
                          className={cn(
                            "relative group cursor-pointer",
                            isAssetSelected(asset.id) && "ring-2 ring-primary rounded-lg"
                          )}
                          onClick={() => onAssetSelect(asset)}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {isAssetSelected(asset.id) && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <p className="text-xs mt-1 truncate">{asset.name}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
