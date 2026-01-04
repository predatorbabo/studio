'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Set up a real-time listener for the user's profile
        const unsubscribeSnapshot = onSnapshot(userRef, async (doc) => {
            if (doc.exists()) {
                setUser({ ...firebaseUser, profile: doc.data() as UserProfile });
            } else {
                // If the document doesn't exist, create it.
                // This might happen on first sign-up.
                try {
                  await setDoc(userRef, {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email,
                      role: null,
                      createdAt: serverTimestamp(),
                      profileComplete: false,
                  });
                } catch (error) {
                  console.error("Error creating user document:", error);
                }
                // The snapshot listener will fire again once the doc is created.
                // For now, we set the profile as undefined.
                setUser({ ...firebaseUser, profile: undefined });
            }
            setProfileLoading(false);
        }, (error) => {
            console.error("Error listening to user profile:", error);
            setUser({ ...firebaseUser, profile: undefined });
            setProfileLoading(false);
        });

        setLoading(false);
        
        return () => unsubscribeSnapshot();

      } else {
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
