"use client";

import React from "react";
import {
  MapPin,
  Edit3,
  Bookmark,
  GitCompare,
  Compass,
  Wallet,
  Users,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "@/lib/types/profile";

interface ProfileSidebarProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onGoToSaved: () => void;
  onGoToCompare: () => void;
  savedCount?: number;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  onEditProfile,
  onGoToSaved,
  onGoToCompare,
  savedCount = 0,
}) => {
  return (
    <aside className="hidden lg:block w-80 shrink-0 space-y-4 sticky top-20 self-start">
      {/* User Profile / Cultural Passport Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-border space-y-4">
        {/* Header with Avatar & Details */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-12 h-12 rounded-2xl object-cover border border-raasta-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-raasta-primary to-[#8A7CFA] text-white flex items-center justify-center font-bold text-lg shadow-subtle">
                {profile.displayName.charAt(0).toUpperCase() || "P"}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-raasta-ink leading-tight">
                {profile.displayName}
              </h3>
              <span className="inline-flex items-center text-xs text-raasta-inkMuted mt-0.5">
                <MapPin className="w-3 h-3 text-raasta-primary mr-1" />
                {profile.homeArea}, Pune
              </span>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            title="Edit profile & preferences"
            className="p-2 rounded-xl bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-inkMuted hover:text-raasta-primary transition-colors border border-raasta-border"
            aria-label="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Bio Snippet */}
        {profile.bio && (
          <p className="text-xs text-raasta-inkMuted leading-relaxed bg-raasta-subtle p-3 rounded-2xl border border-raasta-borderSubtle">
            &ldquo;{profile.bio}&rdquo;
          </p>
        )}

        {/* Cultural Passport Preferences Summary */}
        <div className="pt-3 border-t border-raasta-borderSubtle space-y-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-raasta-inkMuted block mb-1">
              Active Interests ({profile.preferences.categories.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferences.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[11px] font-semibold bg-raasta-primaryLight text-raasta-primary px-2.5 py-1 rounded-full border border-raasta-border"
                >
                  {cat.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-raasta-subtle p-2.5 rounded-xl border border-raasta-borderSubtle">
              <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                <Wallet className="w-3 h-3 inline mr-1 text-raasta-primary" />
                Budget
              </span>
              <span className="font-semibold text-raasta-ink text-[11px]">
                {profile.preferences.flexibleBudget
                  ? "Flexible"
                  : profile.preferences.budgetMaxInr === 0
                  ? "Free only"
                  : `≤ ₹${profile.preferences.budgetMaxInr}`}
              </span>
            </div>
            <div className="bg-raasta-subtle p-2.5 rounded-xl border border-raasta-borderSubtle">
              <span className="text-[10px] uppercase font-bold text-raasta-inkMuted block">
                <Users className="w-3 h-3 inline mr-1 text-raasta-primary" />
                Comfort
              </span>
              <span className="font-semibold text-raasta-ink text-[11px] capitalize">
                {profile.preferences.socialComfort.replace("_", " ")}
              </span>
            </div>
          </div>

          {profile.preferences.favouriteEntities &&
            profile.preferences.favouriteEntities.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-raasta-inkMuted block mb-1">
                  Taste Signals
                </span>
                <div className="flex flex-wrap gap-1">
                  {profile.preferences.favouriteEntities.map((fav) => (
                    <span
                      key={fav.name}
                      className="text-[10px] bg-white text-raasta-ink px-2 py-0.5 rounded-md border border-raasta-border"
                    >
                      {fav.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-raasta-borderSubtle flex flex-col space-y-2">
          <button
            onClick={onEditProfile}
            className="w-full py-2 px-3 rounded-xl bg-raasta-subtle hover:bg-raasta-primaryLight text-raasta-ink hover:text-raasta-primary text-xs font-semibold transition-all border border-raasta-border text-center"
          >
            Edit Profile & Preferences
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onGoToSaved}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-raasta-subtle text-raasta-ink text-[11px] font-semibold border border-raasta-border flex items-center justify-center space-x-1"
            >
              <Bookmark className="w-3.5 h-3.5 text-raasta-primary" />
              <span>Saved ({savedCount})</span>
            </button>
            <button
              onClick={onGoToCompare}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-raasta-subtle text-raasta-ink text-[11px] font-semibold border border-raasta-border flex items-center justify-center space-x-1"
            >
              <GitCompare className="w-3.5 h-3.5 text-raasta-primary" />
              <span>Benchmark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence & Data Provenance Card */}
      <div className="bg-white rounded-3xl p-4 shadow-card border border-raasta-border space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-raasta-primary font-bold text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Cultural Intelligence</span>
        </div>
        <p className="text-[11px] text-raasta-inkMuted leading-relaxed">
          Powered by real-time Qloo taste correlation and 18 source-verified Pune cultural spaces.
        </p>
      </div>
    </aside>
  );
};
