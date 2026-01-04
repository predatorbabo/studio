'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser, UserProfile } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  profileLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profileLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setLoading(false);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          setProfileLoading(true);
          let profileData: UserProfile | undefined = undefined;
          if (docSnap.exists()) {
            profileData = docSnap.data() as UserProfile;
            setUser({ ...firebaseUser, profile: profileData });
          } else {
             // Profile doesn't exist, create it.
             // This branch runs for new sign-ups.
             const newUserProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                role: null,
                createdAt: serverTimestamp() as any, // Let server set time
                profileComplete: false,
              };
              setDoc(userRef, newUserProfile).catch(error => {
                console.error("Error creating user document:", error);
              });
              // The onSnapshot listener will then pick up the newly created doc.
          }
          setProfileLoading(false);
        }, (error) => {
          console.error("Error with profile snapshot:", error);
          setUser({ ...firebaseUser, profile: undefined });
          setProfileLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (loading || profileLoading) {
      return; // Wait until auth and profile state are fully resolved
    }

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isPublicPage = isAuthPage;

    if (!user && !isPublicPage) {
      router.replace('/login');
      return;
    }

    if (user) {
      if (isAuthPage) {
        router.replace('/');
        return;
      }

      if (user.profile) {
        const { role, profileComplete } = user.profile;

        // Central redirection logic based on user state
        if (pathname === '/' || pathname === '/select-role' || pathname.endsWith('/profile')) {
          if (!role) {
            if (pathname !== '/select-role') router.replace('/select-role');
          } else if (!profileComplete) {
            const profilePath = role === 'driver' ? '/driver/profile' : '/owner/profile';
            if (pathname !== profilePath) router.replace(profilePath);
          } else {
            const dashboardPath = role === 'driver' ? '/driver' : '/owner';
            if (pathname !== dashboardPath) router.replace(dashboardPath);
          }
        }
      }
      // If user.profile is not yet available, we just wait on the loading screen
    }
  }, [user, loading, profileLoading, router, pathname]);

  const value = { user, loading, profileLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
