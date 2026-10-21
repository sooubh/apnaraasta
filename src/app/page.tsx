"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Compass,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { BottomNav, NavTab } from "@/components/common/BottomNav";
import { AuthModal } from "@/components/auth/AuthModal";
import { StepOnboarding } from "@/components/onboarding/StepOnboarding";
import { PersonalizedFeed } from "@/components/feed/PersonalizedFeed";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CompareView } from "@/components/compare/CompareView";
import { SavedPathwaysView } from "@/components/saved/SavedPathwaysView";
import { useAuth } from "@/lib/firebase/authContext";
import { saveUserPathway, getUserPathways } from "@/lib/firebase/savedPathways";
import {
  ComparePathwaysResponse,
  GeneratePathwayResponse,
  Pathway,
  QlooEvidence,
  UserPreferences,
} from "@/lib/types/pathway";
import { UserProfile, ProfileUpdateInput } from "@/lib/types/profile";

export default function Home() {
  const { user, profile, loadingProfile, updateProfile } = useAuth();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Discovery / Feed state
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [qlooEvidence, setQlooEvidence] = useState<QlooEvidence | undefined>(undefined);
  const [method, setMethod] = useState<"qloo" | "baseline">("qloo");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Benchmark / Comparison state
  const [compareData, setCompareData] = useState<ComparePathwaysResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Load saved count
  const refreshSavedCount = useCallback(async () => {
    if (user) {
      try {
        const list = await getUserPathways(user.uid);
        setSavedCount(list.length);
      } catch {
        // silent fallback
      }
    }
  }, [user]);

  useEffect(() => {
    refreshSavedCount();
  }, [refreshSavedCount]);

  // Handle pathway generation
  const handleGenerate = useCallback(async (prefs: UserPreferences) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      setIsSaved(false);

      const res = await fetch("/api/pathways/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: prefs,
          requestMode: "qloo",
        }),
      });

      const data: GeneratePathwayResponse = await res.json();

      if (data.status === "error" || !data.pathway) {
        setErrorMsg(
          data.error?.message ||
            "Unable to assemble a pathway for these criteria. Try adjusting your area or budget ceiling."
        );
        setIsLoading(false);
        return;
      }

      setPathway(data.pathway);
      setQlooEvidence(data.qlooEvidence);
      setMethod(data.method);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMsg("A network error occurred. Please try again.");
      setIsLoading(false);
    }
  }, []);

  // When profile is loaded or established, auto-generate pathway if not yet created
  useEffect(() => {
    if (profile && !pathway && !isLoading) {
      handleGenerate(profile.preferences);
    }
  }, [profile, pathway, isLoading, handleGenerate]);

  // Handle pathway regeneration
  const handleRegenerate = async () => {
    if (!profile) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);
      setIsSaved(false);

      const res = await fetch("/api/pathways/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: profile.preferences,
          requestMode: "qloo",
          excludeActivityIds: pathway?.steps.map((s) => s.activityId) || [],
        }),
      });

      const data: GeneratePathwayResponse = await res.json();
      if (data.status === "success" && data.pathway) {
        setPathway(data.pathway);
        setQlooEvidence(data.qlooEvidence);
        setMethod(data.method);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  // Handle save pathway
  const handleSavePathway = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!pathway || !profile) return;

    try {
      setIsSaving(true);
      await saveUserPathway({
        userId: user.uid,
        pathway,
        preferences: profile.preferences,
        method,
        qlooUsed: method === "qloo",
        explainabilityAvailable: Boolean(qlooEvidence?.explainabilityAvailable),
      });
      setIsSaving(false);
      setIsSaved(true);
      refreshSavedCount();
    } catch (err) {
      console.warn("Failed to save pathway:", err);
      setIsSaving(false);
    }
  };

  // Handle profile update
  const handleProfileSave = async (updates: ProfileUpdateInput) => {
    await updateProfile(updates);
    if (updates.preferences && profile) {
      const mergedPrefs: UserPreferences = {
        ...profile.preferences,
        ...updates.preferences,
      };
      handleGenerate(mergedPrefs);
    }
  };

  // Handle run comparative benchmark
  const handleRunComparison = async () => {
    const prefsToUse: UserPreferences = profile?.preferences || {
      city: "Pune",
      areas: ["Koregaon Park", "FC Road & Shivaji Nagar"],
      flexibleBudget: true,
      days: ["sat", "sun"],
      timeWindows: ["morning", "afternoon"],
      socialComfort: "balanced",
      categories: ["music_films", "photography_art"],
      favouriteEntities: [],
    };

    try {
      setIsComparing(true);
      const res = await fetch("/api/pathways/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prefsToUse }),
      });

      const data: ComparePathwaysResponse = await res.json();
      setCompareData(data);
      setIsComparing(false);
    } catch (err) {
      console.warn("Comparison failed:", err);
      setIsComparing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onEditProfile={() => setIsEditProfileModalOpen(true)}
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === "compare" && !compareData && !isComparing) {
            handleRunComparison();
          }
        }}
        savedCount={savedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 md:pb-12">
        {loadingProfile ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-8 h-8 text-raasta-primary animate-spin" />
            <p className="text-xs font-semibold text-raasta-inkMuted">
              Loading your cultural passport...
            </p>
          </div>
        ) : !profile ? (
          /* Step-by-Step Onboarding Flow for New Users & Guests */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StepOnboarding
              onComplete={(newProfile) => {
                handleGenerate(newProfile.preferences);
              }}
            />
          </div>
        ) : (
          /* Authenticated / Configured Experience with Tabs */
          <>
            {/* Tab 1: Personalized Feed */}
            {currentTab === "discover" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-start gap-8 w-full">
                {/* Desktop Sticky Profile Sidebar */}
                <ProfileSidebar
                  profile={profile}
                  onEditProfile={() => setIsEditProfileModalOpen(true)}
                  onGoToSaved={() => setCurrentTab("saved")}
                  onGoToCompare={() => {
                    setCurrentTab("compare");
                    if (!compareData) handleRunComparison();
                  }}
                  savedCount={savedCount}
                />

                {/* Main Personalized Feed Column */}
                <div className="flex-1 w-full min-w-0">
                  {errorMsg && (
                    <div className="mb-4 p-4 rounded-3xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5 shadow-subtle">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold block mb-0.5">Could not curate pathway</span>
                        <span>{errorMsg}</span>
                      </div>
                    </div>
                  )}

                  <PersonalizedFeed
                    profile={profile}
                    pathway={pathway}
                    qlooEvidence={qlooEvidence}
                    method={method}
                    isLoading={isLoading}
                    isSaving={isSaving}
                    isSaved={isSaved}
                    onRegenerate={handleRegenerate}
                    onEditPreferences={() => setIsEditProfileModalOpen(true)}
                    onSavePathway={handleSavePathway}
                    onGoToCompare={() => {
                      setCurrentTab("compare");
                      if (!compareData) handleRunComparison();
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Compare Mode */}
            {currentTab === "compare" && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <CompareView
                  compareData={compareData}
                  isLoading={isComparing}
                  onRunComparison={handleRunComparison}
                />
              </div>
            )}

            {/* Tab 3: Saved Pathways */}
            {currentTab === "saved" && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <SavedPathwaysView
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile / Tablet */}
      <div className="md:hidden">
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            if (tab === "compare" && !compareData && !isComparing) {
              handleRunComparison();
            }
          }}
          savedCount={savedCount}
        />
      </div>

      {/* Profile Edit Slide-Over / Modal */}
      {profile && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          profile={profile}
          onSave={handleProfileSave}
        />
      )}

      {/* Google Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          if (pathway && !isSaved) {
            handleSavePathway();
          }
          refreshSavedCount();
        }}
      />
    </div>
  );
}
