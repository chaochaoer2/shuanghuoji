export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDay(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatDuration(startTime: string, endTime?: string) {
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diff = Math.max(0, end - new Date(startTime).getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function formatDistance(meters: number) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export function createEmptyMetrics() {
  return {
    distanceMeters: 0,
    estimatedSteps: 0,
    averageSpeedKmh: 0,
    estimatedCalories: 0,
    paceText: "--",
  };
}

export function formatMetricDistance(meters: number, isDemoMode?: boolean) {
  if (isDemoMode) return "演示模式";
  return formatDistance(meters);
}

export function formatMaybeNumber(value: number, suffix = "", isDemoMode?: boolean) {
  if (isDemoMode) return "--";
  return `${Number.isFinite(value) ? value.toFixed(value % 1 === 0 ? 0 : 1) : "0"}${suffix}`;
}

export function isAbnormalDuration(startTime: string) {
  return Date.now() - new Date(startTime).getTime() > 12 * 60 * 60 * 1000;
}

export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radius = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

export function shouldAcceptGpsPoint(
  previous: { lat: number; lng: number; timestamp: number } | undefined,
  next: { lat: number; lng: number; accuracy?: number; timestamp: number },
) {
  if (next.accuracy !== undefined && next.accuracy > 80) return false;
  if (!previous) return true;
  const distance = haversineMeters(previous, next);
  if (distance < 3) return false;
  const elapsedHours = Math.max((next.timestamp - previous.timestamp) / 3600000, 1 / 3600000);
  const speedKmh = distance / 1000 / elapsedHours;
  return speedKmh <= 12;
}

export function calculateMetrics(points: { lat: number; lng: number; timestamp?: number }[], startTime: string, endTime?: string) {
  const distanceMeters = points.reduce((total, point, index) => {
    if (index === 0) return total;
    return total + haversineMeters(points[index - 1], point);
  }, 0);
  const elapsedHours = Math.max(1 / 3600, ((endTime ? new Date(endTime).getTime() : Date.now()) - new Date(startTime).getTime()) / 3600000);
  const distanceKm = distanceMeters / 1000;
  const averageSpeedKmh = distanceKm / elapsedHours;
  const paceMinutes = distanceKm > 0 ? (elapsedHours * 60) / distanceKm : 0;
  const paceText = paceMinutes > 0 ? `${Math.floor(paceMinutes)}'${Math.round((paceMinutes % 1) * 60).toString().padStart(2, "0")}"/km` : "--";

  return {
    distanceMeters,
    estimatedSteps: Math.round(distanceMeters / 0.7),
    averageSpeedKmh,
    estimatedCalories: Math.round(distanceKm * 60 * 0.8),
    paceText,
  };
}
