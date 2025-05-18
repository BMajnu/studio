
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
import { Loader2, ChromeIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onEmailSubmit(data: LoginFormValues) {
    setIsEmailLoading(true);
    try {
      const user = await signIn(data.email, data.password);
      if (user) {
        toast({ title: 'Login Successful', description: `Welcome back, ${user.displayName || user.email?.split('@')[0]}!` });
        onSuccess?.();
      } else {
        // This path is less likely if signIn throws specific errors
        console.warn("LoginForm: signIn returned null without throwing an error.");
        toast({
          title: 'Login Failed',
          description: 'Please check your email and password.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Email Sign-In error in LoginForm:", error);
      let description = 'Login failed. Please check your email and password.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please try again.';
      } else if (error.code) {
        description = `Login failed: ${error.message} (Code: ${error.code})`;
      }
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
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
         console.warn("LoginForm: signInWithGoogle returned null without throwing an error.");
        toast({
          title: 'Google Sign-In Failed',
          description: 'Could not sign in with Google. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Google Sign-In error in LoginForm:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: 'Sign-In Cancelled',
          description: 'Google Sign-In was cancelled by user.',
          variant: 'default', // Use default variant, not destructive
          duration: 5000,
        });
      } else {
        let description = 'Could not sign in with Google. Please try again.';
        if (error.code === 'auth/unauthorized-domain') {
          description = 'This domain is not authorized for Google Sign-In. Please check your Firebase project configuration (Authentication > Settings > Authorized domains) and ensure this domain and the [PROJECT_ID].firebaseapp.com domain are listed. See console for more details.';
        } else if (error.code === 'auth/popup-blocked') {
          description = 'Google Sign-In was blocked by your browser. Please allow popups for this site and try again.';
        } else if (error.code) {
          description = `Google Sign-In failed: ${error.message} (Code: ${error.code}). Check console for more details.`;
        }
        toast({
          title: 'Google Sign-In Failed',
          description: description,
          variant: 'destructive',
          duration: 9000, 
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
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
          <Button type="submit" className="w-full" disabled={isEmailLoading || isGoogleLoading}>
            {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
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
        className="w-full text-base py-6" 
        onClick={handleGoogleSignIn} 
        disabled={isGoogleLoading || isEmailLoading}
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
