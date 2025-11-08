'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GalleryAsset, AssetType, GALLERY_SUB_TABS } from '@/lib/video/types';
import { Sparkles, Upload, Save, Check, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { safeToast } from '@/lib/safe-toast';
import { cn } from '@/lib/utils';
import { classifyError, toUserToast, toDisplayMessage } from '@/lib/errors';

interface GalleryManagerProps {
  selectedAssets?: GalleryAsset[];
  onAssetsChange?: (assets: GalleryAsset[]) => void;
}

export function GalleryManager({ 
  selectedAssets = [], 
  onAssetsChange 
}: GalleryManagerProps) {
  const [activeTab, setActiveTab] = useState<AssetType>('character');
  const [prompts, setPrompts] = useState<Record<AssetType, string>>({
    character: '',
    subject: '',
    object: '',
    background: ''
  });
  const [isGenerating, setIsGenerating] = useState<Record<AssetType, boolean>>({
    character: false,
    subject: false,
    object: false,
    background: false
  });
  const [generatedAssets, setGeneratedAssets] = useState<Record<AssetType, GalleryAsset[]>>({
    character: [],
    subject: [],
    object: [],
    background: []
  });
  const [savedAssets, setSavedAssets] = useState<Record<AssetType, GalleryAsset[]>>({
    character: [],
    subject: [],
    object: [],
    background: []
  });
  const [errorTexts, setErrorTexts] = useState<Record<AssetType, string | null>>({
    character: null,
    subject: null,
    object: null,
    background: null,
  });
  
  const handleGenerateAssets = async (type: AssetType) => {
    if (!prompts[type].trim()) {
      safeToast({
        title: 'Missing prompt',
        description: `Please enter a prompt for ${type} generation`,
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }
    
    setIsGenerating(prev => ({ ...prev, [type]: true }));
    setErrorTexts(prev => ({ ...prev, [type]: null }));
    
    try {
      const response = await fetch('/api/generate-gallery-asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompts[type],
          type,
          count: 4,
          style: 'cinematic' // Could be made configurable
        }),
      });
      
      if (!response.ok) {
        let errBody: any = null;
        try {
          errBody = await response.json();
        } catch {
          try {
            const txt = await response.text();
            errBody = { message: txt };
          } catch {
            errBody = {};
          }
        }
        const e = new Error(errBody?.message || 'Failed to generate assets');
        (e as any).code = errBody?.code;
        (e as any).status = response.status;
        throw e;
      }
      
      const data = await response.json();
      
      if (data.success && data.assets) {
        const assets: GalleryAsset[] = data.assets.map((asset: any) => ({
          id: asset.id,
          type: asset.type,
          name: asset.title || asset.name || `${type} Asset`,
          prompt: asset.prompt,
          imageUrl: asset.imageUrl,
          tags: asset.tags,
          createdAt: new Date(asset.createdAt)
        }));
        
        setGeneratedAssets(prev => ({
          ...prev,
          [type]: assets
        }));
        
        safeToast({
          title: 'Assets generated',
          description: `Generated ${assets.length} ${type} variations`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating assets:', error);
      const appErr = classifyError(error as any);
      const toastData = toUserToast(appErr);
      safeToast({ title: toastData.title, description: toastData.description, variant: toastData.variant as any, duration: 4000 });
      setErrorTexts(prev => ({ ...prev, [type]: toDisplayMessage(appErr) }));
    } finally {
      setIsGenerating(prev => ({ ...prev, [type]: false }));
    }
  };
  
  const handleSaveAsset = (asset: GalleryAsset) => {
    setSavedAssets(prev => ({
      ...prev,
      [asset.type]: [...prev[asset.type], asset]
    }));
    setGeneratedAssets(prev => ({
      ...prev,
      [asset.type]: prev[asset.type].filter(a => a.id !== asset.id)
    }));
  };
  
  const handleFileUpload = async (type: AssetType, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const uploadPromises = Array.from(files).map(async (file) => {
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      
      const asset: GalleryAsset = {
        id: `${type}_upload_${Date.now()}_${Math.random()}`,
        type,
        name: file.name,
        prompt: `Uploaded: ${file.name}`,
        imageUrl: tempUrl,
        tags: [type, 'uploaded'],
        createdAt: new Date(),
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      };
      
      return asset;
    });
    
    try {
      const uploadedAssets = await Promise.all(uploadPromises);
      
      setSavedAssets(prev => ({
        ...prev,
        [type]: [...prev[type], ...uploadedAssets]
      }));
      
      safeToast({
        title: 'Upload complete',
        description: `Uploaded ${uploadedAssets.length} ${type} image${uploadedAssets.length > 1 ? 's' : ''}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      safeToast({
        title: 'Upload failed',
        description: 'Failed to upload images',
        variant: 'destructive',
        duration: 3500,
      });
    }
  };
  
  const handleAssetToggle = (asset: GalleryAsset) => {
    if (!onAssetsChange) return;
    
    const isSelected = selectedAssets.some(a => a.id === asset.id);
    
    if (isSelected) {
      onAssetsChange(selectedAssets.filter(a => a.id !== asset.id));
    } else {
      onAssetsChange([...selectedAssets, asset]);
    }
  };
  
  const isAssetSelected = (assetId: string) => {
    return selectedAssets.some(asset => asset.id === assetId);
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssetType)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {GALLERY_SUB_TABS.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {GALLERY_SUB_TABS.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {/* Generation Section */}
            <Card className="p-4 bg-card">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Generate {tab.label}</Label>
                  {errorTexts[tab.id] && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2 whitespace-pre-wrap">
                      {errorTexts[tab.id]}
                    </div>
                  )}
                  <Textarea
                    placeholder={`Describe the ${tab.label.toLowerCase()} you want to generate...`}
                    value={prompts[tab.id]}
                    onChange={(e) => setPrompts(prev => ({ ...prev, [tab.id]: e.target.value }))}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGenerateAssets(tab.id)}
                      disabled={isGenerating[tab.id] || !prompts[tab.id].trim()}
                      className="flex-1"
                    >
                      {isGenerating[tab.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate 4 Variations
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`upload-${tab.id}`)?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <input
                    id={`upload-${tab.id}`}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(tab.id, e.target.files)}
                  />
                </div>
              </div>
            </Card>
            
            {/* Generated Assets Preview */}
            {generatedAssets[tab.id] && generatedAssets[tab.id].length > 0 && (
              <Card className="p-4 bg-card">
                <div className="space-y-3">
                  <Label>Generated Options - Click to Save</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {generatedAssets[tab.id].map((asset) => (
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
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setGeneratedAssets(prev => ({
                                ...prev,
                                [tab.id]: prev[tab.id].filter(a => a.id !== asset.id)
                              }));
                            }}
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
                <Label>Saved {tab.pluralLabel}</Label>
                {!savedAssets[tab.id] || savedAssets[tab.id].length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No saved {tab.label.toLowerCase()} yet
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {savedAssets[tab.id].map((asset) => (
                      <div
                        key={asset.id}
                        className={cn(
                          "relative group cursor-pointer",
                          isAssetSelected(asset.id) && "ring-2 ring-primary rounded-lg"
                        )}
                        onClick={() => handleAssetToggle(asset)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={asset.imageUrl}
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
