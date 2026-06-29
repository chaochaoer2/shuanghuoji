import { useMemo, useState } from "react";
import { Download, ScrollText, WandSparkles } from "lucide-react";
import { generateHtmlShareImage } from "../htmlSharePoster";
import type { SharePosterMode } from "../shareCanvas";
import type { WalkRecord } from "../types";
import { formatDay, formatDistance, formatMaybeNumber } from "../utils";

type Props = {
  record: WalkRecord;
  onSave: (record: WalkRecord) => void;
  onBackToMyWalks: () => void;
};

type TemplateSelection = "auto" | SharePosterMode;

const templateOptions: Array<{ value: TemplateSelection; label: string; hint: string }> = [
  { value: "auto", label: "自动推荐", hint: "按照片数" },
  { value: "outing-proof", label: "出门证明", hint: "1-2张" },
  { value: "plog-cover", label: "Plog封面", hint: "3-4张" },
  { value: "route-handbook", label: "路线手账", hint: "5-6张" },
  { value: "stamp-collection", label: "集章路线", hint: "7-9张" },
  { value: "long-diary", label: "长图游记", hint: "10+张" },
];

function recommendedTemplateLabel(photoCount: number) {
  if (photoCount <= 0) return "路线纪念卡";
  if (photoCount <= 2) return "今日出门证明";
  if (photoCount <= 4) return "今日 Plog 封面";
  if (photoCount <= 6) return "校园路线手账";
  if (photoCount <= 9) return "校园集章路线";
  return "校园 Walk 长图游记";
}

function formatDurationText(startTime: string, endTime?: string) {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}小时${minutes}分钟`;
  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

function metricDistance(meters: number, isDemoMode?: boolean) {
  if (isDemoMode) return "--";
  return formatDistance(meters);
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function downloadGeneratedImage(dataUrl: string, filename: string) {
  const blob = dataUrlToBlob(dataUrl);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function WalkSummary({ record, onSave, onBackToMyWalks }: Props) {
  const [shareImage, setShareImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSelection>("auto");
  const duration = useMemo(() => formatDurationText(record.startTime, record.endTime), [record.startTime, record.endTime]);

  const createShare = async () => {
    setIsGenerating(true);
    try {
      const image = await generateHtmlShareImage(record, selectedTemplate === "auto" ? undefined : selectedTemplate);
      setShareImage(image);
      if (!record.shareImageGenerated && !record.hasGeneratedShareImage) {
        onSave({ ...record, shareImageGenerated: true, hasGeneratedShareImage: true });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="page summary-page">
      <header className="summary-header">
        <div>
          <span>这次校园 Walk 记录</span>
          <h1>{record.routeName}</h1>
          <p>
            {formatDay(record.startTime)} · 今日状态：{record.dailyStatusName ?? "自由走走中"}
            {record.personaName && ` · 爽活人格：${record.personaName}`}
          </p>
        </div>
        <button className="text-button" onClick={onBackToMyWalks}>
          我的记录
        </button>
      </header>

      <div className="template-note">今天走出去了一点点</div>
      {record.isDemoMode && <p className="metric-note strong">本次为演示轨迹，运动数据未记录。</p>}

      <div className="summary-stats walk-summary-grid">
        <div>
          <strong>{duration}</strong>
          <span>本次时长</span>
        </div>
        <div>
          <strong>{metricDistance(record.distanceMeters, record.isDemoMode)}</strong>
          <span>距离</span>
        </div>
        <div>
          <strong>{record.isDemoMode ? "--" : record.estimatedSteps}</strong>
          <span>估算步数</span>
        </div>
        <div>
          <strong>{formatMaybeNumber(record.averageSpeedKmh, " km/h", record.isDemoMode)}</strong>
          <span>平均速度</span>
        </div>
        <div>
          <strong>{formatMaybeNumber(record.estimatedCalories, " kcal", record.isDemoMode)}</strong>
          <span>估算卡路里</span>
        </div>
        <div>
          <strong>{record.photos.length}</strong>
          <span>照片数量</span>
        </div>
      </div>

      <div className="timeline compact">
        <h2>照片时间轴</h2>
        {record.photos.length === 0 ? (
          <p className="empty-text">这次还没有照片。长图手账会根据你上传的照片自动延展。</p>
        ) : (
          record.photos.map((photo, index) => (
            <article className="timeline-item" key={photo.id}>
              <img src={photo.imageDataUrl} alt={photo.locationName || `照片 ${index + 1}`} />
              <div>
                <span>
                  {index + 1}. {photo.locationName || "今天的小瞬间"}
                </span>
                <strong>#{photo.moodTag || "散步"} · {photo.todayStatus ?? record.dailyStatusName ?? "校园 Walk"}</strong>
                <p>{photo.note || `记录在 ${formatDistance(photo.distanceAtMoment ?? 0)}`}</p>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="generator-panel">
        <div className="section-heading tight">
          <div>
            <span>自动分享模板</span>
            <h2>Schoolwalk 手账分享图</h2>
            <p className="template-helper">
              根据照片数量自动生成出门证明、plog 封面、路线手账、集章路线或长图游记；路线、节点、照片和文字都由本次 Walk 自动生成。
            </p>
          </div>
          <ScrollText size={24} />
        </div>

        <div className="recommended-template-card">
          <WandSparkles size={20} />
          <div>
            <strong>推荐模板：{recommendedTemplateLabel(record.photos.length)}</strong>
            <span>当前 {record.photos.length} 张照片。可以按推荐生成，也可以手动切换模板。</span>
          </div>
        </div>

        <div className="template-switch share-template-grid">
          {templateOptions.map((option) => (
            <button
              className={selectedTemplate === option.value ? "active" : ""}
              key={option.value}
              onClick={() => setSelectedTemplate(option.value)}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>{option.hint}</span>
            </button>
          ))}
        </div>

        <button className="primary-button full" onClick={createShare} disabled={isGenerating}>
          <WandSparkles size={19} />
          {isGenerating ? "生成中..." : "生成 Schoolwalk 分享图"}
        </button>
      </div>

      {shareImage && (
        <div className="share-preview">
          <img src={shareImage} alt="生成的校园 Walk 长图路线手账" />
          <button
            className="download-button"
            onClick={() => downloadGeneratedImage(shareImage, `爽活迹-${record.routeName}.png`)}
            type="button"
          >
            <Download size={18} />
            下载图片
          </button>
          <p className="save-image-hint">如果手机内置浏览器没有弹出保存，请长按上方图片保存。</p>
        </div>
      )}
    </section>
  );
}
