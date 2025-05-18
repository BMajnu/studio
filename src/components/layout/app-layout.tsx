
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon, LogOut, LogIn, UserPlus } from 'lucide-react';
import { DesAInRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';
import { useAuth } from '@/contexts/auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  isModalTrigger?: boolean;
  requiresAuth?: boolean; // New property
  hideWhenAuth?: boolean; // New property
  action?: () => void; // For logout or opening modals
  isDialogTrigger?: boolean; // To denote it's a dialog trigger
  dialogContent?: React.ReactNode; // Content for the dialog
  dialogTitle?: string;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');
  const { user, signOut, loading: authLoading } = useAuth();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);


  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: Settings, requiresAuth: true },
    { label: 'Features Guide', icon: HelpCircle, isModalTrigger: true },
    { label: 'Login', icon: LogIn, hideWhenAuth: true, action: () => setIsLoginModalOpen(true), isDialogTrigger: true, dialogTitle: 'Login to DesAInR', dialogContent: <LoginForm onSuccess={() => setIsLoginModalOpen(false)} /> },
    { label: 'Sign Up', icon: UserPlus, hideWhenAuth: true, action: () => setIsSignupModalOpen(true), isDialogTrigger: true, dialogTitle: 'Create DesAInR Account', dialogContent: <SignupForm onSuccess={() => setIsSignupModalOpen(false)} /> },
    { label: 'Logout', icon: LogOut, requiresAuth: true, action: async () => { await signOut(); setIsMobileSheetOpen(false); } },
  ];

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setEffectiveTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setEffectiveTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };
  
  const renderNavItem = (item: NavItem, isMobile: boolean = false) => {
    if (item.requiresAuth && !user) return null;
    if (item.hideWhenAuth && user) return null;

    const commonButtonProps = {
      variant: (item.href && pathname === item.href) ? "default" : "ghost" as "default" | "ghost",
      className: isMobile ? "w-full justify-start text-base py-3 h-auto" : "font-medium",
      onClick: item.action ? () => {
        item.action!();
        if (isMobile && !item.isDialogTrigger && !item.isModalTrigger) setIsMobileSheetOpen(false);
      } : undefined,
    };

    const buttonContent = (
      <>
        <item.icon className={isMobile ? "h-5 w-5 mr-3" : "h-5 w-5 mr-2"} /> {item.label}
      </>
    );

    if (item.isModalTrigger) {
      const TriggerButton = <Button {...commonButtonProps}>{buttonContent}</Button>;
      return (
         <FeaturesGuideModal
            key={item.label}
            triggerButton={isMobile ? <SheetClose asChild>{TriggerButton}</SheetClose> : TriggerButton}
         />
      );
    }

    if (item.isDialogTrigger) {
      const openState = item.label === 'Login' ? isLoginModalOpen : isSignupModalOpen;
      const setOpenState = item.label === 'Login' ? setIsLoginModalOpen : setIsSignupModalOpen;

      return (
        <Dialog key={item.label} open={openState} onOpenChange={setOpenState}>
          <DialogTrigger asChild>
             <Button {...commonButtonProps}>{buttonContent}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{item.dialogTitle}</DialogTitle>
            </DialogHeader>
            {item.dialogContent}
          </DialogContent>
        </Dialog>
      );
    }
    
    if (item.href) {
      const ButtonComponent = <Button {...commonButtonProps}>{buttonContent}</Button>;
      return (
        <Link key={item.label} href={item.href!} passHref legacyBehavior>
          {isMobile ? <SheetClose asChild>{ButtonComponent}</SheetClose> : ButtonComponent}
        </Link>
      );
    }

    // For non-link, non-modal, non-dialog items like Logout
    return (
      <Button key={item.label} {...commonButtonProps}>
        {buttonContent}
      </Button>
    );
  };


  return (
    <div className="flex min-h-screen flex-col" style={{ "--header-height": "4rem" } as React.CSSProperties}>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <DesAInRLogo />
        </Link>

        <div className="flex items-center">
          {user && <span className="text-sm text-muted-foreground mr-4 hidden md:inline">Welcome, {user.email}</span>}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => renderNavItem(item, false))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-2"
          >
            {effectiveTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-4">
                <div className="mb-6 border-b pb-4">
                   <Link href="/" onClick={() => setIsMobileSheetOpen(false)} className="flex items-center gap-2">
                      <DesAInRLogo />
                   </Link>
                </div>
                {user && <div className="text-sm text-muted-foreground mb-4 px-2">Welcome, {user.email}</div>}
                <nav className="flex flex-col space-y-2">
                  {navItems.map(item => renderNavItem(item, true))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden"> 
        {children}
      </main>
    </div>
  );
}
