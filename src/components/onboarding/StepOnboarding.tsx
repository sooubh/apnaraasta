"use client";

import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  MapPin,
  Clock,
  Wallet,
  Users,
  Film,
  Camera,
  BookOpen,
  Utensils,
  HeartHandshake,
  User as UserIcon,
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
import { UserProfile } from "@/lib/types/profile";
import { useAuth } from "@/lib/firebase/authContext";

interface StepOnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const CATEGORY_ICONS: Record<ActivityCategory, React.ElementType> = {
  music_films: Film,
  photography_art: Camera,
  books_board_games: BookOpen,
  food_experiences: Utensils,
  outdoor_activities: Compass,
  volunteering: HeartHandshake,
};

export const StepOnboarding: React.FC<StepOnboardingProps> = ({
  onComplete,
  initialProfile,
}) => {
  const { user, saveProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Identity & Neighborhood
  const [displayName, setDisplayName] = useState(
    initialProfile?.displayName || user?.displayName || ""
  );
  const [homeArea, setHomeArea] = useState(
    initialProfile?.homeArea || "Baner"
  );
  const [bio, setBio] = useState(
    initialProfile?.bio || ""
  );

  // Step 2: Cultural Passions
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategory[]>(
    initialProfile?.preferences.categories || ["books_board_games", "music_films"]
  );
  const [favouriteInput, setFavouriteInput] = useState("");
  const [favouriteList, setFavouriteList] = useState<string[]>(
    initialProfile?.preferences.favouriteEntities.map((f) => f.name) || [
      "Satyajit Ray",
      "Haruki Murakami",
    ]
  );

  // Step 3: Rhythm & Comfort
  const [budgetType, setBudgetType] = useState<"flexible" | "free" | "300" | "600">(
    initialProfile?.preferences.flexibleBudget
      ? "flexible"
      : initialProfile?.preferences.budgetMaxInr === 0
      ? "free"
      : initialProfile?.preferences.budgetMaxInr === 300
      ? "300"
      : initialProfile?.preferences.budgetMaxInr === 600
      ? "600"
      : "flexible"
  );
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialProfile?.preferences.days || ["sat", "sun"]
  );
  const [selectedTimes, setSelectedTimes] = useState<TimeWindow[]>(
    initialProfile?.preferences.timeWindows || ["morning", "afternoon"]
  );
  const [selectedSocial, setSelectedSocial] = useState<SocialComfort>(
    initialProfile?.preferences.socialComfort || "low_pressure"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Add / Remove favourite entity
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

  // Toggle Days
  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day]
    );
  };

  // Toggle Times
  const toggleTime = (time: TimeWindow) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.length > 1
          ? prev.filter((t) => t !== time)
          : prev
        : [...prev, time]
    );
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const prefs: UserPreferences = {
      city: "Pune",
      areas: [homeArea],
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
      days: selectedDays,
      timeWindows: selectedTimes,
      socialComfort: selectedSocial,
      categories: selectedCategories,
      favouriteEntities: favouriteList.map((name) => ({ name })),
    };

    const newProfile: UserProfile = {
      uid: user?.uid || `guest_${Date.now()}`,
      displayName: displayName.trim() || "Pune Explorer",
      email: user?.email || undefined,
      photoURL: user?.photoURL || undefined,
      bio: bio.trim() || "Curious cultural explorer in Pune",
      homeArea,
      preferences: prefs,
      onboardingCompleted: true,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveProfile(newProfile);
      onComplete(newProfile);
    } catch (err) {
      console.warn("Failed to save profile during onboarding:", err);
      onComplete(newProfile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10">
      {/* Progress & Stepper Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-raasta-inkMuted">
          <span className="uppercase tracking-wider text-[11px] text-raasta-primary font-bold">
            Step {step} of 4:{" "}
            {step === 1 && "Identity & Home Base"}
            {step === 2 && "Cultural Taste & Affinities"}
            {step === 3 && "Rhythm & Comfort"}
            {step === 4 && "Your Cultural Passport"}
          </span>
          <span className="text-[11px] text-raasta-inkMuted">
            {step === 4 ? "Ready to launch" : "Personalized setup"}
          </span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-raasta-border">
          <div
            className="h-full bg-raasta-primary transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: IDENTITY & HOME BASE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center mb-3">
              <UserIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
              Welcome to ApnaRaasta
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted mt-1">
              Let&apos;s start by anchoring your cultural journey in Pune.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                What should we call you?
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Ananya, Tanmay, or Explorer"
                className="w-full px-4 py-3 rounded-2xl bg-raasta-subtle border border-raasta-border text-sm text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                Primary Pune Neighborhood
              </label>
              <p className="text-xs text-raasta-inkMuted mb-2.5">
                We prioritize community venues and recurring circles near your home base.
              </p>
              <div className="flex flex-wrap gap-2">
                {PUNE_AREAS.slice(0, 10).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setHomeArea(area)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      homeArea === area
                        ? "bg-raasta-primary text-white border-raasta-primary shadow-sm"
                        : "bg-raasta-subtle text-raasta-ink border-raasta-border hover:border-raasta-primary/40"
                    }`}
                  >
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                Cultural Intent or Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Weekend book enthusiast looking for quiet discussion circles and indie film screenings."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-raasta-subtle border border-raasta-border text-sm text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-raasta-borderSubtle">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle"
            >
              <span>Continue to Cultural Passions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CULTURAL PASSIONS & TASTE */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
              Your Cultural Passions
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted mt-1">
              Select one or more categories that spark your curiosity in Pune.
            </p>
          </div>

          {/* Category Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {APPROVED_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id];
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    isSelected
                      ? "bg-raasta-primaryLight/50 border-raasta-primary text-raasta-ink shadow-sm ring-1 ring-raasta-primary"
                      : "bg-raasta-subtle border-raasta-border hover:border-raasta-primary/40 text-raasta-ink"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-raasta-primary text-white"
                        : "bg-white text-raasta-primary border border-raasta-border"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{cat.label}</h4>
                      {isSelected && <Check className="w-3.5 h-3.5 text-raasta-primary shrink-0" />}
                    </div>
                    <p className="text-[11px] text-raasta-inkMuted mt-0.5 line-clamp-2">
                      {cat.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cultural Taste Signals for Qloo */}
          <div className="pt-4 border-t border-raasta-borderSubtle">
            <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
              Favorite Authors, Directors, or Creators
            </label>
            <p className="text-xs text-raasta-inkMuted mb-3">
              Qloo connects your taste signals to verified Pune places and communities with matching cultural affinity.
            </p>
            <div className="flex space-x-2 mb-3">
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
                placeholder="e.g. Satyajit Ray, Franz Kafka, Pradeep Mathew"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
              />
              <button
                type="button"
                onClick={addFavourite}
                disabled={!favouriteInput.trim() || favouriteList.length >= 5}
                className="px-4 py-2.5 rounded-2xl bg-raasta-ink hover:bg-raasta-ink/90 text-white text-xs font-semibold transition-all disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" />
                Add
              </button>
            </div>
            {favouriteList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {favouriteList.map((fav) => (
                  <span
                    key={fav}
                    className="inline-flex items-center text-xs font-medium bg-white text-raasta-ink px-3 py-1 rounded-full border border-raasta-border shadow-subtle"
                  >
                    <span>{fav}</span>
                    <button
                      type="button"
                      onClick={() => removeFavourite(fav)}
                      className="ml-1.5 text-raasta-inkMuted hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-raasta-borderSubtle">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-raasta-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={selectedCategories.length === 0}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle disabled:opacity-50"
            >
              <span>Continue to Rhythm & Comfort</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RHYTHM & COMFORT */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
              Practical Rhythms & Comfort
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted mt-1">
              Find activities that fit your actual schedule and social energy.
            </p>
          </div>

          <div className="space-y-5">
            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 inline mr-1 text-raasta-primary" />
                Budget Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "flexible", label: "Flexible" },
                  { id: "free", label: "Free only (₹0)" },
                  { id: "300", label: "Under ₹300" },
                  { id: "600", label: "Under ₹600" },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudgetType(b.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      budgetType === b.id
                        ? "bg-raasta-primary text-white border-raasta-primary"
                        : "bg-raasta-subtle text-raasta-ink border-raasta-border hover:border-raasta-primary/40"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Comfort */}
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 inline mr-1 text-raasta-primary" />
                Social Energy & Comfort Level
              </label>
              <div className="space-y-2">
                {SOCIAL_COMFORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedSocial(opt.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedSocial === opt.id
                        ? "bg-raasta-primaryLight/50 border-raasta-primary text-raasta-ink"
                        : "bg-raasta-subtle border-raasta-border hover:border-raasta-primary/40 text-raasta-ink"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-raasta-inkMuted">{opt.desc}</span>
                    </div>
                    {selectedSocial === opt.id && (
                      <Check className="w-4 h-4 text-raasta-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Days & Times */}
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1.5 uppercase tracking-wider">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selectedDays.includes(d.id)
                        ? "bg-raasta-ink text-white border-raasta-ink"
                        : "bg-raasta-subtle text-raasta-ink border-raasta-border"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-raasta-borderSubtle">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-raasta-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-subtle"
            >
              <span>Review Cultural Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PASSPORT REVIEW & LAUNCH */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-raasta-primaryLight text-raasta-primary flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-raasta-ink tracking-tight">
              Your Pune Cultural Passport
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted mt-1">
              Review your preferences before we generate your personalized community feed.
            </p>
          </div>

          {/* Cultural Passport Card */}
          <div className="bg-gradient-to-br from-[#6E5BF6] via-[#7B68F8] to-[#9E92FE] rounded-3xl p-6 text-white shadow-floating relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                  {displayName.charAt(0).toUpperCase() || "E"}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {displayName.trim() || "Pune Explorer"}
                  </h3>
                  <span className="text-[11px] text-white/80 inline-flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" />
                    {homeArea}, Pune
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                Active Passport
              </span>
            </div>

            {bio && (
              <p className="text-xs text-white/90 italic leading-relaxed bg-black/10 p-3 rounded-2xl">
                &ldquo;{bio}&rdquo;
              </p>
            )}

            <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                  Cultural Interests
                </span>
                <span className="font-semibold text-white">
                  {selectedCategories.length} selected (
                  {selectedCategories.map((c) => c.replace(/_/g, " ")).join(", ")})
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                  Social Comfort
                </span>
                <span className="font-semibold text-white capitalize">
                  {selectedSocial.replace("_", " ")}
                </span>
              </div>
            </div>

            {favouriteList.length > 0 && (
              <div className="pt-2 border-t border-white/20">
                <span className="text-[10px] uppercase tracking-wider text-white/70 block mb-1">
                  Taste Affinities (Qloo Signals)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {favouriteList.map((fav) => (
                    <span
                      key={fav}
                      className="text-[11px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white"
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-raasta-borderSubtle">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-raasta-subtle"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-sm font-bold transition-all shadow-floating disabled:opacity-50"
            >
              <span>{isSubmitting ? "Saving Profile..." : "Save Profile & Launch My Feed"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
