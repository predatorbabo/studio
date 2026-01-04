'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                           {user?.email}
                        </span>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
    </ProtectedRoute>
  );
}
