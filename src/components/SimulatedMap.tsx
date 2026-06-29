import type { GPSPoint, PhotoNode } from "../types";

type Props = {
  photos: PhotoNode[];
  gpsPoints?: GPSPoint[];
};

function gpsToSvg(point: GPSPoint, index: number, points: GPSPoint[]) {
  if (points.length < 2) {
    return { x: 16 + index * 8, y: 70 - index * 5 };
  }
  const lats = points.map((item) => item.lat);
  const lngs = points.map((item) => item.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const lngSpan = Math.max(0.000001, maxLng - minLng);
  const latSpan = Math.max(0.000001, maxLat - minLat);
  return {
    x: 12 + ((point.lng - minLng) / lngSpan) * 76,
    y: 82 - ((point.lat - minLat) / latSpan) * 60,
  };
}

export function SimulatedMap({ photos, gpsPoints = [] }: Props) {
  const photoPoints = photos.map((photo) => `${photo.simulatedPosition.x},${photo.simulatedPosition.y}`).join(" ");
  const gpsSvgPoints = gpsPoints.map(gpsToSvg);
  const gpsLine = gpsSvgPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="map-card">
      <svg viewBox="0 0 100 100" role="img" aria-label="演示校园路线图">
        <defs>
          <linearGradient id="mapBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e7fbef" />
            <stop offset="100%" stopColor="#dff3ff" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="8" fill="url(#mapBg)" />
        <path d="M11 23 C31 15, 40 26, 58 20 C73 15, 86 23, 91 38" className="map-path muted" />
        <path d="M10 71 C25 58, 36 76, 50 63 C64 50, 76 59, 91 48" className="map-path muted" />
        <rect x="12" y="12" width="18" height="13" rx="3" className="building" />
        <rect x="68" y="68" width="21" height="15" rx="3" className="building" />
        <rect x="42" y="34" width="18" height="17" rx="3" className="building" />
        <circle cx="24" cy="76" r="9" className="field" />
        {gpsSvgPoints.length > 1 && <polyline points={gpsLine} className="gps-route" />}
        {photos.length > 1 && <polyline points={photoPoints} className="live-route" />}
        {photos.map((photo, index) => (
          <g key={photo.id}>
            <circle cx={photo.simulatedPosition.x} cy={photo.simulatedPosition.y} r="4.5" className="route-dot" />
            <text x={photo.simulatedPosition.x} y={photo.simulatedPosition.y + 1.4} textAnchor="middle" className="route-index">
              {index + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
