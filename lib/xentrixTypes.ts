// lib/xentrixTypes.ts

export type XentrixErrorTag =
  | "MISSING_REQUIRED"
  | "INVALID_NUMBER"
  | "INVALID_DATE"
  | "INVALID_TIME"
  | "OUT_OF_RANGE"
  | "INCONSISTENT_VALUE"
  | "FORMAT_NORMALIZED"
  | "OTHER";

export type XentrixCleanedRow = {
  // --- 基本KPI ---
  Date: string | null;                  // "2025-10-01" （ISO風 yyyy-mm-dd）
  AgentName_original: string | null;    // 元の名前（漢字/カナ/ローマ字）
  AgentName_canonical: string | null;   // ローマ字正規化（例: "Akiko Tanaka"）

  CallsHandled: number | null;          // 0以上。異常値は null + errorTags
  AvgHandleTimeSeconds: number | null;  // 0以上。7200 など怪しい値は null + errorTags
  CSAT: number | null;                  // 0–100。範囲外は null + errorTags
  Adherence: number | null;             // 0–100
  Compliance: number | null;            // 0–100

  Notes: string | null;                 // メモ（改行・空白整理済み）

  // --- コール種別など（元＋英語） ---
  Call_Type: string | null;             // 元の値（"受電" / "Outbound" etc.）
  Call_Type_en: string | null;          // 正規化英語（"Inbound" / "Outbound" / "Chat" ...）

  Issue_Type_original: string | null;   // 元（日本語＋スラッシュ混在OK）
  Issue_Type_en: string | null;         // 英語カテゴリ（"Billing" / "Payment error" ...）

  Resolution_Status_original: string | null; // 元の値
  Resolution_Status_en: string | null;       // 英語カテゴリ（"Resolved" / "Escalated" ...）

  // --- 時刻系 ---
  CallStartTime: string | null;         // "2025-10-01T14:57:01+09:00" など
  CallEndTime: string | null;           // 同上
  LoginTime: string | null;             // エージェントのログイン時刻
  LogoutTime: string | null;            // ログアウト時刻

  // --- アバンダン関係（その行単位で） ---
  AbandonCount: number | null;          // 0以上。無ければ null
  AbandonRate: number | null;           // 0–100（％）。無ければ null

  // --- エラー・補足 ---
  errorTags: XentrixErrorTag[];         // この行で検知したエラー/注意点
  errorMessage: string | null;          // 人間向けコメント（任意）
};

export type XentrixCleanResponse = {
  mode: "strict";                       // 厳格モード固定
  rowCount: number;                     // 行数
  errorCount: number;                   // errorTags.length > 0 な行数
  cleanedRows: XentrixCleanedRow[];     // クレンジング済み行
};
