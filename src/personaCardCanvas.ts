import { getPersonaArtwork } from "./components/persona/PersonaMascot";
import type { PersonaResult } from "./types";

export async function generatePersonaCardImage(persona: PersonaResult) {
  const artwork = getPersonaArtwork(persona.personaId);
  try {
    const response = await fetch(artwork.src, { method: "HEAD" });
    if (response.ok) return artwork.src;
  } catch {
    // Fall through to a simple non-character placeholder.
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return artwork.src;
  ctx.fillStyle = "#FFF9E8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#D9412E";
  ctx.font = '900 64px "Microsoft YaHei", sans-serif';
  ctx.fillText("插画待替换", 120, 620);
  ctx.fillStyle = "#143D35";
  ctx.font = '800 48px "Microsoft YaHei", sans-serif';
  ctx.fillText(persona.personaName, 120, 720);
  ctx.fillStyle = "#52675F";
  ctx.font = '600 30px "Microsoft YaHei", sans-serif';
  ctx.fillText(artwork.src, 120, 800);
  return canvas.toDataURL("image/png");
}
