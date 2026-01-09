// lib/kpi/taskMappingV1.ts
import type { RangeKey, Summary } from "@/lib/kpi/types";

/**
 * Day3: “気づき → タスク生成” のマッピング（v1）
 * - 個人向け / センター向け の分岐
 * - 期限（due）と工数（effortMin）を必ず入れる
 * - まずはモック/Explore風データで確実にタスクが出ることを優先（安全側）
 */

export type TaskScope = "center" | "agent";

export type RecommendTaskV1 = {
  id: string;
  scope: TaskScope;
  title: string;
  why: string;
  steps: string[];
  due: "today" | "this_week" | "this_month";
  effortMin: number; // minutes
  priority: "P0" | "P1" | "P2";
  owner?: string; // agent name (if scope=agent)
  linkHint?: string; // optional
  meta?: Record<string, any>;
};

export type TaskMappingInput = {
  window: RangeKey;
  summary: Summary;
  agentStats?: any[];
  policy?: {
    csatTarget?: number; // default 85
    ahtTargetSec?: number; // default 300
    minSampleCalls?: number; // default 30
    lowCsatAgentThreshold?: number; // default 80
  };
};

function dueFromWindow(w: RangeKey): RecommendTaskV1["due"] {
  if (w === "today") return "today";
  if (w === "week") return "this_week";
  return "this_month";
}

function safeNum(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function pickLowCsatAgents(agentStats: any[], threshold: number) {
  const out: { name: string; csat: number; calls: number }[] = [];
  for (const a of agentStats ?? []) {
    const name = String(a?.agent ?? a?.agentName ?? a?.name ?? a?.Agent ?? "Unknown");
    const csat = safeNum(a?.csat ?? a?.avgCsat ?? a?.CSAT);
    const calls = safeNum(a?.calls ?? a?.totalCalls ?? a?.callCount ?? a?.records ?? a?.rowCount) ?? 0;
    if (csat !== null && csat < threshold && calls > 0) out.push({ name, csat, calls });
  }
  out.sort((x, y) => x.csat - y.csat);
  return out;
}

function pickHighEscalationAgents(agentStats: any[], minRatePct: number) {
  const out: { name: string; rate: number; calls: number }[] = [];
  for (const a of agentStats ?? []) {
    const name = String(a?.agent ?? a?.agentName ?? a?.name ?? a?.Agent ?? "Unknown");
    const rate = safeNum(a?.escalationRate ?? a?.escalRate ?? a?.EscalationRate);
    const calls = safeNum(a?.calls ?? a?.totalCalls ?? a?.callCount ?? a?.records ?? a?.rowCount) ?? 0;
    if (rate !== null && rate >= minRatePct && calls > 0) out.push({ name, rate, calls });
  }
  out.sort((x, y) => y.rate - x.rate);
  return out;
}

/**
 * メイン：Recommend Tasks（v1）
 * “異常がなくても改善タスクを最低1つ出す” 方針（ダッシュボードが空にならない）
 */
export function buildRecommendTasksV1(input: TaskMappingInput): RecommendTaskV1[] {
  const { summary, agentStats } = input;
  const policy = {
    csatTarget: 85,
    ahtTargetSec: 300,
    minSampleCalls: 30,
    lowCsatAgentThreshold: 80,
    ...input.policy,
  };

  const due = dueFromWindow(input.window);
  const tasks: RecommendTaskV1[] = [];

  const rowCount = summary?.rowCount ?? 0;
  const csat = summary?.avgCsat ?? null;
  const fcr = (summary as any)?.fcrRate ?? null;
  const fcrEligible = (summary as any)?.fcrEligibleCount ?? 0;
  const escal = (summary as any)?.escalationRate ?? null;
  const slaStatus = (summary as any)?.slaStatus ?? "missing_columns";

  // Center: CSAT低 → コールレビュー10件
  if (csat !== null && csat < policy.csatTarget && rowCount >= policy.minSampleCalls) {
    tasks.push({
      id: genId("center_csat_review10"),
      scope: "center",
      title: "CSAT低下：コールレビュー10件（原因タグ付け）",
      why: `平均CSATが ${csat}%（目標 ${policy.csatTarget}%）を下回っています。`,
      steps: [
        "直近からランダムに10件抽出（低CSAT優先でもOK）",
        "原因を3分類：①解決不可/制約 ②案内品質 ③プロセス/システム",
        "再発防止の“1行ルール”を作成（例：冒頭で要件復唱）",
        "SVへ共有し、明日のQA/朝会で周知",
      ],
      due,
      effortMin: 45,
      priority: "P0",
      linkHint: "dashboard → CSAT Distribution / Low bucket → sample 10",
      meta: { csatTarget: policy.csatTarget, csat },
    });
  }

  // Center: SLA missing columns
  if (slaStatus === "missing_columns") {
    tasks.push({
      id: genId("center_sla_columns_fix"),
      scope: "center",
      title: "SLA列不足：Explore出力にSLA/WithinSLA列を追加（定義確認）",
      why: "SLA(v1)が Missing columns のため、SLAを計測できません。",
      steps: [
        "Exploreの列一覧で SLA / ServiceLevel / WithinSLA の有無を確認",
        "無い場合：代替列（First reply time / Next reply time など）を特定",
        "“SLA達成”の定義（例：初回返信◯分以内）を決める",
        "出力に列追加 → 再取り込み → ダッシュボードでSLA復活を確認",
      ],
      due,
      effortMin: 30,
      priority: "P1",
      linkHint: "Explore → Columns",
      meta: { slaStatus },
    });
  }

  // Center: FCR低
  if (typeof fcr === "number" && fcrEligible >= policy.minSampleCalls && fcr < 90) {
    tasks.push({
      id: genId("center_fcr_drilldown"),
      scope: "center",
      title: "FCR改善：NotResolved上位理由を10件で確認",
      why: `FCRが ${fcr}% です（eligible ${fcrEligible}件）。`,
      steps: [
        "NotResolvedのケースを10件抽出（最新/頻出カテゴリ優先）",
        "原因を分類：①権限不足 ②ナレッジ不足 ③手順複雑 ④システム/在庫",
        "“1つだけ”改善案を決める（例：テンプレ追記/エスカ導線短縮）",
        "明日からの運用に反映し、1週間後にFCR再評価",
      ],
      due,
      effortMin: 40,
      priority: "P1",
      linkHint: "dashboard → FCR card → eligible/unknown",
      meta: { fcr, fcrEligible },
    });
  }

  // Center: Escalation高
  if (typeof escal === "number" && rowCount >= policy.minSampleCalls && escal >= 5) {
    tasks.push({
      id: genId("center_escalation_reduce"),
      scope: "center",
      title: "Escalation抑制：L2へ回す前のチェックリスト作成",
      why: `Escalation率が ${escal}% です（全 ${rowCount}件）。`,
      steps: [
        "エスカ理由トップ3を仮決め（例：本人確認/返金/在庫）",
        "“L2前に確認する3点”チェックリスト作成",
        "SVが1日5件だけ、チェックリスト遵守をモニタ",
      ],
      due,
      effortMin: 35,
      priority: "P1",
      linkHint: "dashboard → Escalation card",
      meta: { escal, rowCount },
    });
  }

  // Agent: 低CSAT（最大2名）
  const lowAgents = pickLowCsatAgents(agentStats ?? [], policy.lowCsatAgentThreshold).slice(0, 2);
  for (const a of lowAgents) {
    tasks.push({
      id: genId("agent_csat_coach"),
      scope: "agent",
      owner: a.name,
      title: "個別：CSAT改善のミニコーチング（3コール）",
      why: `${a.name} のCSATが ${a.csat}%（閾値 ${policy.lowCsatAgentThreshold}%）です。`,
      steps: [
        "直近の3コールを一緒に聴く（良い点→改善点の順）",
        "“次の3コールでやる1つ”を決める",
        "明日もう一度3コール確認して定着チェック",
      ],
      due,
      effortMin: 20,
      priority: "P1",
      meta: { agentCsat: a.csat, calls: a.calls },
    });
  }

  // Agent: エスカ高（最大1名）
  const highEscAgents = pickHighEscalationAgents(agentStats ?? [], 10).slice(0, 1);
  for (const a of highEscAgents) {
    tasks.push({
      id: genId("agent_escalation_coach"),
      scope: "agent",
      owner: a.name,
      title: "個別：エスカ削減（エスカ前の確認ポイント導入）",
      why: `${a.name} のEscalation率が ${a.rate}% です。`,
      steps: [
        "エスカした2件を確認し、“エスカ前に言える一言”をテンプレ化",
        "明日から3件だけテンプレ適用して効果を見る",
      ],
      due,
      effortMin: 15,
      priority: "P2",
      meta: { agentEscalRate: a.rate, calls: a.calls },
    });
  }

  // Fallback: 空にしない
  if (tasks.length === 0) {
    tasks.push({
      id: genId("baseline_review10"),
      scope: "center",
      title: "維持：週次コールレビュー10件（品質維持）",
      why: "大きな異常が無くても、品質維持のための最小タスクを実行します。",
      steps: ["ランダムに10件抽出", "“良い例3つ”と“改善例3つ”をメモ", "明日の共有で全体に展開（短く）"],
      due,
      effortMin: 30,
      priority: "P2",
      linkHint: "dashboard → sample 10 calls",
    });
  }

  const rank = { P0: 0, P1: 1, P2: 2 } as const;
  tasks.sort((a, b) => rank[a.priority] - rank[b.priority]);

  return tasks;
}

/**
 * ✅ 互換エクスポート：page.tsx が mapInsightsToTasksV1 を import している場合に備える
 * ここでは「insightsを使う」必要はない（Day3はsummary/agentStatsで十分）
 */
export function mapInsightsToTasksV1(input: TaskMappingInput): RecommendTaskV1[] {
  return buildRecommendTasksV1(input);
}
