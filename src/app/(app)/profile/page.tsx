
'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Import Button
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { MailWarning, MailCheck } from 'lucide-react'; // Icons for verification status

export default function ProfilePage() {
  const { profile, updateProfile, isLoading: profileLoading } = useUserProfile();
  const { user, loading: authLoading, sendVerificationEmail } = useAuth(); // Get user and sendVerificationEmail from useAuth

  const isLoading = profileLoading || authLoading;

  if (isLoading || !profile || !user) { // Check for user as well
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
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

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <CardDescription>
            Manage your professional details to personalize AI interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email Verification Status */}
          {user && (
            <div className="mb-6">
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
                  <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                    Your email address ({user.email}) is not verified. Please check your inbox for a verification link, or resend it.
                    <Button 
                      onClick={handleResendVerification} 
                      variant="link" 
                      className="p-0 h-auto ml-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200"
                    >
                      Resend Verification Email
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <ProfileForm initialProfile={profile} onSave={updateProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
