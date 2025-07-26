'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    // Set initial status
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        if (!navigator.onLine) {
            handleOffline();
        }
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-destructive p-3 text-destructive-foreground shadow-lg animate-in fade-in"
      role="status"
      aria-live="assertive"
    >
      <WifiOff className="h-5 w-5" />
      <div className="flex flex-col">
        <span className="font-semibold">You are offline</span>
        <span className="text-sm">Functionality may be limited.</span>
      </div>
    </div>
  );
}
