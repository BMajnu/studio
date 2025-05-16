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
import { DEFAULT_USER_PROFILE } from "@/lib/constants";
import { PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  professionalTitle: z.string().max(100).optional(),
  yearsOfExperience: z.coerce.number().int().positive().optional().or(z.literal("")),
  portfolioLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  communicationStyleNotes: z.string().max(500).optional(),
  services: z.array(z.string().min(1, {message: "Service cannot be empty."}).max(100)).optional(),
  fiverrUsername: z.string().max(50).optional(),
  geminiApiKey: z.string().max(100).optional(), // Not actively used by flows, but stored
  customSellerFeedbackTemplate: z.string().max(1000).optional(),
  customClientFeedbackResponseTemplate: z.string().max(1000).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (data: UserProfile) => void;
}

export function ProfileForm({ initialProfile, onSave }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialProfile.name || DEFAULT_USER_PROFILE.name,
      professionalTitle: initialProfile.professionalTitle || "",
      yearsOfExperience: initialProfile.yearsOfExperience || "",
      portfolioLink: initialProfile.portfolioLink || "",
      communicationStyleNotes: initialProfile.communicationStyleNotes || "",
      services: initialProfile.services || [],
      fiverrUsername: initialProfile.fiverrUsername || "",
      geminiApiKey: initialProfile.geminiApiKey || "",
      customSellerFeedbackTemplate: initialProfile.customSellerFeedbackTemplate || "",
      customClientFeedbackResponseTemplate: initialProfile.customClientFeedbackResponseTemplate || "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  function onSubmit(data: ProfileFormValues) {
    const processedData: UserProfile = {
      ...initialProfile, // Preserve userId, createdAt
      ...data,
      yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : undefined,
      services: data.services || [],
    };
    onSave(processedData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully saved.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <ScrollArea className="h-[calc(100vh-200px)] pr-6"> {/* Adjust height as needed */}
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
                  <Input placeholder="e.g., Professional Graphics Designer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 6" {...field} />
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
                  <Input type="url" placeholder="e.g., https://fiverr.com/majnu786" {...field} />
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
            <FormItem className="mt-6">
              <FormLabel>Communication Style Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Keywords/description for AI tone, e.g., 'friendly, reliable, professional'"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Help AI understand your preferred tone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-6 space-y-4">
          <FormLabel>Services Offered</FormLabel>
          {fields.map((field, index) => (
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove service">
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
            onClick={() => append("")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Service
          </Button>
          <FormDescription>List the services you offer. Emojis are welcome!</FormDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            control={form.control}
            name="fiverrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fiverr Username</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., majnu786" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="geminiApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gemini API Key</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your Gemini API Key" {...field} />
                </FormControl>
                <FormDescription>
                  Your API key is stored locally and not strictly required if the backend uses a server-level key.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="customSellerFeedbackTemplate"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Custom Seller Feedback Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Great client, outstanding experience..."
                  className="resize-none h-24"
                  {...field}
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
            <FormItem className="mt-6">
              <FormLabel>Custom Client Feedback Response Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Thanks for your great feedback..."
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </ScrollArea>

        <Button type="submit" className="mt-8">Save Profile</Button>
      </form>
    </Form>
  );
}
