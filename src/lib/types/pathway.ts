import { ActivityCardData, ActivityCategory, SocialComfort } from "./activity";

export type { ActivityCategory, SocialComfort };

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TimeWindow = "morning" | "afternoon" | "evening";

export interface FavouriteEntity {
  name: string;
  kind?: "artist" | "movie" | "book" | "person" | "brand" | "place";
  qlooEntityId?: string;
}

export interface UserPreferences {
  city: "Pune";
  areas: string[];
  maxDistanceKm?: number;
  budgetMinInr?: number;
  budgetMaxInr?: number;
  flexibleBudget: boolean;
  days: DayOfWeek[];
  timeWindows: TimeWindow[];
  socialComfort: SocialComfort;
  categories: ActivityCategory[];
  favouriteEntities: FavouriteEntity[];
}

export type PathwayStepRole =
  | "approachable_start"
  | "shared_interest"
  | "recurring_participation";

export interface PathwayStep {
  order: 1 | 2 | 3;
  activityId: string;
  activity?: ActivityCardData;
  whyThisStep: string;
  role: PathwayStepRole;
}

export interface Pathway {
  title: string;
  steps: PathwayStep[];
  alternativeActivityIds: string[];
  alternatives?: ActivityCardData[];
}

export interface QlooEvidence {
  resolvedEntities: Array<{
    name: string;
    entityType: string;
    id?: string;
  }>;
  explainabilityAvailable: boolean;
  summary: string;
  contributingSignals?: string[];
}

export interface DataStatus {
  verifiedRecords: number;
  staleRecords: number;
  unknownFields: string[];
}

export interface GeneratePathwayRequest {
  preferences: UserPreferences;
  excludeActivityIds?: string[];
  requestMode?: "qloo" | "baseline";
}

export interface GeneratePathwayResponse {
  requestId: string;
  status: "success" | "error";
  method: "qloo" | "baseline";
  qlooStatus?: "used" | "unavailable" | "partial" | "empty";
  qlooEvidence?: QlooEvidence;
  pathway?: Pathway;
  dataStatus?: DataStatus;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface ComparePathwaysRequest {
  preferences: UserPreferences;
  comparisonRunId?: string;
}

export interface CompareArmResult {
  status: "success" | "error";
  method: "generic_gemini_without_qloo" | "gemini_with_actual_qloo_evidence";
  qlooStatus?: "used" | "unavailable" | "partial" | "empty";
  pathway?: Pathway;
  qlooEvidence?: QlooEvidence;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface CompareMetrics {
  verifiedCandidateCount: number;
  baselineVerifiedSources: number;
  qlooVerifiedSources: number;
  baselineConstraintViolations: number;
  qlooConstraintViolations: number;
  categoryCoverage: {
    baseline: number;
    qloo: number;
  };
}

export interface ComparePathwaysResponse {
  requestId: string;
  candidatePoolId: string;
  baseline: CompareArmResult;
  qloo: CompareArmResult;
  metrics: CompareMetrics;
  comparisonDisclaimer: string;
}

export interface SavedPathwayDoc {
  id: string;
  userId: string;
  createdAt: string;
  title: string;
  city: "Pune";
  preferencesSnapshot: Partial<UserPreferences>;
  steps: PathwayStep[];
  activitySnapshot: ActivityCardData[];
  method: "qloo" | "baseline";
  qlooUsed: boolean;
  explainabilityAvailable: boolean;
  sourceStatusSummary: string;
}
