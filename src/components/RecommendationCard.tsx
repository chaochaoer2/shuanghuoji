import { ArrowRight, Shuffle } from "lucide-react";
import type { PersonaResult, RouteRecommendation } from "../types";

type Props = {
  recommendation: RouteRecommendation;
  persona?: PersonaResult;
  onStart: () => void;
  onChangeStatus: () => void;
  onChooseRoute: () => void;
};

export function RecommendationCard({ recommendation, persona, onStart, onChangeStatus, onChooseRoute }: Props) {
  return (
    <section className="page result-page">
      <div className="result-hero">
        <span>今日推荐</span>
        <h1>{recommendation.routeName}</h1>
        <p>{recommendation.reason}</p>
      </div>
      <div className="result-grid">
        {persona && (
          <div>
            <span>爽活人格</span>
            <strong>{persona.personaName}</strong>
          </div>
        )}
        <div>
          <span>今日状态</span>
          <strong>{recommendation.dailyStatusName ?? "自由走走中"}</strong>
        </div>
        <div>
          <span>推荐时长</span>
          <strong>{recommendation.recommendedDuration}</strong>
        </div>
        <div>
          <span>同行建议</span>
          <strong>{recommendation.socialMode}</strong>
        </div>
      </div>
      <div className="template-note">{recommendation.templateText}</div>
      <button className="primary-button full" onClick={onStart}>
        开始这条 Walk
        <ArrowRight size={18} />
      </button>
      <button className="secondary-button ghost" onClick={onChangeStatus}>
        <Shuffle size={18} />
        换个状态
      </button>
      <button className="secondary-button ghost" onClick={onChooseRoute}>
        自己选路线
      </button>
    </section>
  );
}
