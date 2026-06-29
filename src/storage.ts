import type { PersonaResult, WalkRecord } from "./types";
import { createEmptyMetrics } from "./utils";

const STORAGE_KEY = "shuanghuoji.walks";
const PERSONA_KEY = "shuanghuoji.personaResult";
const APP_STORAGE_KEYS = [STORAGE_KEY, PERSONA_KEY];
const OLD_BRAIN_NAME = "\u8111\u5185\u5E72\u70E7\u7684\u56DB\u80C3\u53CD\u520D\u602A";
const NEW_BRAIN_NAME = "脑内开会的迷航舵手";

function normalizePersonaName(name?: string) {
  return name === OLD_BRAIN_NAME ? NEW_BRAIN_NAME : name;
}

function normalizeWalk(record: Partial<WalkRecord>): WalkRecord {
  return {
    id: record.id ?? "",
    routeId: record.routeId,
    routeName: record.routeName ?? "自由校园 Walk",
    routeSlogan: record.routeSlogan,
    dailyStatusId: record.dailyStatusId,
    dailyStatusName: record.dailyStatusName,
    dailyStatusDescription: record.dailyStatusDescription,
    dailyRecommendationReason: record.dailyRecommendationReason,
    personaId: record.personaId,
    personaName: normalizePersonaName(record.personaName),
    camp: undefined,
    shareCopy: record.shareCopy,
    startTime: record.startTime ?? new Date().toISOString(),
    endTime: record.endTime,
    createdAt: record.createdAt,
    photos: record.photos ?? [],
    moodTags: record.moodTags ?? [],
    gpsPoints: (record.gpsPoints ?? []).map((point) => ({
      ...point,
      timestamp: point.timestamp ?? Date.now(),
    })),
    gpsMode: record.gpsMode ?? (record.isDemoMode ? "demo" : "gps"),
    useGps: record.useGps ?? false,
    isDemoMode: record.isDemoMode ?? true,
    gpsErrorMessage: record.gpsErrorMessage,
    correctedPoint: record.correctedPoint,
    shareImageGenerated: record.shareImageGenerated ?? record.hasGeneratedShareImage ?? false,
    hasGeneratedShareImage: record.hasGeneratedShareImage ?? record.shareImageGenerated ?? false,
    todayStatus: record.todayStatus,
    templateName: record.templateName,
    templateText: record.templateText,
    recommendedDuration: record.recommendedDuration,
    socialMode: record.socialMode,
    routeText: record.routeText,
    distanceMeters: record.distanceMeters ?? createEmptyMetrics().distanceMeters,
    estimatedSteps: record.estimatedSteps ?? createEmptyMetrics().estimatedSteps,
    averageSpeedKmh: record.averageSpeedKmh ?? createEmptyMetrics().averageSpeedKmh,
    estimatedCalories: record.estimatedCalories ?? createEmptyMetrics().estimatedCalories,
    paceText: record.paceText,
  };
}

export function getWalks(): WalkRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeWalk) : [];
  } catch {
    return [];
  }
}

export function saveWalks(walks: WalkRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(walks));
}

export function upsertWalk(record: WalkRecord) {
  const walks = getWalks();
  const index = walks.findIndex((walk) => walk.id === record.id);
  const nextWalks = index >= 0 ? walks.map((walk) => (walk.id === record.id ? record : walk)) : [record, ...walks];
  saveWalks(nextWalks);
}

export function getWalkById(id: string) {
  return getWalks().find((walk) => walk.id === id);
}

export function getPersonaResult(): PersonaResult | undefined {
  const raw = localStorage.getItem(PERSONA_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as PersonaResult;
    return { ...parsed, personaName: normalizePersonaName(parsed.personaName) ?? parsed.personaName, camp: "" };
  } catch {
    return undefined;
  }
}

export function savePersonaResult(result: PersonaResult) {
  localStorage.setItem(PERSONA_KEY, JSON.stringify(result));
}

export type LocalDataClearScope = "walks" | "all";

export function getLocalStorageUsageBytes() {
  return APP_STORAGE_KEYS.reduce((total, key) => {
    const value = localStorage.getItem(key);
    return total + key.length + (value?.length ?? 0);
  }, 0);
}

export function clearLocalData(scope: LocalDataClearScope) {
  localStorage.removeItem(STORAGE_KEY);
  if (scope === "all") {
    localStorage.removeItem(PERSONA_KEY);
  }
}
