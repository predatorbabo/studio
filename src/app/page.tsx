'use client';

import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // The redirection logic is now fully handled by the client-side AuthProvider.
  // This page will just show a loading spinner until the user
  // is redirected to the correct destination.
  // This prevents any server-side rendering errors related to auth state.

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
