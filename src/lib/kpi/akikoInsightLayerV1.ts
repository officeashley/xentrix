// src/lib/kpi/akikoInsightLayerV1.ts
import { AKIKO_INSIGHTS_SEED_V1 } from "./akikoInsightsSeedV1";

type Insight = any;

function ensureId(ins: Insight, fallback: string) {
  return { ...ins, id: ins?.id ?? fallback };
}

export function applyAkikoInsightLayerV1(input: {
  insights: Insight[];
  summary: any;
  agentStats: any[];
  window: any;
}) {
  const { insights, summary, agentStats, window } = input;

  const ctx = { summary, agentStats, window };

  // ① seedを条件でフィルタ
  const seeds = AKIKO_INSIGHTS_SEED_V1
    .filter((s) => (s.when ? s.when(ctx) : true))
    .map((s) => ({
      id: s.id,
      title: s.title,
      why: s.why,
      scope: "center",
      who: "akiko",
      level: "principle",
      lens: s.lens,
      // priorityの簡易上げ（表示順に効かせる用）
      _boost: s.priorityBoost ?? 0,
      source: "akiko_seed_v1",
    }));

  // ② 既存insightsにidを保証
  const base = (insights ?? []).map((it: any, idx: number) =>
    ensureId(it, `rule_${idx}`)
  );

  // ③ 結合（Akikoを先頭寄りに）
  const merged = [...seeds, ...base].sort((a: any, b: any) => (b._boost ?? 0) - (a._boost ?? 0));

  // ④ 空にならないガード（必ず1件）
  if (!merged.length) {
    return [
      {
        id: "fallback_ok",
        title: "大きな異常は検出されませんでした（v1）",
        why: "現状のルール条件に該当する項目がありません。",
        scope: "center",
        who: "system",
        level: "info",
        source: "fallback",
      },
    ];
  }

  return merged;
}
