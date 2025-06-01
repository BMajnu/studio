'use client';

import React from 'react';
import { Download, Copy, CheckCheck, Trophy, Star, Medal, Award, Sparkles, Zap, ArrowDownToLine } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { CheckBestDesignOutput } from '@/ai/flows/check-best-design-flow';

interface TopDesignsResultsProps {
  results: CheckBestDesignOutput | null;
  className?: string;
  onClose?: () => void;
}

export function TopDesignsResults({ results, className, onClose }: TopDesignsResultsProps) {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!results || results.topDesigns.length === 0) {
    return null;
  }

  // Function to copy image to clipboard
  const copyImageToClipboard = async (imageDataUri: string, index: number) => {
    try {
      // Create a fetch request to the data URI to get the image data
      const response = await fetch(imageDataUri);
      const blob = await response.blob();
      
      // Copy the image to clipboard
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      
      // Set copied index for UI feedback
      setCopiedIndex(index);
      toast({ title: '✓ Image copied to clipboard!', duration: 2000 });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy image: ', err);
      toast({ 
        title: '❌ Failed to copy', 
        description: 'Could not copy image to clipboard. Your browser may not support this feature.', 
        variant: 'destructive' 
      });
    }
  };

  // Function to download image
  const downloadImage = (imageDataUri: string, designId: string) => {
    try {
      // Get a clean file name from the design ID or use a default name
      const fileName = designId.replace(/[^a-zA-Z0-9-_]/g, '_') + '.png';
      
      // Create an anchor element and set properties for download
      const link = document.createElement('a');
      link.href = imageDataUri;
      link.download = fileName;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: `📥 Downloading ${fileName}...`, duration: 2000 });
    } catch (err) {
      console.error('Failed to download image: ', err);
      toast({ 
        title: '❌ Download failed', 
        description: 'Could not download the image. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  // Helper to get rank text with proper ordinal suffix
  const getRankText = (rank: number): string => {
    // Handle special cases for 11th, 12th, 13th
    if (rank % 100 >= 11 && rank % 100 <= 13) {
      return `${rank}th Place`;
    }
    
    // Handle standard cases
    switch (rank % 10) {
      case 1: return `${rank}st Place`;
      case 2: return `${rank}nd Place`;
      case 3: return `${rank}rd Place`;
      default: return `${rank}th Place`;
    }
  };

  // Helper to get rank emoji for the design
  const getRankEmoji = (rank: number): React.ReactNode => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500 mr-1.5" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400 mr-1.5" />;
      case 3: return <Award className="h-5 w-5 text-amber-700 mr-1.5" />;
      default: return <Star className="h-5 w-5 text-blue-500 mr-1.5" />;
    }
  };

  // Helper to get image data URI from a design
  const getImageFromDesign = (designId: string): string => {
    // Find the design in the results by ID
    const design = results.topDesigns.find(d => d.designId === designId);
    
    if (!design) return placeholderImage;
    
    // Access the imageDataUri property from the original designs array
    // In the results.topDesigns, we only have the ID reference, not the actual image data
    // The image data should be accessible from the original designs or as a separate property
    
    // Try to get from various possible locations based on the structure
    // @ts-ignore - Handling various potential data structures
    const imageData = design.imageDataUri || 
                     // @ts-ignore - Check if it's in a nested property
                     design.image || 
                     // @ts-ignore - Check if the results object has design images mapped by ID
                     (results.designImages && results.designImages[design.designId]);
    
    if (imageData) return imageData;
    
    // Fallback to a placeholder if no image URI is available
    return placeholderImage;
  };
  
  // Placeholder image for missing designs
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMThweCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
  
  // Helper to get a clean design name for display
  const getDisplayName = (design: any): string => {
    // Try to get the original filename from metadata if available
    if (design.metadata && design.metadata.filename) {
      return design.metadata.filename;
    }
    
    // Fallback to the designId with better formatting
    return design.designId.replace(/_/g, ' ');
  };

  // Helper to get gradient color for rank
  const getRankGradient = (rank: number): string => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-amber-600";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3: return "bg-gradient-to-r from-amber-600 to-amber-800";
      default: return "bg-gradient-to-r from-blue-400 to-indigo-500";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gradient bg-gradient-to-r from-purple-600 to-blue-600">
          <Sparkles className="h-7 w-7 text-amber-500" />
          ✨ Top Designs Evaluation
        </h2>
        <Badge className="text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
          {results.topDesigns.length} designs ranked
        </Badge>
      </div>
      
      <div className="glass-panel p-4 rounded-lg border border-primary/20 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-gradient bg-gradient-to-r from-amber-500 to-orange-500">Analysis Summary</h3>
        </div>
        <p className="text-foreground/90">{results.evaluationSummary}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.topDesigns.map((design, index) => (
          <Card 
            key={design.designId} 
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-xl glass-panel border border-primary/20",
              index === 0 && "ring-2 ring-yellow-500/70 shadow-yellow-500/20 shadow-lg"
            )}
          >
            <CardHeader className={cn(
              "p-4 pb-2 space-y-0 relative border-b border-primary/10",
              getRankGradient(design.rank)
            )}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  {getRankEmoji(design.rank)}
                  <Badge 
                    variant="outline"
                    className={cn(
                      "border-white/40 text-white font-medium",
                      index === 0 && "border-white/60"
                    )}
                  >
                    {getRankText(design.rank)}
                  </Badge>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="px-3 py-1.5 text-base rounded-full bg-white/20 font-bold flex items-center gap-1">
                        <Star className="h-3 w-3" fill="currentColor" />
                        {design.evaluationParameters.overallScore.toFixed(1)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-panel p-3 border border-primary/20 shadow-xl rounded-xl">
                      <div className="space-y-2">
                        <p className="font-bold text-sm flex items-center">
                          <Medal className="h-4 w-4 mr-1.5 text-amber-400" /> 
                          Evaluation Scores
                        </p>
                        <div className="grid grid-cols-1 gap-y-1.5">
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>✨ Visual Attractiveness:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.visualAttractiveness.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>🧩 Simplicity:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.simplicity.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>🎨 Color Harmony:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.colorHarmony.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>📝 Text Readability:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.textAccuracyAndReadability.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>✅ Requirement Matching:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.requirementMatching.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>📊 Alignment:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.alignmentAndComposition.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>🏗️ Visual Hierarchy:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.visualHierarchy.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>🔄 Brand Consistency:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.brandConsistency.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>💡 Innovation:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.innovationAndCreativity.toFixed(1)}</Badge>
                          </div>
                          <div className="text-xs flex items-center justify-between gap-3">
                            <span>♿ Accessibility:</span>
                            <Badge variant="outline" className="bg-background/50">{design.evaluationParameters.accessibilityCompliance.toFixed(1)}</Badge>
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <h3 className="text-sm font-medium text-white mt-2">
                {getDisplayName(design)}
              </h3>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted border border-primary/20 shadow-inner">
                <img 
                  src={getImageFromDesign(design.designId) || placeholderImage} 
                  alt={`Design ${getDisplayName(design)}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    const target = e.target as HTMLImageElement;
                    if (target.src !== placeholderImage) {
                      target.src = placeholderImage;
                    }
                  }}
                  loading="lazy"
                />
              </div>
              
              <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="text-xs font-medium mb-1 text-primary flex items-center">
                  <Star className="h-3.5 w-3.5 mr-1 text-primary" fill="currentColor" /> 
                  Evaluation
                </h4>
                <p className="text-sm text-foreground/80 whitespace-pre-line">
                  {design.reasonSummary}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0 justify-between gap-2 border-t border-primary/10 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-background/80 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => copyImageToClipboard(getImageFromDesign(design.designId), index)}
              >
                {copiedIndex === index ? (
                  <>
                    <CheckCheck className="h-4 w-4 mr-2 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-background/80 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => downloadImage(getImageFromDesign(design.designId), design.designId)}
              >
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
