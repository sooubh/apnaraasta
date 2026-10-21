"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Save,
  Check,
  Plus,
  Compass,
  Wallet,
  Users,
  Film,
  Camera,
  BookOpen,
  Utensils,
  HeartHandshake,
} from "lucide-react";
import {
  APPROVED_CATEGORIES,
  PUNE_AREAS,
  DAYS_OF_WEEK,
  TIME_WINDOWS,
  SOCIAL_COMFORT_OPTIONS,
} from "@/lib/constants";
import {
  ActivityCategory,
  DayOfWeek,
  SocialComfort,
  TimeWindow,
  UserPreferences,
} from "@/lib/types/pathway";
import { UserProfile, ProfileUpdateInput } from "@/lib/types/profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updates: ProfileUpdateInput) => Promise<void>;
}

const CATEGORY_ICONS: Record<ActivityCategory, React.ElementType> = {
  music_films: Film,
  photography_art: Camera,
  books_board_games: BookOpen,
  food_experiences: Utensils,
  outdoor_activities: Compass,
  volunteering: HeartHandshake,
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [homeArea, setHomeArea] = useState(profile.homeArea);
  const [bio, setBio] = useState(profile.bio || "");
  const [categories, setCategories] = useState<ActivityCategory[]>(
    profile.preferences.categories
  );
  const [budgetType, setBudgetType] = useState<"flexible" | "free" | "300" | "600">(
    profile.preferences.flexibleBudget
      ? "flexible"
      : profile.preferences.budgetMaxInr === 0
      ? "free"
      : profile.preferences.budgetMaxInr === 300
      ? "300"
      : profile.preferences.budgetMaxInr === 600
      ? "600"
      : "flexible"
  );
  const [socialComfort, setSocialComfort] = useState<SocialComfort>(
    profile.preferences.socialComfort
  );
  const [favouriteInput, setFavouriteInput] = useState("");
  const [favouriteList, setFavouriteList] = useState<string[]>(
    profile.preferences.favouriteEntities?.map((f) => f.name) || []
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: ActivityCategory) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  const addFavourite = () => {
    const trimmed = favouriteInput.trim();
    if (trimmed && !favouriteList.includes(trimmed) && favouriteList.length < 5) {
      setFavouriteList([...favouriteList, trimmed]);
      setFavouriteInput("");
    }
  };

  const removeFavourite = (name: string) => {
    setFavouriteList(favouriteList.filter((f) => f !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPreferences: Partial<UserPreferences> = {
      city: "Pune",
      areas: [homeArea],
      categories,
      flexibleBudget: budgetType === "flexible",
      budgetMinInr: 0,
      budgetMaxInr:
        budgetType === "free"
          ? 0
          : budgetType === "300"
          ? 300
          : budgetType === "600"
          ? 600
          : undefined,
      socialComfort,
      favouriteEntities: favouriteList.map((name) => ({ name })),
    };

    try {
      await onSave({
        displayName: displayName.trim() || profile.displayName,
        homeArea,
        bio: bio.trim(),
        preferences: updatedPreferences,
      });
      onClose();
    } catch (err) {
      console.warn("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-raasta-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-floating border border-raasta-border overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-raasta-borderSubtle flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-raasta-ink">
              Edit Profile & Cultural Passport
            </h3>
            <p className="text-xs text-raasta-inkMuted">
              Update your Pune neighborhood, interests, or comfort level.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-raasta-inkMuted hover:bg-raasta-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Display Name & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                Primary Neighborhood
              </label>
              <select
                value={homeArea}
                onChange={(e) => setHomeArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
              >
                {PUNE_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
              Cultural Bio
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Exploring indie films, quiet cafes, and photography walks."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
              Cultural Interests
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APPROVED_CATEGORIES.map((cat) => {
                const isSelected = categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-raasta-primary text-white border-raasta-primary"
                        : "bg-raasta-subtle text-raasta-ink border-raasta-border hover:border-raasta-primary/40"
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Social Comfort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 inline mr-1 text-raasta-primary" />
                Budget Ceiling
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "flexible", label: "Flexible" },
                  { id: "free", label: "Free (₹0)" },
                  { id: "300", label: "≤ ₹300" },
                  { id: "600", label: "≤ ₹600" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudgetType(b.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      budgetType === b.id
                        ? "bg-raasta-ink text-white border-raasta-ink"
                        : "bg-raasta-subtle text-raasta-ink border-raasta-border"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 inline mr-1 text-raasta-primary" />
                Social Comfort
              </label>
              <select
                value={socialComfort}
                onChange={(e) => setSocialComfort(e.target.value as SocialComfort)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary capitalize"
              >
                {SOCIAL_COMFORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Taste Signals */}
          <div>
            <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
              Favorite Authors / Creators (Qloo Signals)
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={favouriteInput}
                onChange={(e) => setFavouriteInput(e.target.value)}
                placeholder="Add author, filmmaker, artist..."
                className="flex-1 px-3 py-2 rounded-xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
              />
              <button
                type="button"
                onClick={addFavourite}
                disabled={!favouriteInput.trim() || favouriteList.length >= 5}
                className="px-3 py-2 rounded-xl bg-raasta-ink text-white text-xs font-semibold disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {favouriteList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {favouriteList.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center text-xs bg-raasta-subtle text-raasta-ink px-2.5 py-0.5 rounded-full border border-raasta-border"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFavourite(f)}
                      className="ml-1 text-raasta-inkMuted hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-raasta-borderSubtle flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-raasta-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
