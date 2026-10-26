"use client";

import React from "react";
import {
  MapPin,
  Edit3,
  Bookmark,
  Wallet,
  Users,
  Clock,
  ShieldCheck,
  LogIn,
  LogOut,
  Compass,
  CheckCircle2,
  Calendar,
  Activity,
  Server,
} from "lucide-react";
import { UserProfile } from "@/lib/types/profile";
import { useAuth } from "@/lib/firebase/authContext";

interface ProfileViewProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onGoToSaved: () => void;
  onOpenAuthModal?: () => void;
  onOpenApiHealth?: () => void;
  savedCount?: number;
}

const CATEGORY_DETAILS: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  music_films: {
    label: "Music & Film",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  photography_art: {
    label: "Art & Photography",
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
  },
  books_board_games: {
    label: "Books & Board Games",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  food_experiences: {
    label: "Culinary & Coffee",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  outdoor_activities: {
    label: "Outdoors & Heritage",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  volunteering: {
    label: "Civic & Care",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
  },
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onEditProfile,
  onGoToSaved,
  onOpenAuthModal,
  onOpenApiHealth,
  savedCount = 0,
}) => {
  const { user, signOutUser } = useAuth();

  const hasCustomBio =
    profile.bio &&
    profile.bio.trim() !== "Curious cultural explorer in Pune" &&
    profile.bio.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Cultural Passport Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-16 h-16 rounded-3xl object-cover border-2 border-raasta-primary/20 shadow-subtle"
              />
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-raasta-primary to-[#8A7CFA] text-white flex items-center justify-center font-bold text-2xl shadow-subtle">
                {profile.displayName.charAt(0).toUpperCase() || "P"}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
                  {profile.displayName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-raasta-primaryLight text-raasta-primary border border-raasta-border">
                  Pune Passport
                </span>
              </div>
              <span className="inline-flex items-center text-xs text-raasta-inkMuted mt-1">
                <MapPin className="w-3.5 h-3.5 text-raasta-primary mr-1" />
                {profile.homeArea}, Pune
              </span>
              {profile.email && (
                <span className="block text-[11px] text-raasta-inkMuted mt-0.5">
                  {profile.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onEditProfile}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary text-xs font-bold transition-all border border-raasta-border"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            {user ? (
              <button
                onClick={() => signOutUser()}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white hover:bg-rose-50 text-raasta-inkMuted hover:text-rose-600 text-xs font-semibold transition-all border border-raasta-border"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in with Google</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${user ? "bg-emerald-500" : "bg-amber-400"}`}
            />
            <span className="font-semibold text-raasta-ink">
              {user ? "Cloud Synced to Google Account" : "Preserved in this Browser (Guest Mode)"}
            </span>
          </div>
          {!user && onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="text-xs font-bold text-raasta-primary hover:underline inline-flex items-center"
            >
              <span>Sync with Google Account &rarr;</span>
            </button>
          )}
        </div>

        {/* Custom Bio */}
        {hasCustomBio && (
          <div className="p-4 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle">
            <span className="text-[10px] uppercase font-bold tracking-wider text-raasta-inkMuted block mb-1">
              Cultural Bio
            </span>
            <p className="text-xs sm:text-sm text-raasta-ink leading-relaxed">
              &ldquo;{profile.bio}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selected Interests Card */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-raasta-ink flex items-center space-x-2">
              <Compass className="w-4 h-4 text-raasta-primary" />
              <span>Cultural Interests ({profile.preferences.categories.length})</span>
            </h3>
            <button
              onClick={onEditProfile}
              className="text-[11px] font-semibold text-raasta-primary hover:underline"
            >
              Modify
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.preferences.categories.map((cat) => {
              const meta = CATEGORY_DETAILS[cat] || {
                label: cat.replace(/_/g, " "),
                bg: "bg-raasta-primaryLight",
                text: "text-raasta-primary",
                border: "border-raasta-border",
              };
              return (
                <span
                  key={cat}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${meta.bg} ${meta.text} ${meta.border}`}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Practical Rhythms & Budget */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-raasta-ink flex items-center space-x-2">
              <Clock className="w-4 h-4 text-raasta-primary" />
              <span>Rhythm & Budget</span>
            </h3>
            <button
              onClick={onEditProfile}
              className="text-[11px] font-semibold text-raasta-primary hover:underline"
            >
              Modify
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle">
              <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                <Wallet className="w-3 h-3 inline mr-1 text-raasta-primary" />
                Budget Ceiling
              </span>
              <span className="font-bold text-raasta-ink mt-0.5 block text-xs">
                {profile.preferences.flexibleBudget
                  ? "Flexible"
                  : profile.preferences.budgetMaxInr === 0
                  ? "Free only (₹0)"
                  : `≤ ₹${profile.preferences.budgetMaxInr}`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-raasta-subtle border border-raasta-borderSubtle">
              <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                <Users className="w-3 h-3 inline mr-1 text-raasta-primary" />
                Social Comfort
              </span>
              <span className="font-bold text-raasta-ink mt-0.5 block text-xs capitalize">
                {profile.preferences.socialComfort.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Taste Signals (Qloo Affinity) */}
      {profile.preferences.favouriteEntities &&
        profile.preferences.favouriteEntities.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-raasta-ink">
                  Taste Signals (Qloo Cultural Affinity)
                </h3>
                <p className="text-[11px] text-raasta-inkMuted mt-0.5">
                  Creators, authors, and filmmakers that seed your Pune place recommendations.
                </p>
              </div>
              <button
                onClick={onEditProfile}
                className="text-[11px] font-semibold text-raasta-primary hover:underline"
              >
                Add more
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.preferences.favouriteEntities.map((fav) => (
                <span
                  key={fav.name}
                  className="text-xs font-medium bg-raasta-subtle text-raasta-ink px-3 py-1 rounded-full border border-raasta-border"
                >
                  {fav.name}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Saved Pathways Affordance */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-raasta-ink">
              Your Saved Pathways ({savedCount})
            </h4>
            <p className="text-xs text-raasta-inkMuted mt-0.5">
              Review and revisit your curated 3-step community pathways.
            </p>
          </div>
        </div>
        <button
          onClick={onGoToSaved}
          className="px-5 py-2.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle shrink-0"
        >
          View Saved Pathways
        </button>
      </div>

      {/* Live Services & API Diagnostics Affordance */}
      {onOpenApiHealth && (
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_16px_rgba(27,25,49,0.04)] border border-[#E8E7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-raasta-subtle text-raasta-primary flex items-center justify-center shrink-0 border border-raasta-border">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-raasta-ink">
                Live Service & API Diagnostics
              </h4>
              <p className="text-xs text-raasta-inkMuted mt-0.5">
                Verify live connectivity to Qloo Cultural Intelligence, Gemini Orchestrator, and Firebase.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenApiHealth}
            className="px-5 py-2.5 rounded-full bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary border border-raasta-border text-xs font-bold transition-all shadow-subtle shrink-0 flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-raasta-primary" />
            <span>Open Diagnostics</span>
          </button>
        </div>
      )}
    </div>
  );
};
