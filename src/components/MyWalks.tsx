import { useMemo } from "react";
import { Camera, Clock, CreditCard, Database, Plus, Route, Trash2 } from "lucide-react";
import { PersonaCard } from "./persona/PersonaCard";
import type { PersonaResult, WalkRecord } from "../types";
import type { LocalDataClearScope } from "../storage";
import { formatDay, formatDistance, formatDuration } from "../utils";

type Props = {
  persona?: PersonaResult;
  walks: WalkRecord[];
  onOpen: (walkId: string) => void;
  onStartWalk: () => void;
  onRetest: () => void;
  onViewPersona: () => void;
  onOpenGallery: () => void;
  storageBytes: number;
  onClearLocalData: (scope: LocalDataClearScope) => void;
};

const tipBase = "/assets/tips/schoolwalk_tip_by_persona";

function preferWebp(src: string) {
  return src.replace(/\.png$/i, ".webp");
}

const personaTipMap: Record<string, string[]> = {
  "生无可恋的定海神针": [
    `${tipBase}/01_生无可恋的定海神针/01_tip_每坐45分钟_起身动一动.png`,
    `${tipBase}/01_生无可恋的定海神针/02_tip_保持正确坐姿_减少久坐伤害.png`,
  ],
  "日间休眠的午夜永动机": [
    `${tipBase}/02_日间休眠的午夜永动机/01_tip_固定起床时间_逐步早睡.png`,
    `${tipBase}/02_日间休眠的午夜永动机/02_tip_多晒太阳_少喝咖啡和浓茶.png`,
  ],
  "碳水过载的昏迷患者": [
    `${tipBase}/03_碳水过载的昏迷患者/01_tip_多蔬菜蛋白_少高油高糖.png`,
    `${tipBase}/03_碳水过载的昏迷患者/02_tip_饭后走一走_别久坐.png`,
  ],
  "脑内开会的迷航舵手": [
    `${tipBase}/04_脑内开会的迷航舵手/01_tip_先做5分钟_别让焦虑开会.png`,
    `${tipBase}/04_脑内开会的迷航舵手/02_tip_走出去转一转_别一直内耗.png`,
  ],
  "持续掉线的单机玩家": [
    `${tipBase}/05_持续掉线的单机玩家/01_tip_约熟人见面_轻松连接.png`,
    `${tipBase}/05_持续掉线的单机玩家/02_tip_做真实的自己就够啦.png`,
  ],
  "薛定谔的自律选手": [
    `${tipBase}/06_薛定谔的自律选手/01_tip_选一个小目标_先做起来.png`,
    `${tipBase}/06_薛定谔的自律选手/02_tip_把目标放在固定场景里.png`,
  ],
  "心如止水的低耗电待机党": [
    `${tipBase}/07_心如止水的低耗电待机党/01_tip_每天出门走一走_透气就好.png`,
    `${tipBase}/07_心如止水的低耗电待机党/02_tip_规律作息饮食_维持基本能量.png`,
  ],
  "血条全满的校园特工": [
    `${tipBase}/08_血条全满的校园特工/01_tip_规律作息运动_状态稳定就好.png`,
    `${tipBase}/08_血条全满的校园特工/02_tip_带动同伴_一起变健康.png`,
  ],
  "五维掉线的脆皮大学生": [
    `${tipBase}/09_五维掉线的脆皮大学生/01_tip_先从一件小事开始改变.png`,
    `${tipBase}/09_五维掉线的脆皮大学生/02_tip_需要帮助时_记得求助.png`,
  ],
};

function getRandomTipByPersona(personaName?: string, seed?: string) {
  const tips = personaName ? personaTipMap[personaName] : undefined;
  if (!tips?.length) return null;
  const value = Array.from(seed || personaName || "").reduce((total, char) => total + char.charCodeAt(0), 0);
  return preferWebp(tips[value % tips.length]);
}

export function MyWalks({
  persona,
  walks,
  onOpen,
  onStartWalk,
  onRetest,
  onViewPersona,
  onOpenGallery,
  storageBytes,
  onClearLocalData,
}: Props) {
  const finishedWalks = walks.filter((walk) => walk.endTime);
  const totalDistance = finishedWalks.reduce((total, walk) => total + (walk.isDemoMode ? 0 : walk.distanceMeters), 0);
  const totalPhotos = finishedWalks.reduce((total, walk) => total + walk.photos.length, 0);
  const totalCards = finishedWalks.filter((walk) => walk.shareImageGenerated || walk.hasGeneratedShareImage).length;
  const mostRoute = getMostCommon(finishedWalks.map((walk) => walk.routeName));
  const mostStatus = getMostCommon(finishedWalks.map((walk) => walk.dailyStatusName).filter(Boolean) as string[]);
  const personaTip = useMemo(() => getRandomTipByPersona(persona?.personaName, persona?.createdAt), [persona?.personaName, persona?.createdAt]);

  return (
    <section className="page my-page">
      <header className="summary-header">
        <div>
          <span>我的记录</span>
          <h1>校园 Walk 档案</h1>
          <p>把零散照片整理成一条条生活路线。</p>
        </div>
        <button className="icon-button" onClick={onStartWalk} aria-label="新建记录">
          <Plus size={20} />
        </button>
      </header>

      <div className="persona-mini-card">
        <span>我的爽活人格图鉴</span>
        {persona ? (
          <>
            <PersonaCard persona={persona} compact onClick={onViewPersona} />
            {personaTip && (
              <img
                className="my-persona-tip-image"
                src={personaTip}
                alt={`${persona.personaName} tip`}
                loading="lazy"
                decoding="async"
              />
            )}
            <p>最近一次测试：{formatDay(persona.createdAt)}</p>
            <div className="mini-actions my-persona-actions">
              <button onClick={onRetest}>重新测试</button>
              <button onClick={onOpenGallery}>查看全人格图鉴</button>
            </div>
          </>
        ) : (
          <>
            <h2>还没有人格图鉴</h2>
            <p>先测爽活人格，再出门回血。</p>
            <div className="mini-actions">
              <button onClick={onRetest}>生成我的人格图鉴</button>
            </div>
          </>
        )}
      </div>

      <div className="archive-stats">
        <div><strong>{finishedWalks.length}</strong><span>累计 Walk</span></div>
        <div><strong>{formatDistance(totalDistance)}</strong><span>累计距离</span></div>
        <div><strong>{totalPhotos}</strong><span>累计照片</span></div>
        <div><strong>{totalCards}</strong><span>生活卡</span></div>
        <div><strong>{mostStatus || "暂无"}</strong><span>常选状态</span></div>
        <div><strong>{mostRoute || "暂无"}</strong><span>常走路线</span></div>
      </div>

      <div className="storage-manager">
        <div className="storage-manager-head">
          <div>
            <span>本地存储管理</span>
            <h2>释放照片占用空间</h2>
          </div>
          <div className="storage-size">
            <Database size={18} />
            <strong>{formatStorageSize(storageBytes)}</strong>
          </div>
        </div>
        <p>上传照片提示“太大”时，可以先清理旧 Walk。照片和记录只保存在当前浏览器本地，清理后无法恢复。</p>
        <div className="storage-actions">
          <button className="storage-clean-button" onClick={() => onClearLocalData("walks")}>
            <Trash2 size={17} />
            清理 Walk 记录和照片
          </button>
          <button className="storage-clear-all-button" onClick={() => onClearLocalData("all")}>
            清空全部本地数据
          </button>
        </div>
      </div>

      {finishedWalks.length === 0 ? (
        <div className="empty-state">
          <Route size={34} />
          <h2>还没有完成的 Walk</h2>
          <p>先去走一圈，回来的时候这里就会长出第一条路线。</p>
          <button className="primary-button" onClick={onStartWalk}>开始一次 Walk</button>
        </div>
      ) : (
        <div className="walk-list">
          {finishedWalks.map((walk) => {
            const cover = walk.photos[0]?.imageDataUrl;
            return (
              <button className="walk-record-card archive-card" key={walk.id} onClick={() => onOpen(walk.id)}>
                <div className="archive-cover">{cover ? <img src={cover} alt={walk.routeName} /> : <Route size={24} />}</div>
                <div>
                  <strong>{walk.routeName}</strong>
                  <span>
                    {formatDay(walk.startTime)} · 今日状态：{walk.dailyStatusName ?? "自由走走中"}
                    {walk.personaName && ` · 爽活人格：${walk.personaName}`}
                  </span>
                  <div className="walk-meta">
                    <span><Clock size={16} />{formatDuration(walk.startTime, walk.endTime)}</span>
                    <span>{walk.isDemoMode ? "演示轨迹模式" : formatDistance(walk.distanceMeters)}</span>
                    <span><Camera size={16} />{walk.photos.length} 张</span>
                    <span>{walk.useGps && !walk.isDemoMode ? "GPS 记录" : "非 GPS 记录"}</span>
                    <span><CreditCard size={16} />{walk.shareImageGenerated || walk.hasGeneratedShareImage ? "已生成生活卡" : "未生成生活卡"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getMostCommon(items: string[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function formatStorageSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`;
}
