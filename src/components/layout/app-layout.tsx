
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, HelpCircle, Sun, Moon } from 'lucide-react';
import { DesAInRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  isModalTrigger?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Chat', icon: Home },
  { href: '/profile', label: 'Profile', icon: Settings },
  { label: 'Features Guide', icon: HelpCircle, isModalTrigger: true },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

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

  return (
    <div className="flex min-h-screen flex-col" style={{ "--header-height": "4rem" } as React.CSSProperties}>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <DesAInRLogo />
        </Link>

        <div className="flex items-center">
          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.isModalTrigger) {
                return (
                  <FeaturesGuideModal
                    key={item.label}
                    triggerButton={
                      <Button 
                        variant="ghost"
                        className="font-medium"
                      >
                        <item.icon className="h-5 w-5 mr-2" /> {item.label}
                      </Button>
                    }
                  />
                );
              }
              return (
                <Link key={item.label} href={item.href!} passHref legacyBehavior>
                  <Button 
                    variant={pathname === item.href ? "default" : "ghost"}
                    className="font-medium"
                  >
                    <item.icon className="h-5 w-5 mr-2" /> {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Button (Desktop and Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-2"
          >
            {effectiveTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Nav Toggle & Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-4">
                <div className="mb-6 border-b pb-4">
                   <Link href="/" className="flex items-center gap-2">
                      <DesAInRLogo />
                   </Link>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    if (item.isModalTrigger) {
                      return (
                        <FeaturesGuideModal
                          key={item.label}
                          triggerButton={
                            <SheetClose asChild>
                              <Button 
                                  variant="ghost"
                                  className="w-full justify-start text-base py-3 h-auto"
                              >
                              <item.icon className="h-5 w-5 mr-3" /> {item.label}
                              </Button>
                            </SheetClose>
                          }
                        />
                      );
                    }
                    return (
                      <SheetClose asChild key={item.label}>
                        <Link href={item.href!} passHref legacyBehavior>
                            <Button 
                                variant={pathname === item.href ? "default" : "ghost"}
                                className="w-full justify-start text-base py-3 h-auto"
                            >
                            <item.icon className="h-5 w-5 mr-3" /> {item.label}
                            </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* The main page content area */}
      <main className="flex-1 flex flex-col overflow-hidden"> 
        {children}
      </main>
    </div>
  );
}
