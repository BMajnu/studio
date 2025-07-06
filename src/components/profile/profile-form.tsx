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
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { useActiveGeminiKey } from "@/lib/hooks/use-active-gemini-key";
import { Badge } from "@/components/ui/badge";

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
  useAlternativeAiImpl: z.boolean().optional().default(false),
  useFirebaseAI: z.boolean().optional(),
  customSellerFeedbackTemplate: z.string().max(1000).optional().nullable(),
  customClientFeedbackResponseTemplate: z.string().max(1000).optional().nullable(),
  rawPersonalStatement: z.string().max(2000).optional().nullable(),
  autoRotateGeminiKeys: z.boolean().optional().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
}

export function ProfileForm({ initialProfile, onSave }: ProfileFormProps) {
  const { toast } = useToast();
  const { activeKey, refreshActiveKey } = useActiveGeminiKey(initialProfile?.userId);
  
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
      useAlternativeAiImpl: initialProfile?.useAlternativeAiImpl !== undefined ? initialProfile.useAlternativeAiImpl : DEFAULT_USER_PROFILE.useAlternativeAiImpl,
      useFirebaseAI: initialProfile?.useFirebaseAI !== undefined ? initialProfile.useFirebaseAI : false,
      customSellerFeedbackTemplate: initialProfile?.customSellerFeedbackTemplate || DEFAULT_USER_PROFILE.customSellerFeedbackTemplate || "",
      customClientFeedbackResponseTemplate: initialProfile?.customClientFeedbackResponseTemplate || DEFAULT_USER_PROFILE.customClientFeedbackResponseTemplate || "",
      rawPersonalStatement: initialProfile?.rawPersonalStatement || DEFAULT_USER_PROFILE.rawPersonalStatement || "",
      autoRotateGeminiKeys: initialProfile?.autoRotateGeminiKeys !== undefined ? initialProfile.autoRotateGeminiKeys : true,
    },
    mode: "onChange",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    // @ts-ignore stubborn type error with useFieldArray name prop
    name: "services",
  });

  const { fields: apiKeyFields, append: appendApiKey, remove: removeApiKey } = useFieldArray({
    control: form.control,
    // @ts-ignore stubborn type error with useFieldArray name prop
    name: "geminiApiKeys",
  });

  function onSubmit(data: ProfileFormValues) {
    const processedData: Partial<UserProfile> = {
      name: data.name,
      professionalTitle: data.professionalTitle === null ? undefined : data.professionalTitle,
      yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : undefined,
      portfolioLink: data.portfolioLink === null ? undefined : data.portfolioLink,
      communicationStyleNotes: data.communicationStyleNotes === null ? undefined : data.communicationStyleNotes,
      services: data.services || [],
      fiverrUsername: data.fiverrUsername === null ? undefined : data.fiverrUsername,
      geminiApiKeys: data.geminiApiKeys.filter(key => key.trim() !== ''),
      selectedGenkitModelId: data.selectedGenkitModelId === null ? undefined : data.selectedGenkitModelId || DEFAULT_MODEL_ID,
      useAlternativeAiImpl: data.useAlternativeAiImpl,
      useFirebaseAI: data.useFirebaseAI === null ? undefined : data.useFirebaseAI,
      customSellerFeedbackTemplate: data.customSellerFeedbackTemplate === null ? undefined : data.customSellerFeedbackTemplate,
      customClientFeedbackResponseTemplate: data.customClientFeedbackResponseTemplate === null ? undefined : data.customClientFeedbackResponseTemplate,
      rawPersonalStatement: data.rawPersonalStatement === null ? undefined : data.rawPersonalStatement,
      autoRotateGeminiKeys: data.autoRotateGeminiKeys,
    };
    
    onSave(processedData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully saved.",
    });
    refreshActiveKey();
  }

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
        useAlternativeAiImpl: initialProfile.useAlternativeAiImpl !== undefined ? initialProfile.useAlternativeAiImpl : DEFAULT_USER_PROFILE.useAlternativeAiImpl,
        useFirebaseAI: initialProfile.useFirebaseAI !== undefined ? initialProfile.useFirebaseAI : false,
        customSellerFeedbackTemplate: initialProfile.customSellerFeedbackTemplate || DEFAULT_USER_PROFILE.customSellerFeedbackTemplate || "",
        customClientFeedbackResponseTemplate: initialProfile.customClientFeedbackResponseTemplate || DEFAULT_USER_PROFILE.customClientFeedbackResponseTemplate || "",
        rawPersonalStatement: initialProfile.rawPersonalStatement || DEFAULT_USER_PROFILE.rawPersonalStatement || "",
        autoRotateGeminiKeys: initialProfile.autoRotateGeminiKeys !== undefined ? initialProfile.autoRotateGeminiKeys : true,
      });
    }
  }, [initialProfile, form.reset]);

  // When component mounts or user changes, get the active key.
  useEffect(() => {
    refreshActiveKey();
  }, [refreshActiveKey]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-3">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
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
                        <Input placeholder="e.g., Graphic Designer" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input placeholder="https://yourportfolio.com" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Professional Services Section */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-3">Professional Services</h3>
            <div className="space-y-4">
              <div>
                <FormLabel>Services Offered</FormLabel>
                {serviceFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`services.${index}`}
                    render={({ field: itemField }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="e.g., 👕 T-Shirt Designs" {...itemField} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeService(index)} 
                            className="shrink-0"
                            aria-label="Remove service"
                          >
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
                  className="mt-1"
                  onClick={() => appendService("")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                </Button>
                <FormDescription className="mt-1">List the services you offer. Emojis are welcome!</FormDescription>
              </div>

              <FormField
                control={form.control}
                name="fiverrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiverr Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Fiverr username" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>If you're on Fiverr, add your username.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-3">Communication Preferences</h3>
            <FormField
              control={form.control}
              name="communicationStyleNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Communication Style Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Keywords describing your preferred communication style, e.g., 'friendly, reliable, professional'"
                      className="resize-none max-h-[150px]"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Help AI understand your preferred tone.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* AI Settings - Collapsed by Default */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-3">API Keys & AI Model Settings</h3>
            <FormDescription className="mb-4">
              Manage your Gemini API keys and select your preferred AI model.
            </FormDescription>
            
            <div className="space-y-4">
              {/* Gemini API Keys */}
              <div>
                <FormLabel>Gemini API Keys *</FormLabel>
                {apiKeyFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`geminiApiKeys.${index}`}
                    render={({ field: itemField }) => (
                      <FormItem className="mb-2">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="Enter your Gemini API Key" type="password" {...itemField} />
                          </FormControl>
                          {activeKey === itemField.value && (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white animate-pulse">ACTIVE</Badge>
                          )}
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                            onClick={() => removeApiKey(index)} 
                              className="shrink-0"
                            aria-label="Remove API Key"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendApiKey("")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Key
                </Button>
              </div>

              {/* Auto-rotate keys switch */}
              <FormField
                control={form.control}
                name="autoRotateGeminiKeys"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-gray-50 dark:bg-gray-800/60">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-Rotate Keys</FormLabel>
                      <FormDescription>
                        Automatically switch to the next available key if a quota error occurs.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedGenkitModelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred AI Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? DEFAULT_MODEL_ID}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
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
                    <FormDescription>Choose your preferred AI model.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="useAlternativeAiImpl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use Alternative AI</FormLabel>
                        <FormDescription>
                          Enable experimental AI features
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="useFirebaseAI"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Use Firebase AI</FormLabel>
                        <FormDescription>
                          Process AI through Firebase
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Templates Section - Collapsed by Default */}
          <details className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 group">
            <summary className="font-medium text-lg cursor-pointer list-none flex items-center">
              <span className="flex-1">Advanced Templates</span>
              <svg 
                className="h-5 w-5 transform transition-transform group-open:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="space-y-4 mt-3">
              <FormField
                control={form.control}
                name="customSellerFeedbackTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Feedback Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your custom seller feedback template..."
                        className="resize-none min-h-[80px] max-h-[150px]"
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
                    <FormLabel>Client Feedback Response Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your custom client feedback response template..."
                        className="resize-none min-h-[80px] max-h-[150px]"
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
                name="rawPersonalStatement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your personal statement..."
                        className="resize-none min-h-[80px] max-h-[150px]"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>Tell us about yourself and your services.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </details>

          <div className="flex justify-end py-2">
            <Button type="submit" size="lg" className="px-8 font-semibold">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

    