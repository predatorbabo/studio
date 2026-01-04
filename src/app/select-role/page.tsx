'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Building } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SelectRolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && user.profile?.role) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleRoleSelection = async (role: 'driver' | 'owner') => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: role });
      toast({
        title: 'Role selected!',
        description: 'Now, let\'s complete your profile.',
      });
      // The redirect logic in the root page will now handle this user
      // state change and send them to the correct profile page.
      // We manually refresh to trigger the AuthProvider's listener.
      router.refresh(); 
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error setting role',
        description: error.message || 'Could not update your role.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">One Last Step</CardTitle>
            <CardDescription>
              To personalize your experience, please tell us who you are.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto flex-col p-6"
              onClick={() => handleRoleSelection('driver')}
              disabled={isSubmitting}
            >
              <User className="mb-2 h-10 w-10 text-primary" />
              <span className="font-semibold">I'm a Driver</span>
              <span className="text-xs text-muted-foreground">Looking for tow jobs</span>
              {isSubmitting && <Loader2 className="mt-2 h-4 w-4 animate-spin" />}
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col p-6"
              onClick={() => handleRoleSelection('owner')}
              disabled={isSubmitting}
            >
              <Building className="mb-2 h-10 w-10 text-primary" />
              <span className="font-semibold">I'm a Tow Company</span>
              <span className="text-xs text-muted-foreground">Need to dispatch drivers</span>
              {isSubmitting && <Loader2 className="mt-2 h-4 w-4 animate-spin" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
