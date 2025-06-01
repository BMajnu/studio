'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Import Button
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { MailWarning, MailCheck, Trash2 } from 'lucide-react'; // Icons for verification status
import { useChatHistory } from '@/lib/hooks/use-chat-history'; // Import useChatHistory
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { profile, updateProfile, isLoading: profileLoading } = useUserProfile();
  const { user, loading: authLoading, sendVerificationEmail } = useAuth(); // Get user and sendVerificationEmail from useAuth
  const { cleanLocalStorage } = useChatHistory(user?.uid); // Use the cleanLocalStorage function
  const { toast } = useToast();
  const [cleanupInProgress, setCleanupInProgress] = useState(false);

  const isLoading = profileLoading || authLoading;

  if (isLoading || !profile || !user) { // Check for user as well
    return (
      <div className="flex justify-center w-full px-4 py-6 overflow-y-auto">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-1/2 mb-4" /> {/* For verification status area */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-32 mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleResendVerification = async () => {
    await sendVerificationEmail();
  };
  
  // Handle localStorage cleanup
  const handleCleanupStorage = async () => {
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
  };

  return (
    <div className="w-full h-full flex justify-center overflow-y-auto">
      <div className="w-full max-w-4xl px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            <CardDescription>
              Manage your professional details to personalize AI interactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Verification Status */}
            {user && (
              <div className="mb-2">
                {user.emailVerified ? (
                  <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
                    <MailCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="font-semibold text-green-700 dark:text-green-300">Email Verified</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Your email address ({user.email}) has been successfully verified.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
                    <MailWarning className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="font-semibold text-yellow-700 dark:text-yellow-300">Email Not Verified</AlertTitle>
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400 flex flex-wrap items-center">
                      <span>Your email address ({user.email}) is not verified. Please check your inbox for a verification link, or</span>
                      <Button 
                        onClick={handleResendVerification} 
                        variant="link" 
                        className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200"
                      >
                        resend it.
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Profile Form */}
            <ProfileForm initialProfile={profile} onSave={updateProfile} />
            
            {/* Advanced Settings Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                <div className="flex items-start">
                  <Trash2 className="w-5 h-5 mr-2 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                      Storage Cleanup
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      If you're experiencing issues with chat history or data storage, use this option to clear any corrupted data. 
                      This doesn't delete your chats, only fixes storage issues.
                    </p>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleCleanupStorage}
                      disabled={cleanupInProgress}
                    >
                      {cleanupInProgress ? "Cleaning..." : "Clean Storage Data"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
