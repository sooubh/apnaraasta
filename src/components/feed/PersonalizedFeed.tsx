"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Bookmark,
  LogIn,
} from "lucide-react";
import { Pathway, QlooEvidence } from "@/lib/types/pathway";
import { Activity } from "@/lib/types/activity";
import { UserProfile } from "@/lib/types/profile";
import { PUNE_ACTIVITIES } from "@/data/puneActivities";
import { APPROVED_CATEGORIES } from "@/lib/constants";
import { PathwayView } from "../pathway/PathwayView";
import { OverviewDashboard } from "../dashboard/OverviewDashboard";
import { useAuth } from "@/lib/firebase/authContext";

interface PersonalizedFeedProps {
  profile: UserProfile;
  pathway: Pathway | null;
  qlooEvidence?: QlooEvidence;
  method: "qloo" | "baseline";
  isLoading: boolean;
  isSaving: boolean;
  isSaved: boolean;
  savedCount?: number;
  onRegenerate: () => void;
  onEditPreferences: () => void;
  onSavePathway: () => void;
  onGoToProfile?: () => void;
  onGoToSaved?: () => void;
  onOpenAuthModal?: () => void;
}

export const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({
  profile,
  pathway,
  qlooEvidence,
  method,
  isLoading,
  isSaving,
  isSaved,
  savedCount = 0,
  onRegenerate,
  onEditPreferences,
  onSavePathway,
  onGoToProfile,
  onGoToSaved,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  // Filter and rank activities for user's home area or nearby
  const neighborhoodActivities = useMemo(() => {
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

  // Filtered catalog by category
  const filteredCatalog = useMemo(() => {
    if (activeCategoryFilter === "all") {
      return PUNE_ACTIVITIES.slice(0, 6);
    }
    return PUNE_ACTIVITIES.filter((a) => a.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  return (
    <div className="space-y-6 flex-1 w-full min-w-0">
      {/* CULTURAL OVERVIEW DASHBOARD */}
      <OverviewDashboard
        profile={profile}
        pathway={pathway}
        qlooEvidence={qlooEvidence}
        neighborhoodCount={neighborhoodActivities.length}
        circlesCount={weekendCircles.length}
        catalogCount={PUNE_ACTIVITIES.length}
        savedCount={savedCount}
        isLoadingPathway={isLoading}
        onRegenerate={onRegenerate}
        onEditPreferences={onEditPreferences}
        onGoToProfile={() => onGoToProfile && onGoToProfile()}
        onGoToSaved={() => onGoToSaved && onGoToSaved()}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* Guest Mode: Ask to login to save to cloud, else cleanly preserve in browser */}
      {!user && (
        <div className="bg-white rounded-2xl p-4 border border-raasta-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-raasta-primaryLight text-raasta-primary flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-raasta-ink block">
                Preserved in this browser
              </span>
              <p className="text-[11px] text-raasta-inkMuted">
                Sign in with Google to sync and save your profile & pathways permanently.
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in to Cloud Sync</span>
            </button>
          )}
        </div>
      )}

      {/* 3-Step Curated Pathway (Prominent Big-Image Cards) */}
      <div id="curated-pathway-section" className="space-y-3 pt-1">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight">
              Personalized Pune Pathway
            </h2>
            <p className="text-xs text-raasta-inkMuted mt-0.5">
              Sequenced for <span className="font-semibold text-raasta-ink">{profile.homeArea}</span> based on your taste and weekend rhythm.
            </p>
          </div>
        </div>

        {pathway ? (
          <PathwayView
            pathway={pathway}
            qlooEvidence={qlooEvidence}
            method={method}
            onRegenerate={onRegenerate}
            onEditPreferences={onEditPreferences}
            onSavePathway={onSavePathway}
            isSaving={isSaving}
            isRegenerating={isLoading}
            isSaved={isSaved}
          />
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-card border border-raasta-border text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-raasta-primaryLight text-raasta-primary mx-auto flex items-center justify-center animate-pulse">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-raasta-ink">Curating your Pune Pathway...</h3>
              <p className="text-xs text-raasta-inkMuted mt-0.5">
                Finding verified spaces tailored to your comfort and taste.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION: IN YOUR NEIGHBORHOOD */}
      <section id="neighborhood-section" className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-raasta-primary" />
              <span>More Places in {profile.homeArea}</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted">
              Verified local spaces right near your home base.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {neighborhoodActivities.length > 0 ? (
            neighborhoodActivities.map((act) => (
              <ActivityFeedCard key={act.id} activity={act} />
            ))
          ) : (
            <div className="col-span-2 p-6 bg-white rounded-3xl border border-raasta-border text-center text-xs text-raasta-inkMuted">
              No additional spots recorded in {profile.homeArea}. Showing wider Pune circles below.
            </div>
          )}
        </div>
      </section>

      {/* SECTION: WEEKEND RECURRING CIRCLES */}
      <section id="weekend-circles-section" className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-raasta-primary" />
              <span>Weekend Community Circles</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted">
              Regular groups meeting every weekend where you can build lasting rhythms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {weekendCircles.map((act) => (
            <ActivityFeedCard key={act.id} activity={act} />
          ))}
        </div>
      </section>

      {/* SECTION: EXPLORE BY CATEGORY */}
      <section id="catalog-section" className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-raasta-primary" />
              <span>Explore Verified Spaces by Category</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted">
              Browse all 18 source-checked cultural hubs across Pune.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategoryFilter === "all"
                ? "bg-raasta-ink text-white border-raasta-ink"
                : "bg-white text-raasta-ink border-raasta-border hover:bg-raasta-subtle"
            }`}
          >
            All Categories
          </button>
          {APPROVED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategoryFilter === cat.id
                  ? "bg-raasta-primary text-white border-raasta-primary"
                  : "bg-white text-raasta-ink border-raasta-border hover:bg-raasta-subtle"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((act) => (
            <ActivityFeedCard key={act.id} activity={act} compact />
          ))}
        </div>
      </section>
    </div>
  );
};

interface ActivityFeedCardProps {
  activity: Activity;
  compact?: boolean;
}

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({ activity, compact = false }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E7F2] overflow-hidden shadow-[0_2px_12px_rgba(27,25,49,0.03)] hover:shadow-[0_8px_24px_rgba(27,25,49,0.06)] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* BIG HERO IMAGE */}
        {activity.imageUrl && (
          <div className={`w-full relative overflow-hidden bg-raasta-subtle ${compact ? "h-44 sm:h-48" : "h-52 sm:h-60"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-raasta-ink shadow-subtle border border-raasta-border">
              {activity.category.replace(/_/g, " ")}
            </span>

            {/* Top Right Cost */}
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-raasta-ink/85 backdrop-blur-sm text-white shadow-subtle border border-white/20">
              {activity.costStatus === "free_confirmed"
                ? "Free Entry"
                : activity.priceMinInr !== undefined
                ? `₹${activity.priceMinInr}`
                : "Verified"}
            </span>

            {/* Bottom Location */}
            {activity.area && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/40 backdrop-blur-md text-white shadow-subtle border border-white/20 inline-flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-white" />
                {activity.area}
              </span>
            )}
          </div>
        )}

        <div className="p-5 space-y-2.5">
          <h4 className="font-bold text-base sm:text-lg text-raasta-ink leading-snug line-clamp-1 group-hover:text-raasta-primary transition-colors">
            {activity.title}
          </h4>

          <p className="text-xs text-raasta-inkMuted line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>

          {activity.scheduleText && (
            <div className="p-2.5 rounded-xl bg-[#F8F8FC] border border-[#EDEDF5] text-[11px] text-raasta-ink flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-raasta-primary shrink-0" />
              <span className="line-clamp-1 font-medium">{activity.scheduleText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-3 border-t border-raasta-borderSubtle flex items-center justify-between text-xs">
        <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          {activity.sourceName}
        </span>
        {activity.sourceUrl && (
          <a
            href={activity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-raasta-primary hover:text-raasta-primaryHover inline-flex items-center bg-raasta-subtle hover:bg-raasta-primaryLight px-3.5 py-1 rounded-full border border-raasta-border transition-all"
          >
            <span>Explore</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};
