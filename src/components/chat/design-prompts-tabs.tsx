'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignPromptsData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ImageGenerationPanel } from './image-generation-panel';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function DesignPromptsTabs({ 
    promptsData 
}: { 
    promptsData: DesignPromptsData[] 
}) {
    if (!promptsData || promptsData.length === 0) {
        return <div>No prompts available.</div>;
    }

    const defaultCategory = promptsData[0]?.category;
    
    // Track which prompt is being generated
    const [generatingPrompt, setGeneratingPrompt] = useState<{
        category: string;
        promptIndex: number;
        prompt: string;
    } | null>(null);
    
    // Handle generate button click
    const handleGenerate = (category: string, promptIndex: number, prompt: string) => {
        setGeneratingPrompt({
            category,
            promptIndex,
            prompt
        });
    };
    
    // Close generation panel
    const handleCloseGenerationPanel = () => {
        setGeneratingPrompt(null);
    };
    
    return (
        <Tabs defaultValue={defaultCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                {promptsData.map(categoryData => (
                    <TabsTrigger 
                        key={categoryData.category} 
                        value={categoryData.category}
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
                    >
                        {categoryData.category}
                    </TabsTrigger>
                ))}
            </TabsList>
            {promptsData.map(categoryData => (
                <TabsContent key={categoryData.category} value={categoryData.category} className="mt-4">
                    <Tabs defaultValue="0" className="w-full">
                        <TabsList className={cn("grid w-full", categoryData.prompts.length === 4 ? "grid-cols-4" : "grid-cols-3")}>
                            {categoryData.prompts.map((_, index) => (
                                <TabsTrigger 
                                    key={index} 
                                    value={index.toString()}
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md"
                                >
                                    Prompt {index + 1}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {categoryData.prompts.map((prompt, index) => (
                            <TabsContent key={index} value={index.toString()} className="mt-4">
                                <div className="relative rounded-md border bg-card/50 shadow-sm my-2">
                                    <div className="p-4">
                                        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground font-mono">
                                            <code>{prompt}</code>
                                        </pre>
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                            onClick={() => navigator.clipboard.writeText(prompt)}
                                                            aria-label="Copy to clipboard"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy Prompt</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                                                            onClick={() => handleGenerate(categoryData.category, index, prompt)}
                                                            aria-label="Generate images"
                                                        >
                                                            <Sparkles className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Generate Image</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                    {/* Persist generation panel across prompt tab switches */}
                    {generatingPrompt && generatingPrompt.category === categoryData.category && (
                        <div className="mt-4">
                            <ImageGenerationPanel
                                prompt={generatingPrompt.prompt}
                                onClose={handleCloseGenerationPanel}
                            />
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
} 