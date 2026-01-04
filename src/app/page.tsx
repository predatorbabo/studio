'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to load
    }
    if (!user) {
      router.replace('/login');
      return;
    }

    // User is logged in, but we need to wait for their profile to load.
    if (profileLoading) {
      return;
    }

    // At this point, user is loaded and profile is either loaded or doesn't exist.
    if (user.profile) {
      const { role, profileComplete } = user.profile;
      if (!role) {
        router.replace('/select-role');
      } else if (!profileComplete) {
        router.replace(role === 'driver' ? '/driver/profile' : '/owner/profile');
      } else {
        router.replace(role === 'driver' ? '/driver' : '/owner');
      }
    }
    // The AuthProvider will handle creating the profile if it doesn't exist,
    // and this component will re-render.

  }, [user, loading, profileLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
