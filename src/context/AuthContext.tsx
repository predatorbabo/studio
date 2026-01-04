'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser, UserProfile } from '@/lib/types';

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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setLoading(false); // Auth check is done.
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeSnapshot = onSnapshot(userRef, async (doc) => {
            if (doc.exists()) {
                setUser({ ...firebaseUser, profile: doc.data() as UserProfile });
                setProfileLoading(false);
            } else {
                // Profile doesn't exist, create it. This is safe because onAuthStateChanged
                // and onSnapshot only run on the client-side after initial hydration.
                try {
                  await setDoc(userRef, {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email,
                      role: null,
                      createdAt: serverTimestamp(),
                      profileComplete: false,
                  });
                  // The snapshot listener will automatically pick up the new profile,
                  // so we don't need to manually set user state here.
                } catch (error) {
                  console.error("Error creating user document:", error);
                  // If creation fails, set user without profile to avoid loops.
                  setUser({ ...firebaseUser, profile: undefined });
                  setProfileLoading(false);
                }
            }
        }, (error) => {
            console.error("Error with profile snapshot:", error);
            setUser({ ...firebaseUser, profile: undefined });
            setProfileLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        // No user is signed in.
        setUser(null);
        setLoading(false);
        setProfileLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = { user, loading, profileLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
