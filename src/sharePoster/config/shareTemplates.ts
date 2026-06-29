export type TemplateId =
  | "route_memory_card"
  | "outdoor_proof"
  | "plog_cover"
  | "route_notebook"
  | "long_journal"
  | "stamp_route";

export type Rect = { x: number; y: number; w: number; h: number };

export type PhotoSlot = {
  id: string;
  card: Rect;
  image: Rect;
  title: Rect;
  subtitle: Rect;
  rotation: number;
  foregroundPatches?: Rect[];
};

export type RouteLayout = "vertical" | "compact" | "stamp" | "long";

export type ShareTemplateConfig = {
  id: TemplateId;
  name: string;
  width: number;
  height: number;
  background: string;
  maxPhotos: number;
  routeArea: Rect;
  personaCardArea: Rect;
  personaAvatarArea?: Rect;
  qrArea?: Rect;
  dataCardArea?: Rect;
  summaryCardArea?: Rect;
  sloganArea: Rect;
  tagsArea: Rect;
  photoSlots: PhotoSlot[];
  routeLayout: RouteLayout;
};

const bg = "/share-templates/";

export const shareTemplates: Record<TemplateId, ShareTemplateConfig> = {
  route_memory_card: {
    id: "route_memory_card",
    name: "路线纪念卡",
    width: 1086,
    height: 1448,
    background: `${bg}template_outdoor_proof.svg`,
    maxPhotos: 0,
    routeLayout: "compact",
    routeArea: { x: 720, y: 420, w: 170, h: 500 },
    personaCardArea: { x: 780, y: 58, w: 246, h: 268 },
    personaAvatarArea: { x: 844, y: 76, w: 118, h: 118 },
    qrArea: { x: 882, y: 1218, w: 122, h: 150 },
    dataCardArea: { x: 76, y: 535, w: 520, h: 250 },
    summaryCardArea: { x: 82, y: 802, w: 430, h: 180 },
    sloganArea: { x: 220, y: 1320, w: 650, h: 56 },
    tagsArea: { x: 280, y: 1390, w: 530, h: 44 },
    photoSlots: [],
  },
  outdoor_proof: {
    id: "outdoor_proof",
    name: "今日出门证明",
    width: 1086,
    height: 1448,
    background: `${bg}template_outdoor_proof.svg`,
    maxPhotos: 2,
    routeLayout: "compact",
    routeArea: { x: 742, y: 420, w: 150, h: 500 },
    personaCardArea: { x: 780, y: 58, w: 246, h: 268 },
    personaAvatarArea: { x: 844, y: 76, w: 118, h: 118 },
    qrArea: { x: 884, y: 1218, w: 122, h: 150 },
    summaryCardArea: { x: 45, y: 1200, w: 390, h: 120 },
    sloganArea: { x: 230, y: 1310, w: 640, h: 58 },
    tagsArea: { x: 260, y: 1383, w: 560, h: 45 },
    photoSlots: [
      {
        id: "main",
        card: { x: 76, y: 472, w: 650, h: 628 },
        image: { x: 142, y: 544, w: 520, h: 500 },
        title: { x: 145, y: 1063, w: 500, h: 34 },
        subtitle: { x: 145, y: 1100, w: 500, h: 34 },
        rotation: -0.045,
      },
      {
        id: "optional",
        card: { x: 725, y: 975, w: 270, h: 300 },
        image: { x: 748, y: 1000, w: 225, h: 205 },
        title: { x: 750, y: 1218, w: 215, h: 26 },
        subtitle: { x: 750, y: 1248, w: 215, h: 24 },
        rotation: 0.075,
      },
    ],
  },
  plog_cover: {
    id: "plog_cover",
    name: "今日 Plog 封面",
    width: 1086,
    height: 1448,
    background: `${bg}template_plog_cover.svg`,
    maxPhotos: 4,
    routeLayout: "compact",
    routeArea: { x: 370, y: 420, w: 150, h: 600 },
    personaCardArea: { x: 798, y: 58, w: 250, h: 278 },
    personaAvatarArea: { x: 862, y: 76, w: 120, h: 120 },
    qrArea: { x: 892, y: 1218, w: 122, h: 150 },
    dataCardArea: { x: 95, y: 730, w: 310, h: 190 },
    sloganArea: { x: 210, y: 1312, w: 690, h: 55 },
    tagsArea: { x: 280, y: 1380, w: 540, h: 44 },
    photoSlots: [
      {
        id: "main",
        card: { x: 500, y: 420, w: 450, h: 540 },
        image: { x: 540, y: 460, w: 390, h: 390 },
        title: { x: 545, y: 888, w: 360, h: 30 },
        subtitle: { x: 545, y: 920, w: 360, h: 28 },
        rotation: 0.06,
      },
      {
        id: "left-top",
        card: { x: 70, y: 430, w: 300, h: 300 },
        image: { x: 96, y: 455, w: 235, h: 190 },
        title: { x: 105, y: 670, w: 225, h: 25 },
        subtitle: { x: 105, y: 700, w: 225, h: 24 },
        rotation: -0.06,
      },
      {
        id: "left-bottom",
        card: { x: 95, y: 980, w: 310, h: 300 },
        image: { x: 120, y: 1010, w: 255, h: 185 },
        title: { x: 125, y: 1215, w: 240, h: 25 },
        subtitle: { x: 125, y: 1243, w: 240, h: 24 },
        rotation: 0.05,
      },
      {
        id: "right-bottom",
        card: { x: 625, y: 1005, w: 315, h: 285 },
        image: { x: 652, y: 1032, w: 255, h: 175 },
        title: { x: 655, y: 1222, w: 240, h: 25 },
        subtitle: { x: 655, y: 1250, w: 240, h: 24 },
        rotation: -0.04,
      },
    ],
  },
  route_notebook: {
    id: "route_notebook",
    name: "校园路线手账",
    width: 941,
    height: 1672,
    background: `${bg}template_route_notebook.svg`,
    maxPhotos: 6,
    routeLayout: "vertical",
    routeArea: { x: 390, y: 345, w: 175, h: 1010 },
    personaCardArea: { x: 690, y: 68, w: 225, h: 248 },
    personaAvatarArea: { x: 760, y: 44, w: 118, h: 118 },
    qrArea: { x: 800, y: 1536, w: 90, h: 110 },
    sloganArea: { x: 180, y: 1530, w: 620, h: 55 },
    tagsArea: { x: 210, y: 1600, w: 520, h: 45 },
    photoSlots: [
      { id: "1", card: { x: 72, y: 360, w: 300, h: 335 }, image: { x: 102, y: 407, w: 214, h: 210 }, title: { x: 127, y: 643, w: 188, h: 27 }, subtitle: { x: 74, y: 687, w: 248, h: 24 }, rotation: -0.045, foregroundPatches: [{ x: 72, y: 345, w: 104, h: 42 }] },
      { id: "2", card: { x: 610, y: 400, w: 270, h: 315 }, image: { x: 654, y: 438, w: 192, h: 210 }, title: { x: 681, y: 675, w: 166, h: 27 }, subtitle: { x: 625, y: 716, w: 244, h: 24 }, rotation: 0.045, foregroundPatches: [{ x: 710, y: 378, w: 110, h: 44 }] },
      { id: "3", card: { x: 70, y: 760, w: 290, h: 315 }, image: { x: 83, y: 802, w: 220, h: 200 }, title: { x: 121, y: 1028, w: 174, h: 27 }, subtitle: { x: 68, y: 1073, w: 232, h: 24 }, rotation: 0.035, foregroundPatches: [{ x: 48, y: 744, w: 112, h: 42 }] },
      { id: "4", card: { x: 620, y: 820, w: 280, h: 315 }, image: { x: 657, y: 862, w: 198, h: 198 }, title: { x: 686, y: 1091, w: 164, h: 27 }, subtitle: { x: 623, y: 1133, w: 248, h: 24 }, rotation: -0.035, foregroundPatches: [{ x: 710, y: 797, w: 118, h: 42 }] },
      { id: "5", card: { x: 90, y: 1160, w: 290, h: 300 }, image: { x: 105, y: 1202, w: 190, h: 205 }, title: { x: 141, y: 1394, w: 168, h: 27 }, subtitle: { x: 88, y: 1437, w: 222, h: 24 }, rotation: -0.035, foregroundPatches: [{ x: 65, y: 1145, w: 110, h: 42 }] },
      { id: "6", card: { x: 635, y: 1190, w: 275, h: 300 }, image: { x: 672, y: 1238, w: 194, h: 188 }, title: { x: 699, y: 1441, w: 160, h: 27 }, subtitle: { x: 620, y: 1483, w: 246, h: 24 }, rotation: 0.035, foregroundPatches: [{ x: 735, y: 1170, w: 116, h: 42 }] },
    ],
  },
  long_journal: {
    id: "long_journal",
    name: "校园 Walk 长图游记",
    width: 793,
    height: 1983,
    background: `${bg}template_long_journal.svg`,
    maxPhotos: 12,
    routeLayout: "long",
    routeArea: { x: 340, y: 260, w: 125, h: 1425 },
    personaCardArea: { x: 584, y: 32, w: 184, h: 204 },
    personaAvatarArea: { x: 628, y: 44, w: 96, h: 96 },
    qrArea: { x: 650, y: 1810, w: 104, h: 126 },
    summaryCardArea: { x: 535, y: 1740, w: 210, h: 140 },
    sloganArea: { x: 150, y: 1900, w: 500, h: 35 },
    tagsArea: { x: 160, y: 1942, w: 500, h: 32 },
    photoSlots: [
      { id: "1", card: { x: 125, y: 260, w: 170, h: 205 }, image: { x: 145, y: 288, w: 130, h: 120 }, title: { x: 145, y: 420, w: 130, h: 20 }, subtitle: { x: 145, y: 444, w: 130, h: 18 }, rotation: -0.035 },
      { id: "2", card: { x: 520, y: 280, w: 175, h: 205 }, image: { x: 540, y: 308, w: 135, h: 120 }, title: { x: 540, y: 440, w: 135, h: 20 }, subtitle: { x: 540, y: 464, w: 135, h: 18 }, rotation: 0.035 },
      { id: "3", card: { x: 88, y: 520, w: 170, h: 195 }, image: { x: 108, y: 548, w: 130, h: 110 }, title: { x: 108, y: 670, w: 130, h: 20 }, subtitle: { x: 108, y: 694, w: 130, h: 18 }, rotation: -0.04 },
      { id: "4", card: { x: 505, y: 640, w: 180, h: 200 }, image: { x: 525, y: 670, w: 140, h: 110 }, title: { x: 525, y: 790, w: 140, h: 20 }, subtitle: { x: 525, y: 814, w: 140, h: 18 }, rotation: 0.035 },
      { id: "5", card: { x: 105, y: 780, w: 170, h: 195 }, image: { x: 125, y: 808, w: 130, h: 110 }, title: { x: 125, y: 930, w: 130, h: 20 }, subtitle: { x: 125, y: 954, w: 130, h: 18 }, rotation: -0.03 },
      { id: "6", card: { x: 520, y: 880, w: 175, h: 195 }, image: { x: 540, y: 908, w: 135, h: 110 }, title: { x: 540, y: 1030, w: 135, h: 20 }, subtitle: { x: 540, y: 1054, w: 135, h: 18 }, rotation: 0.035 },
      { id: "7", card: { x: 120, y: 1035, w: 175, h: 195 }, image: { x: 140, y: 1063, w: 135, h: 110 }, title: { x: 140, y: 1185, w: 135, h: 20 }, subtitle: { x: 140, y: 1209, w: 135, h: 18 }, rotation: -0.035 },
      { id: "8", card: { x: 518, y: 1120, w: 175, h: 195 }, image: { x: 538, y: 1148, w: 135, h: 110 }, title: { x: 538, y: 1270, w: 135, h: 20 }, subtitle: { x: 538, y: 1294, w: 135, h: 18 }, rotation: 0.04 },
      { id: "9", card: { x: 95, y: 1335, w: 175, h: 195 }, image: { x: 115, y: 1363, w: 135, h: 110 }, title: { x: 115, y: 1485, w: 135, h: 20 }, subtitle: { x: 115, y: 1509, w: 135, h: 18 }, rotation: -0.035 },
      { id: "10", card: { x: 505, y: 1410, w: 180, h: 195 }, image: { x: 525, y: 1438, w: 140, h: 110 }, title: { x: 525, y: 1560, w: 140, h: 20 }, subtitle: { x: 525, y: 1584, w: 140, h: 18 }, rotation: 0.035 },
      { id: "11", card: { x: 105, y: 1600, w: 175, h: 195 }, image: { x: 125, y: 1628, w: 135, h: 110 }, title: { x: 125, y: 1750, w: 135, h: 20 }, subtitle: { x: 125, y: 1774, w: 135, h: 18 }, rotation: -0.03 },
      { id: "12", card: { x: 435, y: 1625, w: 175, h: 195 }, image: { x: 455, y: 1653, w: 135, h: 110 }, title: { x: 455, y: 1775, w: 135, h: 20 }, subtitle: { x: 455, y: 1799, w: 135, h: 18 }, rotation: 0.03 },
    ],
  },
  stamp_route: {
    id: "stamp_route",
    name: "校园集章路线",
    width: 1086,
    height: 1448,
    background: `${bg}template_stamp_route.svg`,
    maxPhotos: 9,
    routeLayout: "stamp",
    routeArea: { x: 95, y: 360, w: 890, h: 750 },
    personaCardArea: { x: 790, y: 146, w: 230, h: 178 },
    personaAvatarArea: { x: 842, y: 58, w: 116, h: 116 },
    qrArea: { x: 44, y: 1286, w: 116, h: 134 },
    dataCardArea: { x: 398, y: 668, w: 292, h: 166 },
    summaryCardArea: { x: 78, y: 1182, w: 266, h: 126 },
    sloganArea: { x: 320, y: 1320, w: 470, h: 50 },
    tagsArea: { x: 310, y: 1382, w: 526, h: 38 },
    photoSlots: [
      { id: "1", card: { x: 80, y: 355, w: 275, h: 275 }, image: { x: 105, y: 385, w: 220, h: 175 }, title: { x: 112, y: 575, w: 205, h: 24 }, subtitle: { x: 112, y: 604, w: 205, h: 20 }, rotation: -0.035 },
      { id: "2", card: { x: 435, y: 325, w: 240, h: 245 }, image: { x: 458, y: 350, w: 190, h: 145 }, title: { x: 462, y: 508, w: 180, h: 23 }, subtitle: { x: 462, y: 534, w: 180, h: 18 }, rotation: 0.035 },
      { id: "3", card: { x: 740, y: 390, w: 255, h: 260 }, image: { x: 765, y: 420, w: 205, h: 160 }, title: { x: 770, y: 595, w: 190, h: 23 }, subtitle: { x: 770, y: 621, w: 190, h: 18 }, rotation: 0.04 },
      { id: "4", card: { x: 765, y: 745, w: 245, h: 255 }, image: { x: 788, y: 773, w: 195, h: 150 }, title: { x: 792, y: 938, w: 185, h: 23 }, subtitle: { x: 792, y: 964, w: 185, h: 18 }, rotation: -0.035 },
      { id: "5", card: { x: 630, y: 980, w: 250, h: 245 }, image: { x: 654, y: 1008, w: 200, h: 145 }, title: { x: 658, y: 1166, w: 190, h: 23 }, subtitle: { x: 658, y: 1192, w: 190, h: 18 }, rotation: 0.035 },
      { id: "6", card: { x: 335, y: 965, w: 245, h: 245 }, image: { x: 358, y: 993, w: 195, h: 145 }, title: { x: 362, y: 1150, w: 185, h: 23 }, subtitle: { x: 362, y: 1176, w: 185, h: 18 }, rotation: -0.03 },
      { id: "7", card: { x: 100, y: 875, w: 250, h: 245 }, image: { x: 124, y: 903, w: 200, h: 145 }, title: { x: 128, y: 1060, w: 190, h: 23 }, subtitle: { x: 128, y: 1086, w: 190, h: 18 }, rotation: 0.035 },
      { id: "8", card: { x: 78, y: 670, w: 235, h: 225 }, image: { x: 100, y: 698, w: 185, h: 130 }, title: { x: 104, y: 840, w: 175, h: 22 }, subtitle: { x: 104, y: 865, w: 175, h: 18 }, rotation: -0.025 },
      { id: "9", card: { x: 410, y: 835, w: 235, h: 225 }, image: { x: 432, y: 863, w: 185, h: 130 }, title: { x: 436, y: 1005, w: 175, h: 22 }, subtitle: { x: 436, y: 1030, w: 175, h: 18 }, rotation: 0.02 },
    ],
  },
};

export function selectTemplateId(photoCount: number): TemplateId {
  if (photoCount === 0) return "route_memory_card";
  if (photoCount <= 2) return "outdoor_proof";
  if (photoCount <= 4) return "plog_cover";
  if (photoCount <= 6) return "route_notebook";
  if (photoCount <= 9) return "stamp_route";
  return "long_journal";
}

export function getTemplateConfig(id: TemplateId, photoCount: number) {
  const template = shareTemplates[id];
  if (template.id !== "long_journal") return template;
  return {
    ...template,
    height: Math.min(3600, template.height + Math.max(0, photoCount - 10) * 180),
  };
}
