import { useState } from "react";

type Props = {
  personaId: string;
  alt?: string;
  className?: string;
  compact?: boolean;
};

function displayImageSrc(src: string) {
  return src.replace(/\.png$/, ".webp");
}

export const personaArtworkMap: Record<
  string,
  {
    src: string;
    tag: string;
    title: string;
    description: string;
    mood: string;
    accent: "red" | "orange" | "yellow";
  }
> = {
  p_sedentary: {
    src: "/personas/cards/persona-01-sedentary-card.png",
    tag: "sedentary",
    title: "椅子封印",
    description: "女生瘫在椅子或沙发上，旁边有电脑、低电量图标、小植物，表情放空。",
    mood: "久坐、低电量、被椅子封印",
    accent: "orange",
  },
  p_sleep: {
    src: "/personas/cards/persona-02-sleep-card.png",
    tag: "sleep",
    title: "白天断电",
    description: "女生抱着咖啡杯或枕头，身后有月亮和太阳，像熬夜后白天断电。",
    mood: "夜里精神、白天困",
    accent: "yellow",
  },
  p_food: {
    src: "/personas/cards/persona-03-food-card.png",
    tag: "food",
    title: "饭后困倦",
    description: "女生抱着奶茶、饭盒或汉堡，旁边有 Zzz 气泡。",
    mood: "饭后困倦、满足但想睡",
    accent: "orange",
  },
  p_anxious: {
    src: "/personas/cards/persona-04-navigator-card.png",
    tag: "brain",
    title: "脑内开会",
    description: "女生抱头坐着，头顶有乱线和云团，旁边有猫咪安抚。",
    mood: "焦虑、脑内过载、需要疗愈",
    accent: "orange",
  },
  p_social: {
    src: "/personas/cards/persona-05-offline-card.png",
    tag: "offline",
    title: "社交掉线",
    description: "女生抱着手机坐在角落，旁边有断线 WiFi 和对话气泡。",
    mood: "想社交但不知道入口",
    accent: "red",
  },
  p_swing: {
    src: "/personas/cards/persona-06-swing-card.png",
    tag: "swing",
    title: "自律摇摆",
    description: "女生一边拿计划表，一边穿运动鞋，旁边有拖鞋或操场线。",
    mood: "想自律但反复摆烂",
    accent: "yellow",
  },
  p_low: {
    src: "/personas/cards/persona-07-lowpower-card.png",
    tag: "lowpower",
    title: "稳定待机",
    description: "女生安静坐着，旁边有低电量图标、夕阳、叶子。",
    mood: "佛系、稳定待机",
    accent: "yellow",
  },
  p_full: {
    src: "/personas/cards/persona-08-fullpower-card.png",
    tag: "full",
    title: "满电出发",
    description: "女生背包出发，手拿地图，阳光下充满活力。",
    mood: "满电、探索、校园巡游",
    accent: "orange",
  },
  p_fragile: {
    src: "/personas/cards/persona-09-fragile-card.png",
    tag: "fragile",
    title: "系统重启",
    description: "女生趴在书本和外卖袋旁，头顶 REBOOT，周围有咖啡、纸张、低电量和猫。",
    mood: "系统重启中，但可爱不阴暗",
    accent: "red",
  },
};

export function getPersonaArtwork(personaId: string) {
  return personaArtworkMap[personaId] ?? personaArtworkMap.p_low;
}

export function PersonaMascot({ personaId, alt, className = "", compact }: Props) {
  const artwork = getPersonaArtwork(personaId);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`persona-artwork-frame artwork-${artwork.accent}${compact ? " persona-artwork-compact" : ""} ${className}`}>
      <div className="persona-artwork-decor" aria-hidden="true">
        <span className="artwork-sun" />
        <span className="artwork-arc arc-one" />
        <span className="artwork-arc arc-two" />
        <span className="artwork-leaf leaf-one" />
        <span className="artwork-leaf leaf-two" />
      </div>

      {!imageFailed ? (
        <img
          className="persona-artwork-image"
          src={displayImageSrc(artwork.src)}
          alt={alt ?? `${artwork.title}插画`}
          loading={compact ? "lazy" : "eager"}
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="persona-artwork-placeholder">
          <strong>插画待替换</strong>
          {!compact && <p>{artwork.description}</p>}
          <span>{artwork.mood}</span>
        </div>
      )}
    </div>
  );
}
