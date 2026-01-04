'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is false
    if (loading) {
      return;
    }

    // If there's no user, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user exists, but profile is not yet loaded, wait.
    if (!user.profile) {
      return; 
    }

    const { role, profileComplete } = user.profile;

    if (role && profileComplete) {
      router.replace(role === 'driver' ? '/driver' : '/owner');
    } else if (role) {
      router.replace(role === 'driver' ? '/driver/profile' : '/owner/profile');
    } else {
      router.replace('/select-role');
    }

  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
