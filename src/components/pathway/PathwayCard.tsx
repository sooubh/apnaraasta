"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Heart,
  Info,
  Clock,
  ArrowRightLeft,
  Compass,
} from "lucide-react";
import { ActivityCardData } from "@/lib/types/activity";
import { PathwayStepRole } from "@/lib/types/pathway";

interface PathwayCardProps {
  order: 1 | 2 | 3;
  role: PathwayStepRole;
  activity: ActivityCardData;
  whyThisStep: string;
  onSwap?: (currentId: string) => void;
  hasAlternatives?: boolean;
}

const ROLE_META: Record<
  PathwayStepRole,
  { label: string; badgeBg: string; badgeText: string; borderColor: string }
> = {
  approachable_start: {
    label: "Step 1 · Welcoming Start",
    badgeBg: "bg-white/95 backdrop-blur-md",
    badgeText: "text-sky-800",
    borderColor: "border-sky-300",
  },
  shared_interest: {
    label: "Step 2 · Shared Interest",
    badgeBg: "bg-white/95 backdrop-blur-md",
    badgeText: "text-indigo-800",
    borderColor: "border-indigo-300",
  },
  recurring_participation: {
    label: "Step 3 · Community Rhythm",
    badgeBg: "bg-white/95 backdrop-blur-md",
    badgeText: "text-purple-800",
    borderColor: "border-purple-300",
  },
};

export const PathwayCard: React.FC<PathwayCardProps> = ({
  role,
  activity,
  whyThisStep,
  onSwap,
  hasAlternatives,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const roleConfig = ROLE_META[role];

  const formatCost = () => {
    if (activity.costStatus === "free_confirmed") return "Free Entry";
    if (activity.costStatus === "known" && activity.priceMinInr !== undefined) {
      if (activity.priceMaxInr && activity.priceMaxInr > activity.priceMinInr) {
        return `₹${activity.priceMinInr} – ₹${activity.priceMaxInr}`;
      }
      return `₹${activity.priceMinInr}`;
    }
    return "Fee not listed";
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-raasta-border shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* BIG HERO IMAGE BANNER (Prominent High-Impact Card) */}
        <div className="relative w-full h-56 sm:h-64 bg-raasta-subtle overflow-hidden group">
          {activity.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-raasta-primaryLight to-[#EAE8FC]">
              <Compass className="w-12 h-12 text-raasta-primary/40" />
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

          {/* Top Floated Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-subtle border ${roleConfig.badgeBg} ${roleConfig.badgeText} ${roleConfig.borderColor}`}
            >
              {roleConfig.label}
            </span>

            <div className="flex items-center space-x-2">
              <span className="bg-raasta-ink/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-subtle border border-white/20">
                {formatCost()}
              </span>

              {hasAlternatives && onSwap && (
                <button
                  type="button"
                  onClick={() => onSwap(activity.id)}
                  title="Swap with another eligible Pune activity"
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-white bg-black/50 hover:bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full transition-all border border-white/30"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Swap</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Floated Location & Category Badges */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
            {activity.area && (
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center border border-white/20 shadow-subtle">
                <MapPin className="w-3.5 h-3.5 text-white mr-1" />
                {activity.area}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20">
              {activity.category.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {/* Title & Short Description */}
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-raasta-ink leading-snug">
              {activity.title}
            </h3>
            <p className="text-xs sm:text-sm text-raasta-inkMuted line-clamp-2 mt-1 leading-relaxed">
              {activity.shortDescription}
            </p>
          </div>

          {/* Schedule / Timing Pill */}
          {activity.scheduleText && (
            <div className="flex items-start space-x-2 text-xs text-raasta-ink bg-raasta-subtle p-3 rounded-2xl border border-raasta-borderSubtle">
              <Clock className="w-4 h-4 text-raasta-primary shrink-0 mt-0.5" />
              <span className="leading-snug text-xs font-medium">
                {activity.scheduleText}
              </span>
            </div>
          )}

          {/* "Why This Step Was Curated For You" Grounded Explanation */}
          <div className="bg-raasta-primaryLight/50 border border-raasta-primary/20 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-raasta-primary">
              <Heart className="w-3.5 h-3.5 text-raasta-primary" />
              <span>Why this step fits you</span>
            </div>
            <p className="text-xs text-raasta-ink leading-relaxed font-normal">
              {whyThisStep}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Provenance & Action Link */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-raasta-borderSubtle flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-700 font-medium text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[170px] sm:max-w-[240px]">
            {activity.sourceName}
          </span>
          {activity.verificationNotes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5"
              title="Verification details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* External Link to Official Venue / Community Source */}
        {activity.externalActionUrl && (
          <a
            href={activity.externalActionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-raasta-primary hover:text-raasta-primaryHover transition-colors bg-raasta-subtle hover:bg-raasta-primaryLight px-3.5 py-1.5 rounded-full border border-raasta-border"
          >
            <span>Visit Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Pop-down verification notes if toggled */}
      {showNotes && activity.verificationNotes && (
        <div className="mx-5 mb-5 p-3 bg-neutral-50 rounded-2xl text-[11px] text-neutral-600 border border-neutral-200">
          <strong>Verification Notes:</strong> {activity.verificationNotes}
        </div>
      )}
    </div>
  );
};
