import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { UserProfile } from "../types/profile";

/**
 * Fetch a user profile from Firestore by userId
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db || !userId) {
    return null;
  }

  try {
    const profileRef = doc(db, "users", userId);
    const snap = await getDoc(profileRef);

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as UserProfile;
  } catch (err) {
    console.warn("[UserProfile] Error fetching profile:", err);
    return null;
  }
}

/**
 * Save or overwrite a user profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const profileRef = doc(db, "users", profile.uid);
  const data: UserProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(profileRef, data, { merge: true });
}

/**
 * Partially update a user profile in Firestore
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const profileRef = doc(db, "users", userId);
  const data = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(profileRef, data);
}
