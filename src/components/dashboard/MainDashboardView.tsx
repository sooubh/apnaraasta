"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Bookmark,
  RefreshCw,
  Sliders,
  ShieldCheck,
  User,
  ArrowRight,
  Clock,
  Layers,
  ExternalLink,
  LogIn,
  CheckCircle2,
} from "lucide-react";
import { UserProfile } from "@/lib/types/profile";
import { Pathway, QlooEvidence } from "@/lib/types/pathway";
import { Activity } from "@/lib/types/activity";
import { PUNE_ACTIVITIES } from "@/data/puneActivities";
import { APPROVED_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/lib/firebase/authContext";

interface MainDashboardViewProps {
  profile: UserProfile;
  pathway: Pathway | null;
  qlooEvidence?: QlooEvidence;
  savedCount: number;
  isLoadingPathway: boolean;
  onRegenerate: () => void;
  onEditPreferences: () => void;
  onGoToDiscover: () => void;
  onGoToSaved: () => void;
  onGoToProfile: () => void;
  onOpenAuthModal?: () => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  profile,
  pathway,
  qlooEvidence,
  savedCount,
  isLoadingPathway,
  onRegenerate,
  onEditPreferences,
  onGoToDiscover,
  onGoToSaved,
  onGoToProfile,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const firstName = profile.displayName.trim().split(" ")[0] || "Explorer";

  // Filter and rank local spots in user's area by matching categories
  const localSpots = useMemo(() => {
    const targetAreas = [profile.homeArea, ...(profile.preferences.areas || [])];
    const tokens = targetAreas
      .flatMap((a) => a.toLowerCase().split(/[&,/]+/))
      .map((s) => s.trim())
      .filter(Boolean);

    const matches = PUNE_ACTIVITIES.filter((a) => {
      if (!a.area) return false;
      const actAreaLower = a.area.toLowerCase();
      return tokens.some((t) => actAreaLower.includes(t) || t.includes(actAreaLower));
    });

    return matches
      .sort((a, b) => {
        const aCat = profile.preferences.categories.includes(a.category) ? 1 : 0;
        const bCat = profile.preferences.categories.includes(b.category) ? 1 : 0;
        return bCat - aCat;
      })
      .slice(0, 4);
  }, [profile.homeArea, profile.preferences.areas, profile.preferences.categories]);

  // Weekend recurring circles prioritized by user's categories and social comfort
  const weekendCircles = useMemo(() => {
    const circles = PUNE_ACTIVITIES.filter(
      (a) =>
        a.activityKind === "recurring_community" ||
        a.scheduleKind === "recurring"
    );

    return circles
      .sort((a, b) => {
        const aCat = profile.preferences.categories.includes(a.category) ? 2 : 0;
        const bCat = profile.preferences.categories.includes(b.category) ? 2 : 0;
        const aSocial = a.socialComfort === profile.preferences.socialComfort ? 1 : 0;
        const bSocial = b.socialComfort === profile.preferences.socialComfort ? 1 : 0;
        return bCat + bSocial - (aCat + aSocial);
      })
      .slice(0, 4);
  }, [profile.preferences.categories, profile.preferences.socialComfort]);

  // Category catalog
  const filteredSpots = useMemo(() => {
    if (selectedCategory === "all") {
      return PUNE_ACTIVITIES.slice(0, 6);
    }
    return PUNE_ACTIVITIES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. EXECUTIVE HERO BANNER */}
      <div className="bg-gradient-to-r from-white via-[#FAF9FE] to-[#F3F1FE] rounded-3xl p-6 sm:p-8 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-raasta-primaryLight text-raasta-primary border border-raasta-border">
              Pune Cultural Intelligence Dashboard
            </span>
            <span className="text-[11px] text-raasta-inkMuted inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              18 Verified Pune Venues & Circles
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
            Namaste, {firstName}
          </h1>

          <p className="text-xs sm:text-sm text-raasta-inkMuted leading-relaxed">
            Your personalized cultural headquarters for{" "}
            <span className="font-semibold text-raasta-ink">{profile.homeArea}</span>, Pune.
            Curated according to your rhythm, budget ceiling, and cultural interests.
          </p>

          <div className="flex items-center space-x-3 pt-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-[#E8E7F2] text-xs shadow-subtle">
              <span
                className={`w-2 h-2 rounded-full ${user ? "bg-emerald-500" : "bg-amber-400"}`}
              />
              <span className="font-semibold text-raasta-ink text-[11px]">
                {user ? "Cloud Synced to Google" : "Preserved in Local Browser"}
              </span>
            </div>
            {!user && onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="text-xs font-bold text-raasta-primary hover:underline inline-flex items-center"
              >
                <span>Sync with Google &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={onGoToDiscover}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(110,91,246,0.3)]"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Curated Pathway</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRegenerate}
              disabled={isLoadingPathway}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-raasta-subtle text-raasta-ink text-xs font-semibold border border-[#E8E7F2] shadow-subtle transition-all disabled:opacity-50"
              title="Generate a fresh pathway"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-raasta-primary ${isLoadingPathway ? "animate-spin" : ""}`}
              />
              <span>Regenerate</span>
            </button>

            <button
              onClick={onEditPreferences}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-raasta-subtle text-raasta-ink text-xs font-semibold border border-[#E8E7F2] shadow-subtle transition-all"
              title="Edit profile & preferences"
            >
              <Sliders className="w-3.5 h-3.5 text-raasta-primary" />
              <span>Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE 4-METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Pathway Status */}
        <div
          onClick={onGoToDiscover}
          className="bg-white rounded-3xl p-5 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.08)] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center shadow-subtle">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-raasta-primary bg-raasta-primaryLight/60 px-2.5 py-1 rounded-full border border-raasta-borderSubtle">
              {qlooEvidence?.explainabilityAvailable ? "Taste Matched" : "Curated"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider block">
              Active Weekend Itinerary
            </span>
            <h3 className="font-bold text-sm text-raasta-ink mt-0.5 line-clamp-1 group-hover:text-raasta-primary transition-colors">
              {pathway?.title || "Curating your route..."}
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-1">
              3 Steps Sequenced &middot; Verified Pune Hub
            </p>
          </div>
          <div className="pt-2 border-t border-[#EDEDF5] flex items-center justify-between text-xs font-bold text-raasta-primary">
            <span>Open Pathway View</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 2: Neighborhood Radar */}
        <div
          onClick={onGoToDiscover}
          className="bg-white rounded-3xl p-5 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.08)] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center shadow-subtle">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Locality
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-900/60 tracking-wider block">
              Neighborhood Radar
            </span>
            <h3 className="font-bold text-sm text-raasta-ink mt-0.5 line-clamp-1 group-hover:text-indigo-700 transition-colors">
              {profile.homeArea}
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-1">
              {localSpots.length} verified spots in your locality
            </p>
          </div>
          <div className="pt-2 border-t border-[#EDEDF5] flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Explore Neighborhood</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: Cultural Taste Matrix */}
        <div
          onClick={onGoToProfile}
          className="bg-white rounded-3xl p-5 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.08)] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-emerald-600 flex items-center justify-center shadow-subtle">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Interests
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-900/60 tracking-wider block">
              Taste Profile
            </span>
            <h3 className="font-bold text-sm text-raasta-ink mt-0.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {profile.preferences.categories.length} Active Categories
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-1 capitalize">
              Comfort: {profile.preferences.socialComfort.replace("_", " ")}
            </p>
          </div>
          <div className="pt-2 border-t border-[#EDEDF5] flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>View Cultural Passport</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 4: Saved Collections */}
        <div
          onClick={onGoToSaved}
          className="bg-white rounded-3xl p-5 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.08)] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5FF] text-purple-600 flex items-center justify-center shadow-subtle">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              Passport
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-900/60 tracking-wider block">
              Saved Vault
            </span>
            <h3 className="font-bold text-sm text-raasta-ink mt-0.5 line-clamp-1 group-hover:text-purple-700 transition-colors">
              {savedCount} Saved Pathways
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-1">
              {user ? "Safely backed up to cloud" : "Stored in browser storage"}
            </p>
          </div>
          <div className="pt-2 border-t border-[#EDEDF5] flex items-center justify-between text-xs font-bold text-purple-700">
            <span>Open Saved Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* 3. TODAY'S CURATED ITINERARY ROADMAP */}
      {pathway && (
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDEDF5]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-raasta-primaryLight text-raasta-primary border border-raasta-border">
                  Active Sequence
                </span>
                <span className="text-xs text-raasta-inkMuted">
                  {pathway.steps.length} Curated Steps
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight mt-1">
                {pathway.title}
              </h2>
            </div>
            <button
              onClick={onGoToDiscover}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary text-xs font-bold border border-raasta-border transition-all shrink-0"
            >
              <span>View Full Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Steps Horizontal Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pathway.steps.map((step) => {
              if (!step.activity) return null;
              return (
                <div
                  key={step.order}
                  onClick={onGoToDiscover}
                  className="p-4 rounded-2xl bg-[#FBFBFE] hover:bg-[#F4F2FE] border border-[#EDEDF5] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Image Thumbnail */}
                    {step.activity.imageUrl && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-raasta-subtle">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.activity.imageUrl}
                          alt={step.activity.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-raasta-ink shadow-subtle">
                          Step {step.order}
                        </span>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
                          {step.activity.area || "Pune"}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] uppercase font-bold text-raasta-primary tracking-wider">
                        {step.role.replace("_", " ")}
                      </span>
                      <h4 className="font-bold text-sm text-raasta-ink line-clamp-1 group-hover:text-raasta-primary transition-colors">
                        {step.activity.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-raasta-inkMuted line-clamp-2 leading-relaxed">
                      {step.whyThisStep}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EDEDF5] flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold inline-flex items-center">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                      {step.activity.sourceName}
                    </span>
                    <span className="font-bold text-raasta-ink">
                      {step.activity.costStatus === "free_confirmed"
                        ? "Free"
                        : step.activity.priceMinInr !== undefined
                        ? `₹${step.activity.priceMinInr}`
                        : "Verified"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. LOCAL NEIGHBORHOOD SPOTS (In {profile.homeArea}) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-raasta-primary" />
              <span>Verified Spaces in {profile.homeArea}</span>
            </h2>
            <p className="text-xs text-raasta-inkMuted">
              Authentic cultural hubs located right in your neighborhood.
            </p>
          </div>
          <button
            onClick={onGoToDiscover}
            className="text-xs font-bold text-raasta-primary hover:underline self-start sm:self-auto"
          >
            See all places &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {localSpots.map((act) => (
            <DashboardMiniCard key={act.id} activity={act} />
          ))}
        </div>
      </section>

      {/* 5. WEEKEND RECURRING CIRCLES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-raasta-primary" />
              <span>Weekend Community Circles</span>
            </h2>
            <p className="text-xs text-raasta-inkMuted">
              Regular weekly gatherings for books, heritage walks, sketch jams, and open mics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weekendCircles.map((act) => (
            <DashboardMiniCard key={act.id} activity={act} />
          ))}
        </div>
      </section>

      {/* 6. CULTURAL CATEGORIES EXPLORER */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E7F2] shadow-[0_2px_16px_rgba(27,25,49,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-raasta-primary" />
              <span>Explore Verified Spaces by Interest</span>
            </h2>
            <p className="text-xs text-raasta-inkMuted">
              Filter through all 18 curated cultural spaces across Pune.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedCategory === "all"
                ? "bg-raasta-ink text-white border-raasta-ink shadow-sm"
                : "bg-white text-raasta-ink border-raasta-border hover:bg-raasta-subtle"
            }`}
          >
            All Spaces
          </button>
          {APPROVED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat.id
                  ? "bg-raasta-primary text-white border-raasta-primary shadow-sm"
                  : "bg-white text-raasta-ink border-raasta-border hover:bg-raasta-subtle"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredSpots.map((act) => (
            <DashboardMiniCard key={act.id} activity={act} />
          ))}
        </div>
      </section>
    </div>
  );
};

interface DashboardMiniCardProps {
  activity: Activity;
}

const DashboardMiniCard: React.FC<DashboardMiniCardProps> = ({ activity }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E7F2] overflow-hidden shadow-[0_2px_12px_rgba(27,25,49,0.03)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.06)] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Photo Container */}
        {activity.imageUrl && (
          <div className="relative w-full h-44 overflow-hidden bg-raasta-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Top Category Badge */}
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-raasta-ink shadow-subtle border border-raasta-border">
              {activity.category.replace(/_/g, " ")}
            </span>

            {/* Top Right Price */}
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-raasta-ink/85 backdrop-blur-sm text-white shadow-subtle border border-white/20">
              {activity.costStatus === "free_confirmed"
                ? "Free"
                : activity.priceMinInr !== undefined
                ? `₹${activity.priceMinInr}`
                : "Verified"}
            </span>

            {/* Locality Chip */}
            {activity.area && (
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-white shadow-subtle border border-white/20 inline-flex items-center">
                <MapPin className="w-2.5 h-2.5 mr-1 text-white" />
                {activity.area}
              </span>
            )}
          </div>
        )}

        <div className="p-4 space-y-2">
          <h4 className="font-bold text-sm text-raasta-ink leading-snug line-clamp-1 group-hover:text-raasta-primary transition-colors">
            {activity.title}
          </h4>

          <p className="text-[11px] text-raasta-inkMuted line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>

          {activity.scheduleText && (
            <div className="p-2 rounded-xl bg-[#F8F8FC] border border-[#EDEDF5] text-[10px] text-raasta-ink flex items-center">
              <Clock className="w-3 h-3 mr-1 text-raasta-primary shrink-0" />
              <span className="line-clamp-1 font-medium">{activity.scheduleText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-2.5 border-t border-[#EDEDF5] flex items-center justify-between text-xs">
        <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center">
          <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
          {activity.sourceName}
        </span>
        {activity.sourceUrl && (
          <a
            href={activity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-raasta-primary hover:text-white bg-raasta-primaryLight hover:bg-raasta-primary px-3 py-1 rounded-full border border-raasta-border transition-all inline-flex items-center"
          >
            <span>Explore</span>
            <ExternalLink className="w-2.5 h-2.5 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};
