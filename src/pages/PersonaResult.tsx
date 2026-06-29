import { useMemo } from "react";
import { ArrowRight, Download, Images, RefreshCcw, Save, Share2 } from "lucide-react";
import { PersonaCard } from "../components/persona/PersonaCard";
import { generatePersonaCardImage } from "../personaCardCanvas";
import { getRouteById } from "../schoolwalkData";
import type { PersonaResult } from "../types";

type Props = {
  result: PersonaResult;
  onStartMain: () => void;
  onStartSub: () => void;
  onSave: () => void;
  onRetest: () => void;
  onOpenGallery: () => void;
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

function getRandomTipByPersona(personaName: string) {
  const tips = personaTipMap[personaName];
  if (!tips || tips.length === 0) return null;
  return preferWebp(tips[Math.floor(Math.random() * tips.length)]);
}

function downloadImage(src: string, filename: string) {
  const link = document.createElement("a");
  link.href = src;
  link.download = filename;
  link.click();
}

async function shareImage(src: string, title: string) {
  if (!navigator.share) {
    window.open(src, "_blank");
    return;
  }

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], `${title}.png`, { type: blob.type || "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title, files: [file] });
    } else {
      await navigator.share({ title, url: src });
    }
  } catch {
    window.open(src, "_blank");
  }
}

export function PersonaResult({ result, onStartMain, onSave, onRetest, onOpenGallery }: Props) {
  const mainRoute = getRouteById(result.mainRouteId);
  const randomTip = useMemo(() => getRandomTipByPersona(result.personaName), [result.personaName, result.createdAt]);

  const savePersonaCard = async () => {
    onSave();
    const imageUrl = await generatePersonaCardImage(result);
    downloadImage(imageUrl, `爽活迹-${result.personaName}.png`);
  };

  const sharePersonaCard = async () => {
    onSave();
    const imageUrl = await generatePersonaCardImage(result);
    await shareImage(imageUrl, `爽活迹-${result.personaName}`);
  };

  return (
    <section className="page persona-result-page">
      <header className="summary-header persona-page-title">
        <div>
          <span>你的 Schoolwalk 人格是：</span>
          <h1>{result.personaName}</h1>
          <p>按人格图鉴风格生成的校园 Walk 体质卡。</p>
        </div>
      </header>

      <PersonaCard persona={result} />

      <div className="mini-actions persona-card-actions">
        <button className="primary-button" onClick={savePersonaCard}>
          <Save size={18} />
          保存人格图鉴
        </button>
        <button className="primary-button" onClick={sharePersonaCard}>
          <Share2 size={18} />
          分享人格图鉴
        </button>
      </div>

      <button className="secondary-button ghost" onClick={onOpenGallery}>
        <Images size={18} />
        查看全人格图鉴
      </button>

      {randomTip && (
        <section className="result-tip" aria-label={`${result.personaName}养生小tip`}>
          <img src={randomTip} alt={`${result.personaName} tip`} loading="lazy" decoding="async" />
          <div className="mini-actions tip-actions">
            <button onClick={() => downloadImage(randomTip, `爽活迹-${result.personaName}-tip.png`)}>
              <Download size={16} />
              保存tip图
            </button>
            <button onClick={() => shareImage(randomTip, `爽活迹-${result.personaName}-tip`)}>
              <Share2 size={16} />
              分享tip图
            </button>
          </div>
        </section>
      )}

      <div className="result-grid result-grid-brief">
        <div>
          <span>状态特征</span>
          <strong>{result.description}</strong>
        </div>
        <div>
          <span>推荐路线</span>
          <strong>{mainRoute?.routeName ?? "自由校园 Walk"}</strong>
        </div>
      </div>

      <button className="primary-button full" onClick={onStartMain}>
        开始一次 Walk
        <ArrowRight size={18} />
      </button>
      <button className="text-button full" onClick={onRetest}>
        <RefreshCcw size={18} />
        重新测试
      </button>
    </section>
  );
}
