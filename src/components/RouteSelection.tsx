import { ArrowLeft, ArrowRight, Route } from "lucide-react";
import { schoolRoutes } from "../schoolwalkData";

type Props = {
  onBack: () => void;
  onStart: (routeId: string) => void;
};

export function RouteSelection({ onBack, onStart }: Props) {
  return (
    <section className="page route-page">
      <header className="summary-header">
        <div>
          <span>路线选择</span>
          <h1>自己选一条校园 Walk</h1>
          <p>不测人格、不选状态，也可以直接出门回血。</p>
        </div>
        <button className="icon-button" onClick={onBack} aria-label="返回首页">
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="route-list">
        {schoolRoutes.map((route) => (
          <button className="route-card" key={route.routeId} onClick={() => onStart(route.routeId)}>
            <span className="route-icon">
              <Route size={22} />
            </span>
            <span>
              <strong>{route.routeName}</strong>
              <small>{route.routeDescription}</small>
              <em>
                {route.routeType} · {route.duration} · {route.socialMode}
              </em>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
      </div>
    </section>
  );
}
