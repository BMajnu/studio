import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider
import { initializeLogger } from '@/lib/utils/logger-config';
import React, { Suspense } from 'react';
import ExtensionTokenBridge from '@/components/ExtensionTokenBridge';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DesAInR - AI Designer Assistant',
  description: 'AI-powered assistant for graphics designers',
};

// Initialize logger as early as possible
if (typeof window !== 'undefined') {
  initializeLogger();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning={true} // Add this line
      >
        <AuthProvider> {/* Wrap AppLayout with AuthProvider */}
          <Suspense fallback={null}>
            <AppLayout>
              {children}
            </AppLayout>
          </Suspense>
          <ExtensionTokenBridge />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
