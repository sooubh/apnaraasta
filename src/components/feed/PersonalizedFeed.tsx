"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Tag,
  Filter,
  Users,
  Wallet,
  Sparkles as SparklesStub, // not used
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { Pathway, QlooEvidence, UserPreferences } from "@/lib/types/pathway";
import { Activity, ActivityCategory } from "@/lib/types/activity";
import { UserProfile } from "@/lib/types/profile";
import { PUNE_ACTIVITIES } from "@/data/puneActivities";
import { APPROVED_CATEGORIES } from "@/lib/constants";
import { PathwayView } from "../pathway/PathwayView";

interface PersonalizedFeedProps {
  profile: UserProfile;
  pathway: Pathway | null;
  qlooEvidence?: QlooEvidence;
  method: "qloo" | "baseline";
  isLoading: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onRegenerate: () => void;
  onEditPreferences: () => void;
  onSavePathway: () => void;
  onGoToCompare: () => void;
}

export const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({
  profile,
  pathway,
  qlooEvidence,
  method,
  isLoading,
  isSaving,
  isSaved,
  onRegenerate,
  onEditPreferences,
  onSavePathway,
  onGoToCompare,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  // Filter activities for user's home area or nearby
  const neighborhoodActivities = useMemo(() => {
    return PUNE_ACTIVITIES.filter((a) => {
      if (a.area && a.area.toLowerCase().includes(profile.homeArea.toLowerCase())) {
        return true;
      }
      return profile.preferences.areas.some(
        (area) => a.area && a.area.toLowerCase().includes(area.toLowerCase())
      );
    }).slice(0, 4);
  }, [profile.homeArea, profile.preferences.areas]);

  // Weekend recurring circles
  const weekendCircles = useMemo(() => {
    return PUNE_ACTIVITIES.filter(
      (a) =>
        a.activityKind === "recurring_community" ||
        a.scheduleKind === "recurring"
    ).slice(0, 4);
  }, []);

  // Filtered catalog by category
  const filteredCatalog = useMemo(() => {
    if (activeCategoryFilter === "all") {
      return PUNE_ACTIVITIES.slice(0, 6);
    }
    return PUNE_ACTIVITIES.filter((a) => a.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  return (
    <div className="space-y-8 flex-1 w-full min-w-0">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-br from-[#6E5BF6] via-[#7B68F8] to-[#9E92FE] rounded-3xl p-6 sm:p-8 text-white shadow-floating relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="inline-flex items-center text-[11px] font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider text-white">
            <Compass className="w-3 h-3 mr-1.5" />
            Personalized Pune Feed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            Welcome back, {profile.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Curated around your home base in{" "}
            <span className="font-semibold underline decoration-white/40">
              {profile.homeArea}
            </span>{" "}
            and your taste in{" "}
            {profile.preferences.categories
              .map((c) => c.replace(/_/g, " "))
              .slice(0, 3)
              .join(", ")}
            .
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Hero 3-Step Curated Pathway */}
      {pathway ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
                <span>Your Personalized 3-Step Pathway</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-raasta-primaryLight text-raasta-primary border border-raasta-border">
                  Qloo Optimized
                </span>
              </h2>
              <p className="text-xs text-raasta-inkMuted mt-0.5">
                A sequenced journey designed to take you from a low-barrier first visit to weekly community belonging.
              </p>
            </div>
          </div>

          <PathwayView
            pathway={pathway}
            qlooEvidence={qlooEvidence}
            method={method}
            onRegenerate={onRegenerate}
            onEditPreferences={onEditPreferences}
            onSavePathway={onSavePathway}
            onGoToCompare={onGoToCompare}
            isSaving={isSaving}
            isRegenerating={isLoading}
            isSaved={isSaved}
          />
        </section>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-card border border-raasta-border text-center space-y-4">
          <Compass className="w-10 h-10 text-raasta-primary mx-auto animate-pulse" />
          <div>
            <h3 className="font-bold text-base text-raasta-ink">Curating your Pune Pathway...</h3>
            <p className="text-xs text-raasta-inkMuted mt-1">
              Matching verified spaces with your cultural taste signals.
            </p>
          </div>
        </div>
      )}

      {/* SECTION: IN YOUR NEIGHBORHOOD */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-raasta-primary" />
              <span>In & Around {profile.homeArea}</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-0.5">
              Source-verified places and communities accessible from your home base.
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
              No direct venues tagged in {profile.homeArea}. Showing wider Pune circles below.
            </div>
          )}
        </div>
      </section>

      {/* SECTION: WEEKEND RECURRING CIRCLES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-raasta-primary" />
              <span>Recurring Weekend Circles in Pune</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-0.5">
              Welcoming groups meeting regularly on weekends where you can build regular rhythms.
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-raasta-ink tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-raasta-primary" />
              <span>Explore Verified Pune Spaces by Category</span>
            </h3>
            <p className="text-xs text-raasta-inkMuted mt-0.5">
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
    <div className="bg-white rounded-3xl border border-raasta-border overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
      <div>
        {/* Image header if present */}
        {activity.imageUrl && !compact && (
          <div className="h-36 w-full relative overflow-hidden bg-raasta-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-raasta-ink shadow-subtle border border-raasta-border">
              {activity.category.replace(/_/g, " ")}
            </span>
          </div>
        )}

        <div className="p-4 space-y-2">
          {compact && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-raasta-primaryLight text-raasta-primary mb-1 border border-raasta-border">
              {activity.category.replace(/_/g, " ")}
            </span>
          )}

          <h4 className="font-bold text-sm text-raasta-ink leading-snug line-clamp-1">
            {activity.title}
          </h4>

          <p className="text-xs text-raasta-inkMuted line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-raasta-inkMuted">
            {activity.area && (
              <span className="inline-flex items-center">
                <MapPin className="w-3 h-3 text-raasta-primary mr-1" />
                {activity.area}
              </span>
            )}
            {activity.costStatus === "free_confirmed" ? (
              <span className="inline-flex items-center text-emerald-700 font-medium">
                Free entry
              </span>
            ) : activity.priceMinInr !== undefined ? (
              <span className="inline-flex items-center">
                ₹{activity.priceMinInr}
                {activity.priceMaxInr && activity.priceMaxInr !== activity.priceMinInr
                  ? ` - ₹${activity.priceMaxInr}`
                  : ""}
              </span>
            ) : null}
          </div>

          {activity.scheduleText && (
            <p className="text-[11px] text-raasta-inkMuted/80 line-clamp-1 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-raasta-primary shrink-0" />
              <span>{activity.scheduleText}</span>
            </p>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-raasta-borderSubtle mt-2 flex items-center justify-between">
        <span className="text-[10px] text-raasta-inkMuted inline-flex items-center">
          <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
          Verified source
        </span>
        {activity.sourceUrl && (
          <a
            href={activity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-raasta-primary hover:underline inline-flex items-center"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        )}
      </div>
    </div>
  );
};
