'use client';

import { useState, useCallback } from 'react';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileQuickStats } from '@/components/profile/profile-quick-stats';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Trash2, Settings, RefreshCw } from 'lucide-react';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import { useToast } from '@/hooks/use-toast';
import { LoggerSettings } from '@/components/ui/logger-settings';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProfilePage() {
  const { profile, updateProfile, isLoading: profileLoading } = useUserProfile();
  const { user, loading: authLoading, sendVerificationEmail } = useAuth();
  const { cleanLocalStorage, isAutoRefreshEnabled, setAutoRefreshEnabled } = useChatHistory(user?.uid);
  const { toast } = useToast();
  const [cleanupInProgress, setCleanupInProgress] = useState(false);
  const [scrollToForm, setScrollToForm] = useState(false);

  const isLoading = profileLoading || authLoading;

  const handleEditProfile = useCallback(() => {
    setScrollToForm(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('profile-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const handleCleanupStorage = useCallback(async () => {
    try {
      setCleanupInProgress(true);
      cleanLocalStorage();
      toast({
        title: "Storage Cleanup Complete",
        description: "Any corrupted data has been cleared. Please refresh the page.",
        duration: 5000
      });
    } catch (error) {
      console.error("Error cleaning localStorage:", error);
      toast({
        title: "Cleanup Error",
        description: "Failed to clean up localStorage. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setCleanupInProgress(false);
    }
  }, [cleanLocalStorage, toast]);

  const toggleAutoRefresh = useCallback(() => {
    if (setAutoRefreshEnabled) {
      setAutoRefreshEnabled(!isAutoRefreshEnabled);
      toast({
        title: isAutoRefreshEnabled ? "Auto-Refresh Disabled" : "Auto-Refresh Enabled",
        description: isAutoRefreshEnabled 
          ? "Chat history will only refresh when you explicitly request it." 
          : "Chat history will automatically refresh when navigating between pages.",
        duration: 3000
      });
    }
  }, [isAutoRefreshEnabled, setAutoRefreshEnabled, toast]);

  if (isLoading || !profile || !user) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <ProfileHeader user={user} onResendVerification={sendVerificationEmail} />

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <ProfileQuickStats profile={profile} onEdit={handleEditProfile} />

            {/* Profile Form Section */}
            <Card id="profile-form-section">
              <CardContent className="pt-6">
                <ProfileForm initialProfile={profile} onSave={updateProfile} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Advanced Settings */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  {/* Storage Cleanup */}
                  <AccordionItem value="storage">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Storage Cleanup</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">
                          If you're experiencing issues with chat history or data storage, use this option to clear any corrupted data. 
                          This doesn't delete your chats, only fixes storage issues.
                        </p>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleCleanupStorage}
                          disabled={cleanupInProgress}
                          className="w-full"
                        >
                          {cleanupInProgress ? "Cleaning..." : "Clean Storage Data"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Auto-Refresh */}
                  <AccordionItem value="refresh">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">History Auto-Refresh</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">
                          Control how chat history refreshes when you navigate between pages. 
                          Turning this off may improve performance on slower devices.
                        </p>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm font-medium">
                            {isAutoRefreshEnabled ? "Automatic (Default)" : "Manual Only"}
                          </span>
                          <Switch
                            id="auto-refresh"
                            checked={!!isAutoRefreshEnabled}
                            onCheckedChange={toggleAutoRefresh}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Logger Settings */}
                  <AccordionItem value="logging">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Developer Logging</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">
                          Configure console logging for troubleshooting and development purposes.
                          Only enable if you need to debug application issues.
                        </p>
                        <LoggerSettings />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
