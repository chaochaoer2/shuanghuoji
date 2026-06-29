import { createRoot } from "react-dom/client";
import { generateShareImage as generateCanvasShareImage, type SharePosterMode } from "./shareCanvas";
import type { PhotoNode, WalkRecord } from "./types";
import type { CSSProperties } from "react";

type HtmlTemplateId = "outdoor_proof" | "plog_cover" | "route_notebook" | "long_journal" | "stamp_route";

type Box = { x: number; y: number; w: number; h: number };

type PosterTemplate = {
  id: HtmlTemplateId;
  background: string;
  width: number;
  height: number;
  photoSlots: PhotoSlot[];
  routeSlots: RouteSlot[];
  persona: Box;
  personaAvatar?: Box;
  qr?: Box;
  tags: Box[];
  data?: Box;
  mood?: Box;
  summary?: Box;
};

type PhotoSlot = {
  card?: Box;
  image: Box;
  title: Box;
  note: Box;
  rotate?: number;
  paper?: string;
};

type RouteSlot = {
  node?: { x: number; y: number; size: number };
  label?: Box;
  time?: Box;
  place?: Box;
  minute?: "absolute" | "segment";
};

const bg = "/share-templates/";
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

const modeToTemplate: Record<SharePosterMode, HtmlTemplateId> = {
  "outing-proof": "outdoor_proof",
  "plog-cover": "plog_cover",
  "route-handbook": "route_notebook",
  "stamp-collection": "stamp_route",
  "long-diary": "long_journal",
};

const templates: Record<HtmlTemplateId, PosterTemplate> = {
  outdoor_proof: {
    id: "outdoor_proof",
    background: `${bg}template_outdoor_proof.svg`,
    width: 1086,
    height: 1448,
    persona: { x: 792, y: 236, w: 206, h: 132 },
    personaAvatar: { x: 844, y: 76, w: 118, h: 118 },
    qr: { x: 884, y: 1218, w: 122, h: 150 },
    mood: { x: 112, y: 1204, w: 300, h: 64 },
    tags: [
      { x: 280, y: 1390, w: 128, h: 38 },
      { x: 454, y: 1390, w: 146, h: 38 },
      { x: 640, y: 1390, w: 178, h: 38 },
    ],
    photoSlots: [
      {
        card: { x: 76, y: 472, w: 650, h: 628 },
        image: { x: 123, y: 476, w: 542, h: 552 },
        title: { x: 120, y: 1038, w: 520, h: 44 },
        note: { x: 96, y: 1210, w: 300, h: 42 },
        rotate: -4.2,
      },
      {
        card: { x: 725, y: 975, w: 270, h: 300 },
        image: { x: 764, y: 1052, w: 204, h: 224 },
        title: { x: 760, y: 1164, w: 210, h: 52 },
        note: { x: 746, y: 1224, w: 240, h: 38 },
        rotate: 6,
        paper: "#fff7eb",
      },
    ],
    routeSlots: [
      { label: { x: 856, y: 459, w: 82, h: 44 }, time: { x: 852, y: 510, w: 104, h: 46 }, minute: "absolute" },
      { label: { x: 896, y: 699, w: 96, h: 44 }, time: { x: 892, y: 750, w: 112, h: 46 }, minute: "segment" },
      { label: { x: 886, y: 908, w: 96, h: 44 }, time: { x: 860, y: 960, w: 138, h: 46 }, minute: "absolute" },
    ],
  },
  plog_cover: {
    id: "plog_cover",
    background: `${bg}template_plog_cover.svg`,
    width: 1086,
    height: 1448,
    persona: { x: 802, y: 204, w: 210, h: 150 },
    personaAvatar: { x: 862, y: 76, w: 120, h: 120 },
    qr: { x: 892, y: 1218, w: 122, h: 150 },
    data: { x: 116, y: 728, w: 210, h: 186 },
    tags: [
      { x: 250, y: 1372, w: 154, h: 38 },
      { x: 442, y: 1372, w: 166, h: 38 },
      { x: 646, y: 1372, w: 176, h: 38 },
    ],
    photoSlots: [
      { card: { x: 500, y: 420, w: 450, h: 540 }, image: { x: 540, y: 460, w: 390, h: 390 }, title: { x: 545, y: 888, w: 360, h: 30 }, note: { x: 545, y: 920, w: 360, h: 28 }, rotate: 4.2 },
      { card: { x: 70, y: 430, w: 300, h: 300 }, image: { x: 96, y: 455, w: 235, h: 190 }, title: { x: 105, y: 670, w: 225, h: 25 }, note: { x: 105, y: 700, w: 225, h: 24 }, rotate: -4.2 },
      { card: { x: 95, y: 980, w: 310, h: 300 }, image: { x: 120, y: 1010, w: 255, h: 185 }, title: { x: 125, y: 1215, w: 240, h: 25 }, note: { x: 125, y: 1243, w: 240, h: 24 }, rotate: -4.2 },
      { card: { x: 625, y: 1005, w: 315, h: 285 }, image: { x: 652, y: 1032, w: 255, h: 175 }, title: { x: 655, y: 1222, w: 240, h: 25 }, note: { x: 655, y: 1250, w: 240, h: 24 }, rotate: 4.2 },
    ],
    routeSlots: [
      { time: { x: 392, y: 394, w: 88, h: 34 }, place: { x: 384, y: 430, w: 110, h: 34 }, minute: "absolute" },
      { time: { x: 360, y: 726, w: 94, h: 34 }, place: { x: 360, y: 760, w: 116, h: 42 }, minute: "segment" },
      { time: { x: 474, y: 972, w: 94, h: 34 }, place: { x: 472, y: 1008, w: 122, h: 42 }, minute: "segment" },
      { time: { x: 518, y: 1118, w: 98, h: 34 }, place: { x: 522, y: 1152, w: 118, h: 42 }, minute: "segment" },
    ],
  },
  route_notebook: {
    id: "route_notebook",
    background: `${bg}template_route_notebook.svg`,
    width: 941,
    height: 1672,
    persona: { x: 672, y: 176, w: 212, h: 138 },
    personaAvatar: { x: 760, y: 44, w: 118, h: 118 },
    qr: { x: 800, y: 1536, w: 90, h: 110 },
    tags: [
      { x: 216, y: 1600, w: 120, h: 36 },
      { x: 382, y: 1600, w: 130, h: 36 },
      { x: 566, y: 1600, w: 140, h: 36 },
    ],
    photoSlots: [
      { card: { x: 72, y: 382, w: 300, h: 335 }, image: { x: 102, y: 407, w: 214, h: 210 }, title: { x: 132, y: 642, w: 190, h: 30 }, note: { x: 76, y: 682, w: 248, h: 34 }, rotate: -2.6 },
      { card: { x: 608, y: 390, w: 270, h: 315 }, image: { x: 654, y: 438, w: 192, h: 210 }, title: { x: 684, y: 666, w: 166, h: 30 }, note: { x: 625, y: 705, w: 244, h: 34 }, rotate: 2.6 },
      { card: { x: 68, y: 756, w: 290, h: 315 }, image: { x: 83, y: 802, w: 220, h: 200 }, title: { x: 126, y: 1018, w: 174, h: 30 }, note: { x: 72, y: 1058, w: 232, h: 36 }, rotate: 2.1 },
      { card: { x: 618, y: 828, w: 280, h: 315 }, image: { x: 657, y: 862, w: 198, h: 198 }, title: { x: 690, y: 1094, w: 164, h: 30 }, note: { x: 625, y: 1134, w: 248, h: 36 }, rotate: -2.1 },
      { card: { x: 90, y: 1160, w: 290, h: 300 }, image: { x: 105, y: 1202, w: 190, h: 205 }, title: { x: 144, y: 1388, w: 168, h: 30 }, note: { x: 92, y: 1428, w: 222, h: 34 }, rotate: -2.1 },
      { card: { x: 633, y: 1192, w: 275, h: 300 }, image: { x: 672, y: 1238, w: 194, h: 188 }, title: { x: 704, y: 1437, w: 160, h: 30 }, note: { x: 625, y: 1476, w: 246, h: 36 }, rotate: 2.1 },
    ],
    routeSlots: [
      { node: { x: 426, y: 366, size: 48 }, time: { x: 452, y: 435, w: 92, h: 40 }, place: { x: 510, y: 350, w: 170, h: 36 }, minute: "segment" },
      { node: { x: 465, y: 588, size: 48 }, time: { x: 368, y: 596, w: 94, h: 40 }, place: { x: 510, y: 610, w: 170, h: 36 }, minute: "segment" },
      { node: { x: 426, y: 814, size: 48 }, time: { x: 470, y: 792, w: 94, h: 40 }, place: { x: 510, y: 905, w: 170, h: 36 }, minute: "segment" },
      { node: { x: 468, y: 994, size: 48 }, time: { x: 452, y: 1058, w: 98, h: 40 }, place: { x: 318, y: 1010, w: 150, h: 36 }, minute: "segment" },
      { node: { x: 423, y: 1210, size: 48 }, time: { x: 484, y: 1176, w: 98, h: 40 }, place: { x: 318, y: 1218, w: 150, h: 36 }, minute: "segment" },
      { node: { x: 462, y: 1352, size: 48 }, time: { x: 482, y: 1410, w: 100, h: 40 }, place: { x: 525, y: 1350, w: 160, h: 36 }, minute: "segment" },
    ],
  },
  long_journal: {
    id: "long_journal",
    background: `${bg}template_long_journal.svg`,
    width: 793,
    height: 1983,
    persona: { x: 578, y: 138, w: 184, h: 122 },
    personaAvatar: { x: 628, y: 44, w: 96, h: 96 },
    qr: { x: 650, y: 1810, w: 104, h: 126 },
    summary: { x: 530, y: 1738, w: 210, h: 128 },
    tags: [
      { x: 160, y: 1936, w: 100, h: 34 },
      { x: 310, y: 1936, w: 126, h: 34 },
      { x: 480, y: 1936, w: 108, h: 34 },
      { x: 620, y: 1936, w: 118, h: 34 },
    ],
    photoSlots: [
      { card: { x: 125, y: 260, w: 170, h: 205 }, image: { x: 145, y: 288, w: 130, h: 120 }, title: { x: 145, y: 420, w: 130, h: 20 }, note: { x: 145, y: 444, w: 130, h: 18 }, rotate: -3 },
      { card: { x: 520, y: 280, w: 175, h: 205 }, image: { x: 540, y: 308, w: 135, h: 120 }, title: { x: 540, y: 440, w: 135, h: 20 }, note: { x: 540, y: 464, w: 135, h: 18 }, rotate: 3 },
      { card: { x: 88, y: 520, w: 170, h: 195 }, image: { x: 108, y: 548, w: 130, h: 110 }, title: { x: 108, y: 670, w: 130, h: 20 }, note: { x: 108, y: 694, w: 130, h: 18 }, rotate: -4 },
      { card: { x: 505, y: 640, w: 180, h: 200 }, image: { x: 525, y: 670, w: 140, h: 110 }, title: { x: 525, y: 790, w: 140, h: 20 }, note: { x: 525, y: 814, w: 140, h: 18 }, rotate: 3 },
      { card: { x: 105, y: 780, w: 170, h: 195 }, image: { x: 125, y: 808, w: 130, h: 110 }, title: { x: 125, y: 930, w: 130, h: 20 }, note: { x: 125, y: 954, w: 130, h: 18 }, rotate: -3 },
      { card: { x: 520, y: 880, w: 175, h: 195 }, image: { x: 540, y: 908, w: 135, h: 110 }, title: { x: 540, y: 1030, w: 135, h: 20 }, note: { x: 540, y: 1054, w: 135, h: 18 }, rotate: 4 },
      { card: { x: 120, y: 1035, w: 175, h: 195 }, image: { x: 140, y: 1063, w: 135, h: 110 }, title: { x: 140, y: 1185, w: 135, h: 20 }, note: { x: 140, y: 1209, w: 135, h: 18 }, rotate: -3 },
      { card: { x: 518, y: 1120, w: 175, h: 195 }, image: { x: 538, y: 1148, w: 135, h: 110 }, title: { x: 538, y: 1270, w: 135, h: 20 }, note: { x: 538, y: 1294, w: 135, h: 18 }, rotate: 4 },
      { card: { x: 95, y: 1335, w: 175, h: 195 }, image: { x: 115, y: 1363, w: 135, h: 110 }, title: { x: 115, y: 1485, w: 135, h: 20 }, note: { x: 115, y: 1509, w: 135, h: 18 }, rotate: -3 },
      { card: { x: 505, y: 1410, w: 180, h: 195 }, image: { x: 525, y: 1438, w: 140, h: 110 }, title: { x: 525, y: 1560, w: 140, h: 20 }, note: { x: 525, y: 1584, w: 140, h: 18 }, rotate: 3 },
      { card: { x: 105, y: 1600, w: 175, h: 195 }, image: { x: 125, y: 1628, w: 135, h: 110 }, title: { x: 125, y: 1750, w: 135, h: 20 }, note: { x: 125, y: 1774, w: 135, h: 18 }, rotate: -3 },
      { card: { x: 435, y: 1625, w: 175, h: 195 }, image: { x: 455, y: 1653, w: 135, h: 110 }, title: { x: 455, y: 1775, w: 135, h: 20 }, note: { x: 455, y: 1799, w: 135, h: 18 }, rotate: 3 },
    ],
    routeSlots: [
      { place: { x: 428, y: 280, w: 112, h: 30 }, time: { x: 420, y: 316, w: 120, h: 28 }, minute: "absolute" },
      { place: { x: 420, y: 420, w: 112, h: 30 }, time: { x: 420, y: 456, w: 120, h: 28 }, minute: "absolute" },
      { place: { x: 260, y: 560, w: 112, h: 30 }, time: { x: 260, y: 596, w: 120, h: 28 }, minute: "absolute" },
      { place: { x: 406, y: 658, w: 112, h: 30 }, time: { x: 406, y: 694, w: 120, h: 28 }, minute: "absolute" },
      { place: { x: 340, y: 816, w: 112, h: 30 }, time: { x: 340, y: 852, w: 120, h: 28 }, minute: "absolute" },
      { place: { x: 442, y: 1080, w: 112, h: 30 }, time: { x: 442, y: 1116, w: 120, h: 28 }, minute: "absolute" },
    ],
  },
  stamp_route: {
    id: "stamp_route",
    background: `${bg}template_stamp_route.svg`,
    width: 1086,
    height: 1448,
    persona: { x: 790, y: 146, w: 230, h: 178 },
    personaAvatar: { x: 842, y: 58, w: 116, h: 116 },
    qr: { x: 44, y: 1286, w: 116, h: 134 },
    data: { x: 398, y: 668, w: 292, h: 166 },
    summary: { x: 78, y: 1182, w: 266, h: 126 },
    tags: [
      { x: 310, y: 1376, w: 142, h: 38 },
      { x: 488, y: 1376, w: 160, h: 38 },
      { x: 684, y: 1376, w: 152, h: 38 },
    ],
    photoSlots: [
      { card: { x: 80, y: 355, w: 275, h: 275 }, image: { x: 105, y: 385, w: 220, h: 175 }, title: { x: 112, y: 575, w: 205, h: 24 }, note: { x: 112, y: 604, w: 205, h: 20 }, rotate: -2 },
      { card: { x: 435, y: 325, w: 240, h: 245 }, image: { x: 458, y: 350, w: 190, h: 145 }, title: { x: 462, y: 508, w: 180, h: 23 }, note: { x: 462, y: 534, w: 180, h: 18 }, rotate: 2 },
      { card: { x: 740, y: 390, w: 255, h: 260 }, image: { x: 765, y: 420, w: 205, h: 160 }, title: { x: 770, y: 595, w: 190, h: 23 }, note: { x: 770, y: 621, w: 190, h: 18 }, rotate: 3 },
      { card: { x: 765, y: 745, w: 245, h: 255 }, image: { x: 788, y: 773, w: 195, h: 150 }, title: { x: 792, y: 938, w: 185, h: 23 }, note: { x: 792, y: 964, w: 185, h: 18 }, rotate: -3 },
      { card: { x: 630, y: 980, w: 250, h: 245 }, image: { x: 654, y: 1008, w: 200, h: 145 }, title: { x: 658, y: 1166, w: 190, h: 23 }, note: { x: 658, y: 1192, w: 190, h: 18 }, rotate: 2 },
      { card: { x: 335, y: 965, w: 245, h: 245 }, image: { x: 358, y: 993, w: 195, h: 145 }, title: { x: 362, y: 1150, w: 185, h: 23 }, note: { x: 362, y: 1176, w: 185, h: 18 }, rotate: -2 },
      { card: { x: 100, y: 875, w: 250, h: 245 }, image: { x: 124, y: 903, w: 200, h: 145 }, title: { x: 128, y: 1060, w: 190, h: 23 }, note: { x: 128, y: 1086, w: 190, h: 18 }, rotate: 2 },
      { card: { x: 78, y: 670, w: 235, h: 225 }, image: { x: 100, y: 698, w: 185, h: 130 }, title: { x: 104, y: 840, w: 175, h: 22 }, note: { x: 104, y: 865, w: 175, h: 18 }, rotate: -1 },
      { card: { x: 410, y: 835, w: 235, h: 225 }, image: { x: 432, y: 863, w: 185, h: 130 }, title: { x: 436, y: 1005, w: 175, h: 22 }, note: { x: 436, y: 1030, w: 175, h: 18 }, rotate: 1 },
    ],
    routeSlots: [],
  },
};

function chooseTemplate(record: WalkRecord, forcedMode?: SharePosterMode): PosterTemplate {
  if (forcedMode) return templates[modeToTemplate[forcedMode]];
  const count = record.photos.length;
  if (count <= 2) return templates.outdoor_proof;
  if (count <= 4) return templates.plog_cover;
  if (count <= 6) return templates.route_notebook;
  if (count <= 9) return templates.stamp_route;
  return templates.long_journal;
}

function elapsedMinutes(record: WalkRecord) {
  const start = new Date(record.startTime).getTime();
  const end = record.endTime ? new Date(record.endTime).getTime() : Date.now();
  return Math.max(1, Math.round((end - start) / 60000));
}

function photoMinute(record: WalkRecord, photo: PhotoNode | undefined, index: number, count: number) {
  const total = elapsedMinutes(record);
  if (!photo) return Math.round((index / Math.max(1, count - 1)) * total);
  const start = new Date(record.startTime).getTime();
  const time = new Date(photo.createdAt).getTime();
  if (Number.isFinite(start) && Number.isFinite(time) && time >= start) return Math.min(total, Math.round((time - start) / 60000));
  return Math.round((index / Math.max(1, count - 1)) * total);
}

function topicTags(record: WalkRecord, max: number) {
  const base = record.moodTags.length ? record.moodTags : ["爽活迹", "校园Walk", record.routeName || "低电量"];
  return base.filter(Boolean).slice(0, Math.min(max, 3));
}

function cleanPhotoTitle(photo: PhotoNode | undefined, index: number, templateId: HtmlTemplateId) {
  const parts = [photo?.locationName, photo?.moodTag].filter(Boolean);
  return parts.join(" / ");
}

function cleanPhotoNote(photo: PhotoNode | undefined, index: number, templateId: HtmlTemplateId) {
  return photo?.note || "";
}

function absoluteUrl(path: string) {
  return new URL(path, window.location.origin).href;
}

async function imageToDataUrl(path: string) {
  const response = await fetch(absoluteUrl(path));
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function px(box: Box): CSSProperties {
  return { left: box.x, top: box.y, width: box.w, height: box.h };
}

function displayPhotoBox(slot: PhotoSlot, base: Box): Box {
  const inset = 12;
  const top = base.y + inset;
  const bottom = Math.max(top + 48, slot.title.y - 10);
  return {
    x: base.x + inset,
    y: top,
    w: base.w - inset * 2,
    h: Math.min(base.y + base.h - inset - top, bottom - top),
  };
}

function Poster({ record, template, background, personaAvatar, siteQr }: { record: WalkRecord; template: PosterTemplate; background: string; personaAvatar?: string; siteQr?: string }) {
  const photos = record.photos;
  const total = elapsedMinutes(record);
  const routeCount = Math.max(2, Math.min(template.routeSlots.length, photos.length + 2));
  const tags = topicTags(record, template.tags.length);
  return (
    <div className={`html-poster html-poster-${template.id}`} style={{ width: template.width, height: template.height, backgroundImage: `url("${background}")` }}>
      <style>{posterCss}</style>
      {template.photoSlots.map((slot, index) => {
        const photo = photos[index];
        const base = slot.card ?? { x: slot.image.x - 12, y: slot.image.y - 12, w: slot.image.w + 24, h: slot.image.h + slot.title.h + slot.note.h + 46 };
        const imageBox = displayPhotoBox(slot, base);
        return (
          <div className="poster-slot" style={{ ...px(base), transform: `rotate(${slot.rotate ?? 0}deg)` }} key={index}>
            <div className="poster-photo" style={{ ...px({ x: imageBox.x - base.x, y: imageBox.y - base.y, w: imageBox.w, h: imageBox.h }), background: slot.paper ?? "#e8f4ef" }}>
              {photo && <img src={photo.imageDataUrl} alt="" />}
            </div>
            {template.id === "route_notebook" && <div className="poster-photo-index">{index + 1}</div>}
            {template.id === "stamp_route" ? (
              <>
                <div
                  className="poster-caption-cover"
                  style={{
                    left: 0,
                    top: Math.max(0, slot.title.y - base.y - 10),
                    width: base.w,
                    height: Math.max(0, base.h - Math.max(0, slot.title.y - base.y - 10)),
                  }}
                />
                <div className="poster-text title" style={px({ x: slot.title.x - base.x, y: slot.title.y - base.y, w: slot.title.w, h: slot.title.h })}>
                  {photo ? cleanPhotoTitle(photo, index, template.id) : ""}
                </div>
                <div className="poster-text note" style={px({ x: slot.note.x - base.x, y: slot.note.y - base.y, w: slot.note.w, h: slot.note.h })}>
                  {photo ? cleanPhotoNote(photo, index, template.id) : ""}
                </div>
              </>
            ) : (
              <>
                <div className="poster-text title" style={px({ x: slot.title.x - base.x, y: slot.title.y - base.y, w: slot.title.w, h: slot.title.h })}>
                  {photo ? cleanPhotoTitle(photo, index, template.id) : ""}
                </div>
                <div className="poster-text note" style={px({ x: slot.note.x - base.x, y: slot.note.y - base.y, w: slot.note.w, h: slot.note.h })}>
                  {photo ? cleanPhotoNote(photo, index, template.id) : ""}
                </div>
              </>
            )}
          </div>
        );
      })}

      {template.routeSlots.map((slot, index) => {
        const photo = template.id === "route_notebook" ? photos[index] : photos[Math.max(0, index - 1)];
        const previousPhoto = template.id === "route_notebook" ? photos[index - 1] : photos[Math.max(0, index - 2)];
        const minute = slot.minute === "segment" ? Math.max(0, photoMinute(record, photo, index, routeCount) - photoMinute(record, previousPhoto, index - 1, routeCount)) : photoMinute(record, photo, index, routeCount);
        const label =
          template.id === "route_notebook"
            ? index === 0
              ? `从${photo?.locationName || "图书馆"}出发`
              : photo?.locationName || "校园一角"
            : index === 0
              ? "出发"
              : index === routeCount - 1
                ? "回程"
                : photo?.locationName || "打卡";
        return (
          <div key={index}>
            {slot.node && <div className="poster-route-node" style={px({ x: slot.node.x, y: slot.node.y, w: slot.node.size, h: slot.node.size })}>{index + 1}</div>}
            {slot.label && <div className="poster-route-label" style={px(slot.label)}>{label}</div>}
            {slot.place && <div className="poster-route-place" style={px(slot.place)}>{label}</div>}
            {slot.time && <div className="poster-route-time" style={px(slot.time)}>{slot.minute === "segment" ? `+${minute}min` : `${index === 0 ? 0 : minute}min`}</div>}
          </div>
        );
      })}

      <div className="poster-persona" style={px(template.persona)}>
        <span>今日人格:</span>
        <strong>{record.personaName || record.dailyStatusName || "自由走走中"}</strong>
      </div>
      {template.personaAvatar && personaAvatar && (
        <div className="poster-persona-avatar" style={px(template.personaAvatar)}>
          <img src={personaAvatar} alt="" />
        </div>
      )}

      {template.mood && <div className="poster-mood" style={px(template.mood)}>{record.templateText || record.routeSlogan || photos[0]?.note || "今天也走出去了一点点"}</div>}
      {template.data && (
        <div className="poster-data" style={px(template.data)}>
          <span>爽活历</span>
          <strong>{total} min</strong>
          <strong>{record.isDemoMode ? `${photos.length} 个集章点` : `${(record.distanceMeters / 1000).toFixed(1)} km`}</strong>
          <strong>回血 +{Math.min(99, 70 + photos.length * 4)}%</strong>
        </div>
      )}
      {template.summary && (
        <div className="poster-summary" style={px(template.summary)}>
          <span>走走停停，已收藏</span>
          <span>遇见美好，已回血</span>
          <span>明天继续出发</span>
        </div>
      )}
      {template.tags.map((box, index) => (
        <div className={`poster-tag tag-${index}`} style={px(box)} key={index}>#{tags[index] || ""}</div>
      ))}
      {template.qr && siteQr && (
        <div className="poster-qr" style={px(template.qr)}>
          <img src={siteQr} alt="" />
          <span>扫码体验</span>
        </div>
      )}
    </div>
  );
}

const posterCss = `
.html-poster {
  position: relative;
  overflow: hidden;
  background-size: 100% 100%;
  color: #063f32;
  font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif;
  letter-spacing: 0;
}
.html-poster * {
  box-sizing: border-box;
}
.poster-slot {
  position: absolute;
  transform-origin: center;
  border-radius: 5px;
  background: #fffdf6;
  box-shadow: 0 8px 18px rgba(72, 61, 42, 0.18);
}
.poster-slot::before {
  content: "";
  position: absolute;
  inset: 7px;
  border-radius: 5px;
  background: rgba(232, 244, 239, 0.38);
}
.html-poster-route_notebook .poster-slot::after {
  content: "";
  position: absolute;
  z-index: 4;
  left: -24px;
  top: -18px;
  width: 120px;
  height: 38px;
  border-radius: 3px;
  opacity: 0.78;
  transform: rotate(-8deg);
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 8px, transparent 8px 16px),
    rgba(142, 171, 119, 0.72);
}
.html-poster-route_notebook .poster-slot:nth-of-type(2)::after,
.html-poster-route_notebook .poster-slot:nth-of-type(6)::after {
  left: auto;
  right: -18px;
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 8px, transparent 8px 16px),
    rgba(238, 143, 117, 0.72);
}
.html-poster-route_notebook .poster-slot:nth-of-type(3)::after {
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 8px, transparent 8px 16px),
    rgba(243, 177, 103, 0.72);
}
.html-poster-route_notebook .poster-slot:nth-of-type(5)::after {
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 8px, transparent 8px 16px),
    rgba(135, 164, 204, 0.72);
}
.poster-photo {
  position: absolute;
  z-index: 1;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: inset 0 0 0 3px rgba(255,255,255,.88);
}
.poster-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
.poster-photo-index {
  position: absolute;
  z-index: 5;
  left: -12px;
  bottom: 48px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 5px solid #fffdf6;
  border-radius: 999px;
  color: #fff;
  background: #087765;
  font-size: 25px;
  font-weight: 950;
  line-height: 1;
  box-shadow: 0 8px 14px rgba(29, 82, 68, 0.18);
}
.poster-caption-cover {
  position: absolute;
  z-index: 2;
  border-radius: 4px;
  background: rgba(255, 253, 246, 0.96);
}
.poster-text,
.poster-route-label,
.poster-route-place,
.poster-route-node,
.poster-route-time,
.poster-persona,
.poster-mood,
.poster-data,
.poster-summary,
.poster-tag {
  position: absolute;
  z-index: 3;
  overflow: hidden;
  background: #fffdf6;
}
.poster-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  border-radius: 6px;
  padding: 2px 6px;
  font-weight: 900;
  line-height: 1.15;
}
.poster-text.title {
  color: #064f40;
  font-size: 24px;
}
.poster-text.note {
  color: #163f38;
  font-size: 17px;
}
.poster-route-label,
.poster-route-place {
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 0 6px;
  font-size: 18px;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.poster-route-node {
  display: grid;
  place-items: center;
  border: 5px solid #fffdf6;
  border-radius: 999px;
  color: #fff;
  background: #087765;
  font-family: "Comic Sans MS", "KaiTi", "STKaiti", "Microsoft YaHei", sans-serif;
  font-size: 28px;
  font-weight: 950;
  line-height: 1;
  box-shadow: 0 8px 14px rgba(29, 82, 68, 0.18);
}
.html-poster-route_notebook .poster-slot {
  box-shadow: 0 10px 20px rgba(72, 61, 42, 0.16);
}
.html-poster-route_notebook .poster-slot::before {
  inset: 12px 12px 58px;
  background: linear-gradient(135deg, rgba(218, 238, 224, 0.78), rgba(231, 242, 255, 0.62));
}
.html-poster-route_notebook .poster-photo {
  border-radius: 2px;
  box-shadow: none;
}
.html-poster-route_notebook .poster-photo img {
  border-radius: 2px;
}
.html-poster-route_notebook .poster-text {
  background: transparent;
  border-radius: 0;
  padding: 0;
  font-family: "KaiTi", "STKaiti", "Microsoft YaHei", sans-serif;
}
.html-poster-route_notebook .poster-text.title {
  color: #064f40;
  font-size: 22px;
  line-height: 1.2;
}
.html-poster-route_notebook .poster-text.note {
  color: #1b332f;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.15;
}
.html-poster-route_notebook .poster-photo-index {
  left: -10px;
  bottom: 54px;
  width: 42px;
  height: 42px;
  border-width: 4px;
  font-family: "Comic Sans MS", "KaiTi", "STKaiti", "Microsoft YaHei", sans-serif;
  font-size: 25px;
}
.html-poster-route_notebook .poster-route-place {
  background: transparent;
  color: #18352f;
  font-family: "KaiTi", "STKaiti", "Microsoft YaHei", sans-serif;
  font-size: 23px;
  font-weight: 950;
  text-decoration: underline;
  text-decoration-color: rgba(119, 159, 99, 0.72);
  text-decoration-thickness: 3px;
  text-underline-offset: 5px;
}
.html-poster-route_notebook .poster-route-time {
  font-family: "Comic Sans MS", "KaiTi", "STKaiti", "Microsoft YaHei", sans-serif;
  font-size: 20px;
  background: #073b4a;
  box-shadow: 0 5px 10px rgba(7, 59, 74, 0.14);
}
.poster-route-time {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  background: #073b4a;
  font-size: 18px;
  font-weight: 950;
  white-space: nowrap;
}
.poster-persona {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  padding: 6px 8px;
  font-weight: 900;
  line-height: 1.22;
  box-shadow: 0 0 0 8px #fffdf6;
}
.poster-persona span {
  font-size: 20px;
}
.poster-persona strong {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 24px;
}
.poster-persona-avatar {
  position: absolute;
  z-index: 4;
  overflow: hidden;
  border-radius: 50%;
  background: #fffaf0;
  box-shadow: 0 10px 22px rgba(72, 61, 42, 0.2), 0 0 0 8px #fffdf6;
}
.poster-persona-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  transform: scale(1.5);
}
.poster-mood {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 22px;
  font-weight: 900;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.poster-data,
.poster-summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.16;
}
.poster-data span {
  color: #d5531f;
  font-size: 18px;
  font-weight: 950;
}
.poster-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 20px;
  font-weight: 950;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.poster-qr {
  position: absolute;
  z-index: 5;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 3px;
  padding: 9px;
  border-radius: 14px;
  background: #fffdf6;
  box-shadow: 0 7px 16px rgba(72, 61, 42, 0.16);
}
.poster-qr img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
}
.poster-qr span {
  color: #00634f;
  font-size: 15px;
  font-weight: 950;
  line-height: 1;
  text-align: center;
}
.tag-0 { background: #dcebd3; color: #00634f; }
.tag-1 { background: #ffe2a2; color: #d5531f; }
.tag-2, .tag-3 { background: #ffd1ca; color: #d9422e; }
.html-poster-stamp_route .poster-text,
.html-poster-stamp_route .poster-route-label,
.html-poster-stamp_route .poster-route-place,
.html-poster-stamp_route .poster-persona,
.html-poster-stamp_route .poster-data,
.html-poster-stamp_route .poster-summary {
  background: #fffdf6;
}
.html-poster-stamp_route .poster-text {
  padding: 2px 5px;
  line-height: 1.05;
}
.html-poster-stamp_route .poster-text.title {
  font-size: 19px;
}
.html-poster-stamp_route .poster-text.note {
  color: #4f6b62;
  font-size: 13px;
  font-weight: 800;
}
.html-poster-stamp_route .poster-persona {
  padding: 10px 12px;
  box-shadow: 0 0 0 10px #efe4ca;
}
.html-poster-stamp_route .poster-persona span {
  font-size: 18px;
}
.html-poster-stamp_route .poster-persona strong {
  font-size: 22px;
}
.html-poster-stamp_route .poster-data {
  gap: 7px;
  align-items: center;
  text-align: center;
  font-size: 19px;
}
.html-poster-stamp_route .poster-summary {
  gap: 6px;
  font-size: 17px;
}
.html-poster-stamp_route .poster-tag {
  font-size: 17px;
}
`;

async function renderToPng(element: HTMLElement, width: number, height: number) {
  await document.fonts?.ready;
  const clone = element.cloneNode(true) as HTMLElement;
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  const markup = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
  const img = new Image();
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("无法渲染分享图"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建分享图画布");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export async function generateHtmlShareImage(record: WalkRecord, forcedMode?: SharePosterMode) {
  try {
    const template = chooseTemplate(record, forcedMode);
    const background = await imageToDataUrl(template.background);
    const personaAvatar = template.personaAvatar ? await imageToDataUrl(getPersonaAvatarSrc(record)) : undefined;
    const siteQr = template.qr ? await imageToDataUrl("/site-qr.svg") : undefined;
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "0";
    host.style.width = `${template.width}px`;
    host.style.height = `${template.height}px`;
    document.body.appendChild(host);
    const root = createRoot(host);
    root.render(<Poster record={record} template={template} background={background} personaAvatar={personaAvatar} siteQr={siteQr} />);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const poster = host.firstElementChild as HTMLElement | null;
    if (!poster) throw new Error("分享图模板渲染失败");
    const png = await renderToPng(poster, template.width, template.height);
    root.unmount();
    host.remove();
    return png;
  } catch (error) {
    console.warn("HTML poster render failed, falling back to canvas renderer.", error);
    return generateCanvasShareImage(record, forcedMode);
  }
}
