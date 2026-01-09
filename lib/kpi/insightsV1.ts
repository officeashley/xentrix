// lib/kpi/insightsV1.ts
import { buildRecommendTasksV1 } from "@/lib/kpi/taskMappingV1";
import { AiOutputV1, RangeKey } from "@/lib/kpi/types";

type SummaryLike = {
  avgAht?: number | null; // sec
  avgCsat?: number | null; // %
  fcrRate?: number | null; // %
  fcrUnknownCount?: number;
  fcrEligibleCount?: number;
  rowCount?: number;
  escalationRate?: number | null; // %
  slaStatus?: "ok" | "missing_columns";
};

type AgentStatLike = {
  agentName: string;
  totalCalls: number;
  avgAht: number | null; // sec
  avgCsat: number | null; // %
  fcrRate: number | null; // %
  fcrUnknownCount?: number;
  escalationRate?: number | null;
};

type Params = {
  window: RangeKey;
  summary: SummaryLike;
  agentStats: AgentStatLike[];

  // 旧互換
  ahtTargetSec?: number;
  ahtTooLowSec?: number;
  ahtTooHighSec?: number;
  minSample?: number;

  // page.tsx の policy に対応
  policy?: {
    minSampleCalls?: number;
    csatTarget?: number;
    ahtTargetSec?: number;
    ahtTooLowSec?: number;
    ahtTooHighSec?: number;
  };
};

function makeId(prefix: string, seed: string) {
  return `${prefix}_${seed}`.replace(/\s+/g, "_");
}

function pickCenterAht(summary: SummaryLike, agentStats: AgentStatLike[]): number | null {
  const v =
    summary?.avgAht ??
    (summary as any)?.avgAHT ??
    (summary as any)?.avg_handle_time ??
    (summary as any)?.avgHandleTime ??
    null;

  if (typeof v === "number" && Number.isFinite(v)) return v;

  let wSum = 0;
  let callsSum = 0;

  for (const a of agentStats ?? []) {
    const aht = a?.avgAht;
    const calls = a?.totalCalls ?? 0;
    if (typeof aht === "number" && Number.isFinite(aht) && typeof calls === "number" && calls > 0) {
      wSum += aht * calls;
      callsSum += calls;
    }
  }

  if (callsSum === 0) return null;
  return Math.round((wSum / callsSum) * 10) / 10;
}

// ✅ page.tsx が import している名前に合わせる
export function buildInsightsV1(params: Params): AiOutputV1 {
  const { window, summary, agentStats } = params;

  const minSampleCalls = params.policy?.minSampleCalls ?? params.minSample ?? 30;
  const csatTarget = params.policy?.csatTarget ?? 85;

  const ahtTargetSec = params.policy?.ahtTargetSec ?? params.ahtTargetSec ?? 300;
  const ahtTooLowSec = params.policy?.ahtTooLowSec ?? params.ahtTooLowSec ?? 240;
  const ahtTooHighSec = params.policy?.ahtTooHighSec ?? params.ahtTooHighSec ?? 330;

  const problems: string[] = [];
  const insights: AiOutputV1["insights"] = [];

  const TH = {
    csatTarget,
    csatLowGap: 2,
    fcrLow: 80,
    escHigh: 8,
    minCalls: minSampleCalls,
    ahtHigh: ahtTooHighSec,
    ahtLow: ahtTooLowSec,
  };

  const eligibleAgents = (agentStats ?? []).filter((a) => (a?.totalCalls ?? 0) >= TH.minCalls);

  const centerCsat = typeof summary?.avgCsat === "number" ? summary.avgCsat : null;
  const centerAht = pickCenterAht(summary, agentStats);
  const centerFcr = typeof summary?.fcrRate === "number" ? summary.fcrRate : null;
  const centerEsc = typeof summary?.escalationRate === "number" ? summary.escalationRate : null;

  const csatLow = typeof centerCsat === "number" && centerCsat < TH.csatTarget - TH.csatLowGap;
  const ahtHigh = typeof centerAht === "number" && centerAht > TH.ahtHigh;
  const ahtLow = typeof centerAht === "number" && centerAht < TH.ahtLow;

  if (csatLow) {
    problems.push("CSATが低い（センター）");
    insights.push({
      id: makeId("ins", `center_csat_low_${window}`),
      level: centerCsat! < 80 ? "critical" : "warn",
      title: "CSATが低い（センター）",
      why: `平均CSATが ${centerCsat!.toFixed(1)}% で、目標(${TH.csatTarget}%)を下回っています。`,
      impact: "顧客満足の低下は再問い合わせ・解約リスクに直結します。",
      scope: "center",
      who: "center",
      window,
      metrics: { CSAT: centerCsat! },
    });
  }

  if (csatLow && ahtHigh) {
    problems.push("CSAT低 × AHT高（センター）");
    insights.push({
      id: makeId("ins", `center_lowcsat_highaht_${window}`),
      level: "warn",
      title: "CSATが低くAHTが高い（センター）",
      why: `CSAT ${centerCsat!.toFixed(1)}% < ${TH.csatTarget}% かつ AHT ${Math.round(centerAht!)}s > ${TH.ahtHigh}s`,
      impact: "顧客不満と処理長期化が同時に発生。再入電・工数増に波及します。",
      scope: "center",
      who: "center",
      window,
      metrics: { CSAT: centerCsat!, AHT: centerAht! },
    });
  }

  if (csatLow && ahtLow) {
    problems.push("CSAT低 × AHT低（センター）");
    insights.push({
      id: makeId("ins", `center_lowcsat_lowaht_${window}`),
      level: "warn",
      title: "CSATが低くAHTが短い（センター）",
      why: `CSAT ${centerCsat!.toFixed(1)}% < ${TH.csatTarget}% かつ AHT ${Math.round(centerAht!)}s < ${TH.ahtLow}s`,
      impact: "急ぎすぎ・共感不足・確認漏れの可能性。品質起因の再入電に波及します。",
      scope: "center",
      who: "center",
      window,
      metrics: { CSAT: centerCsat!, AHT: centerAht! },
    });
  }

  if (typeof centerFcr === "number" && centerFcr < TH.fcrLow) {
    problems.push("FCRが低い（センター）");
    insights.push({
      id: makeId("ins", `center_fcr_low_${window}`),
      level: centerFcr < 70 ? "critical" : "warn",
      title: "FCRが低い（センター）",
      why: `FCRが ${centerFcr.toFixed(1)}% で、基準(${TH.fcrLow}%)を下回っています。`,
      impact: "再入電が増えるとAHT・コスト・CSATに連鎖します。",
      scope: "center",
      who: "center",
      window,
      metrics: { FCR: centerFcr },
    });
  }

  if (typeof centerEsc === "number" && centerEsc > TH.escHigh) {
    problems.push("Escalation率が高い（センター）");
    insights.push({
      id: makeId("ins", `center_escalation_high_${window}`),
      level: "warn",
      title: "Escalation率が高い（センター）",
      why: `Escalation ${centerEsc.toFixed(1)}% > ${TH.escHigh}%`,
      impact: "二次対応増 → 待ち時間/コスト増、一次解決低下の兆候",
      scope: "center",
      who: "center",
      window,
      metrics: { ESCALATION: centerEsc },
    });
  }

  const tooLowAgents = eligibleAgents.filter((a) => typeof a.avgAht === "number" && a.avgAht < ahtTooLowSec);
  const tooHighAgents = eligibleAgents.filter((a) => typeof a.avgAht === "number" && a.avgAht > ahtTooHighSec);

  for (const a of tooLowAgents) {
    problems.push(`AHTが短すぎる可能性: ${a.agentName}`);
    insights.push({
      id: makeId("ins", `aht_too_low_${a.agentName}_${window}`),
      level: "warn",
      title: "AHTが短すぎる（品質リスク）",
      why: `${a.agentName} の平均AHTが ${Math.round(a.avgAht!)}s で、下限 ${ahtTooLowSec}s を下回っています。`,
      impact: "確認不足は誤案内・再入電・CSAT低下につながります。",
      scope: "agent",
      who: a.agentName,
      window,
      metrics: { AHT: a.avgAht!, CSAT: a.avgCsat ?? null, FCR: a.fcrRate ?? null },
    });
  }

  for (const a of tooHighAgents) {
    problems.push(`AHTが長すぎる可能性: ${a.agentName}`);
    insights.push({
      id: makeId("ins", `aht_too_high_${a.agentName}_${window}`),
      level: "warn",
      title: "AHTが長すぎる（効率リスク）",
      why: `${a.agentName} の平均AHTが ${Math.round(a.avgAht!)}s で、上限 ${ahtTooHighSec}s を上回っています。`,
      impact: "生産性低下・待ち時間増加はCSAT悪化につながります。",
      scope: "agent",
      who: a.agentName,
      window,
      metrics: { AHT: a.avgAht!, CSAT: a.avgCsat ?? null, FCR: a.fcrRate ?? null },
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: makeId("ins", `no_findings_${window}`),
      level: "info",
      title: "大きな異常は検出されませんでした（v1）",
      why: "現在のルール条件に該当する項目がありません。",
      scope: "center",
      who: "center",
      window,
    });
  }

  const recommendTasks = buildRecommendTasksV1({
    window,
    summary: summary as any,
    agentStats: agentStats as any,
    policy: {
      minSampleCalls,
      csatTarget,
      ahtTargetSec,
    },
  });

  return {
    problems,
    insights,
    recommendTasks,
  };
}
