// src/lib/kpi/akikoInsightsSeedV1.ts
export type AkikoInsightSeed = {
  id: string;
  title: string;
  why: string;
  lens: "csat" | "aht" | "fcr" | "sla" | "escalation" | "quality" | "ops";
  when?: (ctx: any) => boolean; // 条件が合う時だけ出す（任意）
  priorityBoost?: 0 | 1 | 2; // 既存insightより優先させたい時
};

export const AKIKO_INSIGHTS_SEED_V1: AkikoInsightSeed[] = [
  {
    id: "csat_median_over_mean",
    title: "CSATは平均だけでなく「中央値」も見る",
    why: "少数の低評価が平均を歪める。分布の形が改善の打ち手を決める。",
    lens: "csat",
  },
  {
    id: "fcr_unknown_is_design",
    title: "FCR unknown が多いのは「運用」ではなく「設計」問題",
    why: "計測不能は改善不能。unknown率が高いほどKPI自体が信用できない。",
    lens: "fcr",
    when: (ctx) => {
      const rowCount = ctx?.summary?.rowCount ?? 0;
      const unk = ctx?.summary?.fcrUnknownCount ?? 0;
      return rowCount > 0 && unk / rowCount > 0.2;
    },
    priorityBoost: 2,
  },
  {
    id: "aht_low_not_always_good",
    title: "AHTが低い＝良い、ではない（確認/共感不足の可能性）",
    why: "短さは品質の代替ではない。CSAT/FCRとセットで評価する。",
    lens: "aht",
  },
  {
    id: "escalation_mix_driver",
    title: "エスカ率は新人比率・難易度ミックスとセットで解釈する",
    why: "プロセス不備なのかスキルギャップなのかで打ち手が変わる。",
    lens: "escalation",
  },
];
