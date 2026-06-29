import type { RouteRecommendation, TodayStatus } from "./types";

export const routeLibrary: RouteRecommendation[] = [
  {
    status: "低电量待机中",
    routeName: "晚风缓冲线",
    recommendedDuration: "20 分钟",
    socialMode: "独行友好 / 安静同行",
    reason: "今天不适合硬运动，出去吹 20 分钟风就够了。",
    templateName: "低电量回血模板",
    templateText: "今天没有满血，但有走出去一点点。",
    routeText: "这周够累了，出去吹会风。",
  },
  {
    status: "椅子封印中",
    routeName: "图书馆解封线",
    recommendedDuration: "15 分钟",
    socialMode: "独行友好",
    reason: "坐太久了，先离开椅子走一小段。",
    templateName: "离开椅子模板",
    templateText: "离开椅子，走一小段。",
    routeText: "离开椅子，走一小段。",
  },
  {
    status: "饭后想躺中",
    routeName: "饭后不躺线",
    recommendedDuration: "15 分钟",
    socialMode: "熟人搭子",
    reason: "吃完先别急着回宿舍，慢慢走一圈。",
    templateName: "饭后不躺模板",
    templateText: "吃完别急着躺，走两步再摆烂。",
    routeText: "吃完别急着躺，走两步再摆烂。",
  },
  {
    status: "脑内加载中",
    routeName: "树荫降噪线",
    recommendedDuration: "20 分钟",
    socialMode: "安静同行",
    reason: "脑子太满，去树荫和风里清一清。",
    templateName: "压力散云模板",
    templateText: "脑子太满，先去风里清一清。",
    routeText: "脑子太满，先去风里清一清。",
  },
  {
    status: "社交断网中",
    routeName: "学院串门线",
    recommendedDuration: "45 分钟",
    socialMode: "搭子友好",
    reason: "换个学院走一圈，打破一点信息差。",
    templateName: "学院串门模板",
    templateText: "去别的学院，发现一个新角落。",
    routeText: "去别的学院，发现一个新角落。",
  },
  {
    status: "拍照雷达开机",
    routeName: "樱花限定线",
    recommendedDuration: "30 分钟",
    socialMode: "拍照友好",
    reason: "今天适合边走边拍，把校园整理成一张生活卡。",
    templateName: "今日好看模板",
    templateText: "今天适合拍点生活。",
    routeText: "花期很短，今天刚好走过。",
  },
  {
    status: "闲得发光中",
    routeName: "学院探索线",
    recommendedDuration: "45 分钟",
    socialMode: "探索友好",
    reason: "无聊别只刷手机，出去发现点什么。",
    templateName: "校园发现模板",
    templateText: "无聊别刷了，出去发现点什么。",
    routeText: "无聊别刷了，出去发现点什么。",
  },
  {
    status: "满血巡游中",
    routeName: "自由校园 Walk",
    recommendedDuration: "自由",
    socialMode: "自由选择",
    reason: "状态不错，今天可以自由走远一点。",
    templateName: "自由路线模板",
    templateText: "状态不错，今天多走一点。",
    routeText: "状态不错，今天多走一点。",
  },
];

export const testQuestions = [
  {
    id: "q1",
    title: "你现在的电量是？",
    options: [
      "快没电了，只想躺",
      "还行，但脑子有点乱",
      "吃饱了，有点困",
      "有点无聊，想找点事",
    ],
  },
  {
    id: "q2",
    title: "你今天最想获得什么？",
    options: ["放松一下", "离开椅子动一动", "拍几张好看的照片", "认识或见到一些人"],
  },
  {
    id: "q3",
    title: "你愿意走多久？",
    options: ["15 分钟以内", "20–30 分钟", "45 分钟左右", "无所谓，开心就行"],
  },
  {
    id: "q4",
    title: "你更想怎么走？",
    options: ["一个人安静走", "和熟人一起走", "随机搭子也可以", "自由走，想去哪去哪"],
  },
  {
    id: "q5",
    title: "你今天最像哪句话？",
    options: ["今天没有满血", "吃完别急着躺", "想去没去过的地方看看", "今天适合拍点生活"],
  },
] as const;

export type TestAnswers = Record<string, number>;

export function getRecommendationByStatus(status: TodayStatus) {
  return routeLibrary.find((route) => route.status === status) ?? routeLibrary[0];
}

export function getRecommendationByRoute(routeName: string) {
  return routeLibrary.find((route) => route.routeName === routeName) ?? routeLibrary[7];
}

export function evaluateStatus(answers: TestAnswers) {
  const q1 = answers.q1;
  const q2 = answers.q2;
  const q3 = answers.q3;
  const q4 = answers.q4;
  const q5 = answers.q5;
  const matched: TodayStatus[] = [];

  if (q1 === 0 || q5 === 0) matched.push("低电量待机中");
  if (q1 === 2 || q5 === 1) matched.push("饭后想躺中");
  if (q2 === 1) matched.push("椅子封印中");
  if (q1 === 1) matched.push("脑内加载中");
  if (q2 === 3 || q4 === 2) matched.push("社交断网中");
  if (q2 === 2 || q5 === 3) matched.push("拍照雷达开机");
  if (q1 === 3 || q5 === 2) matched.push("闲得发光中");
  if (q3 === 3 || q4 === 3) matched.push("满血巡游中");

  const priority: TodayStatus[] = [
    "低电量待机中",
    "饭后想躺中",
    "椅子封印中",
    "脑内加载中",
    "社交断网中",
    "拍照雷达开机",
    "闲得发光中",
    "满血巡游中",
  ];

  return priority.find((status) => matched.includes(status)) ?? "满血巡游中";
}
