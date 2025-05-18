
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon, LogOut, LogIn, XIcon } from 'lucide-react'; 
import { DesAInRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Added SheetTrigger
import React, { useState, useEffect } from 'react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';
import { useAuth } from '@/contexts/auth-context';
import {
  Dialog,
  DialogContent as ModalContent, 
  DialogHeader as ModalHeader,   
  DialogTitle as ModalTitle,     
  DialogTrigger as ModalDialogTrigger, // Renamed to avoid conflict with SheetTrigger
} from "@/components/ui/dialog";
import { LoginForm } from '@/components/auth/login-form';

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  isModalTrigger?: boolean;
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
  action?: () => void;
  isDialogTrigger?: boolean;
  dialogContent?: React.ReactNode;
  dialogTitle?: string;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');
  const { user, signOut, signInWithGoogle, loading: authLoading } = useAuth(); 
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: Settings, requiresAuth: true },
    { label: 'Features Guide', icon: HelpCircle, isModalTrigger: true },
    { 
      label: 'Login with Google', 
      icon: LogIn, 
      hideWhenAuth: true, 
      isDialogTrigger: true, // This will now use the ModalDialogTrigger
      dialogTitle: 'Login to DesAInR'
    },
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
         if (isMobile && !item.isDialogTrigger && !item.isModalTrigger) { // Adjusted condition
           setIsMobileSheetOpen(false);
         }
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
    
    if (item.isDialogTrigger && item.label === 'Login with Google') {
       const openState = isLoginModalOpen;
       const setOpenState = setIsLoginModalOpen;
        return (
            <Dialog key={item.label} open={openState} onOpenChange={setOpenState}>
            <ModalDialogTrigger asChild>
                <Button {...commonButtonProps}>{buttonContent}</Button>
            </ModalDialogTrigger>
            <ModalContent className="sm:max-w-md">
                <ModalHeader>
                <ModalTitle>{item.dialogTitle || 'Login to DesAInR'}</ModalTitle>
                </ModalHeader>
                <LoginForm onSuccess={() => {
                    setOpenState(false);
                    if(isMobile) setIsMobileSheetOpen(false);
                }} />
            </ModalContent>
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
          {user && <span className="text-sm text-muted-foreground mr-4 hidden md:inline">Welcome, {user.displayName || user.email?.split('@')[0]}</span>}
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
                  {isMobileSheetOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-0"> 
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="sr-only">Main Menu</SheetTitle> 
                   <Link href="/" onClick={() => setIsMobileSheetOpen(false)} className="flex items-center gap-2">
                      <DesAInRLogo />
                   </Link>
                </SheetHeader>
                <div className="p-4"> 
                  {user && <div className="text-sm text-muted-foreground mb-4 px-2">Welcome, {user.displayName || user.email?.split('@')[0]}</div>}
                  <nav className="flex flex-col space-y-2">
                     {navItems.map(item => renderNavItem(item, true))}
                  </nav>
                </div>
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
