"use client";

import React, { useState, useEffect } from "react";
import {
  Bookmark,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/authContext";
import { getUserPathways, deleteUserPathway } from "@/lib/firebase/savedPathways";
import { SavedPathwayDoc } from "@/lib/types/pathway";

interface SavedPathwaysViewProps {
  onOpenAuthModal: () => void;
  onSelectPathway?: (saved: SavedPathwayDoc) => void;
}

export const SavedPathwaysView: React.FC<SavedPathwaysViewProps> = ({
  onOpenAuthModal,
  onSelectPathway,
}) => {
  const { user, isConfigured } = useAuth();
  const [pathways, setPathways] = useState<SavedPathwayDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPathways(user.uid);
    } else {
      setPathways([]);
    }
  }, [user]);

  const loadPathways = async (uid: string) => {
    try {
      setLoading(true);
      const docs = await getUserPathways(uid);
      setPathways(docs);
      setLoading(false);
    } catch (err) {
      console.warn("Failed to load pathways:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setDeletingId(id);
      await deleteUserPathway(user.uid, id);
      setPathways((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
    } catch (err) {
      console.warn("Failed to delete pathway:", err);
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-card border border-raasta-borderSubtle text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-raasta-primaryLight text-raasta-primary mx-auto flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-raasta-ink">
          Sign In to Access Your Saved Pathways
        </h2>

        <p className="text-xs text-raasta-inkMuted max-w-sm mx-auto leading-relaxed">
          Google authentication enables private, owner-scoped saving of your curated 3-step cultural journeys and Pune activity history.
        </p>

        <button
          onClick={onOpenAuthModal}
          className="px-6 py-3 rounded-full bg-raasta-ink hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
        >
          <User className="w-4 h-4" />
          <span>Sign In with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="flex items-center space-x-2 text-raasta-primary text-xs font-bold uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4" />
          <span>Saved History</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight mb-1">
          Your Curated Pathways
        </h1>

        <p className="text-xs text-raasta-inkMuted">
          Saved under your Google account ({user.email}). Strictly private to you.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-raasta-inkMuted">
          Loading your saved pathways...
        </div>
      ) : pathways.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 shadow-card border border-raasta-borderSubtle text-center space-y-3">
          <Bookmark className="w-8 h-8 text-raasta-inkMuted/60 mx-auto" />
          <h3 className="font-bold text-sm text-raasta-ink">No saved pathways yet</h3>
          <p className="text-xs text-raasta-inkMuted">
            Explore cultural activities on the Discover tab and bookmark your favorite pathways!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pathways.map((saved) => (
            <div
              key={saved.id}
              className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-raasta-inkMuted">
                  <Calendar className="w-3 h-3 text-raasta-primary" />
                  <span>{new Date(saved.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-raasta-primaryLight text-raasta-primary">
                    {saved.method === "qloo" ? "Qloo Grounded" : "Baseline"}
                  </span>
                  <button
                    onClick={() => handleDelete(saved.id)}
                    disabled={deletingId === saved.id}
                    className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                    title="Delete saved pathway"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-raasta-ink">
                {saved.title}
              </h3>

              {/* Steps preview */}
              <div className="space-y-2 pt-1 border-t border-raasta-borderSubtle">
                {saved.steps.map((st) => (
                  <div
                    key={st.order}
                    className="p-2.5 rounded-2xl bg-raasta-subtle flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[11px] text-raasta-primary block">
                        Step {st.order}: {st.activity?.title || st.activityId}
                      </span>
                      <p className="text-[10px] text-raasta-inkMuted line-clamp-1">
                        {st.whyThisStep}
                      </p>
                    </div>
                    {st.activity?.externalActionUrl && (
                      <a
                        href={st.activity.externalActionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-raasta-primary hover:text-raasta-primaryHover ml-2 shrink-0 p-1"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-emerald-700 flex items-center space-x-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{saved.sourceStatusSummary}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
