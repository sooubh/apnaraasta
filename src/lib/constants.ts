import { ActivityCategory, DayOfWeek, SocialComfort, TimeWindow } from "./types/pathway";

export const PRODUCT_NAME = "ApnaRaasta";
export const PRODUCT_TAGLINE = "From Your Interests to Your People";
export const TARGET_CITY = "Pune";

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  shortDesc: string;
  iconName: string;
  colorBg: string;
  colorBorder: string;
  qlooHintType: string;
}

export const APPROVED_CATEGORIES: CategoryMeta[] = [
  {
    id: "music_films",
    label: "Music & Films",
    shortDesc: "Listening circles, indie screenings, acoustic jams",
    iconName: "Film",
    colorBg: "bg-purple-50",
    colorBorder: "border-purple-200",
    qlooHintType: "urn:entity:artist",
  },
  {
    id: "photography_art",
    label: "Photography & Art",
    shortDesc: "Photowalks, sketch crawls, gallery collectives",
    iconName: "Camera",
    colorBg: "bg-indigo-50",
    colorBorder: "border-indigo-200",
    qlooHintType: "urn:entity:place",
  },
  {
    id: "books_board_games",
    label: "Books & Board Games",
    shortDesc: "Silent reading hours, tabletop guilds, book swaps",
    iconName: "BookOpen",
    colorBg: "bg-blue-50",
    colorBorder: "border-blue-200",
    qlooHintType: "urn:entity:book",
  },
  {
    id: "food_experiences",
    label: "Food Experiences",
    shortDesc: "Roastery cuppings, culinary heritage walks, baking",
    iconName: "Utensils",
    colorBg: "bg-amber-50",
    colorBorder: "border-amber-200",
    qlooHintType: "urn:entity:brand",
  },
  {
    id: "outdoor_activities",
    label: "Outdoor Activities",
    shortDesc: "Tekdi sunrise walks, urban cycling, bouldering",
    iconName: "Compass",
    colorBg: "bg-emerald-50",
    colorBorder: "border-emerald-200",
    qlooHintType: "urn:entity:place",
  },
  {
    id: "volunteering",
    label: "Volunteering",
    shortDesc: "River cleanups, community libraries, animal welfare",
    iconName: "HeartHandshake",
    colorBg: "bg-rose-50",
    colorBorder: "border-rose-200",
    qlooHintType: "urn:entity:brand",
  },
];

export const PUNE_AREAS: string[] = [
  "Koregaon Park",
  "Kalyani Nagar",
  "Viman Nagar",
  "Deccan Gymkhana",
  "FC Road & Shivaji Nagar",
  "Camp & MG Road",
  "Kothrud",
  "Aundh",
  "Baner",
  "Bavdhan",
  "Erandwane",
  "Model Colony",
  "Pimple Saudagar",
];

export const DAYS_OF_WEEK: Array<{ id: DayOfWeek; label: string; short: string }> = [
  { id: "mon", label: "Monday", short: "M" },
  { id: "tue", label: "Tuesday", short: "T" },
  { id: "wed", label: "Wednesday", short: "W" },
  { id: "thu", label: "Thursday", short: "T" },
  { id: "fri", label: "Friday", short: "F" },
  { id: "sat", label: "Saturday", short: "S" },
  { id: "sun", label: "Sunday", short: "S" },
];

export const TIME_WINDOWS: Array<{ id: TimeWindow; label: string; desc: string }> = [
  { id: "morning", label: "Morning", desc: "Before 12:00 PM" },
  { id: "afternoon", label: "Afternoon", desc: "12:00 PM – 5:00 PM" },
  { id: "evening", label: "Evening", desc: "After 5:00 PM" },
];

export const SOCIAL_COMFORT_OPTIONS: Array<{
  id: SocialComfort;
  label: string;
  tagline: string;
  desc: string;
}> = [
  {
    id: "low_pressure",
    label: "Gentle & Observant",
    tagline: "Low social pressure",
    desc: "Ease in at your own pace without mandatory icebreakers or spotlight.",
  },
  {
    id: "balanced",
    label: "Casual & Conversational",
    tagline: "Balanced interaction",
    desc: "Natural shared activities where conversations flow organically.",
  },
  {
    id: "highly_social",
    label: "Lively & Collaborative",
    tagline: "High interaction",
    desc: "Active group discussions, team participation and vibrant meetups.",
  },
];

export const MAX_AGENT_STEPS = 4;
export const MAX_CANDIDATES_FOR_RANKING = 20;
export const MAX_ALTERNATIVES = 4;
export const QLOO_HACKATHON_BASE_URL = "https://hackathon.api.qloo.com";
