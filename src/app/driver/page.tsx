'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DriverHomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Driver Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome back, {user?.profile?.fullName || 'Driver'}. Ready to hit the road?
        </p>
        <div className="mt-8 rounded-lg border bg-card p-8 text-center text-card-foreground">
            <p>Your available jobs will appear here.</p>
        </div>
      </div>
    </div>
  );
}
