export type TodayStatus =
  | "低电量待机中"
  | "椅子封印中"
  | "饭后想躺中"
  | "脑内加载中"
  | "社交断网中"
  | "拍照雷达开机"
  | "闲得发光中"
  | "满血巡游中";

export type GpsPoint = {
  id: string;
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
  coordSystem?: "wgs84" | "gcj02";
};

export type GPSPoint = GpsPoint;

export type PersonaScores = {
  S: number;
  F: number;
  M: number;
  E: number;
  C: number;
  T: number;
  R: number;
};

export type PersonaResult = {
  personaId: string;
  personaName: string;
  camp: string;
  description: string;
  painPoint: string;
  mainRouteId: string;
  subRouteId?: string;
  personaCopy: string;
  shareCopy: string;
  scores: PersonaScores;
  createdAt: string;
};

export type RouteRecommendation = {
  status: TodayStatus;
  dailyStatusId?: string;
  dailyStatusName?: string;
  dailyStatusDescription?: string;
  dailyRecommendationReason?: string;
  routeId?: string | null;
  routeName: string;
  routeSlogan?: string;
  recommendedDuration: string;
  socialMode: string;
  reason: string;
  templateName: string;
  templateText: string;
  routeText: string;
  personaId?: string;
  personaName?: string;
  camp?: string;
  shareCopy?: string;
};

export type WalkMetrics = {
  distanceMeters: number;
  estimatedSteps: number;
  averageSpeedKmh: number;
  estimatedCalories: number;
  paceText?: string;
};

export type PhotoNode = {
  id: string;
  imageDataUrl: string;
  locationName: string;
  moodTag: string;
  note: string;
  createdAt: string;
  simulatedPosition: { x: number; y: number };
  routeName?: string;
  todayStatus?: TodayStatus;
  gpsPoint?: GpsPoint;
  distanceAtMoment?: number;
  distanceMetersAtCapture?: number;
  dailyStatusName?: string;
  personaName?: string;
  routeId?: string | null;
};

export type TrackStatus = "GPS 记录中" | "演示轨迹模式" | "定位失败";

export type ShareTemplate = "proof" | "plog" | "journal" | "stamp" | "travelogue";

export type WalkRecord = WalkMetrics & {
  id: string;
  routeId?: string | null;
  routeName: string;
  routeSlogan?: string;
  dailyStatusId?: string;
  dailyStatusName?: string;
  dailyStatusDescription?: string;
  dailyRecommendationReason?: string;
  personaId?: string;
  personaName?: string;
  camp?: string;
  shareCopy?: string;
  startTime: string;
  endTime?: string;
  createdAt?: string;
  photos: PhotoNode[];
  moodTags: string[];
  todayStatus?: TodayStatus;
  templateName?: string;
  templateText?: string;
  recommendedDuration?: string;
  socialMode?: string;
  routeText?: string;
  gpsMode?: "gps" | "demo" | "failed";
  gpsPoints: GpsPoint[];
  useGps: boolean;
  isDemoMode: boolean;
  gpsErrorMessage?: string;
  correctedPoint?: GpsPoint;
  shareImageGenerated?: boolean;
  hasGeneratedShareImage?: boolean;
};
