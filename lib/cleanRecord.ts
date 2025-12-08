import { cleanText } from "./cleanText";

export function cleanRecord(row: any) {
  const errors: string[] = [];

  // Agent Name（ローマ字化）
  const agentName = row.Agent_Name ?? "";
  const agentNameClean = cleanText(agentName);

  // Issue_Type / Resolution_Status（英語統一の例）
  const issue = cleanText(row.Issue_Type ?? "");
  const resolution = cleanText(row.Resolution_Status ?? "");

  // AvgHandleTimeSeconds（異常値チェック）
  const aht = Number(row.AvgHandleTimeSeconds ?? 0);
  const ahtClean = aht > 3600 ? null : aht; // 3600超えはエラー扱い
  if (aht > 3600) errors.push("AHT too large");

  // Duration（CallStart/Endから自動生成）
  let duration = row.Duration;
  if ((!duration || duration === "") && row.CallStartTime && row.CallEndTime) {
    try {
      const start = new Date(row.CallStartTime);
      const end = new Date(row.CallEndTime);
      duration = (end.getTime() - start.getTime()) / 1000;
    } catch {
      errors.push("Invalid timestamp");
    }
  }

  return {
    Agent_Name: agentNameClean,
    Issue_Type: issue,
    Resolution_Status: resolution,
    AvgHandleTimeSeconds: ahtClean,
    Duration: duration,
    Error_Flag: errors.length > 0,
    Error_Detail: errors.join(", "),
    raw: row // 元データも残す（後で便利）
  };
}
