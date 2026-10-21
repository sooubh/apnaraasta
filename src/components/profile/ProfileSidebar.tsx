"use client";

import React from "react";
import {
  MapPin,
  Edit3,
  Bookmark,
  GitCompare,
  Wallet,
  Users,
} from "lucide-react";
import { UserProfile } from "@/lib/types/profile";
import { useAuth } from "@/lib/firebase/authContext";

interface ProfileSidebarProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onGoToSaved: () => void;
  savedCount?: number;
}

const CATEGORY_NAMES: Record<string, string> = {
  music_films: "Music & Film",
  photography_art: "Art & Photography",
  books_board_games: "Books & Board Games",
  food_experiences: "Culinary & Coffee",
  outdoor_activities: "Outdoors & Heritage",
  volunteering: "Civic & Care",
};

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  onEditProfile,
  onGoToSaved,
  savedCount = 0,
}) => {
  const { user } = useAuth();
  const hasCustomBio =
    profile.bio &&
    profile.bio.trim() !== "Curious cultural explorer in Pune" &&
    profile.bio.trim().length > 0;

  return (
    <aside className="hidden lg:block w-80 shrink-0 space-y-4 sticky top-20 self-start">
      {/* User Cultural Passport Card */}
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
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-base text-raasta-ink leading-tight">
                  {profile.displayName}
                </h3>
              </div>
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

        {/* Sync Status Badge */}
        <div className="flex items-center space-x-1.5 text-[11px] text-raasta-inkMuted bg-raasta-subtle px-3 py-1.5 rounded-xl border border-raasta-borderSubtle">
          <span className={`w-2 h-2 rounded-full ${user ? "bg-emerald-500" : "bg-amber-400"}`} />
          <span className="font-medium">
            {user ? "Cloud Synced (Google Account)" : "Preserved in this Browser"}
          </span>
        </div>

        {/* Custom Bio (Only if genuinely filled out) */}
        {hasCustomBio && (
          <p className="text-xs text-raasta-inkMuted leading-relaxed bg-raasta-subtle p-3 rounded-2xl border border-raasta-borderSubtle">
            &ldquo;{profile.bio}&rdquo;
          </p>
        )}

        {/* Cultural Passport Preferences */}
        <div className="pt-2 border-t border-raasta-borderSubtle space-y-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-raasta-inkMuted block mb-1">
              Active Interests ({profile.preferences.categories.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferences.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[11px] font-semibold bg-raasta-primaryLight text-raasta-primary px-2.5 py-0.5 rounded-full border border-raasta-border"
                >
                  {CATEGORY_NAMES[cat] || cat.replace(/_/g, " ")}
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

        {/* Quick Navigation: Saved Pathways */}
        <div className="pt-2 border-t border-raasta-borderSubtle">
          <button
            onClick={onGoToSaved}
            className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-raasta-subtle text-raasta-ink text-xs font-semibold border border-raasta-border flex items-center justify-center space-x-1.5 shadow-subtle transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-raasta-primary" />
            <span>Saved Pathways ({savedCount})</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
