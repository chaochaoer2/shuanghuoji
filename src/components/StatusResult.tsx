import { ArrowRight, Shuffle } from "lucide-react";
import type { RouteRecommendation } from "../types";

type Props = {
  recommendation: RouteRecommendation;
  onStart: () => void;
  onChangeRoute: () => void;
};

export function StatusResult({ recommendation, onStart, onChangeRoute }: Props) {
  return (
    <section className="page result-page">
      <div className="result-hero">
        <span>你的今日爽活状态</span>
        <h1>{recommendation.status}</h1>
        <p>{recommendation.reason}</p>
      </div>

      <div className="result-grid">
        <div>
          <span>推荐路线</span>
          <strong>{recommendation.routeName}</strong>
        </div>
        <div>
          <span>推荐时长</span>
          <strong>{recommendation.recommendedDuration}</strong>
        </div>
        <div>
          <span>同行建议</span>
          <strong>{recommendation.socialMode}</strong>
        </div>
        <div>
          <span>推荐分享模板</span>
          <strong>{recommendation.templateName}</strong>
        </div>
      </div>

      <div className="template-note">{recommendation.templateText}</div>

      <button className="primary-button full" onClick={onStart}>
        开始这条 Walk
        <ArrowRight size={18} />
      </button>
      <button className="secondary-button ghost" onClick={onChangeRoute}>
        <Shuffle size={18} />
        换一条路线
      </button>
    </section>
  );
}
