// lib/cleanText.ts
export function cleanText(input: string): string {
  if (!input) return "";

  return input
    // タブ・改行も含めて空白を 1 個にまとめる
    .replace(/\s+/g, " ")
    // 前後の空白を削る
    .trim();
}
