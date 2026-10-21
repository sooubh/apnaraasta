export type QlooEntityType =
  | "urn:entity:artist"
  | "urn:entity:book"
  | "urn:entity:brand"
  | "urn:entity:destination"
  | "urn:entity:movie"
  | "urn:entity:person"
  | "urn:entity:place"
  | "urn:entity:podcast"
  | "urn:entity:tv_show"
  | "urn:entity:video_game";

export interface QlooResolvedEntity {
  id: string;
  name: string;
  entityType: string;
  category?: string;
  score?: number;
}

export interface QlooResolvedTag {
  id: string;
  name: string;
  type?: string;
}

export interface QlooInsightItem {
  id: string;
  name: string;
  entityType: string;
  affinity?: number;
  tags?: string[];
  location?: {
    city?: string;
    neighborhood?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  explainability?: {
    contributingSignals?: Array<{
      id: string;
      name: string;
      weight?: number;
    }>;
  };
}

export interface NormalizedInsightResult {
  requestId: string;
  status: "success" | "empty" | "error";
  filterType: string;
  locationQuery?: string;
  entities: QlooInsightItem[];
  explainabilityAvailable: boolean;
  contributingSignals: string[];
  summary: string;
  elapsedMs: number;
}
