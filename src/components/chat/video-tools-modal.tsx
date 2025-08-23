'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Video, Sparkles, Clock, RatioIcon, Palette, Globe, List, Loader2 } from 'lucide-react';

interface VideoToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: VideoGenerationParams) => void;
  isLoading?: boolean;
}

export interface VideoGenerationParams {
  description: string;
  style: string;
  duration: number;
  aspectRatio: string;
  language: 'english' | 'bengali' | 'both';
  outputFormat: 'normal' | 'json' | 'both';
  contentCategory: string;
}

// Popular, practical video styles
const VIDEO_STYLES = [
  { value: 'cinematic', label: 'Cinematic', description: 'Movie-like quality with dramatic shots' },
  { value: 'documentary', label: 'Documentary', description: 'Realistic and informative storytelling' },
  { value: 'animation', label: 'Animation', description: '2D/3D animated style' },
  { value: 'timelapse', label: 'Timelapse', description: 'Fast-forward time progression' },
  { value: 'vlog', label: 'Vlog / Casual', description: 'Handheld, natural, personality-driven' },
  { value: 'explainer', label: 'Explainer / Tutorial', description: 'Clear step-by-step instructional style' },
  { value: 'shortform', label: 'Short-form Vertical', description: 'Snappy, vertical for TikTok/Reels/Shorts' },
  { value: 'musicvideo', label: 'Music Video', description: 'Stylized cuts synced to music' },
  { value: 'productdemo', label: 'Product Demo', description: 'Show features, benefits, and use-cases' },
  { value: 'motiongraphics', label: 'Motion Graphics', description: 'Text/shape animations and transitions' },
  { value: 'stopmotion', label: 'Stop Motion', description: 'Frame-by-frame animation look' },
];

// Common content categories users create
const CONTENT_CATEGORIES = [
  { value: 'shortform', label: 'Short-form (TikTok/Reels)', description: '60s or less, vertical-first social content' },
  { value: 'youtube_vlog', label: 'YouTube Vlog', description: 'Casual lifestyle, day-in-the-life, updates' },
  { value: 'educational', label: 'Educational', description: 'Lessons, tutorials, explainers' },
  { value: 'product_review', label: 'Product Review', description: 'Hands-on reviews and opinions' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative-driven short stories' },
  { value: 'gaming', label: 'Gaming', description: 'Gameplay highlights, commentary' },
  { value: 'travel', label: 'Travel', description: 'Trips, destinations, experiences' },
  { value: 'fitness', label: 'Fitness & Health', description: 'Workouts, wellness tips' },
  { value: 'food', label: 'Food & Cooking', description: 'Recipes, cooking demos' },
  { value: 'news', label: 'News & Current Events', description: 'Updates, analysis, explainers' },
];

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9', description: 'Widescreen (YouTube, TV)' },
  { value: '9:16', label: '9:16', description: 'Vertical (TikTok, Reels)' },
  { value: '1:1', label: '1:1', description: 'Square (Instagram)' },
  { value: '4:3', label: '4:3', description: 'Classic TV' },
  { value: '21:9', label: '21:9', description: 'Ultra-wide Cinematic' },
  { value: '4:5', label: '4:5', description: 'Portrait (Instagram)' },
];

export function VideoToolsModal({ isOpen, onClose, onGenerate, isLoading = false }: VideoToolsModalProps) {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [duration, setDuration] = useState([15]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [language, setLanguage] = useState<'english' | 'bengali' | 'both'>('both');
  const [outputFormat, setOutputFormat] = useState<'normal' | 'json' | 'both'>('both');
  const [contentCategory, setContentCategory] = useState(CONTENT_CATEGORIES[0].value);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [aiDescriptionEnglish, setAiDescriptionEnglish] = useState<string | undefined>(undefined);
  const [aiDescriptionBengali, setAiDescriptionBengali] = useState<string | undefined>(undefined);
  const [showAIDescription, setShowAIDescription] = useState(false);

  const handleGenerate = () => {
    if (!description.trim()) {
      return;
    }

    onGenerate({
      description: description.trim(),
      style,
      duration: duration[0],
      aspectRatio,
      language,
      outputFormat,
      contentCategory,
    });
  };

  const handleRandomPrompt = async () => {
    try {
      setIsGeneratingIdea(true);
      setShowAIDescription(false);
      setAiDescriptionEnglish(undefined);
      setAiDescriptionBengali(undefined);

      const res = await fetch('/api/generate-video-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style,
          contentCategory,
          duration: duration[0],
          aspectRatio,
          language,
          outputFormat,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err?.message || 'Failed to generate idea');
      }
      const data = await res.json();

      const en: string | undefined = data?.descriptionEnglish;
      const bn: string | undefined = data?.descriptionBengali;

      setAiDescriptionEnglish(en);
      setAiDescriptionBengali(bn);

      // Sync the underlying description (used by onGenerate) to match language selection
      const combined = language === 'both'
        ? [en ? `English:\n${en}` : '', bn ? `Bengali:\n${bn}` : ''].filter(Boolean).join('\n\n')
        : (language === 'english' ? (en || '') : (bn || ''));

      setDescription(combined);
      setShowAIDescription(true);
    } catch (e) {
      console.error(e);
      // Keep manual input visible on error
      setShowAIDescription(false);
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setStyle('cinematic');
    setDuration([15]);
    setAspectRatio('16:9');
    setLanguage('both');
    setOutputFormat('both');
    setContentCategory(CONTENT_CATEGORIES[0].value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Tools
          </DialogTitle>
          <DialogDescription>
            Generate optimized video prompts (normal or JSON) for Google Veo 3 and other AI video platforms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Video Description */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="description" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Video Description
            </Label>
            {showAIDescription ? (
              <div className="space-y-2">
                {aiDescriptionEnglish && (
                  <div className="rounded-md border border-border bg-muted/50 p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">English</div>
                    <p className="whitespace-pre-wrap text-sm">{aiDescriptionEnglish}</p>
                  </div>
                )}
                {aiDescriptionBengali && (
                  <div className="rounded-md border border-border bg-muted/50 p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Bengali</div>
                    <p className="whitespace-pre-wrap text-sm">{aiDescriptionBengali}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Textarea
                  id="description"
                  placeholder="Describe the video you want to create..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tip: Be specific about subject, motion, camera, mood, and environment.</span>
                  <span>{description.trim().length} chars</span>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomPrompt}
                disabled={isGeneratingIdea}
              >
                {isGeneratingIdea ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</span>
                ) : (
                  showAIDescription ? 'Regenerate Idea' : 'Random Idea'
                )}
              </Button>
              {showAIDescription && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowAIDescription(false); setAiDescriptionEnglish(undefined); setAiDescriptionBengali(undefined); }}
                  disabled={isGeneratingIdea}
                >
                  Use manual input
                </Button>
              )}
            </div>
          </div>

          {/* Video Style */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="style" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Video Style
            </Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_STYLES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div>
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Category */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="content-category" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Content Category
            </Label>
            <Select value={contentCategory} onValueChange={setContentCategory}>
              <SelectTrigger id="content-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div>
                      <div className="font-medium">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration: {duration[0]} seconds
            </Label>
            <Slider
              id="duration"
              min={5}
              max={60}
              step={5}
              value={duration}
              onValueChange={setDuration}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="aspect-ratio" className="flex items-center gap-2">
              <RatioIcon className="h-4 w-4" />
              Aspect Ratio
            </Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger id="aspect-ratio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    <div>
                      <div className="font-medium">{ratio.label}</div>
                      <div className="text-xs text-muted-foreground">{ratio.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Output Language
            </Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English Only</SelectItem>
                <SelectItem value="bengali">Bengali Only</SelectItem>
                <SelectItem value="both">Both Languages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output Format */}
          <div className="space-y-2 bg-card border border-border rounded-md p-3">
            <Label htmlFor="output-format">Output Format</Label>
            <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as typeof outputFormat)}>
              <SelectTrigger id="output-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Text</SelectItem>
                <SelectItem value="json">JSON Format (Google Veo 3)</SelectItem>
                <SelectItem value="both">Both Formats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!description.trim() || isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
