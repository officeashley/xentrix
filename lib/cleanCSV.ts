// lib/cleanCSV.ts

export type CleanCsvResult = {
  rows: any[];
  errors: string[];
};

export function cleanCSV(raw: string): CleanCsvResult {
  // 超シンプル版：とりあえず動くか確認するため
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: ["empty file"] };
  }

  // 1行目をヘッダーとして扱う
  const header = lines[0].split(",");

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj: Record<string, string> = {};

    header.forEach((key, idx) => {
      obj[key] = cols[idx] ?? "";
    });

    return obj;
  });

  console.log("cleanCSV: header =", header);
  console.log("cleanCSV: first row =", rows[0]);

  return {
    rows,
    errors: [], // 後で 7200 / NULL などをここに積む
  };
}
