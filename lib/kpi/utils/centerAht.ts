// lib/kpi/utils/centerAht.ts

type SummaryLike = Record<string, any>;
type AgentStatLike = {
  avgAht: number | null;
  totalCalls: number;
};

export function calcCenterAht(summary: SummaryLike, agentStats: AgentStatLike[]): number | null {
  // 1) summaryに「avgAhtっぽい」値があるならそれを使う
  const v =
    summary?.avgAht ??
    summary?.avgAHT ??
    summary?.avg_handle_time ??
    summary?.avgHandleTime ??
    null;

  if (typeof v === "number" && Number.isFinite(v)) return v;

  // 2) 無いなら agentStats から加重平均で作る
  let wSum = 0;
  let callsSum = 0;

  for (const a of agentStats ?? []) {
    const aht = a?.avgAht;
    const calls = a?.totalCalls ?? 0;
    if (typeof aht === "number" && Number.isFinite(aht) && calls > 0) {
      wSum += aht * calls;
      callsSum += calls;
    }
  }

  if (callsSum === 0) return null;

  // 小数1桁で返す（表示/比較しやすい）
  return Math.round((wSum / callsSum) * 10) / 10;
}
