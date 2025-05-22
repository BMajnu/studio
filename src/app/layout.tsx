import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider

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
  icons: {
    icon: [
      { rel: 'icon', url: '/icon?size=32x32' },
      { rel: 'icon', url: '/icon?size=64x64' },
      { rel: 'icon', url: '/icon?size=192x192' },
      { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon?size=180x180', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#0062e3',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DesAInR',
  },
};

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
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
