import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, Clock, Flame, Footprints, Gauge, ImagePlus, MapPin, Navigation, Trash2, X } from "lucide-react";
import type { GpsPoint, PhotoNode, TrackStatus, WalkRecord } from "../types";
import {
  calculateMetrics,
  createId,
  formatDistance,
  formatDuration,
  formatMaybeNumber,
  formatMetricDistance,
  shouldAcceptGpsPoint,
  unique,
} from "../utils";
import { AMapWalkMap } from "./AMapWalkMap";

const moodOptions = ["低电量", "回血中", "散步", "晚风", "猫猫", "樱花"];
const routePoints = [
  { x: 16, y: 70 },
  { x: 28, y: 58 },
  { x: 43, y: 63 },
  { x: 55, y: 48 },
  { x: 68, y: 43 },
  { x: 77, y: 33 },
  { x: 88, y: 42 },
  { x: 64, y: 75 },
  { x: 35, y: 30 },
];

const MAX_PHOTO_EDGE = 1280;
const PHOTO_QUALITY = 0.78;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function compressImageDataUrl(dataUrl: string) {
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "#fffdf6";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

type Props = {
  record: WalkRecord;
  onSave: (record: WalkRecord) => void;
  onFinish: (record: WalkRecord) => void;
};

function toGpsPoint(position: GeolocationPosition): GpsPoint {
  return {
    id: createId("gps"),
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp || Date.now(),
    coordSystem: "wgs84",
  };
}

function appendGpsPoint(record: WalkRecord, point: GpsPoint) {
  const previous = record.gpsPoints[record.gpsPoints.length - 1];
  if (!shouldAcceptGpsPoint(previous, point)) return record;
  const gpsPoints = [...record.gpsPoints, point];
  return {
    ...record,
    gpsMode: "gps" as const,
    useGps: true,
    isDemoMode: false,
    gpsPoints,
    ...calculateMetrics(gpsPoints, record.startTime, record.endTime),
  };
}

function getGpsErrorMessage(error?: GeolocationPositionError) {
  if (!error) return "当前浏览器不支持定位，已进入演示轨迹模式。";
  if (error.code === error.PERMISSION_DENIED) return "定位权限被拒绝，已进入演示轨迹模式。";
  if (error.code === error.POSITION_UNAVAILABLE) return "暂时无法获取当前位置，已进入演示轨迹模式。";
  if (error.code === error.TIMEOUT) return "定位超时，已进入演示轨迹模式。";
  return "定位失败，已进入演示轨迹模式。";
}

export function WalkRecorder({ record, onSave, onFinish }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recordRef = useRef(record);
  const onSaveRef = useRef(onSave);
  const watchIdRef = useRef<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [preview, setPreview] = useState("");
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [moodTag, setMoodTag] = useState(moodOptions[2]);
  const [note, setNote] = useState("");

  useEffect(() => {
    recordRef.current = record;
  }, [record]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (record.endTime || !record.useGps || record.isDemoMode) return;
    if (!navigator.geolocation) {
      const next = {
        ...recordRef.current,
        gpsMode: "failed" as const,
        useGps: false,
        isDemoMode: true,
        gpsErrorMessage: getGpsErrorMessage(),
      };
      recordRef.current = next;
      onSaveRef.current(next);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const next = appendGpsPoint(recordRef.current, toGpsPoint(position));
        if (next !== recordRef.current) {
          recordRef.current = next;
          onSaveRef.current(next);
        }
      },
      (error) => {
        const next = {
          ...recordRef.current,
          gpsMode: "failed" as const,
          useGps: false,
          isDemoMode: true,
          gpsErrorMessage: getGpsErrorMessage(error),
        };
        recordRef.current = next;
        onSaveRef.current(next);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [record.endTime, record.isDemoMode, record.useGps]);

  const duration = useMemo(() => {
    void now;
    return formatDuration(record.startTime, record.endTime);
  }, [now, record.startTime, record.endTime]);

  const trackStatus: TrackStatus = record.isDemoMode ? "演示轨迹模式" : record.gpsMode === "failed" ? "定位失败" : "GPS 记录中";
  const currentPoint = record.correctedPoint ?? record.gpsPoints[record.gpsPoints.length - 1];

  const calibrateLocation = (point: GpsPoint) => {
    const next = {
      ...recordRef.current,
      correctedPoint: point,
      gpsErrorMessage: "已手动校准当前位置。GPS 仍会继续尝试记录轨迹。",
    };
    recordRef.current = next;
    onSave(next);
  };

  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsPhotoProcessing(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const compressed = await compressImageDataUrl(dataUrl);
      setPreview(compressed);
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const addPhoto = (event: FormEvent) => {
    event.preventDefault();
    if (!preview || !locationName.trim()) return;

    const latest = recordRef.current;
    const point = routePoints[latest.photos.length % routePoints.length];
    const gpsPoint = latest.correctedPoint ?? (latest.isDemoMode ? undefined : latest.gpsPoints[latest.gpsPoints.length - 1]);
    const photo: PhotoNode = {
      id: createId("photo"),
      imageDataUrl: preview,
      locationName: locationName.trim(),
      moodTag,
      note: note.trim(),
      createdAt: new Date().toISOString(),
      simulatedPosition: point,
      routeName: latest.routeName,
      todayStatus: latest.todayStatus,
      gpsPoint,
      distanceAtMoment: latest.isDemoMode ? undefined : latest.distanceMeters,
      distanceMetersAtCapture: latest.isDemoMode ? undefined : latest.distanceMeters,
      dailyStatusName: latest.dailyStatusName,
      personaName: latest.personaName,
      routeId: latest.routeId,
    };

    const next = {
      ...latest,
      photos: [...latest.photos, photo],
      moodTags: unique([...latest.moodTags, moodTag, latest.todayStatus ?? "散步"]),
    };

    try {
      recordRef.current = next;
      onSave(next);
    } catch {
      recordRef.current = latest;
      window.alert("这张照片太大了，本地存储放不下。请换一张更小的照片再试。");
      return;
    }
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLocationName("");
    setMoodTag(moodOptions[2]);
    setNote("");
  };

  const clearPendingPhoto = () => {
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deletePhoto = (photoId: string) => {
    if (!window.confirm("确定删除这张照片吗？删除后可以重新上传。")) return;
    const latest = recordRef.current;
    const next = {
      ...latest,
      photos: latest.photos.filter((photo) => photo.id !== photoId),
      shareImageGenerated: false,
      hasGeneratedShareImage: false,
    };
    recordRef.current = next;
    onSave(next);
  };

  const finish = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    const finishedAt = new Date().toISOString();
    const latest = recordRef.current;
    const finalMetrics = latest.isDemoMode ? {} : calculateMetrics(latest.gpsPoints, latest.startTime, finishedAt);
    onFinish({ ...latest, ...finalMetrics, endTime: finishedAt });
  };

  return (
    <section className="page recorder-page">
      <header className="record-header">
        <div>
          <span>{trackStatus}</span>
          <h1>{record.routeName}</h1>
        </div>
        <button className="finish-button" onClick={finish}>
          <Check size={18} />
          结束 Walk
        </button>
      </header>

      <div className="status-strip">
        <span>今日状态：{record.dailyStatusName ?? "自由走走中"}</span>
        {record.personaName && <span>爽活人格：{record.personaName}</span>}
        <strong>推荐路线：{record.routeName}</strong>
        <small>{record.routeSlogan ?? record.templateText ?? "不卷步数，只记录一次出门回血。"}</small>
      </div>

      <div className="stat-grid walk-metrics-grid">
        <div>
          <Clock size={18} />
          <span>已用</span>
          <strong>{duration}</strong>
        </div>
        <div>
          <Navigation size={18} />
          <span>走过</span>
          <strong>{formatMetricDistance(record.distanceMeters, record.isDemoMode)}</strong>
        </div>
        <div>
          <Camera size={18} />
          <span>照片节点</span>
          <strong>{record.photos.length} 张</strong>
        </div>
        <div>
          <Footprints size={18} />
          <span>大概步数</span>
          <strong>{record.isDemoMode ? "--" : record.estimatedSteps}</strong>
        </div>
        <div>
          <Gauge size={18} />
          <span>慢慢走的速度</span>
          <strong>{formatMaybeNumber(record.averageSpeedKmh, " km/h", record.isDemoMode)}</strong>
        </div>
        <div>
          <Flame size={18} />
          <span>估算消耗</span>
          <strong>{formatMaybeNumber(record.estimatedCalories, " kcal", record.isDemoMode)}</strong>
        </div>
      </div>

      <p className="metric-note">
        {record.correctedPoint
          ? "当前位置已手动校准。步数与卡路里仍按 GPS 轨迹估算。"
          : record.isDemoMode
            ? record.gpsErrorMessage ?? "当前为演示轨迹模式，数据仅用于原型展示。"
            : "步数与卡路里为估算值。真实记录你走过的校园路。"}
      </p>

      <AMapWalkMap
        gpsPoints={record.gpsPoints}
        photos={record.photos}
        currentPoint={currentPoint}
        isDemoMode={record.isDemoMode}
        trackStatus={trackStatus}
        onPickLocation={calibrateLocation}
      />

      <form className="add-photo-panel" onSubmit={addPhoto}>
        <div className="upload-box-wrap">
        <label className="upload-box">
          {preview ? <img src={preview} alt="待添加照片预览" /> : <ImagePlus size={30} />}
          <span>{isPhotoProcessing ? "处理照片中" : preview ? "更换照片" : "添加照片节点"}</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} />
        </label>
        {preview && (
          <button className="photo-remove-button preview-remove" type="button" onClick={clearPendingPhoto} aria-label="删除待上传照片">
            <X size={17} />
          </button>
        )}
        </div>

        <div className="form-grid">
          <label>
            <span>这是哪里？</span>
            <input value={locationName} onChange={(event) => setLocationName(event.target.value)} placeholder="例如：南门草坪" />
          </label>
          <label>
            <span>此刻状态</span>
            <select value={moodTag} onChange={(event) => setMoodTag(event.target.value)}>
              {moodOptions.map((mood) => (
                <option key={mood}>{mood}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="full-input">
          <span>留一句，可不填</span>
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="边走边拍，一键生成校园 Walk 九宫格" />
        </label>

        <button className="secondary-button" type="submit" disabled={isPhotoProcessing || !preview || !locationName.trim()}>
          <MapPin size={18} />
          点亮这个节点
        </button>
      </form>

      <div className="timeline">
        <h2>照片时间轴</h2>
        {record.photos.length === 0 ? (
          <p className="empty-text">还没有照片节点。每张照片都是一个路线节点。</p>
        ) : (
          record.photos.map((photo, index) => (
            <article className="timeline-item" key={photo.id}>
              <div className="timeline-photo-wrap">
                <img src={photo.imageDataUrl} alt={photo.locationName} />
                <button className="photo-remove-button" type="button" onClick={() => deletePhoto(photo.id)} aria-label={`删除第 ${index + 1} 张照片`}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <span>
                  {index + 1}. {photo.locationName}
                </span>
                <strong>
                  #{photo.moodTag}
                  {!record.isDemoMode && ` · ${formatDistance(photo.distanceAtMoment ?? 0)}`}
                </strong>
                <p>{photo.note || photo.todayStatus || "每张照片都是一个路线节点"}</p>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="recorder-bottom-action">
        <button className="finish-button" onClick={finish}>
          <Check size={18} />
          结束 Walk
        </button>
      </div>
    </section>
  );
}
