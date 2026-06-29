import { useEffect, useMemo, useState } from "react";
import { Camera, Footprints, Home, MapPinned, Sparkles, UserRound, Users } from "lucide-react";
import { HomePage } from "./components/HomePage";
import { MyWalks } from "./components/MyWalks";
import { SocialPage } from "./components/SocialPage";
import { hasAmapConfig } from "./components/AMapWalkMap";
import { PersonaResult as PersonaResultPage } from "./pages/PersonaResult";
import { PersonaGallery } from "./pages/PersonaGallery";
import { PersonaTest } from "./components/PersonaTest";
import { PreWalkStart } from "./components/PreWalkStart";
import { RecommendationCard } from "./components/RecommendationCard";
import { RouteSelection } from "./components/RouteSelection";
import { WalkRecorder } from "./components/WalkRecorder";
import { WalkSummary } from "./components/WalkSummary";
import {
  recommendationFromDailyStatus,
  recommendationFromPersona,
  recommendationFromRoute,
  getPersonaPreviewResult,
} from "./schoolwalkData";
import {
  clearLocalData,
  getLocalStorageUsageBytes,
  getPersonaResult,
  getWalks,
  savePersonaResult,
  upsertWalk,
} from "./storage";
import type { LocalDataClearScope } from "./storage";
import type { PersonaResult, RouteRecommendation, WalkRecord } from "./types";
import { createEmptyMetrics, createId, isAbnormalDuration } from "./utils";

type View =
  | { name: "home" }
  | { name: "routeSelect" }
  | { name: "personaTest" }
  | { name: "personaResult"; result: PersonaResult }
  | { name: "personaGallery" }
  | { name: "recommendation"; recommendation: RouteRecommendation }
  | { name: "preWalk"; recommendation: RouteRecommendation }
  | { name: "record"; walkId: string }
  | { name: "summary"; walkId: string }
  | { name: "social" }
  | { name: "my" };

export function App() {
  const [walks, setWalks] = useState<WalkRecord[]>(() => getWalks());
  const [persona, setPersona] = useState<PersonaResult | undefined>(() => getPersonaResult());
  const [storageBytes, setStorageBytes] = useState(() => getLocalStorageUsageBytes());
  const [view, setView] = useState<View>({ name: "home" });

  useEffect(() => {
    const onStorage = () => {
      setWalks(getWalks());
      setPersona(getPersonaResult());
      setStorageBytes(getLocalStorageUsageBytes());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const activeWalk = useMemo(() => {
    if (view.name !== "record" && view.name !== "summary") return undefined;
    return walks.find((walk) => walk.id === view.walkId);
  }, [view, walks]);

  const syncWalks = () => {
    setWalks(getWalks());
    setPersona(getPersonaResult());
    setStorageBytes(getLocalStorageUsageBytes());
  };

  const saveWalk = (record: WalkRecord) => {
    upsertWalk(record);
    syncWalks();
  };

  const startWalk = (recommendation: RouteRecommendation, useGps: boolean) => {
    const effectiveUseGps = useGps && hasAmapConfig();
    const record: WalkRecord = {
      id: createId("walk"),
      routeId: recommendation.routeId,
      routeName: recommendation.routeName,
      routeSlogan: recommendation.routeSlogan,
      dailyStatusId: recommendation.dailyStatusId,
      dailyStatusName: recommendation.dailyStatusName,
      dailyStatusDescription: recommendation.dailyStatusDescription,
      dailyRecommendationReason: recommendation.dailyRecommendationReason,
      personaId: recommendation.personaId ?? persona?.personaId,
      personaName: recommendation.personaName ?? persona?.personaName,
      camp: recommendation.camp ?? persona?.camp,
      shareCopy: recommendation.shareCopy ?? persona?.shareCopy,
      startTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      photos: [],
      moodTags: [],
      gpsPoints: [],
      gpsMode: effectiveUseGps ? "gps" : "demo",
      useGps: effectiveUseGps,
      isDemoMode: !effectiveUseGps,
      gpsErrorMessage: effectiveUseGps ? undefined : "你选择了演示模式，或当前未配置高德 Key。",
      todayStatus: "满血巡游中",
      templateName: recommendation.templateName,
      templateText: recommendation.templateText,
      recommendedDuration: recommendation.recommendedDuration,
      socialMode: recommendation.socialMode,
      routeText: recommendation.routeText,
      ...createEmptyMetrics(),
    };

    upsertWalk(record);
    syncWalks();
    setView({ name: "record", walkId: record.id });
  };

  const prepareWalk = (recommendation: RouteRecommendation) => {
    const running = walks.find((walk) => !walk.endTime);
    if (running && isAbnormalDuration(running.startTime)) {
      window.alert("上一次 Walk 已持续超过 12 小时，已判定为异常记录，请重新开始。");
      saveWalk({ ...running, endTime: new Date().toISOString() });
      setView({ name: "preWalk", recommendation });
      return;
    }
    if (running) {
      const keepGoing = window.confirm("当前还有未结束的 Walk。\n确定：继续上一次 Walk\n取消：重新开始");
      if (keepGoing) {
        setView({ name: "record", walkId: running.id });
        return;
      }
      saveWalk({ ...running, endTime: new Date().toISOString() });
    }
    setView({ name: "preWalk", recommendation });
  };

  const finishWalk = (record: WalkRecord) => {
    const finished = { ...record, endTime: record.endTime ?? new Date().toISOString() };
    saveWalk(finished);
    setView({ name: "summary", walkId: finished.id });
  };

  const completePersona = (result: PersonaResult) => {
    savePersonaResult(result);
    setPersona(result);
    setStorageBytes(getLocalStorageUsageBytes());
    setView({ name: "personaResult", result });
  };

  const handleClearLocalData = (scope: LocalDataClearScope) => {
    const message =
      scope === "walks"
        ? "确定要清理本地 Walk 记录和照片吗？人格图鉴会保留，但已保存的路线、照片和分享图状态会删除。"
        : "确定要清空全部本地数据吗？这会删除 Walk 记录、照片和人格图鉴，操作后无法恢复。";
    if (!window.confirm(message)) return;
    clearLocalData(scope);
    setWalks(getWalks());
    const nextPersona = getPersonaResult();
    setPersona(nextPersona);
    setStorageBytes(getLocalStorageUsageBytes());
    if (scope === "all") setView({ name: "home" });
    window.alert(scope === "walks" ? "已清理本地 Walk 记录和照片。" : "已清空本地数据。");
  };

  const openRecorder = () => {
    const running = walks.find((walk) => !walk.endTime);
    if (running) {
      if (isAbnormalDuration(running.startTime)) {
        window.alert("上一次 Walk 已持续超过 12 小时，请重新开始。");
        saveWalk({ ...running, endTime: new Date().toISOString() });
        setView({ name: "routeSelect" });
        return;
      }
      setView({ name: "record", walkId: running.id });
      return;
    }
    if (persona) {
      setView({ name: "recommendation", recommendation: recommendationFromPersona(persona) });
      return;
    }
    setView({ name: "routeSelect" });
  };

  return (
    <div className="app-shell">
      <main className="screen">
        {view.name === "home" && (
          <HomePage
            persona={persona}
            onChooseRoute={() => setView({ name: "routeSelect" })}
            onTakePersonaTest={() => setView({ name: "personaTest" })}
            onViewPersona={() => persona && setView({ name: "personaResult", result: persona })}
            onOpenGallery={() => setView({ name: "personaGallery" })}
            onDailyStatus={(statusId) => setView({ name: "recommendation", recommendation: recommendationFromDailyStatus(statusId, persona) })}
          />
        )}
        {view.name === "routeSelect" && (
          <RouteSelection onBack={() => setView({ name: "home" })} onStart={(routeId) => prepareWalk(recommendationFromRoute(routeId, persona))} />
        )}
        {view.name === "personaTest" && <PersonaTest onBack={() => setView({ name: "home" })} onDone={completePersona} />}
        {view.name === "personaResult" && (
          <PersonaResultPage
            result={view.result}
            onStartMain={() => prepareWalk(recommendationFromPersona(view.result))}
            onStartSub={() => view.result.subRouteId && prepareWalk(recommendationFromRoute(view.result.subRouteId, view.result))}
            onSave={() => {
              savePersonaResult(view.result);
              setPersona(view.result);
              window.alert("人格图鉴已保存到本地。");
            }}
            onRetest={() => setView({ name: "personaTest" })}
            onOpenGallery={() => setView({ name: "personaGallery" })}
          />
        )}
        {view.name === "personaGallery" && (
          <PersonaGallery
            onBack={() => {
              if (persona) setView({ name: "personaResult", result: persona });
              else setView({ name: "home" });
            }}
            onSelect={(personaId) => setView({ name: "personaResult", result: getPersonaPreviewResult(personaId) })}
            onStartTest={() => setView({ name: "personaTest" })}
          />
        )}
        {view.name === "recommendation" && (
          <RecommendationCard
            persona={persona}
            recommendation={view.recommendation}
            onStart={() => prepareWalk(view.recommendation)}
            onChangeStatus={() => setView({ name: "home" })}
            onChooseRoute={() => setView({ name: "routeSelect" })}
          />
        )}
        {view.name === "preWalk" && (
          <PreWalkStart
            recommendation={view.recommendation}
            onAllowGps={() => startWalk(view.recommendation, true)}
            onUseDemo={() => startWalk(view.recommendation, false)}
          />
        )}
        {view.name === "record" && activeWalk && <WalkRecorder record={activeWalk} onSave={saveWalk} onFinish={finishWalk} />}
        {view.name === "summary" && activeWalk && (
          <WalkSummary record={activeWalk} onSave={saveWalk} onBackToMyWalks={() => setView({ name: "my" })} />
        )}
        {view.name === "social" && (
          <SocialPage
            persona={persona}
            walks={walks}
            onChooseRoute={() => setView({ name: "routeSelect" })}
            onStartWalk={openRecorder}
          />
        )}
        {view.name === "my" && (
          <MyWalks
            persona={persona}
            walks={walks}
            onRetest={() => setView({ name: "personaTest" })}
            onViewPersona={() => persona && setView({ name: "personaResult", result: persona })}
            onOpenGallery={() => setView({ name: "personaGallery" })}
            onOpen={(walkId) => setView({ name: "summary", walkId })}
            onStartWalk={openRecorder}
            storageBytes={storageBytes}
            onClearLocalData={handleClearLocalData}
          />
        )}
      </main>

      <nav className="tabbar" aria-label="主导航">
        <button className={view.name === "home" ? "active" : ""} onClick={() => setView({ name: "home" })}>
          <Home size={20} />
          首页
        </button>
        <button className={view.name === "record" || view.name === "routeSelect" || view.name === "preWalk" ? "active" : ""} onClick={openRecorder}>
          <Footprints size={20} />
          记录
        </button>
        <button className={view.name === "social" ? "active" : ""} onClick={() => setView({ name: "social" })}>
          <Users size={20} />
          广场
        </button>
        <button className={view.name === "my" || view.name === "summary" ? "active" : ""} onClick={() => setView({ name: "my" })}>
          <UserRound size={20} />
          我的
        </button>
      </nav>

      <div className="floating-mark" aria-hidden="true">
        <MapPinned size={18} />
        <Sparkles size={18} />
        <Camera size={18} />
      </div>
    </div>
  );
}
