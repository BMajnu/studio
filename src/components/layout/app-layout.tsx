"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle, Settings, Menu } from 'lucide-react';
import { DesAInRLogo } from '@/components/icons/logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

const navItems = [
  { href: '/', label: 'Chat', icon: Home },
  { href: '/profile', label: 'Profile', icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <DesAInRLogo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className="w-full"
                  isActive={pathname === item.href}
                  tooltip={{children: item.label, side: 'right', align: 'center' }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <DesAInRLogo />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    );
  }
  

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
        {sidebarContent}
      </Sidebar>
      <SidebarInset>
        <div className="p-2 md:p-0">
            {/* Optional: Add a header within the main content area if needed */}
            {/* <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold">Page Title</h1>
            </header> */}
            <main className="flex-1"> 
              {children}
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
