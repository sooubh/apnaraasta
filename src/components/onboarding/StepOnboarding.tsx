"use client";

import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Clock,
  Wallet,
  Users,
  Plus,
  X,
  Sparkles as SparklesStub,
  ShieldCheck,
  Heart,
} from "lucide-react";
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

// Curated Pune Neighborhoods with high-resolution visual anchors
const NEIGHBORHOOD_CARDS = [
  {
    name: "FC Road & Shivaji Nagar",
    tagline: "Vibrant college lanes, cinema archives, and book cafes",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    vibe: "Central & Lively",
  },
  {
    name: "Koregaon Park & Kalyani Nagar",
    tagline: "Boutique art galleries, green canopies, and indie spaces",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    vibe: "Leafy & Aesthetic",
  },
  {
    name: "Baner & Aundh",
    tagline: "Silent reading rooms, board game tables, and artisan roasters",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    vibe: "Modern & Communal",
  },
  {
    name: "Kothrud & Karve Nagar",
    tagline: "Cultural baithaks, classical music circles, and theater",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    vibe: "Cultural Heartland",
  },
  {
    name: "Camp & MG Road",
    tagline: "Colonial-era architecture, acoustic sessions, and heritage walks",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    vibe: "Heritage & Soulful",
  },
  {
    name: "Old City & Shaniwar Wada",
    tagline: "Historic wadas, traditional craft bazaars, and street food",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    vibe: "Historic & Historic",
  },
];

// Curated Category Cards with big rich imagery
const CATEGORY_CARDS: Array<{
  id: ActivityCategory;
  title: string;
  subtitle: string;
  image: string;
}> = [
  {
    id: "books_board_games",
    title: "Books & Board Games",
    subtitle: "Silent reading hours, tabletop strategy tables, community book exchanges",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "music_films",
    title: "Music & Cinema",
    subtitle: "NFAI classic screenings, indie music baithaks, acoustic listening circles",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "photography_art",
    title: "Photography & Art",
    subtitle: "Urban photowalks, weekend sketch crawls, gallery art discussions",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "outdoor_activities",
    title: "Outdoors & Heritage",
    subtitle: "Vetal Tekdi sunrise walks, urban heritage trails, botanical exploring",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "food_experiences",
    title: "Culinary & Coffee",
    subtitle: "Specialty coffee cuppings, Irani cafe crawls, baking workshops",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "volunteering",
    title: "Civic & Care",
    subtitle: "Urban tree planting, public library support, animal rescue circles",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
  },
];

// Curated Social Energy Cards with photography
const SOCIAL_CARDS: Array<{
  id: SocialComfort;
  title: string;
  tagline: string;
  description: string;
  image: string;
}> = [
  {
    id: "low_pressure",
    title: "Gentle & Observant",
    tagline: "Low social pressure",
    description: "Slip in at your own pace without mandatory icebreakers or being put on the spot.",
    image: "https://images.unsplash.com/photo-1507842229421-700f135b67e0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "balanced",
    title: "Casual & Conversational",
    tagline: "Shared activity focus",
    description: "Natural shared activities where conversations flow organically over books, films, or coffee.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "highly_social",
    title: "Lively & Collaborative",
    tagline: "High interaction",
    description: "Active group discussions, team participation, and buzzing weekend meetups.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  },
];

export const StepOnboarding: React.FC<StepOnboardingProps> = ({
  onComplete,
  initialProfile,
}) => {
  const { user, saveProfile } = useAuth();

  // One by one: 5 visual stages
  const [currentQuestion, setCurrentQuestion] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Question 1: Neighborhood
  const [selectedArea, setSelectedArea] = useState<string>(
    initialProfile?.homeArea || "Baner & Aundh"
  );

  // Question 2: Categories
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategory[]>(
    initialProfile?.preferences.categories || ["books_board_games", "music_films"]
  );

  // Question 3: Social Comfort / Energy
  const [selectedSocial, setSelectedSocial] = useState<SocialComfort>(
    initialProfile?.preferences.socialComfort || "low_pressure"
  );

  // Question 4: Rhythm & Budget
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

  // Question 5: Passport Identity & Taste
  const [displayName, setDisplayName] = useState(
    initialProfile?.displayName || user?.displayName || ""
  );
  const [bio, setBio] = useState(
    initialProfile?.bio || ""
  );
  const [favouriteInput, setFavouriteInput] = useState("");
  const [favouriteList, setFavouriteList] = useState<string[]>(
    initialProfile?.preferences.favouriteEntities.map((f) => f.name) || [
      "Satyajit Ray",
      "Haruki Murakami",
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Category
  const toggleCategory = (cat: ActivityCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  // Add / Remove favourite
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

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const prefs: UserPreferences = {
      city: "Pune",
      areas: [selectedArea],
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
      timeWindows: ["morning", "afternoon"],
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
      homeArea: selectedArea,
      preferences: prefs,
      onboardingCompleted: true,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveProfile(newProfile);
      onComplete(newProfile);
    } catch (err) {
      console.warn("Failed to save profile:", err);
      onComplete(newProfile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10">
      {/* Sleek Visual Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold">
          <span className="uppercase tracking-wider text-[11px] text-raasta-primary font-bold">
            Question {currentQuestion} of 5
          </span>
          <span className="text-[11px] text-raasta-inkMuted">
            {currentQuestion === 1 && "Your Neighborhood Anchor"}
            {currentQuestion === 2 && "Scenes That Excite You"}
            {currentQuestion === 3 && "Your Social Pace"}
            {currentQuestion === 4 && "Weekend Rhythm & Budget"}
            {currentQuestion === 5 && "Your Cultural Passport"}
          </span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-raasta-border">
          <div
            className="h-full bg-raasta-primary transition-all duration-300 rounded-full"
            style={{ width: `${(currentQuestion / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* QUESTION 1: WHERE DO YOU SPEND MOST OF YOUR TIME IN PUNE? (BIG IMAGES) */}
      {currentQuestion === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center text-[11px] font-bold bg-raasta-primaryLight text-raasta-primary px-3 py-1 rounded-full border border-raasta-border">
              <MapPin className="w-3 h-3 mr-1" />
              Pune Neighborhoods
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
              Where do you spend most of your time in Pune?
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted">
              Choose your home base or favorite neighborhood. We prioritize venues and recurring circles right around your corner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEIGHBORHOOD_CARDS.map((hood) => {
              const isSelected = selectedArea === hood.name;
              return (
                <button
                  key={hood.name}
                  type="button"
                  onClick={() => setSelectedArea(hood.name)}
                  className={`group text-left rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between bg-white shadow-subtle hover:shadow-floating ${
                    isSelected
                      ? "border-raasta-primary ring-2 ring-raasta-primary shadow-floating transform -translate-y-1"
                      : "border-raasta-border hover:border-raasta-primary/40"
                  }`}
                >
                  {/* Big Image Header */}
                  <div className="h-44 w-full relative overflow-hidden bg-raasta-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hood.image}
                      alt={hood.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-raasta-ink text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {hood.vibe}
                    </span>
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-raasta-primary text-white p-1 rounded-full shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-base leading-tight drop-shadow-sm">
                        {hood.name}
                      </h4>
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="p-4">
                    <p className="text-xs text-raasta-inkMuted leading-relaxed">
                      {hood.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setCurrentQuestion(2)}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-floating"
            >
              <span>Next: Cultural Passions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 2: WHAT CULTURAL SCENES EXCITE YOU? (BIG IMAGES) */}
      {currentQuestion === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center text-[11px] font-bold bg-raasta-primaryLight text-raasta-primary px-3 py-1 rounded-full border border-raasta-border">
              <Compass className="w-3 h-3 mr-1" />
              Cultural Passions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
              What kind of scenes make you feel alive?
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted">
              Select one or more categories that spark your curiosity in Pune.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY_CARDS.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`group text-left rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between bg-white shadow-subtle hover:shadow-floating ${
                    isSelected
                      ? "border-raasta-primary ring-2 ring-raasta-primary shadow-floating transform -translate-y-1"
                      : "border-raasta-border hover:border-raasta-primary/40"
                  }`}
                >
                  <div className="h-44 w-full relative overflow-hidden bg-raasta-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-raasta-primary text-white p-1 rounded-full shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-base leading-tight drop-shadow-sm">
                        {cat.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-raasta-inkMuted leading-relaxed line-clamp-2">
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentQuestion(1)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-white bg-white/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentQuestion(3)}
              disabled={selectedCategories.length === 0}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-floating disabled:opacity-50"
            >
              <span>Next: Social Comfort</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 3: WHAT SOCIAL PACE FITS YOUR COMFORT? (BIG IMAGES) */}
      {currentQuestion === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center text-[11px] font-bold bg-raasta-primaryLight text-raasta-primary px-3 py-1 rounded-full border border-raasta-border">
              <Users className="w-3 h-3 mr-1" />
              Social Energy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
              What social pace fits your comfort?
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted">
              We respect your social energy. Choose the atmosphere where you feel most at ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIAL_CARDS.map((soc) => {
              const isSelected = selectedSocial === soc.id;
              return (
                <button
                  key={soc.id}
                  type="button"
                  onClick={() => setSelectedSocial(soc.id)}
                  className={`group text-left rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between bg-white shadow-subtle hover:shadow-floating ${
                    isSelected
                      ? "border-raasta-primary ring-2 ring-raasta-primary shadow-floating transform -translate-y-1"
                      : "border-raasta-border hover:border-raasta-primary/40"
                  }`}
                >
                  <div className="h-48 w-full relative overflow-hidden bg-raasta-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={soc.image}
                      alt={soc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-raasta-ink text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {soc.tagline}
                    </span>
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-raasta-primary text-white p-1 rounded-full shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-base leading-tight drop-shadow-sm">
                        {soc.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-raasta-inkMuted leading-relaxed">
                      {soc.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentQuestion(2)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-white bg-white/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentQuestion(4)}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-floating"
            >
              <span>Next: Rhythm & Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 4: RHYTHM & BUDGET (INTERACTIVE CARDS) */}
      {currentQuestion === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center text-[11px] font-bold bg-raasta-primaryLight text-raasta-primary px-3 py-1 rounded-full border border-raasta-border">
              <Clock className="w-3 h-3 mr-1" />
              Schedule & Budget
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
              When does your exploration happen?
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted">
              Set your weekend days and comfort budget.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-6">
            {/* Budget Visual Choice Cards */}
            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-2 uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 inline mr-1 text-raasta-primary" />
                Budget Ceiling
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  {
                    id: "flexible",
                    title: "Flexible",
                    desc: "Free up to modest ticketing",
                  },
                  {
                    id: "free",
                    title: "Free Only (₹0)",
                    desc: "Public archives, parks, swaps",
                  },
                  {
                    id: "300",
                    title: "Under ₹300",
                    desc: "Coffee or modest donor pass",
                  },
                  {
                    id: "600",
                    title: "Under ₹600",
                    desc: "Workshops & special screenings",
                  },
                ].map((b) => {
                  const isSelected = budgetType === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudgetType(b.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-raasta-primary text-white border-raasta-primary shadow-sm ring-1 ring-raasta-primary"
                          : "bg-raasta-subtle border-raasta-border text-raasta-ink hover:border-raasta-primary/40"
                      }`}
                    >
                      <h4 className="font-bold text-sm leading-tight">{b.title}</h4>
                      <p
                        className={`text-[11px] mt-1 leading-snug ${
                          isSelected ? "text-white/85" : "text-raasta-inkMuted"
                        }`}
                      >
                        {b.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Days Selection */}
            <div className="pt-4 border-t border-raasta-borderSubtle">
              <label className="block text-xs font-bold text-raasta-ink mb-2 uppercase tracking-wider">
                Available Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "sat", label: "Saturday Morning" },
                  { id: "sun", label: "Sunday Morning" },
                  { id: "sat_eve", label: "Saturday Evening" },
                  { id: "sun_eve", label: "Sunday Evening" },
                ].map((slot) => {
                  const isChecked = selectedDays.includes(slot.id.startsWith("sat") ? "sat" : "sun");
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        const targetDay: DayOfWeek = slot.id.startsWith("sat") ? "sat" : "sun";
                        setSelectedDays((prev) =>
                          prev.includes(targetDay)
                            ? prev.length > 1
                              ? prev.filter((d) => d !== targetDay)
                              : prev
                            : [...prev, targetDay]
                        );
                      }}
                      className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all ${
                        isChecked
                          ? "bg-raasta-ink text-white border-raasta-ink"
                          : "bg-raasta-subtle text-raasta-ink border-raasta-border hover:border-raasta-primary/40"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentQuestion(3)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-white bg-white/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentQuestion(5)}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-xs font-bold transition-all shadow-floating"
            >
              <span>Next: Your Cultural Passport</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUESTION 5: YOUR CULTURAL PASSPORT & LAUNCH */}
      {currentQuestion === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center text-[11px] font-bold bg-raasta-primaryLight text-raasta-primary px-3 py-1 rounded-full border border-raasta-border">
              <Compass className="w-3 h-3 mr-1" />
              Final Step
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-raasta-ink tracking-tight">
              Your Pune Cultural Passport
            </h2>
            <p className="text-xs sm:text-sm text-raasta-inkMuted">
              Give your passport a name, add any favorite creators for Qloo affinity matching, and launch your personalized feed.
            </p>
          </div>

          {/* Big Cultural Passport Preview Card */}
          <div className="bg-gradient-to-br from-[#6E5BF6] via-[#7B68F8] to-[#9E92FE] rounded-3xl p-6 sm:p-8 text-white shadow-floating relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg border border-white/30">
                  {displayName.charAt(0).toUpperCase() || "E"}
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl leading-tight">
                    {displayName.trim() || "Pune Explorer"}
                  </h3>
                  <span className="text-xs text-white/90 inline-flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-white" />
                    {selectedArea}, Pune
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                Pune Passport
              </span>
            </div>

            {bio && (
              <p className="text-xs text-white/95 italic bg-black/15 p-3.5 rounded-2xl border border-white/10 leading-relaxed">
                &ldquo;{bio}&rdquo;
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/20 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                  Interests
                </span>
                <span className="font-semibold text-white">
                  {selectedCategories.length} Categories
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                  Social Pace
                </span>
                <span className="font-semibold text-white capitalize">
                  {selectedSocial.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                  Budget
                </span>
                <span className="font-semibold text-white capitalize">
                  {budgetType === "flexible" ? "Flexible" : budgetType === "free" ? "Free Only" : `≤ ₹${budgetType}`}
                </span>
              </div>
            </div>

            {favouriteList.length > 0 && (
              <div className="pt-3 border-t border-white/20">
                <span className="text-[10px] uppercase tracking-wider text-white/70 block mb-1.5">
                  Taste Signals (Qloo Cultural Affinity)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {favouriteList.map((fav) => (
                    <span
                      key={fav}
                      className="text-[11px] bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white border border-white/20"
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Input for Name, Bio, and Qloo Taste Signals */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-raasta-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
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
                <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                  Personal Cultural Bio (Optional)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Indie films, quiet cafes, and Sunday book clubs."
                  className="w-full px-4 py-3 rounded-2xl bg-raasta-subtle border border-raasta-border text-sm text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-raasta-ink mb-1 uppercase tracking-wider">
                Favorite Authors, Filmmakers, or Artists (Qloo Signals)
              </label>
              <div className="flex space-x-2 mb-2">
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
                  placeholder="Add creator (e.g. Satyajit Ray, Murakami, Studio Ghibli)..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-raasta-subtle border border-raasta-border text-xs text-raasta-ink focus:outline-none focus:ring-2 focus:ring-raasta-primary"
                />
                <button
                  type="button"
                  onClick={addFavourite}
                  disabled={!favouriteInput.trim() || favouriteList.length >= 5}
                  className="px-4 py-2.5 rounded-2xl bg-raasta-ink text-white text-xs font-semibold disabled:opacity-40"
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
                      className="inline-flex items-center text-xs bg-raasta-subtle text-raasta-ink px-3 py-1 rounded-full border border-raasta-border"
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
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentQuestion(4)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full border border-raasta-border text-raasta-ink text-xs font-semibold hover:bg-white bg-white/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-10 py-4 rounded-full bg-raasta-primary hover:bg-raasta-primaryHover text-white text-sm font-bold transition-all shadow-floating disabled:opacity-50"
            >
              <span>{isSubmitting ? "Curating Feed..." : "Launch My Personalized Feed"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
