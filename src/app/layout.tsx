
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import OfflineIndicator from '@/components/shared/OfflineIndicator';
import { LanguageProvider } from '@/context/LanguageContext';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased text-foreground min-h-screen">
          {children}
          <Toaster />
          <OfflineIndicator />
        </body>
      </html>
    </LanguageProvider>
  );
}
