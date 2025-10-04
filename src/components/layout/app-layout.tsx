"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon, LogOut, LogIn, XIcon, Languages, ChevronUp, ChevronDown, PlusCircle, User } from 'lucide-react';
import { DesAInRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';
import GeneratedImagesCleaner from '@/components/GeneratedImagesCleaner';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { APP_FEATURES_GUIDE, APP_FEATURES_GUIDE_BN } from "@/lib/constants";
import { useRouteChangeEvent } from '@/lib/utils/route-events';

// Define a custom event for header/footer collapse
export const HEADER_TOGGLE_EVENT = 'desainr_header_toggle';
export const FOOTER_TOGGLE_EVENT = 'desainr_footer_toggle';

interface NavItem {
  href?: string;
  label: string | { en: string; bn: string };
  icon: React.ElementType;
  isModalTrigger?: boolean;
  modalType?: 'login' | 'signup' | 'features';
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
  action?: () => void;
  dialogTitle?: string | { en: string; bn: string };
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');
  const { user, signOut, loading: authLoading } = useAuth();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  // Add the route change event listener
  useRouteChangeEvent();

  const getLabel = (label: string | { en: string; bn: string }): string => {
    if (typeof label === 'string') return label;
    return label[currentLanguage] || label.en;
  };
  
  const navItems: NavItem[] = [
    { label: { en: 'Features Guide', bn: 'ফিচার গাইড' }, icon: HelpCircle, isModalTrigger: true, modalType: 'features' },
    {
      label: { en: 'Login', bn: 'লগইন করুন' },
      icon: LogIn,
      hideWhenAuth: true,
      isModalTrigger: true,
      modalType: 'login',
      dialogTitle: { en: 'Login to DesAInR', bn: 'DesAInR-এ লগইন করুন' }
    },
    {
      label: { en: 'Sign Up', bn: 'সাইন আপ করুন' },
      icon: LogIn, // Should be UserPlus, but keeping LogIn if that was intended
      hideWhenAuth: true,
      isModalTrigger: true,
      modalType: 'signup',
      dialogTitle: { en: 'Create DesAInR Account', bn: 'DesAInR অ্যাকাউন্ট তৈরি করুন' }
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setEffectiveTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error accessing localStorage for theme:', error);
      setEffectiveTheme('light'); 
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedLanguage = localStorage.getItem('desainr_language') as 'en' | 'bn' | null;
      if (storedLanguage) {
        setCurrentLanguage(storedLanguage);
      }
    } catch (error) {
      console.error('Error accessing localStorage for language:', error);
    }
  }, []);
  
  const toggleTheme = () => {
    setEffectiveTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.error('Error setting theme in localStorage:', error);
      }
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
    // Force re-render of relevant parts if needed, though label fetching should handle it.
  };
  
  const handleItemClick = (item: NavItem) => {
    if (item.action) item.action();
    if (item.modalType === 'login') setIsLoginModalOpen(true);
    else if (item.modalType === 'signup') setIsSignupModalOpen(true);
    
    // For non-modal links, SheetClose will handle closing.
    // For modal triggers that are *not* also SheetClose, ensure sheet stays open or closes appropriately.
    if (!item.href || item.isModalTrigger) { // If it's not a direct link, or it is a modal trigger
      // For mobile, modals generally shouldn't close the sheet.
      // This logic is handled by how SheetClose wraps the Link component.
    } else {
       setIsMobileSheetOpen(false); // Close for direct links
    }
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    if (item.requiresAuth && !user && !authLoading) return null;
    if (item.requiresAuth && authLoading) return null; 
    if (item.hideWhenAuth && user) return null;
    
    const itemLabel = getLabel(item.label);
    const guideTextToShow = currentLanguage === 'bn' ? APP_FEATURES_GUIDE_BN : APP_FEATURES_GUIDE;

    const buttonContent = (
      <>
        <item.icon className={isMobile ? "h-5 w-5 mr-3" : "h-6 w-6"} /> 
        {!isMobile && item.modalType === 'features' ? null : <span className={isMobile ? "" : "ml-2"}>{itemLabel}</span>}
      </>
    );
    
    const commonButtonProps: ButtonProps = {
      variant: (item.href && pathname === item.href) ? "default" : "ghost",
      rounded: "full",
      glow: true,
      animate: true,
      className: `font-medium transition-all duration-300 ease-in-out ${isMobile ? "w-full justify-start text-base py-3 h-auto" : ""}`
    };

    if (item.isModalTrigger && item.modalType === 'features') {
       const TriggerButton = (
         <Button 
           {...commonButtonProps} 
           onClick={() => handleItemClick(item)} // Ensure modal state is handled if needed
           className={`${commonButtonProps.className} hover:text-primary hover:bg-primary/10 shadow-sm`}
         >
           {buttonContent}
         </Button>
       );
       return (
         <FeaturesGuideModal
            key={itemLabel}
            triggerButton={TriggerButton}
            guideContent={guideTextToShow}
         />
      );
    }
    
    if (item.isModalTrigger && (item.modalType === 'login' || item.modalType === 'signup')) {
        return (
            <Button 
                key={itemLabel} 
                {...commonButtonProps} 
                onClick={() => handleItemClick(item)}
                variant={item.modalType === 'signup' ? "default" : "outline"}
                className={`${commonButtonProps.className} ${item.modalType === 'signup' ? "bg-primary text-primary-foreground shadow-md" : "hover:text-primary hover:bg-primary/10 shadow-sm"}`}
            >
                {buttonContent}
            </Button>
        );
    }

    if (item.href) {
      const ButtonComponent = (
        <Button 
          {...commonButtonProps} 
          className={`${commonButtonProps.className} hover:text-primary hover:bg-primary/10 shadow-sm`}
        >
          {buttonContent}
        </Button>
      );
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

     const ActionButtonComponent = (
       <Button 
         {...commonButtonProps} 
         onClick={() => handleItemClick(item)}
         className={`${commonButtonProps.className} hover:text-primary hover:bg-primary/10 shadow-sm`}
       >
         {buttonContent}
       </Button>
     );
     if (isMobile && !item.isModalTrigger) { // Modals shouldn't be wrapped in SheetClose here
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
  const sheetTitle = currentLanguage === 'bn' ? 'মেনু' : 'Menu';

  return (
    <div className="relative flex h-[100dvh] flex-col">
      <GeneratedImagesCleaner />
      
      <div className="absolute top-4 right-4 z-50 flex items-center gap-1 md:gap-2">
                {/* Hide nav items on mobile to save space */}
                <div className="hidden md:flex items-center gap-2">
                  {navItems.map((item, index) => (
                    <React.Fragment key={`nav-${index}`}>
                      {renderNavItem(item, false)}
                    </React.Fragment>
                  ))}
                </div>
                
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    rounded="full" 
                    glow
                    animate
                    className="backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out h-8 w-8 md:h-10 md:w-10" 
                    aria-label={srChangeLanguage}
                  >
              <Languages className="h-4 w-4 md:h-6 md:w-6 text-foreground/80 hover:text-primary transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-panel backdrop-blur-md border-border/30 shadow-lg animate-fade-in">
                  <DropdownMenuItem 
                    onClick={() => changeLanguage('en')} 
                    className={`${currentLanguage === 'en' ? "bg-primary/20 text-primary" : ""} transition-colors hover:text-primary hover:bg-primary/10`}
                  >
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => changeLanguage('bn')} 
                    className={`${currentLanguage === 'bn' ? "bg-primary/20 text-primary" : ""} transition-colors hover:text-primary hover:bg-primary/10`}
                  >
                    বাংলা (Bengali)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                rounded="full" 
                glow
                animate
                className="backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out h-8 w-8 md:h-10 md:w-10" 
                onClick={toggleTheme} 
                aria-label={srToggleTheme}
              >
                {effectiveTheme === 'dark' ? 
            <Moon className="h-4 w-4 md:h-6 md:w-6 text-foreground/80 hover:text-primary transition-colors" /> : 
            <Sun className="h-4 w-4 md:h-6 md:w-6 text-foreground/80 hover:text-primary transition-colors" />}
              </Button>
            
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    rounded="full" 
                    glow
                    animate
                className="backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out h-8 w-8 md:h-10 md:w-10"
                  >
                <Avatar className="h-7 w-7 md:h-9 md:w-9">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback>
                    <User className="h-4 w-4 md:h-6 md:w-6 text-foreground/80" />
                  </AvatarFallback>
                </Avatar>
                  </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel backdrop-blur-md border-border/30 shadow-lg animate-fade-in">
              <DropdownMenuItem 
                asChild
                className="transition-colors hover:text-primary hover:bg-primary/10"
              >
                <Link href="/profile">View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={async () => await signOut()}
                className="transition-colors hover:text-primary hover:bg-primary/10"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
              </div>

      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <ModalContent className="sm:max-w-md glass-panel backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>
          <ModalHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <ModalTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
                {getLabel(navItems.find(item => item.modalType === 'login')?.dialogTitle || 'Login')}
              </ModalTitle>
            </div>
          </ModalHeader>
          <LoginForm onSuccess={() => setIsLoginModalOpen(false)} />
        </ModalContent>
      </Dialog>

      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <ModalContent className="sm:max-w-md glass-panel backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl animate-fade-in">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>
          <ModalHeader className="relative z-10">
             <div className="flex items-center justify-between">
              <ModalTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
                {getLabel(navItems.find(item => item.modalType === 'signup')?.dialogTitle || 'Sign Up')}
              </ModalTitle>
            </div>
          </ModalHeader>
          <SignupForm onSuccess={() => setIsSignupModalOpen(false)} />
        </ModalContent>
      </Dialog>
    </div>
  );
}
