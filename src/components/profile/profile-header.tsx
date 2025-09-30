'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { User } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailWarning, MailCheck } from 'lucide-react';

interface ProfileHeaderProps {
  user: User | null;
  onResendVerification?: () => Promise<void>;
}

export function ProfileHeader({ user, onResendVerification }: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Settings & Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and personalize AI interactions
          </p>
        </div>
      </div>

      {/* Email Verification Status */}
      {user && (
        <div>
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
                  onClick={onResendVerification} 
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
    </div>
  );
}

