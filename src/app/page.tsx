'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    const { role, profileComplete } = user.profile || {};

    if (!role) {
      router.replace('/select-role');
      return;
    }

    if (!profileComplete) {
      router.replace(role === 'driver' ? '/driver/profile' : '/owner/profile');
      return;
    }
    
    router.replace(role === 'driver' ? '/driver' : '/owner');

  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
