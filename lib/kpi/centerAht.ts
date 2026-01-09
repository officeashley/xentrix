// lib/kpi/centerAht.ts
export function computeCenterAhtFromAgents(
  agentStats: { avgAht: number | null; totalCalls: number }[]
): number | null {
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
  return Math.round((wSum / callsSum) * 10) / 10;
}
