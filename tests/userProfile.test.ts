import { describe, it, expect } from "vitest";
import { UserProfile, ProfileUpdateInput } from "../src/lib/types/profile";
import { UserPreferences } from "../src/lib/types/pathway";

describe("User Profile and Onboarding Logic", () => {
  const mockPreferences: UserPreferences = {
    city: "Pune",
    areas: ["Baner"],
    flexibleBudget: true,
    budgetMinInr: 0,
    days: ["sat", "sun"],
    timeWindows: ["morning"],
    socialComfort: "low_pressure",
    categories: ["books_board_games", "music_films"],
    favouriteEntities: [{ name: "Satyajit Ray" }],
  };

  it("should create a valid UserProfile structure", () => {
    const profile: UserProfile = {
      uid: "test_user_123",
      displayName: "Ananya Deshpande",
      email: "ananya@example.com",
      homeArea: "Baner",
      bio: "Passionate reader and indie film enthusiast.",
      preferences: mockPreferences,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(profile.uid).toBe("test_user_123");
    expect(profile.displayName).toBe("Ananya Deshpande");
    expect(profile.homeArea).toBe("Baner");
    expect(profile.preferences.categories).toContain("books_board_games");
    expect(profile.onboardingCompleted).toBe(true);
  });

  it("should properly merge updates into an existing profile", () => {
    const initialProfile: UserProfile = {
      uid: "user_456",
      displayName: "Tanmay",
      homeArea: "Kothrud",
      preferences: mockPreferences,
      onboardingCompleted: true,
      createdAt: "2026-10-21T10:00:00.000Z",
      updatedAt: "2026-10-21T10:00:00.000Z",
    };

    const updates: ProfileUpdateInput = {
      displayName: "Tanmay Kulkarni",
      homeArea: "Deccan Gymkhana",
      bio: "Exploring weekend acoustic sessions",
      preferences: {
        budgetMaxInr: 300,
        flexibleBudget: false,
      },
    };

    const updatedProfile: UserProfile = {
      ...initialProfile,
      displayName: updates.displayName || initialProfile.displayName,
      homeArea: updates.homeArea || initialProfile.homeArea,
      bio: updates.bio || initialProfile.bio,
      preferences: {
        ...initialProfile.preferences,
        ...updates.preferences,
      },
      updatedAt: new Date().toISOString(),
    };

    expect(updatedProfile.displayName).toBe("Tanmay Kulkarni");
    expect(updatedProfile.homeArea).toBe("Deccan Gymkhana");
    expect(updatedProfile.bio).toBe("Exploring weekend acoustic sessions");
    expect(updatedProfile.preferences.budgetMaxInr).toBe(300);
    expect(updatedProfile.preferences.flexibleBudget).toBe(false);
    expect(updatedProfile.preferences.categories).toEqual(initialProfile.preferences.categories);
  });
});
