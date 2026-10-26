"use client";

import React from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Bookmark,
  RefreshCw,
  Sliders,
  ShieldCheck,
  User,
  ArrowDown,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { UserProfile } from "@/lib/types/profile";
import { Pathway, QlooEvidence } from "@/lib/types/pathway";
import { useAuth } from "@/lib/firebase/authContext";

interface OverviewDashboardProps {
  profile: UserProfile;
  pathway: Pathway | null;
  qlooEvidence?: QlooEvidence;
  neighborhoodCount: number;
  circlesCount: number;
  catalogCount: number;
  savedCount: number;
  isLoadingPathway: boolean;
  onRegenerate: () => void;
  onEditPreferences: () => void;
  onGoToProfile: () => void;
  onGoToSaved: () => void;
  onOpenAuthModal?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  pathway,
  qlooEvidence,
  neighborhoodCount,
  circlesCount,
  catalogCount,
  savedCount,
  isLoadingPathway,
  onRegenerate,
  onEditPreferences,
  onGoToProfile,
  onGoToSaved,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const firstName = profile.displayName.trim().split(" ")[0] || "Explorer";

  const scrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-raasta-borderSubtle">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-raasta-primaryLight text-raasta-primary border border-raasta-border">
              Pune Cultural Radar
            </span>
            <span className="text-[10px] text-raasta-inkMuted inline-flex items-center">
              <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
              Verified Local Spaces
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
            Welcome, {firstName}
          </h2>
          <p className="text-xs text-raasta-inkMuted">
            Your cultural overview for{" "}
            <span className="font-semibold text-raasta-ink">{profile.homeArea}</span> ·{" "}
            {profile.preferences.categories.length} interests active
          </p>
        </div>

        {/* Sync Status / Auth Action */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle text-xs">
            <span
              className={`w-2 h-2 rounded-full ${user ? "bg-emerald-500" : "bg-amber-400"}`}
            />
            <span className="text-[11px] font-semibold text-raasta-ink">
              {user ? "Cloud Synced" : "Browser Preserved"}
            </span>
          </div>

          {!user && onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-raasta-primary hover:bg-raasta-primaryHover text-white text-[11px] font-bold transition-all shadow-subtle shrink-0"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Pathway */}
        <div
          onClick={() => scrollTo("curated-pathway-section")}
          className="p-4 rounded-2xl bg-raasta-primaryLight/40 hover:bg-raasta-primaryLight/70 border border-raasta-borderSubtle transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-raasta-primary text-white flex items-center justify-center shadow-subtle">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-raasta-primary bg-white/90 px-2 py-0.5 rounded-full border border-raasta-borderSubtle">
              {qlooEvidence?.explainabilityAvailable
                ? "Taste Matched"
                : qlooEvidence?.resolvedEntities?.length
                ? `${qlooEvidence.resolvedEntities.length} Taste Seeds`
                : "Curated"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider block">
              Curated Pathway
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-raasta-ink line-clamp-1 mt-0.5 group-hover:text-raasta-primary transition-colors">
              {pathway?.title || "Curating your route..."}
            </h3>
            <p className="text-[11px] text-raasta-inkMuted mt-0.5">
              {pathway
                ? `${pathway.steps.length} Curated Steps`
                : "Finding verified spots..."}
            </p>
          </div>
          <div className="pt-2 border-t border-raasta-borderSubtle/60 flex items-center justify-between text-[11px] font-bold text-raasta-primary">
            <span>View Pathway</span>
            <ArrowDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
          </div>
        </div>

        {/* Card 2: Neighborhood Radar */}
        <div
          onClick={() => scrollTo("neighborhood-section")}
          className="p-4 rounded-2xl bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-indigo-100 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-subtle">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-white/90 px-2 py-0.5 rounded-full border border-indigo-100">
              Local Hub
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-900/60 tracking-wider block">
              Neighborhood Hub
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-raasta-ink line-clamp-1 mt-0.5 group-hover:text-indigo-700 transition-colors">
              {profile.homeArea}
            </h3>
            <p className="text-[11px] text-raasta-inkMuted mt-0.5">
              {neighborhoodCount} local spaces verified
            </p>
          </div>
          <div className="pt-2 border-t border-indigo-100/70 flex items-center justify-between text-[11px] font-bold text-indigo-700">
            <span>Local Spots</span>
            <ArrowDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
          </div>
        </div>

        {/* Card 3: Weekend Circles */}
        <div
          onClick={() => scrollTo("weekend-circles-section")}
          className="p-4 rounded-2xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-emerald-100 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-subtle">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-full border border-emerald-100">
              Recurring
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-900/60 tracking-wider block">
              Weekend Circles
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-raasta-ink line-clamp-1 mt-0.5 group-hover:text-emerald-700 transition-colors">
              {circlesCount} Community Meetups
            </h3>
            <p className="text-[11px] text-raasta-inkMuted mt-0.5">
              Heritage, art, reading & coffee
            </p>
          </div>
          <div className="pt-2 border-t border-emerald-100/70 flex items-center justify-between text-[11px] font-bold text-emerald-700">
            <span>Browse Circles</span>
            <ArrowDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
          </div>
        </div>

        {/* Card 4: Cultural Passport */}
        <div
          onClick={onGoToProfile}
          className="p-4 rounded-2xl bg-raasta-subtle hover:bg-raasta-primaryLight/50 border border-raasta-borderSubtle transition-all cursor-pointer group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-raasta-ink text-white flex items-center justify-center shadow-subtle">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-raasta-ink bg-white/90 px-2 py-0.5 rounded-full border border-raasta-borderSubtle">
              Passport
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider block">
              My Profile
            </span>
            <h3 className="font-bold text-xs sm:text-sm text-raasta-ink line-clamp-1 mt-0.5 group-hover:text-raasta-primary transition-colors">
              {profile.preferences.categories.length} Active Interests
            </h3>
            <p className="text-[11px] text-raasta-inkMuted mt-0.5">
              {savedCount} Saved Pathways
            </p>
          </div>
          <div className="pt-2 border-t border-raasta-borderSubtle/60 flex items-center justify-between text-[11px] font-bold text-raasta-ink group-hover:text-raasta-primary transition-colors">
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Quick Jump & Action Navigation Bar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Jump Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-raasta-inkMuted mr-1 hidden sm:inline">
            Quick Jump:
          </span>
          <button
            onClick={() => scrollTo("curated-pathway-section")}
            className="px-3 py-1 rounded-full text-[11px] font-semibold bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary border border-raasta-borderSubtle transition-colors"
          >
            Today&apos;s Pathway
          </button>
          <button
            onClick={() => scrollTo("neighborhood-section")}
            className="px-3 py-1 rounded-full text-[11px] font-semibold bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary border border-raasta-borderSubtle transition-colors"
          >
            In {profile.homeArea} ({neighborhoodCount})
          </button>
          <button
            onClick={() => scrollTo("weekend-circles-section")}
            className="px-3 py-1 rounded-full text-[11px] font-semibold bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary border border-raasta-borderSubtle transition-colors"
          >
            Weekend Circles ({circlesCount})
          </button>
          <button
            onClick={() => scrollTo("catalog-section")}
            className="px-3 py-1 rounded-full text-[11px] font-semibold bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary border border-raasta-borderSubtle transition-colors"
          >
            All Spaces ({catalogCount})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onRegenerate}
            disabled={isLoadingPathway}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-raasta-subtle text-raasta-ink text-xs font-semibold border border-raasta-border shadow-subtle transition-all disabled:opacity-50"
            title="Generate a fresh pathway"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-raasta-primary ${isLoadingPathway ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">Regenerate</span>
          </button>

          <button
            onClick={onEditPreferences}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-raasta-subtle text-raasta-ink text-xs font-semibold border border-raasta-border shadow-subtle transition-all"
            title="Modify interests and preferences"
          >
            <Sliders className="w-3.5 h-3.5 text-raasta-primary" />
            <span className="hidden xs:inline">Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
