import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { Pathway, SavedPathwayDoc, UserPreferences } from "../types/pathway";

export async function saveUserPathway(params: {
  userId: string;
  pathway: Pathway;
  preferences: Partial<UserPreferences>;
  method: "qloo" | "baseline";
  qlooUsed: boolean;
  explainabilityAvailable: boolean;
}): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  const pathwayId = `pathway_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const pathwayRef = doc(db, "users", params.userId, "pathways", pathwayId);

  const activitySnapshot = params.pathway.steps
    .map((s) => s.activity)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const docData: SavedPathwayDoc = {
    id: pathwayId,
    userId: params.userId,
    createdAt: new Date().toISOString(),
    title: params.pathway.title,
    city: "Pune",
    preferencesSnapshot: params.preferences,
    steps: params.pathway.steps,
    activitySnapshot,
    method: params.method,
    qlooUsed: params.qlooUsed,
    explainabilityAvailable: params.explainabilityAvailable,
    sourceStatusSummary: `Contains ${activitySnapshot.length} source-verified Pune activities.`,
  };

  await setDoc(pathwayRef, docData);
  return pathwayId;
}

export async function getUserPathways(userId: string): Promise<SavedPathwayDoc[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const pathwaysCol = collection(db, "users", userId, "pathways");
  const q = query(pathwaysCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => d.data() as SavedPathwayDoc);
}

export async function deleteUserPathway(userId: string, pathwayId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }
  const pathwayRef = doc(db, "users", userId, "pathways", pathwayId);
  await deleteDoc(pathwayRef);
}
