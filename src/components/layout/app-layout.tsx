
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon, LogOut, LogIn, XIcon, Languages } from 'lucide-react';
import { DesAInRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';
import { useAuth } from '@/contexts/auth-context';
import {
  Dialog,
  DialogContent as ModalContent, 
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
  DialogTrigger as ModalDialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginForm } from '@/components/auth/login-form';
import { APP_FEATURES_GUIDE, APP_FEATURES_GUIDE_BN } from "@/lib/constants";

interface NavItem {
  href?: string;
  label: string | { en: string; bn: string };
  icon: React.ElementType;
  isModalTrigger?: boolean;
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
  action?: () => void;
  isDialogTrigger?: boolean;
  dialogTitle?: string | { en: string; bn: string };
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light'); // Default to light
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');
  const { user, signOut, loading: authLoading } = useAuth();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getLabel = (label: string | { en: string; bn: string }): string => {
    if (typeof label === 'string') return label;
    return label[currentLanguage] || label.en;
  };
  
  const navItems: NavItem[] = [
    { href: '/', label: { en: 'Home', bn: 'হোম' }, icon: Home },
    { href: '/profile', label: { en: 'Profile', bn: 'প্রোফাইল' }, icon: Settings, requiresAuth: true },
    { label: { en: 'Features Guide', bn: 'ফিচার গাইড' }, icon: HelpCircle, isModalTrigger: true },
    {
      label: { en: 'Login', bn: 'লগইন করুন' },
      icon: LogIn,
      hideWhenAuth: true,
      isDialogTrigger: true,
      dialogTitle: { en: 'Login to DesAInR', bn: 'DesAInR-এ লগইন করুন' }
    },
    { label: { en: 'Logout', bn: 'লগআউট' }, icon: LogOut, requiresAuth: true, action: async () => { await signOut(); setIsMobileSheetOpen(false); } },
  ];

  // Theme effect
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Default to 'light' if no stored theme and system doesn't prefer dark.
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light'); 
    
    setEffectiveTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Language effect
  useEffect(() => {
    const storedLanguage = localStorage.getItem('desainr_language') as 'en' | 'bn' | null;
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
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

  const changeLanguage = (lang: 'en' | 'bn') => {
    setCurrentLanguage(lang);
    localStorage.setItem('desainr_language', lang);
    // Force re-render for mobile sheet text if open
    if (isMobileSheetOpen) {
      setIsMobileSheetOpen(false);
      setTimeout(() => setIsMobileSheetOpen(true), 0);
    }
  };
  
  const renderNavItem = (item: NavItem, isMobile: boolean = false) => {
    if (item.requiresAuth && !user && !authLoading) return null; // Hide if auth required and no user (and auth not loading)
    if (item.requiresAuth && authLoading) return null; // Optionally hide auth-required items while auth is loading
    if (item.hideWhenAuth && user) return null;

    const itemLabel = getLabel(item.label);
    const itemDialogTitle = item.dialogTitle ? getLabel(item.dialogTitle) : undefined;
    const guideTextToShow = currentLanguage === 'bn' ? APP_FEATURES_GUIDE_BN : APP_FEATURES_GUIDE;

    const commonButtonProps = {
      variant: (item.href && pathname === item.href) ? "default" : "ghost" as "default" | "ghost",
      className: `font-medium transition-all duration-200 ease-in-out hover:text-primary ${isMobile ? "w-full justify-start text-base py-3 h-auto" : "hover:bg-primary/10"}`,
      onClick: () => {
        if (item.action) item.action();
        if (isMobile && item.href && !item.isDialogTrigger && !item.isModalTrigger) {
          setIsMobileSheetOpen(false);
        }
      },
    };

    const buttonContent = (
      <>
        <item.icon className={isMobile ? "h-5 w-5 mr-3" : "h-5 w-5 mr-2"} /> {itemLabel}
      </>
    );

    if (item.isModalTrigger && (item.label as { en: string; bn: string }).en === 'Features Guide') {
       const TriggerButton = <Button {...commonButtonProps}>{buttonContent}</Button>;
      return (
         <FeaturesGuideModal
            key={itemLabel}
            triggerButton={TriggerButton}
            guideContent={guideTextToShow}
         />
      );
    }
    
    if (item.isDialogTrigger && (item.label as { en: string; bn: string }).en === 'Login') {
       const openState = isLoginModalOpen;
       const setOpenState = setIsLoginModalOpen;
        return (
            <Dialog key={itemLabel} open={openState} onOpenChange={setOpenState}>
            <ModalDialogTrigger asChild>
                <Button {...commonButtonProps}>{buttonContent}</Button>
            </ModalDialogTrigger>
            <ModalContent className="sm:max-w-md">
                <ModalHeader>
                <ModalTitle>{itemDialogTitle || 'Login to DesAInR'}</ModalTitle>
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
      if (isMobile) {
        return (
          <SheetClose asChild key={itemLabel}>
            <Link href={item.href!} passHref legacyBehavior>
              {ButtonComponent}
            </Link>
          </SheetClose>
        );
      }
      return (
        <Link key={itemLabel} href={item.href!} passHref legacyBehavior>
          {ButtonComponent}
        </Link>
      );
    }

     const ActionButtonComponent = <Button {...commonButtonProps}>{buttonContent}</Button>;
     if (isMobile) {
         return <SheetClose asChild key={itemLabel}>{ActionButtonComponent}</SheetClose>;
     }
     return <React.Fragment key={itemLabel}>{ActionButtonComponent}</React.Fragment>;
  };

  const welcomeMessageText = currentLanguage === 'bn' 
    ? `স্বাগতম, ${user?.displayName || user?.email?.split('@')[0] || 'অতিথি'}` 
    : `Welcome, ${user?.displayName || user?.email?.split('@')[0] || 'Guest'}`;
  
  const srMainMenu = currentLanguage === 'bn' ? 'প্রধান মেনু' : 'Main Menu';
  const srToggleMenu = currentLanguage === 'bn' ? 'মেনু টগল করুন' : 'Toggle Menu';
  const srChangeLanguage = currentLanguage === 'bn' ? 'ভাষা পরিবর্তন করুন' : 'Change language';
  const srToggleTheme = currentLanguage === 'bn' ? 'থিম পরিবর্তন করুন' : 'Toggle theme';


  return (
    <div className="flex min-h-screen flex-col" style={{ "--header-height": "4rem" } as React.CSSProperties}>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md shrink-0 shadow-sm">
        <Link href="/" className="flex items-center gap-2 transition-transform duration-200 ease-in-out hover:opacity-80 hover:scale-105">
          <DesAInRLogo />
        </Link>

        <div className="flex items-center">
          {user && <span className="text-sm text-muted-foreground mr-4 hidden md:inline">{welcomeMessageText}</span>}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => renderNavItem(item, false))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 transition-colors hover:bg-primary/10" aria-label={srChangeLanguage}>
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={currentLanguage === 'en'}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('bn')} disabled={currentLanguage === 'bn'}>
                বাংলা (Bangla)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={srToggleTheme}
            className="ml-1 transition-colors hover:bg-primary/10" 
          >
            {effectiveTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  {isMobileSheetOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">{srToggleMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-0">
                <SheetHeader className="p-4 border-b">
                   <SheetTitle className="sr-only">{srMainMenu}</SheetTitle>
                   <Link href="/" onClick={() => setIsMobileSheetOpen(false)} className="flex items-center gap-2">
                      <DesAInRLogo />
                   </Link>
                </SheetHeader>
                <div className="p-4">
                  {user && <div className="text-sm text-muted-foreground mb-4 px-2">{welcomeMessageText}</div>}
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
