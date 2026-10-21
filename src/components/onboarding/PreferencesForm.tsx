"use client";

import React, { useState } from "react";
import {
  Film,
  Camera,
  BookOpen,
  Utensils,
  Compass,
  HeartHandshake,
  MapPin,
  Plus,
  X,
  Sparkles,
  Navigation,
  Check,
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

interface PreferencesFormProps {
  initialPreferences?: UserPreferences;
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

const CATEGORY_ICONS: Record<ActivityCategory, React.ElementType> = {
  music_films: Film,
  photography_art: Camera,
  books_board_games: BookOpen,
  food_experiences: Utensils,
  outdoor_activities: Compass,
  volunteering: HeartHandshake,
};

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialPreferences,
  onSubmit,
  isLoading,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategory[]>(
    initialPreferences?.categories || ["music_films", "photography_art"]
  );

  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    initialPreferences?.areas || []
  );

  const [budgetType, setBudgetType] = useState<"flexible" | "free" | "300" | "600" | "1000">(
    initialPreferences?.flexibleBudget
      ? "flexible"
      : initialPreferences?.budgetMaxInr === 0
      ? "free"
      : initialPreferences?.budgetMaxInr === 300
      ? "300"
      : initialPreferences?.budgetMaxInr === 600
      ? "600"
      : "flexible"
  );

  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialPreferences?.days || ["sat", "sun"]
  );

  const [selectedTimes, setSelectedTimes] = useState<TimeWindow[]>(
    initialPreferences?.timeWindows || ["morning", "afternoon"]
  );

  const [selectedSocial, setSelectedSocial] = useState<SocialComfort>(
    initialPreferences?.socialComfort || "balanced"
  );

  const [favouriteInput, setFavouriteInput] = useState("");
  const [favouriteList, setFavouriteList] = useState<string[]>(
    initialPreferences?.favouriteEntities.map((f) => f.name) || []
  );

  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNote, setGeoNote] = useState<string | null>(null);

  // Category toggle
  const toggleCategory = (cat: ActivityCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  // Area toggle
  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Add favourite cultural entity
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

  // Optional Geolocation helper
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoNote("Location is not supported on this device. Please pick your area below.");
      return;
    }
    setGeoLocating(true);
    setGeoNote(null);
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeoLocating(false);
        setGeoNote("Location verified in Pune. Select your closest preferred neighborhoods.");
      },
      () => {
        setGeoLocating(false);
        setGeoNote("Location permission was skipped. Manual neighborhood selection is active.");
      },
      { timeout: 6000 }
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let budgetMaxInr: number | undefined = undefined;
    let flexibleBudget = true;

    if (budgetType === "free") {
      budgetMaxInr = 0;
      flexibleBudget = false;
    } else if (budgetType === "300") {
      budgetMaxInr = 300;
      flexibleBudget = false;
    } else if (budgetType === "600") {
      budgetMaxInr = 600;
      flexibleBudget = false;
    } else if (budgetType === "1000") {
      budgetMaxInr = 1000;
      flexibleBudget = false;
    }

    const preferences: UserPreferences = {
      city: "Pune",
      areas: selectedAreas,
      budgetMaxInr,
      flexibleBudget,
      days: selectedDays,
      timeWindows: selectedTimes,
      socialComfort: selectedSocial,
      categories: selectedCategories,
      favouriteEntities: favouriteList.map((name) => ({ name })),
    };

    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* 1. Category Selection */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-raasta-primary">
            Step 1 · Cultural Interests
          </span>
          <h2 className="text-base font-bold text-raasta-ink mt-0.5">
            What sparks your curiosity?
          </h2>
          <p className="text-xs text-raasta-inkMuted">
            Select one or more cultural spaces to explore in Pune.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {APPROVED_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`p-3 rounded-2xl flex flex-col items-start text-left transition-all border ${
                  isSelected
                    ? "bg-raasta-ink text-white border-raasta-ink shadow-sm"
                    : "bg-raasta-subtle hover:bg-neutral-100 text-raasta-ink border-transparent"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white text-raasta-primary shadow-subtle"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">{cat.label}</span>
                <span
                  className={`text-[10px] mt-1 line-clamp-1 ${
                    isSelected ? "text-neutral-300" : "text-raasta-inkMuted"
                  }`}
                >
                  {cat.shortDesc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Optional favourite taste signals */}
        <div className="mt-4 pt-4 border-t border-raasta-borderSubtle">
          <label className="block text-xs font-semibold text-raasta-ink mb-1">
            Favourite artists, films, or authors (optional)
          </label>
          <p className="text-[11px] text-raasta-inkMuted mb-2">
            Qloo uses these taste signals to match related cultural spots.
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={favouriteInput}
              onChange={(e) => setFavouriteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFavourite();
                }
              }}
              placeholder="e.g. Radiohead, Murakami, Satyajit Ray"
              maxLength={60}
              className="flex-1 bg-raasta-subtle border border-raasta-border text-xs rounded-2xl px-3 py-2 text-raasta-ink placeholder-raasta-inkMuted/70 focus:outline-none focus:border-raasta-primary"
            />
            <button
              type="button"
              onClick={addFavourite}
              disabled={!favouriteInput.trim() || favouriteList.length >= 5}
              className="px-3 py-2 rounded-2xl bg-white border border-raasta-border text-xs font-semibold text-raasta-ink hover:bg-neutral-50 shadow-subtle disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {favouriteList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {favouriteList.map((fav) => (
                <span
                  key={fav}
                  className="inline-flex items-center space-x-1 bg-raasta-primaryLight text-raasta-primary text-xs font-medium px-2.5 py-1 rounded-full border border-raasta-border"
                >
                  <span>{fav}</span>
                  <button
                    type="button"
                    onClick={() => removeFavourite(fav)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Pune Area Selection & Budget Constraints */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-raasta-primary">
            Step 2 · Area & Budget Constraints
          </span>
          <h2 className="text-base font-bold text-raasta-ink mt-0.5">
            Neighborhoods & Spending
          </h2>
          <p className="text-xs text-raasta-inkMuted">
            Where in Pune are you looking to participate?
          </p>
        </div>

        {/* Pune Localities */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-raasta-ink">
              Preferred Pune Localities
            </span>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLocating}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-raasta-primary hover:underline"
            >
              <Navigation className="w-3 h-3" />
              <span>{geoLocating ? "Checking..." : "Optional GPS"}</span>
            </button>
          </div>

          {geoNote && (
            <p className="text-[11px] text-raasta-inkMuted bg-raasta-subtle p-2 rounded-xl mb-2">
              {geoNote}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedAreas([])}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedAreas.length === 0
                  ? "bg-raasta-ink text-white shadow-sm"
                  : "bg-raasta-subtle text-raasta-inkMuted hover:bg-neutral-100"
              }`}
            >
              All Pune
            </button>
            {PUNE_AREAS.map((area) => {
              const isSelected = selectedAreas.includes(area);
              return (
                <button
                  type="button"
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-raasta-ink text-white shadow-sm"
                      : "bg-raasta-subtle text-raasta-ink hover:bg-neutral-100"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Ceiling */}
        <div className="pt-3 border-t border-raasta-borderSubtle">
          <label className="block text-xs font-semibold text-raasta-ink mb-2">
            Activity Cost Preference
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: "flexible", label: "Any Budget", desc: "Show all" },
              { id: "free", label: "Free Only", desc: "₹0 confirmed" },
              { id: "300", label: "Under ₹300", desc: "Low cost" },
              { id: "600", label: "Under ₹600", desc: "Moderate" },
            ].map((b) => (
              <button
                type="button"
                key={b.id}
                onClick={() => setBudgetType(b.id as any)}
                className={`p-2.5 rounded-2xl text-left border transition-all ${
                  budgetType === b.id
                    ? "bg-raasta-ink text-white border-raasta-ink shadow-sm"
                    : "bg-raasta-subtle border-transparent text-raasta-ink hover:bg-neutral-100"
                }`}
              >
                <div className="text-xs font-bold">{b.label}</div>
                <div
                  className={`text-[10px] ${
                    budgetType === b.id ? "text-neutral-300" : "text-raasta-inkMuted"
                  }`}
                >
                  {b.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Rhythm & Social Comfort */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-raasta-borderSubtle">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-raasta-primary">
            Step 3 · Rhythm & Social Comfort
          </span>
          <h2 className="text-base font-bold text-raasta-ink mt-0.5">
            Availability & Pace
          </h2>
          <p className="text-xs text-raasta-inkMuted">
            Tailor the pathway to your weekly routine and social energy.
          </p>
        </div>

        {/* Days available */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-raasta-ink mb-2">
            Available Days
          </label>
          <div className="flex space-x-1.5">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day.id);
              return (
                <button
                  type="button"
                  key={day.id}
                  onClick={() =>
                    setSelectedDays((prev) =>
                      prev.includes(day.id)
                        ? prev.length > 1
                          ? prev.filter((d) => d !== day.id)
                          : prev
                        : [...prev, day.id]
                    )
                  }
                  className={`w-9 h-9 rounded-2xl text-xs font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-raasta-ink text-white shadow-sm"
                      : "bg-raasta-subtle text-raasta-ink hover:bg-neutral-100"
                  }`}
                >
                  {day.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time windows */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-raasta-ink mb-2">
            Preferred Times
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_WINDOWS.map((time) => {
              const isSelected = selectedTimes.includes(time.id);
              return (
                <button
                  type="button"
                  key={time.id}
                  onClick={() =>
                    setSelectedTimes((prev) =>
                      prev.includes(time.id)
                        ? prev.length > 1
                          ? prev.filter((t) => t !== time.id)
                          : prev
                        : [...prev, time.id]
                    )
                  }
                  className={`p-2.5 rounded-2xl text-center border transition-all ${
                    isSelected
                      ? "bg-raasta-ink text-white border-raasta-ink shadow-sm"
                      : "bg-raasta-subtle border-transparent text-raasta-ink hover:bg-neutral-100"
                  }`}
                >
                  <div className="text-xs font-bold">{time.label}</div>
                  <div
                    className={`text-[10px] ${
                      isSelected ? "text-neutral-300" : "text-raasta-inkMuted"
                    }`}
                  >
                    {time.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Social Comfort */}
        <div>
          <label className="block text-xs font-semibold text-raasta-ink mb-2">
            Social Comfort Level
          </label>
          <div className="space-y-2">
            {SOCIAL_COMFORT_OPTIONS.map((opt) => {
              const isSelected = selectedSocial === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedSocial(opt.id)}
                  className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-raasta-primaryLight/70 border-raasta-primary text-raasta-ink shadow-sm"
                      : "bg-raasta-subtle border-transparent text-raasta-ink hover:bg-neutral-100"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[11px] text-raasta-inkMuted">{opt.desc}</div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-raasta-primary text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white font-bold text-sm shadow-floating flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        <Sparkles className="w-5 h-5" />
        <span>{isLoading ? "Generating Your Pathway..." : "Discover My 3-Step Pathway"}</span>
      </button>
    </form>
  );
};
