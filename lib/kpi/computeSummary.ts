// lib/kpi/computeSummary.ts
import type { Summary } from "@/lib/kpi/types";

/** number化（""/null/undefined は null） */
function num(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** キー候補から最初に見つかった値を返す */
function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined) return obj[k];
  }
  return undefined;
}

/** "mm:ss" / "hh:mm:ss" / 数値文字列 を秒に変換 */
function parseSeconds(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;

  // number / numeric string
  const n = Number(v);
  if (Number.isFinite(n)) return n;

  // "mm:ss" or "hh:mm:ss"
  const s = String(v).trim();
  if (!s.includes(":")) return null;

  const parts = s.split(":").map((x) => x.trim());
  if (parts.some((p) => p === "" || Number.isNaN(Number(p)))) return null;

  if (parts.length === 2) {
    const mm = Number(parts[0]);
    const ss = Number(parts[1]);
    return mm * 60 + ss;
  }
  if (parts.length === 3) {
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    const ss = Number(parts[2]);
    return hh * 3600 + mm * 60 + ss;
  }
  return null;
}

/** いろんな真偽値表現を吸収（true/false, 1/0, yes/no, within/out, met/miss） */
function normalizeBool(v: any): boolean | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s) return null;

  if (["true", "t", "yes", "y", "1", "within", "met"].includes(s)) return true;
  if (["false", "f", "no", "n", "0", "out", "miss"].includes(s)) return false;
  return null;
}

function normalizeStatus(v: any): "resolved" | "not_resolved" | "unknown" {
  if (v === null || v === undefined) return "unknown";
  const s = String(v).trim().toLowerCase();
  if (!s) return "unknown";

  // Resolved寄せ
  if (["resolved", "solved", "complete", "completed", "done", "closed"].includes(s)) return "resolved";

  // Not resolved寄せ（暫定）
  if (["open", "pending", "in progress", "escalated", "transferred", "unresolved"].includes(s)) return "not_resolved";

  return "unknown";
}

/** Escalation判定（v1）：Resolution_Status に Transfer to L2 / Escalation を含む */
function isEscalationStatus(v: any): boolean | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s) return null;

  if (s.includes("transfer to l2")) return true;
  if (s.includes("escalation")) return true;
  if (s.includes("escalated")) return true;
  return false;
}

/** ✅ Summaryは “KPI集計だけ” に固定（引数は rows のみ） */
export function computeSummary(rows: any[]): Summary {
  const safeRows = Array.isArray(rows) ? rows : [];
  const rowCount = safeRows.length;
  const totalCalls = rowCount;

  const csatVals: number[] = [];
  const ahtVals: number[] = [];

  // Day3: FCR
  let fcrEligibleCount = 0;
  let fcrResolvedCount = 0;
  let fcrUnknownCount = 0;

  // Day4: SLA
  let slaEligibleCount = 0;
  let slaMetCount = 0;
  let slaUnknownCount = 0;
  let slaStatus: "ok" | "missing_columns" = "missing_columns";

  // Day4: Escalation
  let escalationEligibleCount = 0;
  let escalationCount = 0;
  let escalationUnknownCount = 0;
  let escalationStatus: "ok" | "missing_columns" = "missing_columns";

  const probe = safeRows[0] ?? {};
  const hasWithinSla = pick(probe, ["WithinSLA", "within_sla", "withinSla"]) !== undefined;
  const hasSlaPct = pick(probe, ["SLA", "sla", "ServiceLevel", "service_level", "serviceLevel"]) !== undefined;

  const hasResolution =
    pick(probe, ["Resolution_Status", "resolution_status", "resolutionStatus", "status", "Status"]) !== undefined;

  if (hasWithinSla || hasSlaPct) slaStatus = "ok";
  if (hasResolution) escalationStatus = "ok";

  const slaPctVals: number[] = [];

  for (const r of safeRows) {
    // CSAT
    const csatRaw = pick(r, ["CSAT", "csat", "Csat", "csat_score", "csatScore"]);
    const csat = num(csatRaw);
    if (csat !== null) csatVals.push(csat);

    // AHT（seconds or "mm:ss"）
    const ahtRaw = pick(r, [
      "AHT",
      "aht",
      "Aht",
      "aht_sec",
      "ahtSec",
      "AHT_sec",
      "AHTSeconds",
      "aht_seconds",
      "handle_time_sec",
      "HandleTimeSec",
      "Handle_Time_Sec",
      "Handle Time (sec)",
      "Handle Time",
    ]);

    const ahtSec = parseSeconds(ahtRaw);
    if (ahtSec !== null) {
      ahtVals.push(ahtSec);
    } else {
      const ahtFallback = num(ahtRaw);
      if (ahtFallback !== null) ahtVals.push(ahtFallback);
    }

    // Resolution_Status（FCR & Escalationの基礎）
    const rsRaw = pick(r, ["Resolution_Status", "resolution_status", "resolutionStatus", "status", "Status"]);

    // ---- Day3: FCR(v1)
    const cls = normalizeStatus(rsRaw);
    if (cls === "unknown") {
      fcrUnknownCount += 1;
    } else {
      fcrEligibleCount += 1;
      if (cls === "resolved") fcrResolvedCount += 1;
    }

    // ---- Day4: Escalation(v1)
    if (escalationStatus !== "missing_columns") {
      const esc = isEscalationStatus(rsRaw);
      if (esc === null) {
        escalationUnknownCount += 1;
      } else {
        escalationEligibleCount += 1;
        if (esc) escalationCount += 1;
      }
    }

    // ---- Day4: SLA(v1)
    if (slaStatus !== "missing_columns") {
      if (hasWithinSla) {
        const withinRaw = pick(r, ["WithinSLA", "within_sla", "withinSla"]);
        const within = normalizeBool(withinRaw);
        if (within === null) {
          slaUnknownCount += 1;
        } else {
          slaEligibleCount += 1;
          if (within) slaMetCount += 1;
        }
      } else {
        const pctRaw = pick(r, ["SLA", "sla", "ServiceLevel", "service_level", "serviceLevel"]);
        const pct = num(pctRaw);
        if (pct === null) {
          slaUnknownCount += 1;
        } else {
          slaPctVals.push(pct);
        }
      }
    }
  }

  const avgCsat =
    csatVals.length > 0 ? Math.round((csatVals.reduce((a, b) => a + b, 0) / csatVals.length) * 10) / 10 : null;

  const avgAht =
    ahtVals.length > 0 ? Math.round((ahtVals.reduce((a, b) => a + b, 0) / ahtVals.length) * 10) / 10 : null;

  const fcrRate = fcrEligibleCount > 0 ? Math.round((fcrResolvedCount / fcrEligibleCount) * 1000) / 10 : null;

  // SLA rate
  let slaRate: number | null = null;
  if (slaStatus === "missing_columns") {
    slaRate = null;
  } else if (hasWithinSla) {
    slaRate = slaEligibleCount > 0 ? Math.round((slaMetCount / slaEligibleCount) * 1000) / 10 : null;
  } else {
    slaRate = slaPctVals.length > 0 ? Math.round((slaPctVals.reduce((a, b) => a + b, 0) / slaPctVals.length) * 10) / 10 : null;
    slaEligibleCount = slaPctVals.length;
    slaMetCount = 0; // %平均方式では個別metは持たない（v1）
  }

  // Escalation rate
  const escalationRate =
    escalationStatus === "missing_columns"
      ? null
      : escalationEligibleCount > 0
        ? Math.round((escalationCount / escalationEligibleCount) * 1000) / 10
        : null;

  const slaDefinition =
    slaStatus === "missing_columns"
      ? "SLA(v1)=入力カラム不足（SLA/ServiceLevel/WithinSLA が無い）"
      : hasWithinSla
        ? "SLA(v1)=WithinSLA(true) / eligible. unknownは母数から除外"
        : "SLA(v1)=SLA/ServiceLevel(%) の平均（v1）";

  const escalationDefinition =
    escalationStatus === "missing_columns"
      ? "Escalation(v1)=入力カラム不足（Resolution_Status が無い）"
      : "Escalation(v1)=count(Transfer to L2 or Escalation) / eligible. unknownは母数から除外";

  return {
    rowCount,
    totalCalls,

    avgCsat,
    avgAht,

    // FCR
    fcrRate,
    fcrEligibleCount,
    fcrResolvedCount,
    fcrUnknownCount,
    fcrDefinition: "FCR(v1)=Resolved / (Resolved + NotResolved). unknownは母数から除外",

    // SLA
    slaRate,
    slaEligibleCount,
    slaMetCount,
    slaUnknownCount,
    slaStatus,
    slaDefinition,

    // Escalation
    escalationRate,
    escalationEligibleCount,
    escalationCount,
    escalationUnknownCount,
    escalationStatus,
    escalationDefinition,
  };
}
