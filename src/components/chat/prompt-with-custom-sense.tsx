'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// ScrollArea might not be needed if prompts are not displayed here
// import { ScrollArea } from '@/components/ui/scroll-area'; 
import { X, Plus, Trash, MessageSquarePlus } from 'lucide-react'; // Removed Wand2, Copy, Check if not used
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
// cn might not be needed if conditional styling for prompt display is removed
// import { cn } from '@/lib/utils'; 
import { promptWithCustomSense } from '@/ai/flows/prompt-with-custom-sense-flow';
import type { PromptWithCustomSenseOutput } from '@/ai/flows/prompt-with-custom-sense-types';
// Removed Tabs imports as they are no longer used

interface PromptWithCustomSenseProps {
  userName?: string;
  userApiKey?: string;
  modelId?: string;
  onClose: () => void;
  onPromptsGenerated: (prompts: PromptWithCustomSenseOutput['prompts'], designType: string, description: string) => void;
}

const DEFAULT_DESIGN_TYPES = [
  "Vector Design",
  "Illustration",
  "POD Design",
  "Thumbnail Design",
  "Poster Design"
];

export function PromptWithCustomSense({ userName, userApiKey, modelId, onClose, onPromptsGenerated }: PromptWithCustomSenseProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [designTypes, setDesignTypes] = useState<string[]>(DEFAULT_DESIGN_TYPES);
  const [selectedDesignType, setSelectedDesignType] = useState<string>("POD Design");
  const [description, setDescription] = useState<string>("");
  const [newDesignType, setNewDesignType] = useState<string>("");
  const { toast } = useToast();
  
  const addDesignType = () => {
    if (newDesignType.trim() === "") return;
    if (designTypes.includes(newDesignType.trim())) {
      toast({
        title: "Design type already exists",
        description: "This design type is already in the list.",
        variant: "destructive"
      });
      return;
    }
    
    setDesignTypes(prev => [...prev, newDesignType.trim()]);
    setNewDesignType("");
  };
  
  const removeDesignType = (typeToRemove: string) => {
    if (designTypes.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one design type.",
        variant: "destructive"
      });
      return;
    }
    
    setDesignTypes(prev => prev.filter(type => type !== typeToRemove));
    if (selectedDesignType === typeToRemove) {
      setSelectedDesignType(designTypes.filter(type => type !== typeToRemove)[0] || DEFAULT_DESIGN_TYPES[0]);
    }
  };
  
  const handleGeneratePrompts = async () => {
    if (description.trim() === "") {
      toast({
        title: "Description required",
        description: "Please describe the original concept or changes you want.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await promptWithCustomSense({
        designType: selectedDesignType,
        description: description.trim(),
        userName,
        userApiKey,
        modelId,
      });
      
      onPromptsGenerated(result.prompts, selectedDesignType, description.trim());
      onClose();
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
  
  return (
    <Card className="w-full max-w-4xl mx-auto glass-panel border border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gradient">
          <MessageSquarePlus className="h-5 w-5 inline-block mr-2" />
          Prompt with Custom Change
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">What type of design is it?</h3>
              <RadioGroup 
                value={selectedDesignType} 
                onValueChange={setSelectedDesignType}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {designTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeDesignType(type)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="flex items-center mt-4 space-x-2">
                <Input 
                  placeholder="Add new design type..." 
                  value={newDesignType}
                  onChange={(e) => setNewDesignType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDesignType();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={addDesignType} className="flex-shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Describe the original concept or what changes you want</h3>
              <Textarea 
                placeholder="E.g., A funny cat wearing sunglasses for a t-shirt design" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGeneratePrompts} 
              disabled={isLoading}
            >
              {isLoading ? "Generating Prompts..." : "Generate Prompts"}
            </Button>
          </div>
      </CardContent>
    </Card>
  );
} 