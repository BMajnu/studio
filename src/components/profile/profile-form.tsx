
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/types";
import { DEFAULT_USER_PROFILE, AVAILABLE_MODELS, DEFAULT_MODEL_ID } from "@/lib/constants";
import { PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  professionalTitle: z.string().max(100).optional().nullable(),
  yearsOfExperience: z.coerce.number().int().positive().optional().or(z.literal("")).nullable(),
  portfolioLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")).nullable(),
  communicationStyleNotes: z.string().max(500).optional().nullable(),
  services: z.array(z.string().min(1, {message: "Service cannot be empty."}).max(100)).optional(),
  fiverrUsername: z.string().max(50).optional().nullable(),
  geminiApiKeys: z.array(
      z.string().min(1, "API Key cannot be empty.").max(100, "API Key is too long.")
    ).min(1, "At least one Gemini API Key is required."),
  selectedGenkitModelId: z.string().optional().nullable(),
  customSellerFeedbackTemplate: z.string().max(1000).optional().nullable(),
  customClientFeedbackResponseTemplate: z.string().max(1000).optional().nullable(),
  rawPersonalStatement: z.string().max(2000).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
}

export function ProfileForm({ initialProfile, onSave }: ProfileFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialProfile?.name || DEFAULT_USER_PROFILE.name,
      professionalTitle: initialProfile?.professionalTitle || DEFAULT_USER_PROFILE.professionalTitle || "",
      yearsOfExperience: initialProfile?.yearsOfExperience || DEFAULT_USER_PROFILE.yearsOfExperience || "",
      portfolioLink: initialProfile?.portfolioLink || DEFAULT_USER_PROFILE.portfolioLink || "",
      communicationStyleNotes: initialProfile?.communicationStyleNotes || DEFAULT_USER_PROFILE.communicationStyleNotes || "",
      services: initialProfile?.services && initialProfile.services.length > 0 ? initialProfile.services : DEFAULT_USER_PROFILE.services || [],
      fiverrUsername: initialProfile?.fiverrUsername || DEFAULT_USER_PROFILE.fiverrUsername || "",
      geminiApiKeys: initialProfile?.geminiApiKeys && initialProfile.geminiApiKeys.length > 0 ? initialProfile.geminiApiKeys : DEFAULT_USER_PROFILE.geminiApiKeys || [''],
      selectedGenkitModelId: initialProfile?.selectedGenkitModelId || DEFAULT_USER_PROFILE.selectedGenkitModelId || DEFAULT_MODEL_ID,
      customSellerFeedbackTemplate: initialProfile?.customSellerFeedbackTemplate || DEFAULT_USER_PROFILE.customSellerFeedbackTemplate || "",
      customClientFeedbackResponseTemplate: initialProfile?.customClientFeedbackResponseTemplate || DEFAULT_USER_PROFILE.customClientFeedbackResponseTemplate || "",
      rawPersonalStatement: initialProfile?.rawPersonalStatement || DEFAULT_USER_PROFILE.rawPersonalStatement || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialProfile) {
      form.reset({
        name: initialProfile.name || DEFAULT_USER_PROFILE.name,
        professionalTitle: initialProfile.professionalTitle || DEFAULT_USER_PROFILE.professionalTitle || "",
        yearsOfExperience: initialProfile.yearsOfExperience || DEFAULT_USER_PROFILE.yearsOfExperience || "",
        portfolioLink: initialProfile.portfolioLink || DEFAULT_USER_PROFILE.portfolioLink || "",
        communicationStyleNotes: initialProfile.communicationStyleNotes || DEFAULT_USER_PROFILE.communicationStyleNotes || "",
        services: initialProfile.services && initialProfile.services.length > 0 ? initialProfile.services : DEFAULT_USER_PROFILE.services || [],
        fiverrUsername: initialProfile.fiverrUsername || DEFAULT_USER_PROFILE.fiverrUsername || "",
        geminiApiKeys: initialProfile.geminiApiKeys && initialProfile.geminiApiKeys.length > 0 ? initialProfile.geminiApiKeys : DEFAULT_USER_PROFILE.geminiApiKeys || [''],
        selectedGenkitModelId: initialProfile.selectedGenkitModelId || DEFAULT_USER_PROFILE.selectedGenkitModelId || DEFAULT_MODEL_ID,
        customSellerFeedbackTemplate: initialProfile.customSellerFeedbackTemplate || DEFAULT_USER_PROFILE.customSellerFeedbackTemplate || "",
        customClientFeedbackResponseTemplate: initialProfile.customClientFeedbackResponseTemplate || DEFAULT_USER_PROFILE.customClientFeedbackResponseTemplate || "",
        rawPersonalStatement: initialProfile.rawPersonalStatement || DEFAULT_USER_PROFILE.rawPersonalStatement || "",
      });
    }
  }, [initialProfile, form.reset]);


  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const { fields: apiKeyFields, append: appendApiKey, remove: removeApiKey } = useFieldArray({
    control: form.control,
    name: "geminiApiKeys",
  });

  function onSubmit(data: ProfileFormValues) {
    const processedData: Partial<UserProfile> = {
      ...data,
      yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : undefined,
      services: data.services || [],
      geminiApiKeys: data.geminiApiKeys.filter(key => key.trim() !== ''), // Filter out empty keys before saving
      selectedGenkitModelId: data.selectedGenkitModelId || DEFAULT_MODEL_ID,
    };
    
    Object.keys(processedData).forEach(key => {
      const K = key as keyof Partial<UserProfile>;
      if (processedData[K] === null) {
        delete processedData[K];
      }
    });

    onSave(processedData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully saved.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 pr-1">
          {/* ... other form fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B. Majnu" {...field} />
                  </FormControl>
                  <FormDescription>Your professional name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Professional Graphics Designer" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 6" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portfolioLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="e.g., https://fiverr.com/majnu786" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
         
          <FormField
            control={form.control}
            name="communicationStyleNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Communication Style Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Keywords/description for AI tone, e.g., 'friendly, reliable, professional'"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>Help AI understand your preferred tone.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Services Offered</FormLabel>
            {serviceFields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`services.${index}`}
                render={({ field: itemField }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="e.g., 🎽 T-Shirt Designs" {...itemField} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeService(index)} aria-label="Remove service">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendService("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Service
            </Button>
            <FormDescription>List the services you offer. Emojis are welcome!</FormDescription>
          </div>
          
          <FormField
            control={form.control}
            name="rawPersonalStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Personal Statement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your detailed professional introduction and experience for the AI to adapt."
                    className="resize-none h-40"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>Provide your full professional bio here. The AI will adapt parts of this for client introductions based on their specific request.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fiverrUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiverr Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., majnu786" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="selectedGenkitModelId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Preferred AI Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || DEFAULT_MODEL_ID}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {AVAILABLE_MODELS.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                            {model.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormDescription>
                    Choose the AI model for generating responses.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Gemini API Keys *</FormLabel>
            {apiKeyFields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`geminiApiKeys.${index}`}
                render={({ field: itemField }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={`API Key ${index + 1}`} 
                          {...itemField} 
                        />
                      </FormControl>
                      {apiKeyFields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeApiKey(index)} 
                          aria-label="Remove API Key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage /> {/* This will show errors for individual keys if any */}
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendApiKey("")}
              className="mt-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add API Key
            </Button>
            <FormDescription>
              Enter your Gemini API Keys. The first key in the list will be used. At least one key is required for AI features.
            </FormDescription>
            {/* Display top-level form error for geminiApiKeys if it exists (e.g., "At least one key is required") */}
            {form.formState.errors.geminiApiKeys && !form.formState.errors.geminiApiKeys.message && (
                 <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.geminiApiKeys.root?.message || "Please provide at least one API key."}
                </p>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="customSellerFeedbackTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Seller Feedback Template</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Great client, outstanding experience..."
                    className="resize-none h-24"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customClientFeedbackResponseTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Client Feedback Response Template</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Thanks for your great feedback..."
                    className="resize-none h-24"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-8">Save Profile</Button>
      </form>
    </Form>
  );
}

    