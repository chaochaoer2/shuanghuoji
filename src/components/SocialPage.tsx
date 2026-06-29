import { useState } from "react";
import { Heart, MapPinned, MessageCircle, Send, Sparkles, Trophy, Users } from "lucide-react";
import { getRouteById, schoolRoutes } from "../schoolwalkData";
import type { PersonaResult, WalkRecord } from "../types";

type Props = {
  persona?: PersonaResult;
  walks: WalkRecord[];
  onChooseRoute: () => void;
  onStartWalk: () => void;
};

type SocialTab = "buddy" | "share" | "explore";

const filters = ["同校", "轻社交", "饭后走", "安静同行", "30分钟内", "今晚有空"];

const buddyPosts = [
  {
    persona: "脑内开会的迷航舵手",
    nickname: "湖边降噪员",
    route: "图书馆后小路",
    duration: "约 30 分钟",
    time: "今晚 19:30",
    tag: "安静同行",
    text: "想找一个不用硬聊的搭子，看看猫、吹吹风就好。",
  },
  {
    persona: "持续掉线的单机玩家",
    nickname: "跨学院观察员",
    route: "学院交流家",
    duration: "约 45 分钟",
    time: "明天 16:20",
    tag: "轻社交",
    text: "想去别的学院走走，顺便交换一点校园情报。",
  },
  {
    persona: "碳水过载的昏迷患者",
    nickname: "饭后散步搭",
    route: "饭后追霞径",
    duration: "约 20 分钟",
    time: "饭后 20 分钟",
    tag: "饭搭子",
    text: "吃完不想直接躺，找人一起慢慢走一段。",
  },
];

const feedPosts = [
  {
    title: "饭后追霞径真的很适合低门槛启动",
    type: "🍜 美食路线",
    author: "饭后追霞径",
    persona: "碳水过载的昏迷患者",
    time: "2小时前",
    text: "从饭堂走到湖边，路上有冰粉，适合奖励一下完成 Walk 的自己。",
    stats: "26 赞 · 8 收藏",
  },
  {
    title: "操场刷圈怪也可以不无聊",
    type: "💭 路上所想",
    author: "保底刷圈员",
    persona: "薛定谔的自律选手",
    time: "昨天",
    text: "不想做决定的时候，固定路线反而很安心。走完一圈，脑子安静一点。",
    stats: "18 赞 · 5 评论",
  },
  {
    title: "图书馆后门的小路很适合发呆",
    type: "🌿 校园发现",
    author: "晚风收集者",
    persona: "心如止水的低耗电待机党",
    time: "3天前",
    text: "傍晚光线很好，人也不多，适合一边走一边整理今天的心情。",
    stats: "31 赞 · 12 收藏",
  },
];

const unlockStages = [
  { title: "本校路线", status: "已解锁", condition: "校园基础 Walk 已开放" },
  { title: "周边校园", status: "0/8", condition: "完成 8 次本校 Walk 后解锁" },
  { title: "广东高校", status: "未解锁", condition: "解锁 3 所周边校园后开放" },
  { title: "全国高校", status: "未解锁", condition: "广东高校路线完成后开放" },
];

export function SocialPage({ persona, walks, onChooseRoute, onStartWalk }: Props) {
  const [activeTab, setActiveTab] = useState<SocialTab>("buddy");
  const [toast, setToast] = useState("");
  const finishedWalks = walks.filter((walk) => walk.endTime);
  const personaRoute = getRouteById(persona?.mainRouteId);
  const nextUnlock = Math.min(finishedWalks.length, 8);
  const currentStage = nextUnlock >= 8 ? 2 : 1;

  const showNearbyToast = () => {
    setToast("附近搭子功能即将上线");
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section className="page social-page">
      <header className="summary-header social-header">
        <div>
          <span>搭子广场</span>
          <h1>找一位顺路回血的人</h1>
          <p>匹配路线搭子，也分享自己的路线、美食和沿路想法。</p>
        </div>
        <button className="icon-button" onClick={showNearbyToast} aria-label="附近搭子" title="附近搭子">
          <MapPinned size={20} />
        </button>
      </header>

      {activeTab === "buddy" ? (
        <div className="social-hero">
          <div>
            <span>今日推荐搭子路线</span>
            <h2>{personaRoute?.routeName ?? "萌宠偶遇官"}</h2>
            <p>
              {persona
                ? `${persona.personaName} 适合先从这条路线发起邀约。`
                : "脑内开会的迷航舵手 适合先从这条路线发起邀约。"}
            </p>
          </div>
          <button className="primary-button" onClick={onStartWalk}>
            先走一趟
            <Send size={18} />
          </button>
        </div>
      ) : (
        <div className="social-channel-note">
          <strong>{activeTab === "share" ? "看看大家最近走了什么" : "走走就能解锁新地图"}</strong>
          <span>
            {activeTab === "share"
              ? "路线、美食、校园发现和路上的小想法都可以分享。"
              : "从本校开始，慢慢走到更远的校园。"}
          </span>
        </div>
      )}

      <div className="social-tabs" aria-label="广场分类">
        <button className={activeTab === "buddy" ? "active" : ""} onClick={() => setActiveTab("buddy")}>
          找搭子
        </button>
        <button className={activeTab === "share" ? "active" : ""} onClick={() => setActiveTab("share")}>
          路线分享
        </button>
        <button className={activeTab === "explore" ? "active" : ""} onClick={() => setActiveTab("explore")}>
          探索
        </button>
      </div>

      {activeTab === "buddy" && (
        <section className="social-section">
          <div className="section-title-row">
            <h2><Users size={18} /> 推荐搭子</h2>
            <button>发布邀约</button>
          </div>
          <div className="filter-chips" aria-label="搭子筛选">
            {filters.map((filter, index) => <span className={index === 0 ? "active" : ""} key={filter}>{filter}</span>)}
          </div>
          <div className="buddy-list">
            {buddyPosts.map((post) => (
              <article className="buddy-card" key={`${post.nickname}-${post.time}`}>
                <div className="buddy-card-top">
                  <span>{post.persona}</span>
                  <em>{post.tag}</em>
                </div>
                <h3>{post.nickname}</h3>
                <p>{post.text}</p>
                <small className="buddy-route">{post.route}｜{post.duration}</small>
                <div className="buddy-card-bottom">
                  <span>{post.time}</span>
                  <button>约 TA 同行</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "share" && (
        <section className="social-section">
          <div className="section-title-row">
            <h2><MessageCircle size={18} /> 路线分享</h2>
            <button>写一条</button>
          </div>
          <div className="share-filter-tabs" aria-label="路线分享排序">
            <span className="active">热门</span>
            <span>最新</span>
            <span>同校</span>
          </div>
          <div className="feed-list">
            {feedPosts.map((post) => (
              <article className="feed-card" key={post.title}>
                <span className="feed-type">{post.type}</span>
                <strong>{post.title}</strong>
                <p>{post.text}</p>
                <small>by {post.author} · {post.persona} · {post.time}</small>
                <div className="feed-actions">
                  <span><Heart size={14} /> {post.stats}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "explore" && (
        <section className="social-section">
          <div className="section-title-row">
            <h2><Sparkles size={18} /> 校园解锁进度</h2>
            <button onClick={onChooseRoute}>查看更多</button>
          </div>
          <div className="unlock-strip inline" aria-label="校园解锁进度">
            <div className="unlock-strip-header">
              <span>当前进度：{currentStage} / 4 阶段</span>
            </div>
            <div className="unlock-progress">
              {unlockStages.map((stage, index) => (
                <div className={index === 0 || nextUnlock >= 8 ? "unlock-step unlocked" : "unlock-step"} key={stage.title}>
                  <strong>{stage.title}</strong>
                  <span>{index === 1 ? `${nextUnlock}/8` : stage.status}</span>
                  {index < 2 && <small>{stage.condition}</small>}
                </div>
              ))}
            </div>
          </div>

          <div className="section-title-row explore-subtitle">
            <h2><Trophy size={18} /> 本周热门 Walk</h2>
            <button>查看全部</button>
          </div>
          <div className="rank-groups">
            <div className="rank-list">
              {schoolRoutes.slice(0, 3).map((route, index) => (
                <div className="rank-row" key={route.routeId}>
                  <span>{index + 1}</span>
                  <strong>{route.routeName}</strong>
                  <em>{128 - index * 23} 次同行</em>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title-row explore-subtitle">
            <h2><MapPinned size={18} /> 大家的校园足迹</h2>
          </div>
          <div className="rank-groups">
            <div className="rank-mini-grid">
              <div><strong>42</strong><span>人发起同行邀约</span></div>
              <div><strong>16</strong><span>条路线本周活跃</span></div>
            </div>
          </div>
        </section>
      )}
      {toast && <div className="social-toast" role="status">{toast}</div>}
    </section>
  );
}
