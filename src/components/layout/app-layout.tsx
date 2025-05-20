
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon, LogOut, LogIn, XIcon, Languages, UserPlus } from 'lucide-react'; // Added UserPlus
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
import { SignupForm } from '@/components/auth/signup-form'; // Import SignupForm
import { APP_FEATURES_GUIDE, APP_FEATURES_GUIDE_BN } from "@/lib/constants";

interface NavItem {
  href?: string;
  label: string | { en: string; bn: string };
  icon: React.ElementType;
  isModalTrigger?: boolean; // General modal trigger flag
  modalType?: 'login' | 'signup' | 'features'; // Specify modal type
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
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // State for signup modal

  const getLabel = (label: string | { en: string; bn: string }): string => {
    if (typeof label === 'string') return label;
    return label[currentLanguage] || label.en;
  };
  
  const navItems: NavItem[] = [
    { href: '/', label: { en: 'Home', bn: 'হোম' }, icon: Home },
    { href: '/profile', label: { en: 'Profile', bn: 'প্রোফাইল' }, icon: Settings, requiresAuth: true },
    { label: { en: 'Features Guide', bn: 'ফিচার গাইড' }, icon: HelpCircle, isModalTrigger: true, modalType: 'features' },
    {
      label: { en: 'Login', bn: 'লগইন করুন' },
      icon: LogIn,
      hideWhenAuth: true,
      isModalTrigger: true,
      modalType: 'login',
      dialogTitle: { en: 'Login to DesAInR', bn: 'DesAInR-এ লগইন করুন' }
    },
    { // New Sign Up button
      label: { en: 'Sign Up', bn: 'সাইন আপ করুন' },
      icon: UserPlus,
      hideWhenAuth: true,
      isModalTrigger: true,
      modalType: 'signup',
      dialogTitle: { en: 'Create DesAInR Account', bn: 'DesAInR অ্যাকাউন্ট তৈরি করুন' }
    },
    { label: { en: 'Logout', bn: 'লগআউট' }, icon: LogOut, requiresAuth: true, action: async () => { await signOut(); setIsMobileSheetOpen(false); } },
  ];

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    // Default to dark mode instead of checking system preference
    const initialTheme = storedTheme || 'dark'; 
    
    // Set the theme in localStorage if it's not already set
    if (!storedTheme) {
      localStorage.setItem('theme', 'dark');
    }
    
    setEffectiveTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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
    if (isMobileSheetOpen) {
      setIsMobileSheetOpen(false);
      setTimeout(() => setIsMobileSheetOpen(true), 0);
    }
  };
  
  const handleItemClick = (item: NavItem) => {
    if (item.action) item.action();
    if (item.href && !item.isModalTrigger) {
      setIsMobileSheetOpen(false);
    }
    // For modal triggers, handle opening the correct modal
    if (item.isModalTrigger && item.modalType === 'login') setIsLoginModalOpen(true);
    if (item.isModalTrigger && item.modalType === 'signup') setIsSignupModalOpen(true);
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    if (item.requiresAuth && !user && !authLoading) return null;
    if (item.requiresAuth && authLoading) return null; 
    if (item.hideWhenAuth && user) return null;
    
    const itemLabel = getLabel(item.label);
    const guideTextToShow = currentLanguage === 'bn' ? APP_FEATURES_GUIDE_BN : APP_FEATURES_GUIDE;

    // Enhanced button content with consistent styling
    const buttonContent = (
      <>
        <item.icon className={isMobile ? "h-5 w-5 mr-3" : "h-5 w-5 mr-2"} /> 
        {itemLabel}
      </>
    );
    
    // Common button props with modern styling
    const commonButtonProps = {
      onClick: () => handleItemClick(item),
      variant: (item.href && pathname === item.href) ? "default" : "ghost" as "default" | "ghost",
      rounded: "full" as "full",
      glow: true,
      animate: true,
      className: `font-medium transition-all duration-300 ease-in-out ${isMobile ? "w-full justify-start text-base py-3 h-auto" : ""}`
    };

    if (item.isModalTrigger && item.modalType === 'features') {
       const TriggerButton = (
         <Button 
           {...commonButtonProps} 
           className={`${commonButtonProps.className} hover:text-primary hover:bg-primary/10 shadow-sm`}
         >
           {buttonContent}
         </Button>
       );
       return (
         <FeaturesGuideModal
            key={itemLabel} // Use itemLabel as key for consistency
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
         className={`${commonButtonProps.className} hover:text-primary hover:bg-primary/10 shadow-sm`}
       >
         {buttonContent}
       </Button>
     );
     if (isMobile) {
        // If it's an action button in mobile sheet, ensure SheetClose wraps it if no modal handling
        if (!item.isModalTrigger) {
           return <SheetClose asChild key={itemLabel}>{ActionButtonComponent}</SheetClose>;
        }
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
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/60 px-4 backdrop-blur-xl shrink-0 shadow-lg glass-panel animate-fade-in">
        <Link href="/" className="flex items-center gap-2 transition-all duration-300 ease-in-out hover:opacity-90 hover:scale-110 group">
          <div className="relative overflow-hidden rounded-full p-1 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/20">
            <DesAInRLogo className="animate-pulse-slow" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <div className="text-sm font-medium bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-1.5 rounded-full mr-2 hidden md:flex items-center animate-fade-in shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {welcomeMessageText}
              </span>
            </div>
          )}
          <nav className="hidden md:flex items-center space-x-2 animate-fade-in">
            {navItems.map((item, index) => (
              <div key={`nav-${index}`} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                {renderNavItem(item, false)}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2 ml-4 animate-fade-in">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  rounded="full" 
                  glow
                  animate
                  className="backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out" 
                  aria-label={srChangeLanguage}
                >
                  <Languages className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors" />
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
              className="backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out" 
              onClick={toggleTheme} 
              aria-label={srToggleTheme}
            >
              {effectiveTheme === 'dark' ? 
                <Moon className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors" /> : 
                <Sun className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors" />}
            </Button>
          </div>
          
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                rounded="full" 
                glow
                animate
                className="md:hidden backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 ease-in-out" 
                aria-label={srToggleMenu}
              >
                <span className="sr-only">{srMainMenu}</span>
                <Menu className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 glass-panel backdrop-blur-lg border-r border-border/20 shadow-xl">
              <SheetHeader className="space-y-1">
                <SheetTitle className="text-left text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {currentLanguage === 'bn' ? 'মেনু' : 'Menu'}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 mt-8">
                {navItems.map((item, index) => (
                  <div key={`mobile-nav-${index}`} className="animate-stagger" style={{ animationDelay: `${index * 150}ms` }}>
                    {renderNavItem(item, true)}
                  </div>
                ))}
              </nav>
              <div className="flex flex-col space-y-4 mt-8 px-1">
                <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {currentLanguage === 'bn' ? 'ভাষা' : 'Language'}
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => changeLanguage('en')} 
                    variant={currentLanguage === 'en' ? "default" : "outline"} 
                    size="sm"
                    rounded="full"
                    glow
                    animate
                    className="flex-1 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    English
                  </Button>
                  <Button onClick={() => changeLanguage('bn')} 
                    variant={currentLanguage === 'bn' ? "default" : "outline"} 
                    size="sm"
                    rounded="full"
                    glow
                    animate
                    className="flex-1 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    বাংলা
                  </Button>
                </div>
                <div className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mt-2">
                  {currentLanguage === 'bn' ? 'থিম' : 'Theme'}
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => { toggleTheme(); setEffectiveTheme('light'); }} 
                    variant={effectiveTheme === 'light' ? "default" : "outline"} 
                    size="sm"
                    rounded="full"
                    glow
                    animate
                    className="flex-1 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {currentLanguage === 'bn' ? 'লাইট' : 'Light'}
                  </Button>
                  <Button 
                    onClick={() => { toggleTheme(); setEffectiveTheme('dark'); }} 
                    variant={effectiveTheme === 'dark' ? "default" : "outline"} 
                    size="sm"
                    rounded="full"
                    glow
                    animate
                    className="flex-1 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    {currentLanguage === 'bn' ? 'ডার্ক' : 'Dark'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>{getLabel(navItems.find(item => item.modalType === 'login')?.dialogTitle || 'Login')}</ModalTitle>
          </ModalHeader>
          <LoginForm onSuccess={() => setIsLoginModalOpen(false)} />
        </ModalContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>{getLabel(navItems.find(item => item.modalType === 'signup')?.dialogTitle || 'Sign Up')}</ModalTitle>
          </ModalHeader>
          <SignupForm onSuccess={() => setIsSignupModalOpen(false)} />
        </ModalContent>
      </Dialog>
    </div>
  );
}
