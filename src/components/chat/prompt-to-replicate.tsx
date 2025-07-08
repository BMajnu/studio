'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check, X, Upload, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { promptToReplicate } from '@/ai/flows/prompt-to-replicate-flow';
import type { PromptToReplicateOutput } from '@/ai/flows/prompt-to-replicate-types';

interface PromptToReplicateProps {
  userName?: string;
  userApiKey?: string;
  modelId?: string;
  onClose: () => void;
  initialResults?: PromptToReplicateOutput | null;
  isLoading?: boolean;
}

export function PromptToReplicate({ userName, userApiKey, modelId, onClose, initialResults, isLoading: externalIsLoading }: PromptToReplicateProps) {
  const [isLoading, setIsLoading] = useState<boolean>(externalIsLoading || false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<PromptToReplicateOutput['imagePrompts']>([]);
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  
  // Initialize with initialResults if provided
  useEffect(() => {
    if (initialResults && initialResults.imagePrompts) {
      setPrompts(initialResults.imagePrompts);
      // Extract image data URIs from results to show as uploaded images
      setUploadedImages(initialResults.imagePrompts.map(prompt => prompt.imageDataUri));
    }
  }, [initialResults]);
  
  // Update loading state when external loading state changes
  useEffect(() => {
    if (externalIsLoading !== undefined) {
      setIsLoading(externalIsLoading);
    }
  }, [externalIsLoading]);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files.",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          newImages.push(event.target.result);
          
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Generate prompts
  const handleGeneratePrompts = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one image to generate prompts.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await promptToReplicate({
        imageDataUris: uploadedImages,
        userName,
        userApiKey,
        modelId,
      });
      
      setPrompts(result.imagePrompts);
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: "Error",
        description: "Failed to generate prompts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy prompt to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [id]: true });
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [id]: false });
    }, 2000);
  };
  
  return (
    <Card className="w-full max-w-5xl mx-auto glass-panel border border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gradient">
          <Sparkles className="h-5 w-5 inline-block mr-2" />
          Prompt to Replicate
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-lg p-4 border-primary/20 hover:border-primary/40 transition-all">
              <label htmlFor="image-upload" className="cursor-pointer group">
                <div className="flex flex-col items-center justify-center space-y-2 p-4">
                  <Upload className="h-10 w-10 text-primary/50 group-hover:text-primary transition-all" />
                  <p className="text-lg font-medium">Upload Image{uploadedImages.length > 0 ? "s" : ""}</p>
                  <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
                </div>
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {uploadedImages.length > 0 && (
              <>
                <h3 className="text-lg font-medium">Uploaded Images ({uploadedImages.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border border-border h-40">
                      <Image 
                        src={image} 
                        alt={`Uploaded image ${index + 1}`} 
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleGeneratePrompts} 
                  disabled={isLoading}
                >
                  {isLoading ? "Generating Prompts..." : "Generate Prompts"}
                </Button>
              </>
            )}
          </div>
        ) : (
          // Display prompts for each image
          <div className="space-y-8">
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-medium">Generated Prompts</h3>
              <Button variant="outline" size="sm" onClick={() => setPrompts([])}>
                Upload Different Images
              </Button>
            </div>
            
            {prompts.map((imagePrompt, imageIndex) => (
              <Card key={imageIndex} className="border border-border">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="relative rounded-md overflow-hidden w-24 h-24 border border-border">
                      <Image 
                        src={imagePrompt.imageDataUri} 
                        alt={`Image ${imageIndex + 1}`} 
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <h4 className="text-lg font-semibold">Image {imageIndex + 1} Prompts</h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="exact" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4 bg-gradient-to-r from-background/80 to-muted/80 p-1 rounded-lg">
                      <TabsTrigger value="exact" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Exact Replication</TabsTrigger>
                      <TabsTrigger value="similar" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Similar with Tweaks</TabsTrigger>
                      <TabsTrigger value="niche" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Same Niche/Concept</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="exact">
                      <PromptDisplay 
                        prompt={imagePrompt.exactReplicationPrompt} 
                        title="Exact Replication"
                        description="A prompt to recreate this exact design"
                        id={`exact-${imageIndex}`}
                        copyStatus={copyStatus}
                        onCopy={copyToClipboard}
                      />
                    </TabsContent>
                    
                    <TabsContent value="similar">
                      <PromptDisplay 
                        prompt={imagePrompt.similarWithTweaksPrompt} 
                        title="Similar with Tweaks"
                        description="A prompt for a similar design with modifications"
                        id={`similar-${imageIndex}`}
                        copyStatus={copyStatus}
                        onCopy={copyToClipboard}
                      />
                    </TabsContent>
                    
                    <TabsContent value="niche">
                      <PromptDisplay 
                        prompt={imagePrompt.sameNichePrompt} 
                        title="Same Niche/Concept"
                        description="A prompt for a different design in the same category"
                        id={`niche-${imageIndex}`}
                        copyStatus={copyStatus}
                        onCopy={copyToClipboard}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PromptDisplayProps {
  prompt: string;
  title: string;
  description: string;
  id: string;
  copyStatus: {[key: string]: boolean};
  onCopy: (text: string, id: string) => void;
}

function PromptDisplay({ prompt, title, description, id, copyStatus, onCopy }: PromptDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => onCopy(prompt, id)}
        >
          {copyStatus[id] ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </Button>
      </div>
      <ScrollArea className="h-[200px] rounded-md border p-4 bg-background">
        <pre className="text-sm whitespace-pre-wrap">{prompt}</pre>
      </ScrollArea>
    </div>
  );
} 