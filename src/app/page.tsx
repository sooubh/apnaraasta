"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Compass,
  AlertCircle,
  Loader2,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { BottomNav, NavTab } from "@/components/common/BottomNav";
import { AuthModal } from "@/components/auth/AuthModal";
import { PreferencesForm } from "@/components/onboarding/PreferencesForm";
import { PathwayView } from "@/components/pathway/PathwayView";
import { CompareView } from "@/components/compare/CompareView";
import { SavedPathwaysView } from "@/components/saved/SavedPathwaysView";
import { useAuth } from "@/lib/firebase/authContext";
import { saveUserPathway } from "@/lib/firebase/savedPathways";
import {
  ComparePathwaysResponse,
  GeneratePathwayResponse,
  Pathway,
  QlooEvidence,
  UserPreferences,
} from "@/lib/types/pathway";

export default function Home() {
  const { user } = useAuth();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Discovery state
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [qlooEvidence, setQlooEvidence] = useState<QlooEvidence | undefined>(undefined);
  const [method, setMethod] = useState<"qloo" | "baseline">("qloo");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Benchmark / Comparison state
  const [compareData, setCompareData] = useState<ComparePathwaysResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Handle pathway generation
  const handleGenerate = async (prefs: UserPreferences) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      setIsSaved(false);
      setPreferences(prefs);

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
  };

  // Handle pathway regeneration
  const handleRegenerate = async () => {
    if (!preferences) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);
      setIsSaved(false);

      const res = await fetch("/api/pathways/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences,
          requestMode: "qloo",
          // pass existing step ids to provide refreshing diversity
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

    if (!pathway) return;

    try {
      setIsSaving(true);
      await saveUserPathway({
        userId: user.uid,
        pathway,
        preferences: preferences || {},
        method,
        qlooUsed: method === "qloo",
        explainabilityAvailable: Boolean(qlooEvidence?.explainabilityAvailable),
      });
      setIsSaving(false);
      setIsSaved(true);
    } catch (err) {
      console.warn("Failed to save pathway:", err);
      setIsSaving(false);
    }
  };

  // Handle run comparative benchmark
  const handleRunComparison = async () => {
    const prefsToUse: UserPreferences = preferences || {
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
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 max-w-xl mx-auto w-full">
        {currentTab === "discover" && (
          <>
            {/* If no pathway generated yet: Welcome Hero Card matching Reference 2 */}
            {!pathway && !isLoading && (
              <div className="mb-6 bg-gradient-to-br from-[#6E5BF6] via-[#7B68F8] to-[#9E92FE] rounded-3xl p-6 text-white shadow-floating relative overflow-hidden">
                <div className="relative z-10 space-y-2.5">
                  <span className="inline-flex items-center text-[11px] font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pune Cultural Intelligence
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight leading-snug">
                    Turn Your Taste Into Your Community
                  </h1>
                  <p className="text-xs text-white/85 leading-relaxed max-w-sm">
                    Move beyond generic event listings. Discover a personalized 3-step cultural pathway in Pune powered by Qloo cultural affinity and verified local venues.
                  </p>
                </div>
                {/* Decorative background shape */}
                <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-4 rounded-3xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5 shadow-subtle">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block mb-0.5">Could not generate pathway</span>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* Loading / Agent Reasoning State */}
            {isLoading && (
              <div className="bg-white rounded-3xl p-8 shadow-card border border-raasta-borderSubtle text-center space-y-4 my-8 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-raasta-primaryLight text-raasta-primary mx-auto flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-raasta-ink">
                    Reasoning Your Pune Pathway...
                  </h3>
                  <p className="text-xs text-raasta-inkMuted mt-1">
                    Resolving taste signals via Qloo · Filtering verified Pune venues · Sequencing 3-step community pathway
                  </p>
                </div>
              </div>
            )}

            {/* Either Form or Pathway Result */}
            {!isLoading && !pathway && (
              <PreferencesForm
                initialPreferences={preferences || undefined}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            )}

            {!isLoading && pathway && (
              <PathwayView
                pathway={pathway}
                qlooEvidence={qlooEvidence}
                method={method}
                onRegenerate={handleRegenerate}
                onEditPreferences={() => setPathway(null)}
                onSavePathway={handleSavePathway}
                onGoToCompare={() => {
                  setCurrentTab("compare");
                  if (!compareData) {
                    handleRunComparison();
                  }
                }}
                isSaving={isSaving}
                isRegenerating={isLoading}
                isSaved={isSaved}
              />
            )}
          </>
        )}

        {/* Tab 2: Compare Mode */}
        {currentTab === "compare" && (
          <CompareView
            compareData={compareData}
            isLoading={isComparing}
            onRunComparison={handleRunComparison}
          />
        )}

        {/* Tab 3: Saved Pathways */}
        {currentTab === "saved" && (
          <SavedPathwaysView
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation matching Reference 1 & 2 */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === "compare" && !compareData && !isComparing) {
            handleRunComparison();
          }
        }}
      />

      {/* Google Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          if (pathway && !isSaved) {
            handleSavePathway();
          }
        }}
      />
    </div>
  );
}
