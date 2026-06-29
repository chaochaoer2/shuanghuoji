import { ArrowRight, Leaf } from "lucide-react";
import { getRouteById } from "../schoolwalkData";
import type { PersonaResult } from "../types";

type Props = {
  persona?: PersonaResult;
  onChooseRoute: () => void;
  onTakePersonaTest: () => void;
  onViewPersona: () => void;
  onOpenGallery: () => void;
  onDailyStatus: (statusId: string) => void;
};

export function HomePage({ persona, onChooseRoute, onTakePersonaTest, onViewPersona, onOpenGallery }: Props) {
  const personaRoute = getRouteById(persona?.mainRouteId);

  return (
    <section className="page home-page">
      <div className="hero-band">
        <span className="hero-doodle hero-doodle-sun" aria-hidden="true" />
        <span className="hero-doodle hero-doodle-star" aria-hidden="true">★</span>
        <div className="brand-row">
          <span className="logo-badge">
            <Leaf size={22} />
          </span>
          <span>脆皮大学生的轻健康 SchoolWalk</span>
        </div>
        <picture className="home-poster-wrap">
          <source srcSet="/home-poster.webp" type="image/webp" />
          <img
            className="home-poster"
            src="/home-poster.png"
            alt="爽活迹首页海报"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-actions">
          <button className="primary-button" onClick={onTakePersonaTest}>
            极速爽活人格测试
            <ArrowRight size={19} />
          </button>
          <button className="secondary-button ghost" onClick={onChooseRoute}>
            跳过测试，直接开始 Walk
          </button>
          <button className="secondary-button ghost" onClick={onOpenGallery}>
            查看全人格图鉴
          </button>
        </div>
      </div>

      {persona && (
        <div className="persona-mini-card">
          <span>我的爽活人格</span>
          <h2>{persona.personaName}</h2>
          <p>默认路线：{personaRoute?.routeName ?? persona.mainRouteId}</p>
          <div className="mini-actions home-persona-actions">
            <button onClick={onViewPersona}>查看人格图鉴</button>
            <button onClick={onTakePersonaTest}>重新测试</button>
            <button className="home-walk-button" onClick={onChooseRoute}>开始一次 Walk</button>
          </div>
        </div>
      )}
    </section>
  );
}
