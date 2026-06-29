import type { PersonaResult, PersonaScores, RouteRecommendation } from "./types";

export const scoreValues = [0, 15, 35, 50] as const;

export const schoolwalkQuestions = [
  { id: "q1", dim: "S", title: "到了晚上 12 点，你通常在干嘛？", options: ["已经睡了，或者准备关机", "躺床上刷手机，但知道该收手了", "DDL 前效率突然上线，越晚越像开了倍速", "越夜越清醒，半晚上干出一个白天的工作量"] },
  { id: "q2", dim: "S", title: "面对早八/上午课，你的真实状态是？", options: ["不仅自然醒，还能吃早餐", "起床虽痛苦，但坐下后还能正常开机", "身体准时到场，大脑延迟上线", "完课像打完一场硬仗，下午还得靠午觉/咖啡续命"] },
  { id: "q3", dim: "F", title: "你的三餐日常更接近哪种？", options: ["基本规律，吃得比较清爽均衡", "基本按点吃，偶尔点外卖，与食堂随缘搭配", "经常放纵，奶茶烧烤炸鸡一周能来好几回", "糖油混合物是常驻主食，省事、重口、快乐但上头"] },
  { id: "q4", dim: "F", title: "饭后 1 小时，你最常见的状态是？", options: ["没什么明显影响，能继续学习/走动", "有点懒，但还能正常运转", "似乎有点困，要是在宿舍就上床了", "饭后直接昏迷，高低得眯一会儿"] },
  { id: "q5", dim: "M", title: "每周你大致主动运动的频率是？", options: ["3 次及以上，且每次持续 30 分钟以上", "1–2 次，或者通勤走路还不少", "想起来才动一下，主要靠缘分", "能不动则不动，外卖都想找人代取"] },
  { id: "q6", dim: "M", title: "你的身体最近有没有发出“久坐警报”？", options: ["肩颈腰背基本没什么感觉", "偶尔酸痛，活动一下会好", "久坐后明显僵硬、发沉、没精神", "感觉屁股和椅子已经签了长期合同"] },
  { id: "q7", dim: "E", title: "过度思考或焦虑时，你通常怎么处理？", options: ["会尽快拆成小任务，或者转移注意力让自己缓下来", "会先放松一下，之后基本还能回到正事", "知道该行动，但经常会拖着、刷着、反复脑内排练很久", "明明该处理却卡住不动，越拖越乱，连学习/睡眠/饮食都被带崩"] },
  { id: "q8", dim: "E", title: "最近你的压力/焦虑后台运行情况更接近哪种？", options: ["偶尔有压力，但基本能随事情结束而关机", "有阶段性压力，但不太影响学习生活", "经常被 ddl、学业、未来牵着走，需要比较久才能缓过来", "长期高负荷运行，已经明显影响睡眠、饮食或学习效率"] },
  { id: "q9", dim: "C", title: "如果看到一个校内线下活动，你第一反应是？", options: ["有点期待，愿意认识新朋友", "若有熟人同去就很乐意", "有点想去，又怕尴尬/没话说", "光看见“线下活动”四个字就想隐身"] },
  { id: "q10", dim: "C", title: "最近你和同学/朋友的线下社交状态更接近哪种？", options: ["有二三好友，常能畅聊天地", "能和作业/兴趣搭子聊聊，互换情报", "交流较少，还没找到特别聊得来的人", "能不见人就不见人，社交电量长期红灯"] },
] as const;

export const schoolRoutes = [
  { routeId: "A", routeName: "晨间血清素", routeType: "作息修复 / 向阳运动", duration: "20–30 分钟", intensity: "轻中等", socialMode: "独行友好", routeDescription: "适合夜间兴奋、白天断电的人，推荐在早晨或上午沿向阳道路慢走或慢跑。", slogan: "向阳运动，重塑生物钟。" },
  { routeId: "B", routeName: "饭后追霞径", routeType: "饭后轻走 / 低门槛回血", duration: "15–25 分钟", intensity: "轻松", socialMode: "熟人搭子 / 独行友好", routeDescription: "适合饭后困倦、低电量、脆皮状态的人，从食堂或宿舍附近出发，完成一段不费力的餐后轻走。", slogan: "主打一个饭后顺便。" },
  { routeId: "C", routeName: "心肺唤醒环", routeType: "心肺激活 / 能量释放", duration: "30–45 分钟", intensity: "中等", socialMode: "搭子友好", routeDescription: "适合久坐、运动不足或能量过剩的人，用一条校园环线完成适度心肺唤醒。", slogan: "去校园里释放一点剩余精力。" },
  { routeId: "D", routeName: "操场刷圈怪", routeType: "校内保底 / 操场循环", duration: "20–40 分钟", intensity: "可自由调节", socialMode: "独行友好 / 搭子友好", routeDescription: "不想远行时的保底路线，在操场或校内环线完成一段稳定、可控、不需要决策的 Walk。", slogan: "不想远行，就在校内刷圈保底。" },
  { routeId: "E", routeName: "萌宠偶遇官", routeType: "情绪疗愈 / 轻探索", duration: "20–30 分钟", intensity: "轻松", socialMode: "独行友好", routeDescription: "适合压力大、脑内反刍、社交电量低的人，以校园萌宠、树荫、草地为情绪缓冲点。注意只偶遇，不打扰，不投喂。", slogan: "社恐不敢去，先跟猫社交。" },
  { routeId: "F", routeName: "学院交流家", routeType: "跨学院探索 / 社交破冰", duration: "40–60 分钟", intensity: "轻中等", socialMode: "搭子友好", routeDescription: "适合想扩大社交面、打破学院信息差的人，路线串联不同学院公共空间与可停留节点。", slogan: "去别的学院走走，打破一点信息差。" },
];

export const personas = [
  { personaId: "p_sedentary", personaName: "生无可恋的定海神针", camp: "", description: "运动匮乏；屁股与椅子融合，肩颈石化。", painPoint: "久坐不动，身体加载慢。", mainRouteId: "C", subRouteId: "D", personaCopy: "不是不想动，是椅子先动的手。", shareCopy: "今天先从离开椅子开始。" },
  { personaId: "p_sleep", personaName: "日间休眠的午夜永动机", camp: "", description: "作息失调；半夜灵感爆发，白天随机断电。", painPoint: "夜间兴奋，白天断电。", mainRouteId: "A", personaCopy: "夜里精神百倍，白天加载失败。", shareCopy: "向阳运动，重塑生物钟。" },
  { personaId: "p_food", personaName: "碳水过载的昏迷患者", camp: "", description: "饮食极差；外卖重度依赖，饭后深度昏睡。", painPoint: "饭后容易断电。", mainRouteId: "B", personaCopy: "吃完不是饱了，是系统准备休眠。", shareCopy: "餐后轻有氧，防止饭后断电。" },
  { personaId: "p_anxious", personaName: "脑内开会的迷航舵手", camp: "", description: "情绪高压；脑内持续开会，反复思考到有点迷航。", painPoint: "脑内过载，需要降噪。", mainRouteId: "E", subRouteId: "D", personaCopy: "脑子太吵，先去校园里降噪。", shareCopy: "动物疗愈，转移内耗。" },
  { personaId: "p_social", personaName: "持续掉线的单机玩家", camp: "", description: "社交孤立；三点一线，习惯单机但渴望连接。", painPoint: "想连接，但缺少入口。", mainRouteId: "F", subRouteId: "E", personaCopy: "不是不社交，是还没找到合适的入口。", shareCopy: "去别的学院走走，打破一点信息差。" },
  { personaId: "p_swing", personaName: "薛定谔的自律选手", camp: "", description: "想努力变好，卷与摆烂间反复仰卧起坐。", painPoint: "计划很多，执行不稳。", mainRouteId: "D", subRouteId: "B", personaCopy: "计划很多，执行看天气。", shareCopy: "先保住自律底线，走一圈也算开始。" },
  { personaId: "p_low", personaName: "心如止水的低耗电待机党", camp: "", description: "对养生无欲望，只求今天不断电。", painPoint: "低耗电稳定待机。", mainRouteId: "B", personaCopy: "不求满血，只求稳定待机。", shareCopy: "主打一个饭后顺便。" },
  { personaId: "p_full", personaName: "血条全满的校园特工", camp: "", description: "能量溢出；到点自然醒，每天有用不完的牛马精神。", painPoint: "精力需要释放。", mainRouteId: "C", subRouteId: "F", personaCopy: "状态不错，适合多走一点。", shareCopy: "去大学城释放剩余精力。" },
  { personaId: "p_fragile", personaName: "五维掉线的脆皮大学生", camp: "", description: "作息、饮食、运动、情绪、社交集体掉帧，系统正在请求重启。", painPoint: "五维都需要轻轻重启。", mainRouteId: "B", subRouteId: "E", personaCopy: "别急着重启人生，先从最简单的走路开始。", shareCopy: "不强求完整走完，说不定会发现猫咪。" },
];

export const dailyStatuses = [
  { statusId: "morning_off", statusName: "上午断电", statusDescription: "白天加载失败", recommendedRouteId: "A", recommendedRouteName: "晨间血清素", recommendationReason: "白天加载失败时，先去向阳路线慢慢开机。", duration: "20–30 分钟", socialMode: "独行友好", templateText: "向阳运动，重塑生物钟。" },
  { statusId: "after_meal", statusName: "饭后想躺", statusDescription: "吃完有点困", recommendedRouteId: "B", recommendedRouteName: "饭后追霞径", recommendationReason: "吃完别急着回宿舍，走一小段再摆烂。", duration: "15–25 分钟", socialMode: "熟人搭子 / 独行友好", templateText: "主打一个饭后顺便。" },
  { statusId: "chair_stone", statusName: "久坐石化", statusDescription: "身体需要叫醒", recommendedRouteId: "C", recommendedRouteName: "心肺唤醒环", recommendationReason: "屁股和椅子待太久了，今天先把身体叫醒。", duration: "30–45 分钟", socialMode: "搭子友好", templateText: "今天先从离开椅子开始。" },
  { statusId: "brain_overload", statusName: "脑子过载", statusDescription: "先去降噪", recommendedRouteId: "E", recommendedRouteName: "萌宠偶遇官", recommendationReason: "脑子太吵时，不必硬运动，先去校园里降噪。", duration: "20–30 分钟", socialMode: "独行友好", templateText: "动物疗愈，转移内耗。" },
  { statusId: "meet_people", statusName: "想认识人", statusDescription: "想打破信息差", recommendedRouteId: "F", recommendedRouteName: "学院交流家", recommendationReason: "去别的学院走走，顺便打破一点信息差。", duration: "40–60 分钟", socialMode: "搭子友好", templateText: "去别的学院走走，打破一点信息差。" },
  { statusId: "nearby", statusName: "不想远行", statusDescription: "校内刷圈保底", recommendedRouteId: "D", recommendedRouteName: "操场刷圈怪", recommendationReason: "不想决策、不想跑远，就在校内刷一圈保底。", duration: "20–40 分钟", socialMode: "独行友好 / 搭子友好", templateText: "不想远行，就在校内刷圈保底。" },
  { statusId: "full_power", statusName: "满血有劲", statusDescription: "多走一点", recommendedRouteId: "C", recommendedRouteName: "心肺唤醒环", recommendationReason: "状态不错，今天可以多走一点，释放剩余精力。", duration: "30–45 分钟", socialMode: "搭子友好", templateText: "去校园里释放一点剩余精力。" },
  { statusId: "free", statusName: "自由走走", statusDescription: "自己选路线", recommendedRouteId: null, recommendedRouteName: "用户自行选择路线", recommendationReason: "今天不想被推荐，随便走走也算出门回血。", duration: "自由", socialMode: "自由选择", templateText: "不卷步数，只是出去走走。" },
];

export type PersonaAnswers = Record<string, number>;

const dimensionPriority = ["E", "S", "M", "F", "C"] as const;
const extremeMap = { S: "p_sleep", F: "p_food", M: "p_sedentary", E: "p_anxious", C: "p_social" } as const;

export function getRouteById(routeId?: string | null) {
  return schoolRoutes.find((route) => route.routeId === routeId);
}

export function getPersonaById(personaId?: string) {
  return personas.find((persona) => persona.personaId === personaId);
}

const personaPreviewScores: Record<string, PersonaScores> = {
  p_sedentary: { S: 45, F: 40, M: 90, E: 55, C: 48, T: 55.6, R: 50 },
  p_sleep: { S: 92, F: 38, M: 42, E: 48, C: 40, T: 52, R: 54 },
  p_food: { S: 44, F: 92, M: 48, E: 42, C: 38, T: 52.8, R: 54 },
  p_anxious: { S: 52, F: 44, M: 46, E: 94, C: 50, T: 57.2, R: 50 },
  p_social: { S: 40, F: 42, M: 46, E: 56, C: 90, T: 54.8, R: 50 },
  p_swing: { S: 70, F: 35, M: 66, E: 42, C: 38, T: 50.2, R: 35 },
  p_low: { S: 45, F: 50, M: 42, E: 48, C: 44, T: 45.8, R: 8 },
  p_full: { S: 20, F: 18, M: 15, E: 22, C: 24, T: 19.8, R: 9 },
  p_fragile: { S: 88, F: 90, M: 86, E: 94, C: 82, T: 88, R: 12 },
};

export function getPersonaPreviewResult(personaId: string): PersonaResult {
  const persona = getPersonaById(personaId) ?? personas[6];
  return {
    ...persona,
    scores: personaPreviewScores[persona.personaId] ?? personaPreviewScores.p_low,
    createdAt: new Date().toISOString(),
  };
}

function highestDimension(scores: PersonaScores) {
  const dims = ["S", "F", "M", "E", "C"] as const;
  const max = Math.max(...dims.map((dim) => scores[dim]));
  return dimensionPriority.find((dim) => scores[dim] === max) ?? "E";
}

export function evaluatePersona(answers: PersonaAnswers): PersonaResult {
  const base = { S: 0, F: 0, M: 0, E: 0, C: 0 };
  schoolwalkQuestions.forEach((question) => {
    base[question.dim] += scoreValues[answers[question.id] ?? 0];
  });
  const values = Object.values(base);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const scores: PersonaScores = { ...base, T: values.reduce((sum, value) => sum + value, 0) / 5, R: max - min };
  const answerScore = (questionId: string) => scoreValues[answers[questionId] ?? 0];
  const activeScores = ["q1", "q3", "q5", "q7", "q9"].map(answerScore);
  const objectiveScores = ["q2", "q4", "q6", "q8", "q10"].map(answerScore);
  const activeLowCount = activeScores.filter((score) => score <= 15).length;
  const activeHighCount = activeScores.filter((score) => score >= 35).length;
  const activeAverage = activeScores.reduce<number>((sum, score) => sum + score, 0) / activeScores.length;
  const activeRange = Math.max(...activeScores) - Math.min(...activeScores);
  const objectiveMax = Math.max(...objectiveScores);
  let personaId = "p_low";
  if (values.every((value) => value <= 30)) personaId = "p_full";
  else if (values.every((value) => value >= 70)) personaId = "p_fragile";
  else if (max >= 70) personaId = extremeMap[highestDimension(scores)];
  else if (activeLowCount >= 2 && activeHighCount >= 2 && activeRange >= 35) personaId = "p_swing";
  else if (max <= 55 && objectiveMax <= 35 && activeAverage >= 25 && activeAverage <= 35 && activeRange <= 20) personaId = "p_low";
  else if (max >= 55) personaId = extremeMap[highestDimension(scores)];
  else if (activeHighCount >= 2 && activeLowCount >= 1) personaId = "p_swing";
  const persona = getPersonaById(personaId) ?? personas[6];
  return { ...persona, scores, createdAt: new Date().toISOString() };
}

export function recommendationFromRoute(routeId: string | null | undefined, persona?: PersonaResult, dailyStatus?: (typeof dailyStatuses)[number]): RouteRecommendation {
  const route = getRouteById(routeId) ?? schoolRoutes[1];
  return {
    status: "满血巡游中",
    dailyStatusId: dailyStatus?.statusId,
    dailyStatusName: dailyStatus?.statusName,
    dailyStatusDescription: dailyStatus?.statusDescription,
    dailyRecommendationReason: dailyStatus?.recommendationReason,
    routeId: route.routeId,
    routeName: route.routeName,
    routeSlogan: route.slogan,
    recommendedDuration: dailyStatus?.duration ?? route.duration,
    socialMode: dailyStatus?.socialMode ?? route.socialMode,
    reason: dailyStatus?.recommendationReason ?? route.routeDescription,
    templateName: dailyStatus ? "今日状态生活卡" : "自由路线生活卡",
    templateText: dailyStatus?.templateText ?? persona?.shareCopy ?? route.slogan,
    routeText: route.routeDescription,
    personaId: persona?.personaId,
    personaName: persona?.personaName,
    camp: persona?.camp,
    shareCopy: persona?.shareCopy,
  };
}

export function recommendationFromDailyStatus(statusId: string, persona?: PersonaResult) {
  const status = dailyStatuses.find((item) => item.statusId === statusId) ?? dailyStatuses[7];
  return recommendationFromRoute(status.recommendedRouteId, persona, status);
}

export function recommendationFromPersona(persona: PersonaResult) {
  return recommendationFromRoute(persona.mainRouteId, persona);
}
