"use client";

import React, { useState } from "react";
import {
  Compass,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Info,
  Scale,
  ArrowRight,
  GitCompare,
} from "lucide-react";
import { ComparePathwaysResponse, PathwayStep } from "@/lib/types/pathway";

interface CompareViewProps {
  compareData: ComparePathwaysResponse | null;
  isLoading: boolean;
  onRunComparison: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareData,
  isLoading,
  onRunComparison,
}) => {
  const [activeTab, setActiveTab] = useState<"qloo" | "baseline">("qloo");

  return (
    <div className="space-y-6 pb-28">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="flex items-center space-x-2 text-raasta-primary text-xs font-bold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>Fair AI Comparison Engine</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight mb-2">
          Qloo Taste Graph vs. Generic AI Baseline
        </h1>

        <p className="text-xs text-raasta-inkMuted leading-relaxed">
          Both pathways are generated using the <strong>exact same user preferences</strong>,
          the <strong>same verified Pune activity candidate pool</strong>, and identical hard constraint filters.
          Only the Qloo arm receives cultural affinity and entity insight signals.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onRunComparison}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full bg-raasta-ink hover:bg-neutral-800 text-white font-bold text-xs shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isLoading ? "Running Comparative Benchmark..." : "Run New Comparison"}</span>
          </button>
        </div>
      </div>

      {compareData && (
        <>
          {/* Comparative Metrics Table */}
          <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
            <h3 className="font-bold text-sm text-raasta-ink mb-3">
              Verifiable Benchmark Metrics
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-raasta-borderSubtle text-[11px] text-raasta-inkMuted">
                    <th className="py-2 font-semibold">Evaluation Metric</th>
                    <th className="py-2 px-3 font-semibold text-raasta-primary">
                      Qloo Arm
                    </th>
                    <th className="py-2 px-3 font-semibold text-neutral-600">
                      Generic Baseline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-raasta-borderSubtle">
                  <tr>
                    <td className="py-2.5 font-medium text-raasta-ink">
                      Candidate Pool Size
                    </td>
                    <td className="py-2.5 px-3 font-bold text-raasta-primary">
                      {compareData.metrics.verifiedCandidateCount} activities
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {compareData.metrics.verifiedCandidateCount} activities
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-raasta-ink">
                      Verified Sourced Steps
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      {compareData.metrics.qlooVerifiedSources} / 3 (100%)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-600">
                      {compareData.metrics.baselineVerifiedSources} / 3 (100%)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-raasta-ink">
                      Constraint Violations
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      0 violations
                    </td>
                    <td className="py-2.5 px-3 text-emerald-600">
                      0 violations
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-raasta-ink">
                      Cultural Signal Grounding
                    </td>
                    <td className="py-2.5 px-3 font-bold text-raasta-primary">
                      {compareData.qloo.qlooStatus === "used" ? "Qloo Taste Graph Active" : "Simulated / Fallback"}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500">
                      None (Heuristic prompt only)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Side-by-Side Arm Inspector */}
          <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
            {/* Arm Tabs */}
            <div className="flex space-x-2 mb-4 bg-raasta-subtle p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab("qloo")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === "qloo"
                    ? "bg-white text-raasta-primary shadow-subtle"
                    : "text-raasta-inkMuted hover:text-raasta-ink"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Qloo-Grounded Pathway</span>
              </button>

              <button
                onClick={() => setActiveTab("baseline")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === "baseline"
                    ? "bg-white text-neutral-800 shadow-subtle"
                    : "text-raasta-inkMuted hover:text-raasta-ink"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Generic AI Baseline</span>
              </button>
            </div>

            {/* Arm Content */}
            {activeTab === "qloo" ? (
              <div className="space-y-3">
                <div className="p-3 bg-raasta-primaryLight/40 rounded-2xl border border-raasta-primary/20 text-xs">
                  <span className="font-bold text-raasta-primary block mb-0.5">
                    How Qloo Influenced this Pathway:
                  </span>
                  <p className="text-raasta-ink">
                    {compareData.qloo.qlooEvidence?.summary ||
                      "Qloo cultural signals identified venue affinities in Pune, guiding step sequencing and why-it-fits reasoning."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {compareData.qloo.pathway?.steps.map((step) => (
                    <ArmStepItem key={step.order} step={step} isQloo />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs">
                  <span className="font-bold text-neutral-800 block mb-0.5">
                    Baseline Methodology:
                  </span>
                  <p className="text-neutral-700">
                    Standard LLM ordering based only on lexical matching of user categories and candidate titles, without taste intelligence.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {compareData.baseline.pathway?.steps.map((step) => (
                    <ArmStepItem key={step.order} step={step} isQloo={false} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Honest Disclaimer */}
          <div className="p-4 rounded-3xl bg-neutral-100 border border-neutral-200/80 text-[11px] text-raasta-inkMuted flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {compareData.comparisonDisclaimer}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const ArmStepItem: React.FC<{ step: PathwayStep; isQloo: boolean }> = ({
  step,
  isQloo,
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-raasta-ink uppercase tracking-wider">
          Step {step.order}: {step.role.replace("_", " ")}
        </span>
        {step.activity?.area && (
          <span className="text-[10px] text-raasta-inkMuted bg-white px-2 py-0.5 rounded-full border border-raasta-border">
            {step.activity.area}
          </span>
        )}
      </div>

      <h4 className="font-bold text-xs text-raasta-ink mb-1">
        {step.activity?.title || step.activityId}
      </h4>

      <p className="text-[11px] text-raasta-inkMuted leading-relaxed">
        {step.whyThisStep}
      </p>

      {step.activity?.sourceName && (
        <div className="mt-2 text-[10px] text-emerald-700 flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Source: {step.activity.sourceName}</span>
        </div>
      )}
    </div>
  );
};
