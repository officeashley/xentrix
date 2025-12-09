// xentrix/lib/mockAiClean.ts

// 20行ぶんのクレンジング済みデータ（モック）を読み込む
import mockData from "@/data/xentrix_clean_20rows_mock.json";

// AIクレンジングAPIのモック用引数
type AiCleanArgs = {
  mode: "strict" | "relaxed";
  rows?: any[]; // 呼び出し側から rows が来た場合も受け取れるように
};

// OpenAI を呼ばないモック実装
export function mockAiClean({ mode, rows }: AiCleanArgs) {
  // rows が渡されていればその件数を優先（なければ JSON 側の cleanedRows を使う）
  const cleanedRows =
    Array.isArray(rows) && rows.length > 0
      ? rows
      : (mockData as any).cleanedRows ?? [];

  const rowCount = cleanedRows.length;

  return {
    // JSON 側の元データをベースにしつつ…
    ...(mockData as any),
    // mode / rowCount / cleanedRows を上書き
    mode,
    rowCount,
    cleanedRows,
  };
}
