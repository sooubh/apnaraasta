"use client";

import React, { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  ShieldCheck,
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
  onGoToCompare: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
  isSaved: boolean;
}

export const PathwayView: React.FC<PathwayViewProps> = ({
  pathway,
  qlooEvidence,
  method,
  onRegenerate,
  onEditPreferences,
  onSavePathway,
  onGoToCompare,
  isSaving,
  isRegenerating,
  isSaved,
}) => {
  const [currentSteps, setCurrentSteps] = useState<PathwayStep[]>(pathway.steps);
  const [currentAlternatives, setCurrentAlternatives] = useState<ActivityCardData[]>(
    pathway.alternatives || []
  );
  const [showEvidence, setShowEvidence] = useState(false);

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
      whyThisStep: `Alternative selection: ${alternativeToUse.title} offers an engaging experience in ${alternativeToUse.area || "Pune"}.`,
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
    <div className="space-y-6 pb-28">
      {/* Title & Status Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {method === "qloo" ? (
            <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-raasta-primaryLight to-[#EAE6FE] text-raasta-primary px-3 py-1 rounded-full text-xs font-bold border border-raasta-border">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Qloo Cultural Intelligence Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-bold">
              <span>Baseline Heuristic Mode</span>
            </div>
          )}

          <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>100% Sourced Pune Data</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight mb-2">
          {pathway.title}
        </h1>

        <p className="text-xs text-raasta-inkMuted leading-relaxed">
          A coherent sequence moving from an approachable starting point to shared-interest engagement and regular community belonging.
        </p>

        {/* Qloo Explainability Accordion */}
        {qlooEvidence && (
          <div className="mt-3 pt-3 border-t border-raasta-borderSubtle">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="w-full flex items-center justify-between text-xs font-semibold text-raasta-primary hover:text-raasta-primaryHover transition-colors"
            >
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>View Cultural Taste Signals & Evidence</span>
              </div>
              {showEvidence ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showEvidence && (
              <div className="mt-2.5 p-3 rounded-2xl bg-raasta-subtle text-xs text-raasta-ink space-y-2 border border-raasta-borderSubtle animate-in fade-in duration-150">
                <p className="font-medium text-[11px]">{qlooEvidence.summary}</p>

                {qlooEvidence.resolvedEntities && qlooEvidence.resolvedEntities.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider">
                      Resolved Cultural Entities:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {qlooEvidence.resolvedEntities.map((e, idx) => (
                        <span
                          key={idx}
                          className="bg-white px-2 py-0.5 rounded-full border border-raasta-border text-[11px] font-medium"
                        >
                          {e.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {qlooEvidence.contributingSignals && qlooEvidence.contributingSignals.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-raasta-inkMuted tracking-wider">
                      Contributing Taste Vectors:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {qlooEvidence.contributingSignals.map((sig, idx) => (
                        <span
                          key={idx}
                          className="bg-raasta-primaryLight text-raasta-primary px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* The 3 Ordered Step Cards */}
      <div className="space-y-4">
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
                Available Alternatives in Pune
              </h3>
              <p className="text-[11px] text-raasta-inkMuted">
                Other source-verified candidates matching your constraints.
              </p>
            </div>
            <span className="text-xs font-semibold text-raasta-primary bg-raasta-primaryLight px-2.5 py-0.5 rounded-full">
              {currentAlternatives.length} available
            </span>
          </div>

          <div className="space-y-2.5">
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
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="p-3 rounded-2xl bg-white hover:bg-neutral-50 text-raasta-ink font-bold text-xs border border-raasta-border shadow-subtle flex flex-col items-center justify-center space-y-1 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-raasta-primary ${isRegenerating ? "animate-spin" : ""}`} />
          <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
        </button>

        <button
          onClick={onEditPreferences}
          className="p-3 rounded-2xl bg-white hover:bg-neutral-50 text-raasta-ink font-bold text-xs border border-raasta-border shadow-subtle flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-raasta-primary" />
          <span>Adjust Filters</span>
        </button>

        <button
          onClick={onSavePathway}
          disabled={isSaving || isSaved}
          className={`p-3 rounded-2xl font-bold text-xs border shadow-subtle flex flex-col items-center justify-center space-y-1 transition-all ${
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
          <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save Pathway"}</span>
        </button>

        <button
          onClick={onGoToCompare}
          className="p-3 rounded-2xl bg-white hover:bg-neutral-50 text-raasta-ink font-bold text-xs border border-raasta-border shadow-subtle flex flex-col items-center justify-center space-y-1 transition-all"
        >
          <Scale className="w-4 h-4 text-raasta-primary" />
          <span>Benchmark</span>
        </button>
      </div>
    </div>
  );
};
