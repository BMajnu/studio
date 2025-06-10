'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { DesignPromptsData } from '@/lib/types';
import { cn } from '@/lib/utils';

export function DesignPromptsTabs({ promptsData }: { promptsData: DesignPromptsData[] }) {
    if (!promptsData || promptsData.length === 0) {
        return <div>No prompts available.</div>;
    }

    const defaultCategory = promptsData[0]?.category;
    
    return (
        <Tabs defaultValue={defaultCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                {promptsData.map(categoryData => (
                    <TabsTrigger key={categoryData.category} value={categoryData.category}>
                        {categoryData.category}
                    </TabsTrigger>
                ))}
            </TabsList>
            {promptsData.map(categoryData => (
                <TabsContent key={categoryData.category} value={categoryData.category} className="mt-4">
                    <Tabs defaultValue="0" className="w-full">
                        <TabsList className={cn("grid w-full", categoryData.prompts.length === 4 ? "grid-cols-4" : "grid-cols-3")}>
                            {categoryData.prompts.map((_, index) => (
                                <TabsTrigger key={index} value={index.toString()}>
                                    Prompt {index + 1}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {categoryData.prompts.map((prompt, index) => (
                            <TabsContent key={index} value={index.toString()} className="mt-4">
                                <CopyToClipboard textToCopy={prompt} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </TabsContent>
            ))}
        </Tabs>
    );
} 