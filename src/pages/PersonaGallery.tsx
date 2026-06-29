import { ArrowLeft, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import { PersonaCard } from "../components/persona/PersonaCard";
import { personas } from "../schoolwalkData";

const posterImage = "/personas/poster/schoolwalk-persona-gallery-poster.png";
const posterPreviewImage = "/personas/poster/schoolwalk-persona-gallery-poster.webp";

type Props = {
  onBack: () => void;
  onSelect: (personaId: string) => void;
  onStartTest: () => void;
};

function downloadImage(src: string, filename: string) {
  const link = document.createElement("a");
  link.href = src;
  link.download = filename;
  link.click();
}

export function PersonaGallery({ onBack, onSelect, onStartTest }: Props) {
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <section className="page persona-gallery-page">
      <header className="summary-header persona-page-title">
        <button className="icon-button" onClick={onBack} aria-label="返回">
          <ArrowLeft size={20} />
        </button>
        <div>
          <span>爽活迹</span>
          <h1>Schoolwalk 全人格图鉴</h1>
          <p>看看你是哪种校园 Walk 体质。</p>
        </div>
      </header>

      <button className="persona-poster-card" onClick={() => !posterFailed && window.open(posterImage, "_blank")} aria-label="放大查看总图鉴">
        {posterFailed ? (
          <div className="persona-poster-placeholder">
            <strong>总图鉴待替换</strong>
            <span>{posterImage}</span>
          </div>
        ) : (
          <img src={posterPreviewImage} alt="Schoolwalk 全人格图鉴总海报" loading="eager" decoding="async" onError={() => setPosterFailed(true)} />
        )}
      </button>

      <div className="mini-actions">
        <button onClick={() => downloadImage(posterImage, "爽活迹-Schoolwalk全人格图鉴.png")}>
          <Download size={16} />
          保存总图鉴
        </button>
        <button onClick={onStartTest}>
          <Sparkles size={16} />
          开始测试
        </button>
      </div>

      <div className="persona-gallery-grid">
        {personas.map((persona) => (
          <PersonaCard key={persona.personaId} persona={persona} compact onClick={() => onSelect(persona.personaId)} />
        ))}
      </div>
    </section>
  );
}
