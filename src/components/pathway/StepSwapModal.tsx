"use client";

import React from "react";
import { X, ArrowRightLeft, MapPin, Tag, ShieldCheck } from "lucide-react";
import { ActivityCardData } from "@/lib/types/activity";
import { PathwayStep } from "@/lib/types/pathway";

interface StepSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If user clicked swap from a specific step card
  targetStep?: PathwayStep | null;
  // If user clicked swap from an alternative card
  selectedAlternative?: ActivityCardData | null;
  currentSteps: PathwayStep[];
  availableAlternatives: ActivityCardData[];
  onExecuteSwap: (stepOrder: 1 | 2 | 3, newActivity: ActivityCardData) => void;
}

const STEP_ROLE_LABELS: Record<string, string> = {
  approachable_start: "Step 1 · Welcoming Start",
  shared_interest: "Step 2 · Shared Interest",
  recurring_participation: "Step 3 · Community Rhythm",
};

export const StepSwapModal: React.FC<StepSwapModalProps> = ({
  isOpen,
  onClose,
  targetStep,
  selectedAlternative,
  currentSteps,
  availableAlternatives,
  onExecuteSwap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-raasta-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-raasta-border shadow-modal w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-raasta-borderSubtle flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-raasta-primaryLight text-raasta-primary flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-raasta-ink">
                {targetStep
                  ? `Choose Alternative for ${STEP_ROLE_LABELS[targetStep.role] || `Step ${targetStep.order}`}`
                  : selectedAlternative
                  ? `Place ${selectedAlternative.title}`
                  : "Swap Pathway Activity"}
              </h3>
              <p className="text-[11px] text-raasta-inkMuted">
                {targetStep
                  ? `Replacing: ${targetStep.activity?.title}`
                  : "Choose which step in your 3-step sequence to replace"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-3">
          {/* Mode A: User clicked Swap on a Step Card -> Pick an alternative */}
          {targetStep && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-raasta-inkMuted block">
                Available Verified Alternatives ({availableAlternatives.length})
              </span>

              {availableAlternatives.length === 0 ? (
                <div className="p-6 text-center text-xs text-raasta-inkMuted">
                  No other alternatives available in this candidate pool.
                </div>
              ) : (
                availableAlternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-4 rounded-2xl border border-raasta-borderSubtle bg-raasta-subtle hover:bg-white hover:border-raasta-primary/40 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <h4 className="font-bold text-xs text-raasta-ink group-hover:text-raasta-primary transition-colors">
                        {alt.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-raasta-inkMuted mt-1">
                        {alt.area && (
                          <span className="inline-flex items-center">
                            <MapPin className="w-3 h-3 mr-0.5 text-raasta-primary" />
                            {alt.area}
                          </span>
                        )}
                        <span>·</span>
                        <span>{alt.category.replace(/_/g, " ")}</span>
                        <span>·</span>
                        <span className="font-medium text-raasta-ink">
                          {alt.costStatus === "free_confirmed"
                            ? "Free"
                            : alt.priceMinInr !== undefined
                            ? `₹${alt.priceMinInr}`
                            : "Standard"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onExecuteSwap(targetStep.order, alt);
                        onClose();
                      }}
                      className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white group-hover:bg-raasta-primary group-hover:text-white text-raasta-primary border border-raasta-border shadow-subtle transition-all"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Mode B: User clicked Swap on an Alternative -> Pick which step to replace */}
          {!targetStep && selectedAlternative && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-raasta-inkMuted block">
                Select Step to Replace
              </span>

              {currentSteps.map((step) => (
                <div
                  key={step.order}
                  className="p-4 rounded-2xl border border-raasta-borderSubtle bg-raasta-subtle hover:bg-white hover:border-raasta-primary/40 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-raasta-primary block mb-0.5">
                      {STEP_ROLE_LABELS[step.role] || `Step ${step.order}`}
                    </span>
                    <h4 className="font-bold text-xs text-raasta-ink">
                      {step.activity?.title || "Active Activity"}
                    </h4>
                    <p className="text-[11px] text-raasta-inkMuted mt-0.5">
                      {step.activity?.area ? `${step.activity.area} · ` : ""}
                      {step.activity?.costStatus === "free_confirmed"
                        ? "Free"
                        : step.activity?.priceMinInr !== undefined
                        ? `₹${step.activity.priceMinInr}`
                        : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onExecuteSwap(step.order, selectedAlternative);
                      onClose();
                    }}
                    className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white group-hover:bg-raasta-primary group-hover:text-white text-raasta-primary border border-raasta-border shadow-subtle transition-all"
                  >
                    Replace Step {step.order}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-raasta-borderSubtle bg-neutral-50 flex items-center justify-between text-xs">
          <span className="text-emerald-700 font-medium inline-flex items-center text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Verified Pune Venue Pool
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
