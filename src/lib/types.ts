import type { User as FirebaseUser } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'driver' | 'owner' | null;
  createdAt: Timestamp;
  fullName?: string;
  phone?: string;
  vehicleType?: string; // Driver specific
  companyName?: string; // Owner specific
  profileComplete: boolean;
}

// This extends the default Firebase User type with our custom profile
export type AppUser = FirebaseUser & {
  profile?: UserProfile;
};
