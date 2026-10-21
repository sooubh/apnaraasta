"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";
import { UserProfile, ProfileUpdateInput } from "../types/profile";
import { getUserProfile, saveUserProfile, updateUserProfile as dbUpdateUserProfile } from "./userProfile";

const GUEST_PROFILE_STORAGE_KEY = "apnaraasta_guest_profile_v1";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loadingProfile: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (updates: ProfileUpdateInput) => Promise<void>;
  setGuestProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  loadingProfile: false,
  isConfigured: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  saveProfile: async () => {},
  updateProfile: async () => {},
  setGuestProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Helper to load profile from Firestore or localStorage
  const loadProfileForUser = useCallback(async (currentUser: User | null) => {
    if (currentUser) {
      setLoadingProfile(true);
      try {
        const remoteProfile = await getUserProfile(currentUser.uid);
        if (remoteProfile) {
          setProfile(remoteProfile);
        } else {
          // Check if there was a guest profile stored locally to migrate
          if (typeof window !== "undefined") {
            const localStr = localStorage.getItem(GUEST_PROFILE_STORAGE_KEY);
            if (localStr) {
              try {
                const guestDraft: UserProfile = JSON.parse(localStr);
                const migratedProfile: UserProfile = {
                  ...guestDraft,
                  uid: currentUser.uid,
                  displayName: currentUser.displayName || guestDraft.displayName || "Pune Explorer",
                  email: currentUser.email || undefined,
                  photoURL: currentUser.photoURL || undefined,
                  updatedAt: new Date().toISOString(),
                };
                await saveUserProfile(migratedProfile);
                setProfile(migratedProfile);
                localStorage.removeItem(GUEST_PROFILE_STORAGE_KEY);
              } catch (e) {
                console.warn("[AuthContext] Failed to migrate guest profile:", e);
              }
            }
          }
        }
      } catch (err) {
        console.warn("[AuthContext] Error loading user profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    } else {
      // Guest mode - check localStorage
      if (typeof window !== "undefined") {
        try {
          const localStr = localStorage.getItem(GUEST_PROFILE_STORAGE_KEY);
          if (localStr) {
            setProfile(JSON.parse(localStr));
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      // Fallback guest load if Firebase is not active
      if (typeof window !== "undefined") {
        try {
          const localStr = localStorage.getItem(GUEST_PROFILE_STORAGE_KEY);
          if (localStr) setProfile(JSON.parse(localStr));
        } catch {}
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      await loadProfileForUser(currentUser);
    });

    return () => unsubscribe();
  }, [loadProfileForUser]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        "Firebase authentication is not configured yet. Please configure NEXT_PUBLIC_FIREBASE_* in .env.local"
      );
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const res = await signInWithPopup(auth, provider);
    if (res.user) {
      await loadProfileForUser(res.user);
    }
  };

  const signOutUser = async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  };

  const saveProfile = async (newProfile: UserProfile) => {
    if (user && isFirebaseConfigured) {
      await saveUserProfile(newProfile);
      setProfile(newProfile);
    } else {
      // Guest profile
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      }
      setProfile(newProfile);
    }
  };

  const updateProfile = async (updates: ProfileUpdateInput) => {
    if (!profile) return;

    const merged: UserProfile = {
      ...profile,
      displayName: updates.displayName !== undefined ? updates.displayName : profile.displayName,
      bio: updates.bio !== undefined ? updates.bio : profile.bio,
      homeArea: updates.homeArea !== undefined ? updates.homeArea : profile.homeArea,
      preferences: {
        ...profile.preferences,
        ...(updates.preferences || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    if (user && isFirebaseConfigured) {
      await dbUpdateUserProfile(user.uid, merged);
      setProfile(merged);
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_PROFILE_STORAGE_KEY, JSON.stringify(merged));
      }
      setProfile(merged);
    }
  };

  const setGuestProfile = (guestProf: UserProfile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_PROFILE_STORAGE_KEY, JSON.stringify(guestProf));
    }
    setProfile(guestProf);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loadingProfile,
        isConfigured: isFirebaseConfigured,
        signInWithGoogle,
        signOutUser,
        saveProfile,
        updateProfile,
        setGuestProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
