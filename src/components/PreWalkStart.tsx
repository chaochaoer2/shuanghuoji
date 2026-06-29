import { MapPin, Navigation } from "lucide-react";
import type { RouteRecommendation } from "../types";
import { hasAmapConfig } from "./AMapWalkMap";

type Props = {
  recommendation: RouteRecommendation;
  onAllowGps: () => void;
  onUseDemo: () => void;
};

export function PreWalkStart({ recommendation, onAllowGps, onUseDemo }: Props) {
  const configured = hasAmapConfig();

  return (
    <section className="page prewalk-page">
      <div className="result-hero">
        <span>开始前确认</span>
        <h1>{recommendation.routeName}</h1>
        <p>今日状态：{recommendation.status}</p>
      </div>

      <div className="privacy-card">
        <MapPin size={28} />
        <h2>爽活迹需要获取你本次 Walk 的位置，用来生成路线轨迹。</h2>
        <p>位置信息仅保存在本地 demo 中，不会上传服务器。每张照片都是一个路线节点，最后生成校园 Walk 生活卡。</p>
        {configured ? (
          <strong>已读取高德 Key。点击允许并开始后，将请求浏览器定位权限。</strong>
        ) : (
          <strong>当前未配置高德 Key，将使用演示轨迹模式。</strong>
        )}
      </div>

      <button className="primary-button full" onClick={onAllowGps} disabled={!configured}>
        <Navigation size={18} />
        允许并开始
      </button>
      <button className="secondary-button ghost" onClick={onUseDemo}>
        不用 GPS，使用演示模式
      </button>
    </section>
  );
}
