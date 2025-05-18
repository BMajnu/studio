
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, ChromeIcon } from 'lucide-react'; // Using ChromeIcon as a placeholder for Google
import { Separator } from '@/components/ui/separator';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const user = await signIn(data.email, data.password);
      if (user) {
        toast({ title: 'Login Successful', description: `Welcome back, ${user.displayName || user.email?.split('@')[0]}!` });
        onSuccess?.();
      } else {
        // This path might not be hit if signIn throws and is caught below.
        // Specific Firebase errors (e.g., auth/invalid-credential) are logged by AuthContext.
        console.warn('LoginForm: signIn attempt failed. User object is null. This usually indicates invalid credentials or other Firebase auth issue.');
        toast({
          title: 'Login Failed',
          description: 'Please check your email and password.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      // Catching errors re-thrown by AuthContext's signIn
      console.error("Login form submission error:", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your email and password.', // Use Firebase error message if available
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast({ title: 'Google Sign-In Successful', description: `Welcome, ${user.displayName || user.email?.split('@')[0]}!` });
        onSuccess?.();
      } else {
        // This case might not be hit if signInWithGoogle throws on error
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
        duration: 9000, // Longer duration for more detailed message
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleGoogleSignIn} 
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ChromeIcon className="mr-2 h-4 w-4" /> // Placeholder for Google Icon
        )}
        Sign in with Google
      </Button>
    </div>
  );
}
