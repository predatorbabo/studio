'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until both auth and profile loading are complete
    if (loading || profileLoading) {
      return;
    }

    // If there's no user, they should be at the login page.
    if (!user) {
      router.replace('/login');
      return;
    }

    // If we have a user, but their profile isn't loaded yet,
    // they might be a new user. We wait for the profile to load.
    // The AuthProvider is creating the profile if it's missing.
    // Once profile is loaded, this effect will run again.
    if (!user.profile) {
      // This state shouldn't last long, but we'll wait here.
      return;
    }

    const { role, profileComplete } = user.profile;

    if (!role) {
       router.replace('/select-role');
    } else if (!profileComplete) {
      router.replace(role === 'driver' ? '/driver/profile' : '/owner/profile');
    } else {
      router.replace(role === 'driver' ? '/driver' : '/owner');
    }
    
  }, [user, loading, profileLoading, router]);

  // Show a loader while authentication and redirection are in progress.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
