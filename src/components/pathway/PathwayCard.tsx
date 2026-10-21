"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  ArrowRightLeft,
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
  { label: string; bg: string; text: string; border: string }
> = {
  approachable_start: {
    label: "Step 1 · Welcoming Start",
    bg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-200",
  },
  shared_interest: {
    label: "Step 2 · Shared Interest",
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
  },
  recurring_participation: {
    label: "Step 3 · Community Rhythm",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
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
    if (activity.costStatus === "free_confirmed") return "Free";
    if (activity.costStatus === "known" && activity.priceMinInr !== undefined) {
      if (activity.priceMaxInr && activity.priceMaxInr > activity.priceMinInr) {
        return `₹${activity.priceMinInr} – ₹${activity.priceMaxInr}`;
      }
      return `₹${activity.priceMinInr}`;
    }
    return "Fee not listed";
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle transition-all hover:shadow-floating">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
        >
          {roleConfig.label}
        </span>

        {hasAlternatives && onSwap && (
          <button
            type="button"
            onClick={() => onSwap(activity.id)}
            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-raasta-inkMuted hover:text-raasta-primary bg-raasta-subtle px-2.5 py-1 rounded-full transition-colors"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Swap</span>
          </button>
        )}
      </div>

      {/* Image Banner */}
      {activity.imageUrl && (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3.5 bg-neutral-100 shadow-subtle group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Cost Chip */}
          <span className="absolute top-2.5 left-2.5 bg-raasta-ink/85 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {formatCost()}
          </span>

          {/* Locality Pill */}
          {activity.area && (
            <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-raasta-ink text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center">
              <MapPin className="w-3 h-3 text-raasta-primary mr-1" />
              {activity.area}
            </span>
          )}
        </div>
      )}

      {/* Title & Description */}
      <h3 className="font-bold text-base sm:text-lg text-raasta-ink leading-snug mb-1">
        {activity.title}
      </h3>

      <p className="text-xs text-raasta-inkMuted line-clamp-2 mb-3">
        {activity.shortDescription}
      </p>

      {/* Schedule / Logistics Pill */}
      {activity.scheduleText && (
        <div className="flex items-start space-x-1.5 text-xs text-raasta-ink mb-3 bg-raasta-subtle/80 p-2.5 rounded-2xl">
          <Clock className="w-3.5 h-3.5 text-raasta-primary shrink-0 mt-0.5" />
          <span className="leading-tight text-[11px] font-medium">
            {activity.scheduleText}
          </span>
        </div>
      )}

      {/* "Why This Fits You" Grounded Explanation */}
      <div className="bg-raasta-primaryLight/40 border border-raasta-primary/20 rounded-2xl p-3.5 mb-3.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-raasta-primary mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why this fits your pathway</span>
        </div>
        <p className="text-xs text-raasta-ink leading-relaxed font-normal">
          {whyThisStep}
        </p>
      </div>

      {/* Provenance & Verification Metadata */}
      <div className="pt-3 border-t border-raasta-borderSubtle flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1 text-emerald-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate max-w-[170px] sm:max-w-[220px]">
            {activity.sourceName}
          </span>
          {activity.verificationNotes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5"
              title="Verification details"
            >
              <Info className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Link to Official Source */}
        {activity.externalActionUrl && (
          <a
            href={activity.externalActionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-raasta-primary hover:text-raasta-primaryHover transition-colors"
          >
            <span>Visit source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Pop-down verification notes if toggled */}
      {showNotes && activity.verificationNotes && (
        <div className="mt-2 p-2.5 bg-neutral-50 rounded-xl text-[10px] text-neutral-600 border border-neutral-200">
          <strong>Verification Notes:</strong> {activity.verificationNotes}
        </div>
      )}
    </div>
  );
};
