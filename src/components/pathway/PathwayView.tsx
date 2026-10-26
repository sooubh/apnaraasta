"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Compass,
  ShieldCheck,
  MapPin,
  ArrowRightLeft,
} from "lucide-react";
import { Pathway, PathwayStep, QlooEvidence } from "@/lib/types/pathway";
import { ActivityCardData } from "@/lib/types/activity";
import { PathwayCard } from "./PathwayCard";
import { StepSwapModal } from "./StepSwapModal";

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

  // Modal swap states
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [targetStep, setTargetStep] = useState<PathwayStep | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<ActivityCardData | null>(null);

  // Synchronize state whenever pathway prop updates (e.g. on profile change or regeneration)
  useEffect(() => {
    setCurrentSteps(pathway.steps);
    setCurrentAlternatives(pathway.alternatives || []);
  }, [pathway]);

  // Compute executive metrics for summary bar
  const calculatedCostText = useMemo(() => {
    let minTotal = 0;
    let maxTotal = 0;
    let hasPaid = false;

    currentSteps.forEach((step) => {
      const act = step.activity;
      if (!act) return;
      if (act.costStatus === "free_confirmed") return;
      if (act.priceMinInr !== undefined) {
        hasPaid = true;
        minTotal += act.priceMinInr;
        maxTotal += act.priceMaxInr || act.priceMinInr;
      }
    });

    if (!hasPaid) return "100% Free Entry";
    if (minTotal === maxTotal) return `₹${minTotal} total`;
    return `₹${minTotal} – ₹${maxTotal} total`;
  }, [currentSteps]);

  const uniqueAreasText = useMemo(() => {
    const areas = currentSteps
      .map((s) => s.activity?.area)
      .filter((a): a is string => Boolean(a));
    const unique = Array.from(new Set(areas));
    if (unique.length === 0) return "Pune Wide";
    if (unique.length === 1) return unique[0];
    return unique.slice(0, 2).join(" & ");
  }, [currentSteps]);

  // Open swap modal targeting a specific step
  const handleOpenSwapModalForStep = (order: 1 | 2 | 3) => {
    const step = currentSteps.find((s) => s.order === order);
    if (!step) return;
    setTargetStep(step);
    setSelectedAlternative(null);
    setIsSwapModalOpen(true);
  };

  // Open swap modal targeting a specific alternative
  const handleOpenSwapModalForAlt = (alt: ActivityCardData) => {
    setSelectedAlternative(alt);
    setTargetStep(null);
    setIsSwapModalOpen(true);
  };

  // Execute swap with grounded role-specific rationale
  const handleExecuteSwap = (stepOrder: 1 | 2 | 3, newActivity: ActivityCardData) => {
    const stepIndex = currentSteps.findIndex((s) => s.order === stepOrder);
    if (stepIndex === -1) return;

    const oldActivity = currentSteps[stepIndex].activity;
    const role = currentSteps[stepIndex].role;

    let dynamicRationale = "";
    const locality = newActivity.area ? `in ${newActivity.area}` : "in Pune";

    if (role === "approachable_start") {
      dynamicRationale = `Start your journey ${locality} at ${newActivity.title}. `;
      if (newActivity.costStatus === "free_confirmed") {
        dynamicRationale += "It is completely free and unpretentious—an easy, welcoming setting to drop by without pressure.";
      } else {
        dynamicRationale += "It offers a quiet, relaxed atmosphere designed for newcomers to settle in comfortably.";
      }
    } else if (role === "shared_interest") {
      dynamicRationale = `Step deeper into Pune's creative community at ${newActivity.title}. Conversations happen naturally around a focused shared activity ${locality}.`;
    } else {
      dynamicRationale = `Build a lasting weekly habit with ${newActivity.title}. A reliable, welcoming recurring circle ${locality} to turn familiar faces into regular friends.`;
    }

    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      activityId: newActivity.id,
      activity: newActivity,
      whyThisStep: dynamicRationale,
    };

    // Remove newActivity from alternatives, add oldActivity if present
    const updatedAlternatives = currentAlternatives.filter((a) => a.id !== newActivity.id);
    if (oldActivity && !updatedAlternatives.some((a) => a.id === oldActivity.id)) {
      updatedAlternatives.push(oldActivity);
    }

    setCurrentSteps(updatedSteps);
    setCurrentAlternatives(updatedAlternatives);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* EXECUTIVE PATHWAY ARCHITECTURE SUMMARY STRIP */}
      <div className="bg-white rounded-3xl p-5 border border-raasta-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-raasta-primary block">
              Curated Cultural Sequence
            </span>
            <h3 className="font-bold text-sm text-raasta-ink leading-tight">
              {pathway.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-2 md:pt-0 border-t md:border-t-0 border-raasta-borderSubtle">
          {/* Estimated Outlay */}
          <div className="bg-raasta-subtle px-3 py-1.5 rounded-xl border border-raasta-borderSubtle">
            <span className="text-[10px] text-raasta-inkMuted block font-medium">Est. Outlay</span>
            <span className="font-bold text-xs text-raasta-ink">{calculatedCostText}</span>
          </div>

          {/* Social Arc */}
          <div className="bg-raasta-subtle px-3 py-1.5 rounded-xl border border-raasta-borderSubtle">
            <span className="text-[10px] text-raasta-inkMuted block font-medium">Social Arc</span>
            <span className="font-bold text-xs text-raasta-ink">3-Stage Welcoming Pace</span>
          </div>

          {/* Locality Footprint */}
          <div className="bg-raasta-subtle px-3 py-1.5 rounded-xl border border-raasta-borderSubtle">
            <span className="text-[10px] text-raasta-inkMuted block font-medium">Neighborhoods</span>
            <span className="font-bold text-xs text-raasta-ink">{uniqueAreasText}</span>
          </div>

          {/* Verified Badge */}
          <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-xs">Verified 3 of 3</span>
          </div>
        </div>
      </div>

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
              onSwap={(_id, order) => handleOpenSwapModalForStep(order)}
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
                className="p-3.5 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle flex items-center justify-between hover:bg-white transition-all"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="font-bold text-xs text-raasta-ink truncate">
                    {alt.title}
                  </h4>
                  <p className="text-[11px] text-raasta-inkMuted truncate mt-0.5">
                    {alt.area ? `${alt.area} · ` : ""}
                    {alt.category.replace(/_/g, " ")} · {alt.costStatus === "free_confirmed" ? "Free" : alt.priceMinInr ? `₹${alt.priceMinInr}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenSwapModalForAlt(alt)}
                  className="shrink-0 text-xs font-bold text-raasta-primary hover:text-raasta-primaryHover bg-white px-3.5 py-1.5 rounded-full border border-raasta-border shadow-subtle transition-all flex items-center space-x-1"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Swap in</span>
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

      {/* Interactive Step Swap Modal */}
      <StepSwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        targetStep={targetStep}
        selectedAlternative={selectedAlternative}
        currentSteps={currentSteps}
        availableAlternatives={currentAlternatives}
        onExecuteSwap={handleExecuteSwap}
      />
    </div>
  );
};
