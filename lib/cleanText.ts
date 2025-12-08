// lib/cleanText.ts
export function cleanText(input: string): string {
  if (!input) return "";

  return input
    .replace(/\s+/g, " ") // 連続スペース・改行・タブを 1 個にまとめる
    .trim();              // 前後の空白を削る
}
