import type { GpsPoint, PhotoNode } from "../types";

type Props = {
  gpsPoints: GpsPoint[];
  photos: PhotoNode[];
  isDemoMode: boolean;
  startTime: string;
  endTime?: string;
};

type RouteNode = {
  id: string;
  index: number;
  title: string;
  minute: number;
  segmentMinute: number;
  type: "building" | "lake" | "drink" | "pet" | "sunset" | "scenery";
};

const fallbackNodes = [
  { title: "出发", minute: 0, type: "building" as const },
  { title: "路上", minute: 8, type: "scenery" as const },
  { title: "收尾", minute: 18, type: "sunset" as const },
];

function inferType(photo?: PhotoNode): RouteNode["type"] {
  const value = `${photo?.locationName ?? ""} ${photo?.moodTag ?? ""} ${photo?.note ?? ""}`;
  if (/猫|宠|狗|爪|萌/.test(value)) return "pet";
  if (/咖啡|奶茶|饮|喝|杯|食堂/.test(value)) return "drink";
  if (/湖|水|桥|河/.test(value)) return "lake";
  if (/夕|晚霞|日落|落日|晚风/.test(value)) return "sunset";
  if (/楼|馆|院|门|钟|图书/.test(value)) return "building";
  return "scenery";
}

function totalMinutes(startTime: string, endTime?: string) {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.max(1, Math.round((end - start) / 60000));
}

function photoMinute(photo: PhotoNode, startTime: string, fallback: number) {
  const start = new Date(startTime).getTime();
  const created = new Date(photo.createdAt).getTime();
  if (!Number.isFinite(created) || created < start) return fallback;
  return Math.max(0, Math.round((created - start) / 60000));
}

function makeNodes(photos: PhotoNode[], startTime: string, endTime?: string): RouteNode[] {
  const duration = totalMinutes(startTime, endTime);
  const source = photos.length ? photos.slice(0, 6) : [];

  if (!source.length) {
    return fallbackNodes.map((node, index) => ({
      ...node,
      id: `fallback-${index}`,
      index: index + 1,
      segmentMinute: index === 0 ? 0 : node.minute - fallbackNodes[index - 1].minute,
    }));
  }

  return source.map((photo, index) => {
    const fallback = source.length === 1 ? duration : Math.round((duration * index) / Math.max(1, source.length - 1));
    const minute = photoMinute(photo, startTime, fallback);
    const previous = index > 0 ? photoMinute(source[index - 1], startTime, Math.round((duration * (index - 1)) / Math.max(1, source.length - 1))) : 0;
    return {
      id: photo.id,
      index: index + 1,
      title: photo.locationName || `节点 ${index + 1}`,
      minute,
      segmentMinute: index === 0 ? minute : Math.max(0, minute - previous),
      type: inferType(photo),
    };
  });
}

function pointFor(index: number, total: number) {
  const presets = [
    [
      { x: 54, y: 134 },
      { x: 178, y: 78 },
      { x: 306, y: 142 },
    ],
    [
      { x: 48, y: 148 },
      { x: 128, y: 82 },
      { x: 232, y: 86 },
      { x: 312, y: 154 },
    ],
    [
      { x: 44, y: 154 },
      { x: 112, y: 78 },
      { x: 188, y: 124 },
      { x: 254, y: 70 },
      { x: 318, y: 150 },
    ],
    [
      { x: 42, y: 154 },
      { x: 98, y: 82 },
      { x: 164, y: 128 },
      { x: 218, y: 70 },
      { x: 280, y: 112 },
      { x: 320, y: 166 },
    ],
  ];
  const points = presets[Math.min(Math.max(total, 3), 6) - 3];
  return points[index] ?? points[points.length - 1];
}

function iconFor(type: RouteNode["type"]) {
  if (type === "building") return "⌂";
  if (type === "lake") return "≈";
  if (type === "drink") return "☕";
  if (type === "pet") return " paw";
  if (type === "sunset") return "☼";
  return "✦";
}

function shortTitle(title: string) {
  return title.length > 6 ? `${title.slice(0, 6)}…` : title;
}

export function RouteLifeMap({ gpsPoints, photos, isDemoMode, startTime, endTime }: Props) {
  const nodes = makeNodes(photos, startTime, endTime);
  const points = nodes.map((_, index) => pointFor(index, nodes.length));
  const path = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      const controlX = (previous.x + point.x) / 2;
      const controlY = (previous.y + point.y) / 2 + (index % 2 === 0 ? 34 : -34);
      return `Q ${controlX} ${controlY} ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <div className="life-map-card route-journal-card" aria-label="校园 Walk 手账路线图">
      <div className="route-journal-heading">
        <div>
          <strong>路线手账图</strong>
          <span>按打卡节点生成，每段标出大概用时</span>
        </div>
        <small>{isDemoMode ? "演示轨迹" : gpsPoints.length > 1 ? "GPS 轨迹" : "照片节点"}</small>
      </div>

      <svg className="route-journal-svg" viewBox="0 0 360 240" role="img">
        <defs>
          <filter id="routeNodeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1d5244" floodOpacity="0.16" />
          </filter>
        </defs>
        <rect x="8" y="10" width="344" height="220" rx="24" className="route-paper-bg" />
        <path d={path} className="route-journal-line" />

        {nodes.slice(1).map((node, index) => {
          const start = points[index];
          const end = points[index + 1];
          const x = (start.x + end.x) / 2;
          const y = (start.y + end.y) / 2 + (index % 2 === 0 ? -18 : 22);
          return (
            <g key={`${node.id}-segment`}>
              <rect x={x - 26} y={y - 13} width="52" height="26" rx="13" className="route-segment-pill" />
              <text x={x} y={y + 5} textAnchor="middle" className="route-segment-text">
                {node.segmentMinute}min
              </text>
            </g>
          );
        })}

        {nodes.map((node, index) => {
          const point = points[index];
          const labelX = Math.min(252, Math.max(18, point.x - 42));
          const labelY = point.y > 140 ? point.y - 78 : point.y + 36;
          return (
            <g key={node.id} filter="url(#routeNodeShadow)">
              <circle cx={point.x} cy={point.y} r="18" className="route-node-circle" />
              <text x={point.x} y={point.y + 7} textAnchor="middle" className="route-node-index">
                {node.index}
              </text>
              <rect x={labelX} y={labelY} width="90" height="50" rx="14" className="route-node-label" />
              <text x={labelX + 10} y={labelY + 20} className="route-node-title">
                {iconFor(node.type)} {shortTitle(node.title)}
              </text>
              <text x={labelX + 10} y={labelY + 40} className="route-node-minute">
                到达 {node.minute}min
              </text>
            </g>
          );
        })}
      </svg>

      <div className="route-journal-list">
        {nodes.map((node) => (
          <span key={`${node.id}-list`}>
            {node.index}. {shortTitle(node.title)} · 到达 {node.minute}min
          </span>
        ))}
      </div>
    </div>
  );
}
