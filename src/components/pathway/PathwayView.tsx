"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  Tag,
} from "lucide-react";
import { Pathway, PathwayStep, QlooEvidence } from "@/lib/types/pathway";
import { ActivityCardData } from "@/lib/types/activity";
import { PathwayCard } from "./PathwayCard";

interface PathwayViewProps {
  pathway: Pathway;
  qlooEvidence?: QlooEvidence;
  method: "qloo" | "baseline";
  onRegenerate: () => void;
  onEditPreferences: () => void;
  onSavePathway: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
  isSaved: boolean;
}

export const PathwayView: React.FC<PathwayViewProps> = ({
  pathway,
  qlooEvidence,
  onRegenerate,
  onEditPreferences,
  onSavePathway,
  isSaving,
  isRegenerating,
  isSaved,
}) => {
  const [currentSteps, setCurrentSteps] = useState<PathwayStep[]>(pathway.steps);
  const [currentAlternatives, setCurrentAlternatives] = useState<ActivityCardData[]>(
    pathway.alternatives || []
  );
  const [showEvidence, setShowEvidence] = useState(false);

  // Synchronize state whenever pathway prop updates (e.g. on profile change or regeneration)
  useEffect(() => {
    setCurrentSteps(pathway.steps);
    setCurrentAlternatives(pathway.alternatives || []);
  }, [pathway]);

  // Handle swapping a step with an alternative
  const handleSwap = (currentActivityId: string) => {
    if (currentAlternatives.length === 0) return;

    const stepIndex = currentSteps.findIndex((s) => s.activityId === currentActivityId);
    if (stepIndex === -1) return;

    const alternativeToUse = currentAlternatives[0];
    const currentActivity = currentSteps[stepIndex].activity;

    // Swap activity in step
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      activityId: alternativeToUse.id,
      activity: alternativeToUse,
      whyThisStep: `Alternative selection: ${alternativeToUse.title} in ${alternativeToUse.area || "Pune"}.`,
    };

    // Update alternatives list (put previous activity into alternatives, remove chosen)
    const updatedAlternatives = currentAlternatives.slice(1);
    if (currentActivity) {
      updatedAlternatives.push(currentActivity);
    }

    setCurrentSteps(updatedSteps);
    setCurrentAlternatives(updatedAlternatives);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Optional Subtle Cultural Signals Inspection */}
      {qlooEvidence && (
        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="inline-flex items-center space-x-1.5 text-raasta-inkMuted hover:text-raasta-primary transition-colors text-xs font-semibold"
          >
            <Tag className="w-3.5 h-3.5 text-raasta-primary" />
            <span>Taste Signals & Grounding</span>
            {showEvidence ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </div>
      )}

      {showEvidence && qlooEvidence && (
        <div className="p-4 rounded-2xl bg-white border border-raasta-border text-xs text-raasta-ink space-y-2.5 shadow-subtle animate-in fade-in duration-150">
          <p className="font-medium text-xs leading-relaxed text-raasta-inkMuted">
            {qlooEvidence.summary}
          </p>

          {qlooEvidence.resolvedEntities && qlooEvidence.resolvedEntities.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider">
                Resolved Taste Entities:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {qlooEvidence.resolvedEntities.map((e, idx) => (
                  <span
                    key={idx}
                    className="bg-raasta-subtle px-2.5 py-0.5 rounded-full border border-raasta-border text-[11px] font-medium"
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* The 3 Ordered Big-Image Step Cards */}
      <div className="space-y-5">
        {currentSteps.map((step) => {
          if (!step.activity) return null;
          return (
            <PathwayCard
              key={step.order}
              order={step.order}
              role={step.role}
              activity={step.activity}
              whyThisStep={step.whyThisStep}
              onSwap={handleSwap}
              hasAlternatives={currentAlternatives.length > 0}
            />
          );
        })}
      </div>

      {/* Alternative Options Section */}
      {currentAlternatives.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-raasta-ink">
                Other Matching Pune Places
              </h3>
              <p className="text-[11px] text-raasta-inkMuted">
                Swap any step above with these verified alternatives.
              </p>
            </div>
            <span className="text-xs font-semibold text-raasta-primary bg-raasta-primaryLight px-2.5 py-0.5 rounded-full">
              {currentAlternatives.length} available
            </span>
          </div>

          <div className="space-y-2">
            {currentAlternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle flex items-center justify-between"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="font-bold text-xs text-raasta-ink truncate">
                    {alt.title}
                  </h4>
                  <p className="text-[10px] text-raasta-inkMuted truncate">
                    {alt.area ? `${alt.area} · ` : ""}
                    {alt.sourceName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSwap(currentSteps[0].activityId)}
                  className="shrink-0 text-xs font-bold text-raasta-primary hover:text-raasta-primaryHover bg-white px-3 py-1.5 rounded-full border border-raasta-border shadow-subtle transition-all"
                >
                  Swap in
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="p-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-raasta-ink font-bold text-xs border border-raasta-border shadow-subtle flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-raasta-primary ${isRegenerating ? "animate-spin" : ""}`} />
          <span>{isRegenerating ? "Curating..." : "Regenerate Pathway"}</span>
        </button>

        <button
          onClick={onEditPreferences}
          className="p-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-raasta-ink font-bold text-xs border border-raasta-border shadow-subtle flex items-center justify-center space-x-2 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-raasta-primary" />
          <span>Edit Preferences</span>
        </button>

        <button
          onClick={onSavePathway}
          disabled={isSaving || isSaved}
          className={`p-3.5 rounded-2xl font-bold text-xs border shadow-subtle flex items-center justify-center space-x-2 transition-all ${
            isSaved
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-white hover:bg-neutral-50 text-raasta-ink border-raasta-border"
          }`}
        >
          {isSaved ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Bookmark className="w-4 h-4 text-raasta-primary" />
          )}
          <span>{isSaving ? "Saved" : isSaved ? "Saved to Profile" : "Save Pathway"}</span>
        </button>
      </div>
    </div>
  );
};
