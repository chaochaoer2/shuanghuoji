import AMapLoader from "@amap/amap-jsapi-loader";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GpsPoint, PhotoNode, TrackStatus } from "../types";
import { SimulatedMap } from "./SimulatedMap";

type Props = {
  gpsPoints: GpsPoint[];
  photos: PhotoNode[];
  currentPoint?: GpsPoint;
  isDemoMode: boolean;
  trackStatus: TrackStatus;
  onPickLocation?: (point: GpsPoint) => void;
};

const amapKey = import.meta.env.VITE_AMAP_KEY as string | undefined;
const amapSecurityCode = import.meta.env.VITE_AMAP_SECURITY_CODE as string | undefined;
const pi = Math.PI;
const axis = 6378245.0;
const offset = 0.00669342162296594323;

export function hasAmapConfig() {
  return Boolean(amapKey && amapSecurityCode);
}

function outOfChina(lat: number, lng: number) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(x: number, y: number) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLng(x: number, y: number) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) * 2.0) / 3.0;
  return ret;
}

function toAmapPosition(point: GpsPoint) {
  if (point.coordSystem === "gcj02") return [point.lng, point.lat];
  if (outOfChina(point.lat, point.lng)) return [point.lng, point.lat];
  let dLat = transformLat(point.lng - 105.0, point.lat - 35.0);
  let dLng = transformLng(point.lng - 105.0, point.lat - 35.0);
  const radLat = (point.lat / 180.0) * pi;
  let magic = Math.sin(radLat);
  magic = 1 - offset * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((axis * (1 - offset)) / (magic * sqrtMagic)) * pi);
  dLng = (dLng * 180.0) / ((axis / sqrtMagic) * Math.cos(radLat) * pi);
  return [point.lng + dLng, point.lat + dLat];
}

export function AMapWalkMap({ gpsPoints, photos, currentPoint, isDemoMode, trackStatus, onPickLocation }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const photoMarkersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const canUseAmap = hasAmapConfig() && !loadFailed;

  useEffect(() => {
    if (!canUseAmap || !containerRef.current || mapRef.current) return;
    if (!amapKey || !amapSecurityCode) return;
    (window as any)._AMapSecurityConfig = { securityJsCode: amapSecurityCode };
    AMapLoader.load({
      key: amapKey,
      version: "2.0",
      plugins: ["AMap.Scale"],
    })
      .then((AMap) => {
        const center = currentPoint ? toAmapPosition(currentPoint) : [113.373, 23.043];
        mapRef.current = new AMap.Map(containerRef.current, {
          zoom: 17,
          center,
          viewMode: "2D",
        });
        mapRef.current.addControl(new AMap.Scale());
        polylineRef.current = new AMap.Polyline({
          path: [],
          strokeColor: "#1f8b70",
          strokeWeight: 6,
          strokeOpacity: 0.85,
          lineJoin: "round",
        });
        mapRef.current.add(polylineRef.current);
        infoWindowRef.current = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -28) });
      })
      .catch(() => setLoadFailed(true));
  }, [canUseAmap, currentPoint]);

  useEffect(() => {
    return () => {
      mapRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !canUseAmap) return;
    const AMap = (window as any).AMap;
    const path = gpsPoints.map(toAmapPosition);

    polylineRef.current?.setPath(path);

    if (currentPoint) {
      const position = toAmapPosition(currentPoint);
      if (!currentMarkerRef.current) {
        currentMarkerRef.current = new AMap.Marker({
          position,
          anchor: "center",
          content: '<div class="amap-current-dot"></div>',
        });
        map.add(currentMarkerRef.current);
      } else {
        currentMarkerRef.current.setPosition(position);
      }
    }

    photoMarkersRef.current.forEach((marker) => map.remove(marker));
    photoMarkersRef.current = photos
      .filter((photo) => photo.gpsPoint)
      .map((photo, index) => {
        const point = photo.gpsPoint!;
        const position = toAmapPosition(point);
        const marker = new AMap.Marker({
          position,
          anchor: "bottom-center",
          content: `<button class="amap-photo-marker">${index + 1}</button>`,
        });
        marker.on("click", () => {
          infoWindowRef.current?.setContent(`
            <div class="map-info-card">
              <img src="${photo.imageDataUrl}" alt="${photo.locationName}" />
              <strong>${photo.locationName}</strong>
              <span>#${photo.moodTag}</span>
              <p>${photo.note || "每张照片都是一个路线节点"}</p>
            </div>
          `);
          infoWindowRef.current?.open(map, position);
        });
        map.add(marker);
        return marker;
      });

    const fitOverlays = [path.length > 1 ? polylineRef.current : undefined, currentMarkerRef.current, ...photoMarkersRef.current].filter(Boolean);
    if (fitOverlays.length) map.setFitView(fitOverlays, false, [44, 24, 44, 24]);
  }, [canUseAmap, currentPoint, gpsPoints, photos]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !canUseAmap || !isPicking || !onPickLocation) return;
    const onClick = (event: any) => {
      const lnglat = event.lnglat;
      onPickLocation({
        id: `manual-${Date.now()}`,
        lat: lnglat.getLat(),
        lng: lnglat.getLng(),
        accuracy: 0,
        timestamp: Date.now(),
        coordSystem: "gcj02",
      });
      setIsPicking(false);
    };
    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [canUseAmap, isPicking, onPickLocation]);

  const demoMessage = useMemo(() => {
    if (!hasAmapConfig()) return "当前为演示地图模式，配置高德 Key 后可显示真实地图。";
    if (isDemoMode) return "当前为演示轨迹模式，数据仅用于原型展示。";
    if (loadFailed) return "地图加载失败，已切换为演示地图模式。";
    return "";
  }, [isDemoMode, loadFailed]);

  if (!canUseAmap) {
    return (
      <div className="map-fallback">
        <p>{demoMessage}</p>
        <SimulatedMap photos={photos} gpsPoints={[]} />
      </div>
    );
  }

  return (
    <div className="amap-panel">
      <div className="track-pill">{trackStatus}</div>
      {isDemoMode && <div className="map-demo-note">GPS 暂时不可用，仍显示高德地图底图；轨迹数据仅用于原型展示。</div>}
      {onPickLocation && (
        <button className={`map-calibrate-button ${isPicking ? "active" : ""}`} onClick={() => setIsPicking((value) => !value)}>
          {isPicking ? "点击地图上的真实位置" : "校准当前位置"}
        </button>
      )}
      <div className="amap-container" ref={containerRef} />
    </div>
  );
}
