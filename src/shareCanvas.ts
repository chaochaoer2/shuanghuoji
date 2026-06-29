import type { PhotoNode, WalkRecord } from "./types";
import {
  getTemplateConfig,
  selectTemplateId,
  type PhotoSlot,
  type Rect,
  type ShareTemplateConfig,
  type TemplateId,
} from "./sharePoster/config/shareTemplates";

export type SharePosterMode = "outing-proof" | "plog-cover" | "route-handbook" | "stamp-collection" | "long-diary";

type PosterNode = {
  label: string;
  minute: number;
  segment: number;
  type: "start" | "photo" | "end";
};

type TextStyle = {
  size: number;
  minSize?: number;
  color?: string;
  weight?: number;
  lineHeight?: number;
  align?: CanvasTextAlign;
};

const modeToTemplate: Record<SharePosterMode, TemplateId> = {
  "outing-proof": "outdoor_proof",
  "plog-cover": "plog_cover",
  "route-handbook": "route_notebook",
  "stamp-collection": "stamp_route",
  "long-diary": "long_journal",
};

const C = {
  paper: "#fbf3df",
  paper2: "#fff9ec",
  ink: "#143d35",
  muted: "#335b50",
  green: "#0a756b",
  orange: "#e45b2f",
  dark: "#0e3447",
  cream: "#fffdf6",
};

const templateErase: Partial<Record<TemplateId, string>> = {
  route_memory_card: "#f7f0df",
  outdoor_proof: "#f7f0df",
  plog_cover: "#f7f0df",
  route_notebook: C.cream,
  long_journal: "#f7f0df",
  stamp_route: "#efe4ca",
};
const personaAvatarMap: Record<string, string> = {
  p_sedentary: "/personas/cards/persona-01-sedentary-card.webp",
  p_sleep: "/personas/cards/persona-02-sleep-card.webp",
  p_food: "/personas/cards/persona-03-food-card.webp",
  p_anxious: "/personas/cards/persona-04-navigator-card.webp",
  p_social: "/personas/cards/persona-05-offline-card.webp",
  p_swing: "/personas/cards/persona-06-swing-card.webp",
  p_low: "/personas/cards/persona-07-lowpower-card.webp",
  p_full: "/personas/cards/persona-08-fullpower-card.webp",
  p_fragile: "/personas/cards/persona-09-fragile-card.webp",
};
const personaNameToId: Record<string, string> = {
  "生无可恋的定海神针": "p_sedentary",
  "日间休眠的午夜永动机": "p_sleep",
  "碳水过载的昏迷患者": "p_food",
  "脑内开会的迷航舵手": "p_anxious",
  "持续掉线的单机玩家": "p_social",
  "薛定谔的自律选手": "p_swing",
  "心如止水的低耗电待机党": "p_low",
  "血条全满的校园特工": "p_full",
  "五维掉线的脆皮大学生": "p_fragile",
};

function getPersonaAvatarSrc(record: WalkRecord) {
  const personaId = record.personaId || (record.personaName ? personaNameToId[record.personaName] : undefined);
  return personaAvatarMap[personaId || ""] ?? personaAvatarMap.p_low;
}

function loadImage(src?: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function font(size: number, weight = 700) {
  return `${weight} ${size}px "Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif`;
}

function rr(ctx: CanvasRenderingContext2D, r: Rect, radius: number) {
  const rad = Math.min(radius, r.w / 2, r.h / 2);
  ctx.beginPath();
  ctx.moveTo(r.x + rad, r.y);
  ctx.arcTo(r.x + r.w, r.y, r.x + r.w, r.y + r.h, rad);
  ctx.arcTo(r.x + r.w, r.y + r.h, r.x, r.y + r.h, rad);
  ctx.arcTo(r.x, r.y + r.h, r.x, r.y, rad);
  ctx.arcTo(r.x, r.y, r.x + r.w, r.y, rad);
  ctx.closePath();
}

function fillRect(ctx: CanvasRenderingContext2D, r: Rect, color: string, radius = 0) {
  ctx.fillStyle = color;
  if (radius) {
    rr(ctx, r, radius);
    ctx.fill();
  } else {
    ctx.fillRect(r.x, r.y, r.w, r.h);
  }
}

function drawTemplateBackground(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, image: HTMLImageElement | null) {
  fillRect(ctx, { x: 0, y: 0, w: template.width, h: template.height }, C.paper);
  if (!image) return;
  if (template.id === "long_journal" && template.height > image.height) {
    ctx.drawImage(image, 0, 0, template.width, image.height);
    const middle = 880;
    const sliceH = 360;
    for (let y = image.height; y < template.height; y += sliceH) {
      ctx.drawImage(image, 0, middle, image.width, sliceH, 0, y, template.width, Math.min(sliceH, template.height - y));
    }
  } else {
    ctx.drawImage(image, 0, 0, template.width, template.height);
  }
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, r: Rect, radius = 8) {
  const imageRatio = img.width / img.height;
  const rectRatio = r.w / r.h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (imageRatio > rectRatio) {
    sw = img.height * rectRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / rectRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  rr(ctx, r, radius);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, r.x, r.y, r.w, r.h);
  ctx.restore();
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, r: Rect, radius = 8) {
  const scale = Math.min(r.w / img.width, r.h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = r.x + (r.w - dw) / 2;
  const dy = r.y + (r.h - dh) / 2;
  ctx.save();
  rr(ctx, r, radius);
  ctx.clip();
  fillRect(ctx, r, "#eef6ee", radius);
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
  ctx.save();
  rr(ctx, r, radius);
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = Math.max(2, Math.min(r.w, r.h) * 0.012);
  ctx.stroke();
  ctx.restore();
}

function displayPhotoRect(slot: PhotoSlot): Rect {
  const inset = 12;
  const top = slot.card.y + inset;
  const titleGap = 10;
  const bottom = Math.max(top + 48, slot.title.y - titleGap);
  return {
    x: slot.card.x + inset,
    y: top,
    w: slot.card.w - inset * 2,
    h: Math.min(slot.card.y + slot.card.h - inset - top, bottom - top),
  };
}

function drawPersonaAvatar(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, avatar: HTMLImageElement | null) {
  const r = template.personaAvatarArea;
  if (!r || !avatar) return;
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  ctx.save();
  ctx.shadowColor = "rgba(72, 61, 42, 0.2)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#fffaf0";
  ctx.beginPath();
  ctx.arc(cx, cy, r.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r.w / 2 - 2, 0, Math.PI * 2);
  ctx.clip();
  const scale = Math.max(r.w / avatar.width, r.h / avatar.height) * 1.55;
  const dw = avatar.width * scale;
  const dh = avatar.height * scale;
  ctx.drawImage(avatar, cx - dw / 2, cy - dh * 0.42, dw, dh);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#fffdf6";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r.w / 2 + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawTemplatePatch(ctx: CanvasRenderingContext2D, templateImage: HTMLImageElement | null, r: Rect) {
  if (!templateImage) return;
  ctx.drawImage(templateImage, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
}

function drawPhotoCard(ctx: CanvasRenderingContext2D, slot: PhotoSlot) {
  ctx.save();
  ctx.shadowColor = "rgba(72, 61, 42, 0.18)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 8;
  fillRect(ctx, slot.card, "#fffdf6", 4);
  ctx.restore();
  fillRect(ctx, { x: slot.card.x + 7, y: slot.card.y + 7, w: slot.card.w - 14, h: slot.card.h - 14 }, "rgba(232, 244, 239, 0.38)", 4);
}

function fitText(ctx: CanvasRenderingContext2D, raw: string, box: Rect, style: TextStyle) {
  const minSize = style.minSize ?? Math.max(10, style.size - 8);
  let size = style.size;
  const text = raw.trim();
  while (size > minSize) {
    ctx.font = font(size, style.weight ?? 800);
    if (ctx.measureText(text).width <= box.w) break;
    size -= 1;
  }
  return { ...style, size };
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, width: number) {
  if (ctx.measureText(text).width <= width) return text;
  let value = text;
  while (value.length > 1 && ctx.measureText(`${value}...`).width > width) {
    value = value.slice(0, -1);
  }
  return `${value}...`;
}

function drawSingleLineText(ctx: CanvasRenderingContext2D, raw: string, box: Rect, style: TextStyle) {
  const fitted = fitText(ctx, raw, box, style);
  ctx.save();
  ctx.fillStyle = fitted.color ?? C.ink;
  ctx.font = font(fitted.size, fitted.weight ?? 800);
  ctx.textBaseline = "top";
  ctx.textAlign = fitted.align ?? "left";
  const x = fitted.align === "center" ? box.x + box.w / 2 : fitted.align === "right" ? box.x + box.w : box.x;
  ctx.fillText(ellipsize(ctx, raw.trim(), box.w), x, box.y);
  ctx.restore();
}

function drawMultiLineText(ctx: CanvasRenderingContext2D, raw: string, box: Rect, style: TextStyle, maxLines: number) {
  const fitted = fitText(ctx, raw, box, style);
  const lineHeight = fitted.lineHeight ?? fitted.size * 1.35;
  const words = Array.from(raw.trim());
  const lines: string[] = [];
  let line = "";
  ctx.save();
  ctx.font = font(fitted.size, fitted.weight ?? 700);
  words.forEach((char) => {
    const next = `${line}${char}`;
    if (ctx.measureText(next).width > box.w && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  const visible = lines.slice(0, maxLines);
  if (lines.length > maxLines) visible[visible.length - 1] = ellipsize(ctx, visible[visible.length - 1], box.w);
  ctx.fillStyle = fitted.color ?? C.ink;
  ctx.textBaseline = "top";
  visible.forEach((text, i) => {
    const y = box.y + i * lineHeight;
    if (y + fitted.size <= box.y + box.h) ctx.fillText(text, box.x, y);
  });
  ctx.restore();
}

function minutes(record: WalkRecord) {
  const start = new Date(record.startTime).getTime();
  const end = record.endTime ? new Date(record.endTime).getTime() : Date.now();
  return Math.max(1, Math.round((end - start) / 60000));
}

function distance(record: WalkRecord) {
  if (record.isDemoMode) return "0 m";
  if (record.distanceMeters >= 1000) return `${(record.distanceMeters / 1000).toFixed(1)} km`;
  return `${Math.round(record.distanceMeters || 0)} m`;
}

function photoMinute(record: WalkRecord, photo: PhotoNode, index: number, count: number) {
  const start = new Date(record.startTime).getTime();
  const time = new Date(photo.createdAt).getTime();
  if (Number.isFinite(start) && Number.isFinite(time) && time >= start) return Math.min(minutes(record), Math.round((time - start) / 60000));
  return Math.round((index / Math.max(1, count + 1)) * minutes(record));
}

function nodesFor(record: WalkRecord, photos: PhotoNode[], maxNodes: number) {
  const sampled = photos.slice(0, Math.max(0, maxNodes - 2));
  const photoNodes = sampled
    .map((photo, index) => ({
      label: String(index + 1),
      minute: photoMinute(record, photo, index + 1, sampled.length),
      segment: 0,
      type: "photo" as const,
    }))
    .sort((a, b) => a.minute - b.minute);
  const all: PosterNode[] = [
    { label: "S", minute: 0, segment: 0, type: "start" },
    ...photoNodes,
    { label: "E", minute: minutes(record), segment: 0, type: "end" },
  ];
  return all.map((node, index) => ({ ...node, segment: index === 0 ? 0 : Math.max(0, node.minute - all[index - 1].minute) }));
}

function caption(photo: PhotoNode) {
  const title = [photo.locationName, photo.moodTag].filter(Boolean).join(" / ");
  return { title, subtitle: photo.note || "" };
}

function eraseTextBand(ctx: CanvasRenderingContext2D, box: Rect) {
  fillRect(ctx, { x: box.x - 8, y: box.y - 5, w: box.w + 16, h: box.h + 10 }, C.cream, 4);
}

function drawPhotoSlot(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, templateImage: HTMLImageElement | null, slot: PhotoSlot, photo: PhotoNode | undefined, image: HTMLImageElement | null) {
  const cx = slot.card.x + slot.card.w / 2;
  const cy = slot.card.y + slot.card.h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(slot.rotation);
  ctx.translate(-cx, -cy);
  drawPhotoCard(ctx, slot);
  const imageRect = displayPhotoRect(slot);
  fillRect(ctx, imageRect, "#eef6ee", 8);
  if (image) drawCover(ctx, image, imageRect, 8);
  if (template.id === "stamp_route") {
    const coverY = Math.max(slot.card.y, slot.title.y - 10);
    fillRect(ctx, { x: slot.card.x + 4, y: coverY, w: slot.card.w - 8, h: Math.max(0, slot.card.y + slot.card.h - coverY - 4) }, C.paper, 4);
  } else {
    eraseField(ctx, slot.title, C.cream, 3, 5);
    eraseField(ctx, slot.subtitle, C.cream, 3, 5);
  }
  if (photo) {
    const cap = caption(photo);
    drawSingleLineText(ctx, cap.title, slot.title, { size: template.id === "stamp_route" ? 18 : Math.max(16, slot.title.h - 2), minSize: 12, color: C.ink, weight: 900 });
    drawSingleLineText(ctx, cap.subtitle, slot.subtitle, { size: template.id === "stamp_route" ? 12 : Math.max(13, slot.subtitle.h - 3), minSize: 10, color: C.muted, weight: 800 });
  }
  ctx.restore();
  slot.foregroundPatches?.forEach((patch) => drawTemplatePatch(ctx, templateImage, patch));
}

function drawQrCode(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, qr: HTMLImageElement | null) {
  const r = template.qrArea;
  if (!r || !qr) return;
  ctx.save();
  ctx.shadowColor = "rgba(72, 61, 42, 0.16)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 7;
  fillRect(ctx, r, "#fffdf6", 14);
  ctx.restore();
  const labelH = Math.min(24, r.h * 0.18);
  const pad = Math.max(8, Math.round(r.w * 0.08));
  const qrBox = { x: r.x + pad, y: r.y + pad, w: r.w - pad * 2, h: r.h - pad * 2 - labelH };
  ctx.drawImage(qr, qrBox.x, qrBox.y, qrBox.w, qrBox.h);
  drawSingleLineText(ctx, "扫码体验", { x: r.x + 8, y: r.y + r.h - labelH - 5, w: r.w - 16, h: labelH }, { size: Math.min(16, labelH * 0.75), minSize: 10, color: C.green, weight: 900, align: "center" });
}

type RouteSlot = {
  node?: { x: number; y: number; r: number };
  pill?: Rect;
  place?: Rect;
  elapsed?: Rect;
  cover?: Rect;
};

function getRouteSlots(template: ShareTemplateConfig): RouteSlot[] {
  if (template.id === "outdoor_proof" || template.id === "route_memory_card") {
    return [
      { place: { x: 852, y: 500, w: 90, h: 36 }, elapsed: { x: 855, y: 548, w: 96, h: 34 } },
      { place: { x: 860, y: 720, w: 92, h: 36 }, elapsed: { x: 852, y: 768, w: 112, h: 34 } },
      { place: { x: 860, y: 945, w: 92, h: 36 }, elapsed: { x: 852, y: 992, w: 112, h: 34 } },
    ];
  }
  if (template.id === "plog_cover") {
    return [
      { node: { x: 397, y: 392, r: 15 }, place: { x: 418, y: 398, w: 110, h: 45 } },
      { node: { x: 397, y: 715, r: 15 }, pill: { x: 365, y: 720, w: 92, h: 32 }, place: { x: 374, y: 758, w: 120, h: 50 } },
      { node: { x: 447, y: 990, r: 15 }, pill: { x: 456, y: 988, w: 92, h: 32 }, place: { x: 468, y: 1028, w: 120, h: 50 } },
      { node: { x: 454, y: 1112, r: 15 }, pill: { x: 470, y: 1115, w: 92, h: 32 }, place: { x: 492, y: 1154, w: 120, h: 50 } },
    ];
  }
  if (template.id === "route_notebook") {
    return [
      { node: { x: 450, y: 390, r: 24 }, pill: { x: 452, y: 435, w: 92, h: 40 }, place: { x: 510, y: 350, w: 170, h: 36 } },
      { node: { x: 489, y: 612, r: 24 }, pill: { x: 368, y: 596, w: 94, h: 40 }, place: { x: 510, y: 610, w: 170, h: 36 } },
      { node: { x: 450, y: 838, r: 24 }, pill: { x: 470, y: 792, w: 94, h: 40 }, place: { x: 510, y: 905, w: 170, h: 36 } },
      { node: { x: 492, y: 1018, r: 24 }, pill: { x: 452, y: 1058, w: 98, h: 40 }, place: { x: 318, y: 1010, w: 150, h: 36 } },
      { node: { x: 447, y: 1234, r: 24 }, pill: { x: 484, y: 1176, w: 98, h: 40 }, place: { x: 318, y: 1218, w: 150, h: 36 } },
      { node: { x: 486, y: 1376, r: 24 }, pill: { x: 482, y: 1410, w: 100, h: 40 }, place: { x: 525, y: 1350, w: 160, h: 36 } },
    ];
  }
  if (template.id === "stamp_route") {
    return [
      { node: { x: 48, y: 330, r: 26 }, pill: { x: 310, y: 423, w: 100, h: 34 } },
      { node: { x: 665, y: 430, r: 24 }, pill: { x: 350, y: 438, w: 105, h: 34 } },
      { node: { x: 740, y: 545, r: 24 }, pill: { x: 690, y: 505, w: 100, h: 34 } },
      { node: { x: 800, y: 795, r: 24 }, pill: { x: 780, y: 710, w: 100, h: 34 } },
      { node: { x: 802, y: 905, r: 24 }, pill: { x: 735, y: 850, w: 100, h: 34 } },
      { node: { x: 522, y: 995, r: 24 }, pill: { x: 498, y: 923, w: 100, h: 34 } },
      { node: { x: 300, y: 905, r: 24 }, pill: { x: 245, y: 910, w: 100, h: 34 } },
      { node: { x: 49, y: 790, r: 24 }, pill: { x: 10, y: 860, w: 100, h: 34 } },
    ];
  }
  return Array.from({ length: 12 }, (_, i) => ({
    node: { x: 380 + Math.sin(i * 1.2) * 28, y: 265 + i * 125, r: 18 },
    pill: { x: i % 2 ? 405 : 325, y: 300 + i * 125, w: 75, h: 26 },
    place: { x: i % 2 ? 430 : 245, y: 260 + i * 125, w: 110, h: 28 },
    elapsed: { x: i % 2 ? 430 : 245, y: 295 + i * 125, w: 110, h: 26 },
  }));
}

function drawNode(ctx: CanvasRenderingContext2D, slot: RouteSlot, label: string) {
  if (!slot.node) return;
  const { x, y, r } = slot.node;
  ctx.save();
  ctx.fillStyle = C.green;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.cream;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = font(r * 1.05, 900);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y + 1);
  ctx.restore();
}

function eraseField(ctx: CanvasRenderingContext2D, box: Rect, color = C.cream, radius = 4, pad = 6) {
  fillRect(ctx, { x: box.x - pad, y: box.y - pad, w: box.w + pad * 2, h: box.h + pad * 2 }, color, radius);
}

function replaceSingleLine(ctx: CanvasRenderingContext2D, raw: string, box: Rect, style: TextStyle, color = C.cream, pad = 6) {
  eraseField(ctx, box, color, 4, pad);
  drawSingleLineText(ctx, raw, box, style);
}

function replaceMultiLine(ctx: CanvasRenderingContext2D, raw: string, box: Rect, style: TextStyle, maxLines: number, color = C.cream, pad = 6) {
  eraseField(ctx, box, color, 5, pad);
  drawMultiLineText(ctx, raw, box, style, maxLines);
}

function drawRoute(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, nodes: PosterNode[], photos: PhotoNode[]) {
  const routeNodes = template.id === "stamp_route" ? nodes.filter((node) => node.type === "photo") : nodes;
  const erase = templateErase[template.id] ?? C.paper;
  getRouteSlots(template).forEach((slot, index) => {
    const node = routeNodes[index];
    const photo = photos[index];
    if (slot.pill) eraseField(ctx, slot.pill, erase, slot.pill.h / 2, 4);
    if (slot.place) eraseField(ctx, slot.place, erase, 4, 5);
    if (slot.elapsed) eraseField(ctx, slot.elapsed, erase, 4, 5);
    if (!node) return;
    if (template.id === "long_journal" && slot.node) drawNode(ctx, slot, String(index + 1));
    if (slot.pill) {
      fillRect(ctx, slot.pill, C.dark, slot.pill.h / 2);
      drawSingleLineText(ctx, `+${node.segment}min`, { x: slot.pill.x + 6, y: slot.pill.y + 5, w: slot.pill.w - 12, h: slot.pill.h - 8 }, { size: Math.min(18, slot.pill.h * 0.56), minSize: 10, color: "#fff", weight: 900, align: "center" });
    }
    if (slot.place) {
      const label = node.type === "start" ? "出发" : node.type === "end" ? "回程" : photo?.locationName || "校园一角";
      drawSingleLineText(ctx, label, slot.place, { size: Math.min(22, slot.place.h * 0.7), minSize: 11, color: C.ink, weight: 900 });
    }
    if (slot.elapsed) {
      drawSingleLineText(ctx, `${node.minute}min`, slot.elapsed, { size: Math.min(24, slot.elapsed.h * 0.75), minSize: 11, color: C.green, weight: 900 });
    }
  });
}

function drawRouteNotebookFields(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, nodes: PosterNode[], photos: PhotoNode[]) {
  const routeNodes = nodes.filter((node) => node.type === "photo");
  getRouteSlots(template).forEach((slot, index) => {
    const node = routeNodes[index];
    if (slot.node) drawNode(ctx, slot, String(index + 1));
    if (slot.pill) {
      fillRect(ctx, { x: slot.pill.x - 3, y: slot.pill.y - 3, w: slot.pill.w + 6, h: slot.pill.h + 6 }, C.dark, (slot.pill.h + 6) / 2);
      if (!node) return;
      drawSingleLineText(ctx, `${node.segment ? `+${node.segment}` : "0"}min`, { x: slot.pill.x + 6, y: slot.pill.y + 5, w: slot.pill.w - 12, h: slot.pill.h - 8 }, { size: Math.min(18, slot.pill.h * 0.56), minSize: 10, color: "#fff", weight: 900, align: "center" });
    }
    if (slot.place && node) {
      const label = index === 0 ? `从${photos[index]?.locationName || "图书馆"}出发` : photos[index]?.locationName || "校园一角";
      drawSingleLineText(ctx, label, slot.place, { size: Math.min(22, slot.place.h * 0.68), minSize: 11, color: C.ink, weight: 900 });
    }
  });
}

function drawPersona(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, record: WalkRecord) {
  const r = template.personaCardArea;
  const labelBox = { x: r.x + r.w * 0.12, y: r.y + r.h * 0.52, w: r.w * 0.66, h: r.h * 0.15 };
  const nameBox = { x: r.x + r.w * 0.12, y: r.y + r.h * 0.66, w: r.w * 0.72, h: r.h * 0.25 };
  eraseField(ctx, { x: r.x + r.w * 0.07, y: r.y + r.h * 0.46, w: r.w * 0.84, h: r.h * 0.48 }, C.cream, 12, 10);
  drawSingleLineText(ctx, "今日人格:", labelBox, { size: Math.max(13, r.w * 0.07), minSize: 10, color: C.ink, weight: 900 });
  drawMultiLineText(ctx, record.personaName || record.dailyStatusName || "自由走走中", nameBox, { size: Math.max(13, r.w * 0.085), minSize: 10, color: C.ink, weight: 900, lineHeight: Math.max(19, r.w * 0.11) }, 2);
}

function drawDataCard(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, record: WalkRecord) {
  const r = template.dataCardArea;
  if (!r) return;
  fillRect(ctx, r, C.cream, 18);
  drawSingleLineText(ctx, "今日数据", { x: r.x + 24, y: r.y + 22, w: r.w - 48, h: 32 }, { size: Math.min(26, r.w * 0.1), minSize: 14, color: C.green, weight: 900 });
  drawMultiLineText(
    ctx,
    `总时长: ${minutes(record)} min\n总距离: ${distance(record)}\n回血值: +${Math.min(99, 70 + record.photos.length * 3)}%`,
    { x: r.x + 24, y: r.y + 60, w: r.w - 48, h: r.h - 76 },
    { size: Math.min(23, r.w * 0.075), minSize: 12, color: C.ink, weight: 800, lineHeight: Math.min(34, r.w * 0.11) },
    4,
  );
}

function drawSummary(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, record: WalkRecord, more: number) {
  const r = template.summaryCardArea;
  if (!r) return;
  fillRect(ctx, r, C.cream, 16);
  const items = [
    record.templateText || record.routeSlogan || "走走停停，超治愈",
    record.photos.length ? "遇见美好，已回血" : "路线也被好好收下",
    more ? `更多瞬间 +${more}` : "今天也有认真生活",
  ];
  drawSingleLineText(ctx, "今日小总结", { x: r.x + 22, y: r.y + 18, w: r.w - 44, h: 28 }, { size: Math.min(25, r.w * 0.09), minSize: 13, color: C.ink, weight: 900, align: "center" });
  items.slice(0, 3).forEach((item, i) => {
    drawSingleLineText(ctx, `✓ ${item}`, { x: r.x + 24, y: r.y + 56 + i * 27, w: r.w - 48, h: 24 }, { size: Math.min(18, r.w * 0.065), minSize: 10, color: C.ink, weight: 800 });
  });
}

function drawSloganAndTags(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, record: WalkRecord) {
  const tags = (record.moodTags.length ? record.moodTags : ["散步", "回血中", "校园Walk"]).slice(0, 4);
  fillRect(ctx, { x: template.tagsArea.x - 12, y: template.tagsArea.y - 8, w: template.tagsArea.w + 24, h: template.tagsArea.h + 16 }, C.paper, 14);
  const gap = Math.max(8, template.tagsArea.w * 0.025);
  const w = (template.tagsArea.w - gap * (tags.length - 1)) / tags.length;
  tags.forEach((tag, i) => {
    const box = { x: template.tagsArea.x + i * (w + gap), y: template.tagsArea.y, w, h: template.tagsArea.h };
    fillRect(ctx, box, i % 3 === 1 ? "rgba(255,224,154,0.86)" : i % 3 === 2 ? "rgba(255,198,196,0.86)" : "rgba(214,235,221,0.9)", box.h / 2);
    drawSingleLineText(ctx, `#${tag.replace(/^#/, "")}`, { x: box.x + 8, y: box.y + box.h * 0.2, w: box.w - 16, h: box.h * 0.65 }, { size: Math.min(20, box.h * 0.55), minSize: 10, color: i % 3 === 2 ? C.orange : C.green, weight: 900, align: "center" });
  });
}

function maxNodesFor(template: ShareTemplateConfig) {
  if (template.id === "route_memory_card") return 2;
  if (template.id === "outdoor_proof") return template.maxPhotos + 2;
  if (template.id === "plog_cover") return template.maxPhotos + 2;
  if (template.id === "route_notebook") return template.maxPhotos + 2;
  if (template.id === "stamp_route") return template.maxPhotos + 2;
  return Math.min(14, template.maxPhotos + 2);
}

function drawRouteNotebookTags(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, record: WalkRecord) {
  const tags = (record.moodTags.length ? record.moodTags : ["散步", "回血中", "校园Walk"]).slice(0, 3);
  const slots: Rect[] = [
    { x: 214, y: 1597, w: 120, h: 38 },
    { x: 380, y: 1597, w: 130, h: 38 },
    { x: 565, y: 1597, w: 140, h: 38 },
  ];
  tags.forEach((tag, index) => {
    const box = slots[index];
    if (!box) return;
    fillRect(ctx, box, index === 1 ? "#ffe3a2" : index === 2 ? "#ffd0cd" : "#dceee2", box.h / 2);
    drawSingleLineText(ctx, `#${tag.replace(/^#/, "")}`, { x: box.x + 8, y: box.y + 8, w: box.w - 16, h: box.h - 12 }, { size: 18, minSize: 11, color: index === 2 ? C.orange : C.green, weight: 900, align: "center" });
  });
}

function drawRouteNotebook(ctx: CanvasRenderingContext2D, template: ShareTemplateConfig, templateImage: HTMLImageElement | null, personaAvatar: HTMLImageElement | null, record: WalkRecord, photos: PhotoNode[], images: Array<HTMLImageElement | null>) {
  const nodes = nodesFor(record, photos, maxNodesFor(template));
  template.photoSlots.forEach((slot, index) => {
    drawPhotoSlot(ctx, template, templateImage, slot, photos[index], images[index]);
  });
  drawRouteNotebookFields(ctx, template, nodes, photos);
  drawPersona(ctx, template, record);
  drawPersonaAvatar(ctx, template, personaAvatar);
  drawRouteNotebookTags(ctx, template, record);
}

export async function generateShareImage(record: WalkRecord, forcedMode?: SharePosterMode) {
  const templateId = forcedMode ? modeToTemplate[forcedMode] : selectTemplateId(record.photos.length);
  const template = getTemplateConfig(templateId, record.photos.length);
  const photos = record.photos.slice(0, template.maxPhotos);
  const more = Math.max(0, record.photos.length - photos.length);
  const [background, personaAvatar, qrCode, ...images] = await Promise.all([
    loadImage(template.background),
    loadImage(template.personaAvatarArea ? getPersonaAvatarSrc(record) : undefined),
    loadImage(template.qrArea ? "/site-qr.svg" : undefined),
    ...photos.map((photo) => loadImage(photo.imageDataUrl)),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  drawTemplateBackground(ctx, template, background);
  if (template.id === "route_notebook") {
    drawRouteNotebook(ctx, template, background, personaAvatar, record, photos, images);
    drawQrCode(ctx, template, qrCode);
    return canvas.toDataURL("image/png");
  }

  drawRoute(ctx, template, nodesFor(record, photos, maxNodesFor(template)), photos);
  template.photoSlots.forEach((slot, index) => {
    drawPhotoSlot(ctx, template, background, slot, photos[index], images[index]);
  });
  drawPersona(ctx, template, record);
  drawPersonaAvatar(ctx, template, personaAvatar);
  drawDataCard(ctx, template, record);
  drawSummary(ctx, template, record, more);
  drawSloganAndTags(ctx, template, record);
  drawQrCode(ctx, template, qrCode);

  return canvas.toDataURL("image/png");
}
