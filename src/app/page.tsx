'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until initial auth check and profile loading is complete.
    if (loading || profileLoading) {
      return;
    }

    // If there's no user, redirect to login.
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user is authenticated, but profile is not loaded or incomplete,
    // redirect to the appropriate page.
    if (user && user.profile) {
      const { role, profileComplete } = user.profile;

      if (!role) {
         router.replace('/select-role');
      } else if (!profileComplete) {
        router.replace(role === 'driver' ? '/driver/profile' : '/owner/profile');
      } else {
        router.replace(role === 'driver' ? '/driver' : '/owner');
      }
    }
    
  }, [user, loading, profileLoading, router]);

  // Show a loader while authentication and redirection are in progress.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
