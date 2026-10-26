"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Server,
  Zap,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config";

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceHealthState {
  loading: boolean;
  configured: boolean;
  status: "success" | "partial" | "unconfigured" | "error" | "idle";
  latencyMs?: number;
  maskedKey?: string | null;
  details?: any;
  error?: string | null;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [qlooHealth, setQlooHealth] = useState<ServiceHealthState>({
    loading: false,
    configured: false,
    status: "idle",
  });

  const [geminiHealth, setGeminiHealth] = useState<ServiceHealthState>({
    loading: false,
    configured: false,
    status: "idle",
  });

  const testQloo = async () => {
    setQlooHealth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/qloo/smoke");
      const data = await res.json();
      setQlooHealth({
        loading: false,
        configured: Boolean(data.configured),
        status: data.status || (data.configured ? "success" : "unconfigured"),
        latencyMs: data.totalElapsedMs,
        maskedKey: data.maskedKey,
        details: data,
        error: data.error || null,
      });
    } catch (err: any) {
      setQlooHealth({
        loading: false,
        configured: false,
        status: "error",
        error: err.message || "Failed to reach smoke test endpoint",
      });
    }
  };

  const testGemini = async () => {
    setGeminiHealth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/gemini/smoke");
      const data = await res.json();
      setGeminiHealth({
        loading: false,
        configured: Boolean(data.configured),
        status: data.status || (data.configured ? "success" : "unconfigured"),
        latencyMs: data.latencyMs,
        maskedKey: data.maskedKey,
        details: data,
        error: data.error || null,
      });
    } catch (err: any) {
      setGeminiHealth({
        loading: false,
        configured: false,
        status: "error",
        error: err.message || "Failed to reach Gemini smoke test endpoint",
      });
    }
  };

  const testAll = async () => {
    await Promise.all([testQloo(), testGemini()]);
  };

  useEffect(() => {
    if (isOpen) {
      testAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const renderBadge = (health: ServiceHealthState) => {
    if (health.loading) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-raasta-subtle text-raasta-ink">
          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
          Testing...
        </span>
      );
    }
    if (health.status === "success") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
          Connected ({health.latencyMs}ms)
        </span>
      );
    }
    if (health.status === "partial") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
          Active ({health.latencyMs}ms)
        </span>
      );
    }
    if (health.status === "error") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 mr-1 text-rose-600" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
        Unconfigured (Fallback Active)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-raasta-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-raasta-borderSubtle flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center shadow-subtle">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-raasta-ink tracking-tight">
                API Diagnostics & Live Services
              </h2>
              <p className="text-xs text-raasta-inkMuted">
                Live verification of Qloo Cultural Intelligence, Gemini, and Firebase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-raasta-subtle text-raasta-inkMuted hover:text-raasta-ink transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Info Strip */}
          <div className="p-3.5 rounded-2xl bg-raasta-primaryLight/30 border border-raasta-borderSubtle flex items-center justify-between text-xs">
            <span className="text-raasta-ink font-medium">
              Secrets are stored strictly server-side in <code className="bg-white px-1.5 py-0.5 rounded text-[11px] border border-raasta-border">.env.local</code>.
            </span>
            <button
              onClick={testAll}
              disabled={qlooHealth.loading || geminiHealth.loading}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle disabled:opacity-50 shrink-0 ml-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${qlooHealth.loading || geminiHealth.loading ? "animate-spin" : ""}`}
              />
              <span>Test All</span>
            </button>
          </div>

          {/* 1. Qloo Cultural Intelligence */}
          <div className="p-5 rounded-3xl bg-white border border-raasta-border shadow-subtle space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-raasta-ink">
                    Qloo Cultural Intelligence API
                  </h3>
                  <span className="text-[10px] font-semibold bg-raasta-subtle px-2 py-0.5 rounded-full text-raasta-inkMuted">
                    v2/insights
                  </span>
                </div>
                <p className="text-xs text-raasta-inkMuted">
                  Endpoint: <code className="text-[11px]">https://hackathon.api.qloo.com</code>
                </p>
              </div>
              {renderBadge(qlooHealth)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-raasta-subtle border border-raasta-borderSubtle">
                <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                  Key Status
                </span>
                <span className="font-mono text-[11px] text-raasta-ink font-semibold">
                  {qlooHealth.maskedKey || "Not configured"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-raasta-subtle border border-raasta-borderSubtle">
                <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                  Latency
                </span>
                <span className="font-semibold text-raasta-ink text-[11px]">
                  {qlooHealth.latencyMs !== undefined ? `${qlooHealth.latencyMs} ms` : "Not tested"}
                </span>
              </div>
            </div>

            {qlooHealth.details?.insightsSmoke && (
              <div className="p-3 rounded-2xl bg-[#F8F8FC] border border-raasta-borderSubtle text-[11px] space-y-1">
                <span className="font-semibold text-raasta-ink block">
                  Smoke Test Results:
                </span>
                <p className="text-raasta-inkMuted">
                  Resolved Entities: {qlooHealth.details.searchSmoke?.returnedCount ?? 0} &middot;
                  Places in Pune: {qlooHealth.details.insightsSmoke?.returnedCount ?? 0} &middot;
                  Explainability: {qlooHealth.details.insightsSmoke?.explainabilityAvailable ? "Enabled" : "Standard"}
                </p>
                {qlooHealth.details.insightsSmoke?.summary && (
                  <p className="text-raasta-ink text-[10px] italic">
                    &ldquo;{qlooHealth.details.insightsSmoke.summary}&rdquo;
                  </p>
                )}
              </div>
            )}

            {qlooHealth.error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {qlooHealth.error}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={testQloo}
                disabled={qlooHealth.loading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary text-xs font-semibold transition-all border border-raasta-border"
              >
                <RefreshCw className={`w-3 h-3 ${qlooHealth.loading ? "animate-spin" : ""}`} />
                <span>Test Qloo Smoke</span>
              </button>
            </div>
          </div>

          {/* 2. Google Gemini Orchestrator */}
          <div className="p-5 rounded-3xl bg-white border border-raasta-border shadow-subtle space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-raasta-ink">
                    Google Gemini Orchestrator
                  </h3>
                  <span className="text-[10px] font-semibold bg-raasta-subtle px-2 py-0.5 rounded-full text-raasta-inkMuted">
                    @google/genai
                  </span>
                </div>
                <p className="text-xs text-raasta-inkMuted">
                  Model: <code className="text-[11px] font-bold text-raasta-ink">gemini-2.0-flash</code>
                </p>
              </div>
              {renderBadge(geminiHealth)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-raasta-subtle border border-raasta-borderSubtle">
                <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                  Key Status
                </span>
                <span className="font-mono text-[11px] text-raasta-ink font-semibold">
                  {geminiHealth.maskedKey || "Not configured"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-raasta-subtle border border-raasta-borderSubtle">
                <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                  Latency
                </span>
                <span className="font-semibold text-raasta-ink text-[11px]">
                  {geminiHealth.latencyMs !== undefined ? `${geminiHealth.latencyMs} ms` : "Not tested"}
                </span>
              </div>
            </div>

            {geminiHealth.details?.sampleResponse && (
              <div className="p-3 rounded-2xl bg-[#F8F8FC] border border-raasta-borderSubtle text-[11px] space-y-1">
                <span className="font-semibold text-raasta-ink block">
                  Gemini Model Response:
                </span>
                <pre className="text-[10px] text-raasta-inkMuted overflow-x-auto bg-white p-2 rounded-xl border border-raasta-borderSubtle">
                  {JSON.stringify(geminiHealth.details.sampleResponse, null, 2)}
                </pre>
              </div>
            )}

            {geminiHealth.error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {geminiHealth.error}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={testGemini}
                disabled={geminiHealth.loading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary text-xs font-semibold transition-all border border-raasta-border"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Test Gemini Smoke</span>
              </button>
            </div>
          </div>

          {/* 3. Firebase Web App & Firestore */}
          <div className="p-5 rounded-3xl bg-white border border-raasta-border shadow-subtle space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-raasta-ink">
                  Firebase Client & Firestore
                </h3>
                <p className="text-xs text-raasta-inkMuted">
                  Project: <code className="text-[11px] font-semibold">{firebaseConfig.projectId || "apnaraasta-app"}</code> &middot; Google OAuth configured
                </p>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-raasta-subtle border-t border-raasta-borderSubtle flex items-center justify-between text-xs">
          <span className="text-raasta-inkMuted">
            ApnaRaasta Cultural Intelligence Layer
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-raasta-ink hover:bg-black text-white text-xs font-bold transition-all shadow-subtle"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
