// lib/kpi/index.ts
export type { Summary, RangeKey } from "@/lib/kpi/types";

// 実装は computeSummary.ts に置く（index.ts では再exportだけ）
export { computeSummary } from "@/lib/kpi/computeSummary";

// もし page.tsx / 他が attachActions を参照してるなら残す（使ってなければ消してOK）
export function attachActions<T extends object>(
  summary: T,
  extra: {
    insights?: any[];
    recommendTasks?: any[];
  }
) {
  return {
    ...summary,
    ...(extra.insights ? { insights: extra.insights } : {}),
    ...(extra.recommendTasks ? { recommendTasks: extra.recommendTasks } : {}),
  };
}
