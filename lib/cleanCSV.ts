// lib/cleanCSV.ts

export type CleanCsvErrorType =
  | "MISSING_REQUIRED"
  | "INVALID_NUMBER"
  | "COLUMN_MISMATCH";

export type CleanCsvError = {
  row: number;          // 何行目か（1 行目 = ヘッダーなので 2 から始まる）
  column: string;       // カラム名（または ""）
  type: CleanCsvErrorType;
  message: string;      // 日本語メッセージ
  raw?: string;         // 生データ（あれば）
};

export type CleanCsvRow = Record<string, string | null>;

export type CleanCsvResult = {
  rows: CleanCsvRow[];   // クレンジング前の“生データ＋NULL 正規化”
  errors: CleanCsvError[];
};

/**
 * 空欄 / "NULL" / 全角スペースだけ → null 扱い
 */
function normalizeNull(value: string | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toUpperCase() === "NULL") return null;
  return trimmed;
}

/**
 * 厳格な数値チェック:
 *  - 整数 or 少数のみ
 *  - カンマや文字が入っていたら NG
 */
function isStrictNumber(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value);
}

/**
 * XENTRIX 用の前処理＋エラー検知
 */
export function cleanCSV(raw: string): CleanCsvResult {
  const errors: CleanCsvError[] = [];
  const rows: CleanCsvRow[] = [];

  // 行ごとに分解（空行は捨てる）
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: [] };
  }

  // 1 行目をヘッダーとする
  const header = lines[0].split(",").map((h) => h.trim());

  // 必須カラム（Akiko がチェックしたい列）
  const requiredColumns = [
    "Date",
    "AgentName",
    "CallHandled",
    "AvgHandleTimeSeconds",
    "CSAT",
    "Issue_Type",
    "Resolution_Status",
  ];

  // 数値であるべきカラム
  const numericColumns = [
    "CallHandled",
    "AvgHandleTimeSeconds",
    "CSAT",
    "Adherence",
    "Compliance",
  ];

  // データ行を 1 行ずつチェック
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = line.split(",");

    const rowObj: CleanCsvRow = {};
    const rowNumber = i + 1; // 人間目線の行番号（1 行目がヘッダー）

    // 列数がヘッダーとズレている場合
    if (cols.length !== header.length) {
      errors.push({
        row: rowNumber,
        column: "",
        type: "COLUMN_MISMATCH",
        message: `ヘッダーの列数(${header.length})と一致しません（実際: ${cols.length} 列）`,
        raw: line,
      });
    }

    // 各カラムごとに値をセット＋検証
    for (let colIndex = 0; colIndex < header.length; colIndex++) {
      const colName = header[colIndex] ?? `col_${colIndex}`;
      const rawValue = cols[colIndex];
      const normalized = normalizeNull(rawValue);

      rowObj[colName] = normalized;

      // ---------- 必須カラムの欠損チェック ----------
      if (requiredColumns.includes(colName) && normalized === null) {
        errors.push({
          row: rowNumber,
          column: colName,
          type: "MISSING_REQUIRED",
          message: `必須項目「${colName}」が欠損しています（NULL として扱います）`,
          raw: rawValue,
        });
      }

      // ---------- 数値カラムの厳格チェック ----------
      if (numericColumns.includes(colName)) {
        // 欠損は「MISSING_REQUIRED」の担当なので、ここではスキップ
        if (normalized === null) continue;

        if (!isStrictNumber(normalized)) {
          errors.push({
            row: rowNumber,
            column: colName,
            type: "INVALID_NUMBER",
            message: `数値項目「${colName}」が数値として解釈できません（値: "${normalized}"）`,
            raw: rawValue,
          });
        }
      }
    }

    rows.push(rowObj);
  }

  // デバッグ用ログ（必要なければ消して OK）
  console.log("cleanCSV: header =", header);
  console.log("cleanCSV: rows.length =", rows.length);
  console.log("cleanCSV: errors.length =", errors.length);

  return { rows, errors };
}
