export type ActivityCategory =
  | "music_films"
  | "photography_art"
  | "books_board_games"
  | "food_experiences"
  | "outdoor_activities"
  | "volunteering";

export type SocialComfort = "low_pressure" | "balanced" | "highly_social";

export type ScheduleKind = "recurring" | "date_specific" | "evergreen" | "unknown";

export type VerificationStatus = "verified" | "stale" | "demo_only" | "unverified";

export type ActivityKind = "activity" | "recurring_community" | "place";

export type CostStatus = "known" | "free_confirmed" | "unknown";

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  shortDescription?: string;
  activityKind: ActivityKind;
  city: "Pune";
  area?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  costStatus: CostStatus;
  priceMinInr?: number;
  priceMaxInr?: number;
  scheduleKind: ScheduleKind;
  scheduleText?: string;
  nextOccurrence?: string; // ISO-8601 only if source-verified
  socialComfort?: SocialComfort;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string; // ISO timestamp when source was verified
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  registrationUrl?: string;
  imageUrl?: string;
  imageSourceUrl?: string;
  imageUsageNotes?: string;
  qlooEntityRefs?: string[];
  tags: string[];
  demoOnly: boolean;
  externalActionUrl?: string;
}

export interface ActivityCardData {
  id: string;
  title: string;
  category: ActivityCategory;
  shortDescription?: string;
  activityKind: ActivityKind;
  area?: string;
  address?: string;
  distanceKm?: number;
  priceMinInr?: number;
  priceMaxInr?: number;
  costStatus: CostStatus;
  scheduleKind: ScheduleKind;
  scheduleText?: string;
  nextOccurrence?: string;
  socialComfort?: SocialComfort;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  imageUrl?: string;
  externalActionUrl?: string;
}
