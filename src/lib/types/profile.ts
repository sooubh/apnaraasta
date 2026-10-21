import { UserPreferences } from "./pathway";

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  homeArea: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateInput {
  displayName?: string;
  bio?: string;
  homeArea?: string;
  preferences?: Partial<UserPreferences>;
}

export interface OnboardingDraft {
  displayName: string;
  bio: string;
  homeArea: string;
  preferences: UserPreferences;
}
