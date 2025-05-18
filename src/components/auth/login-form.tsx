
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, ChromeIcon } from 'lucide-react'; // Using ChromeIcon as a placeholder for Google

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({ title: 'Google Sign-In Successful', description: `Welcome, ${user.displayName || user.email?.split('@')[0]}!` });
        onSuccess?.();
      } else {
        toast({
          title: 'Google Sign-In Failed',
          description: 'Could not sign in with Google. Please try again or check console for details.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Google Sign-In error in LoginForm:", error);
      let description = 'Could not sign in with Google. Please try again.';
      if (error.code === 'auth/unauthorized-domain') {
        description = 'This domain is not authorized for Google Sign-In. Please check your Firebase project configuration (Authentication > Settings > Authorized domains) and ensure this domain and the [PROJECT_ID].firebaseapp.com domain are listed. See console for more details.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        description = 'Google Sign-In cancelled by user.';
      } else if (error.code) {
        description = `Google Sign-In failed: ${error.message} (Code: ${error.code}). Check console for more details.`;
      }
      toast({
        title: 'Google Sign-In Failed',
        description: description,
        variant: 'destructive',
        duration: 9000, 
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-6 py-4"> {/* Added some padding */}
      <Button 
        variant="outline" 
        className="w-full text-base py-6" // Made button larger
        onClick={handleGoogleSignIn} 
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <ChromeIcon className="mr-2 h-5 w-5" /> 
        )}
        Sign in with Google
      </Button>
    </div>
  );
}
