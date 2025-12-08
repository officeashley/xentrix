export function cleanCsvRow(row: any) {
  const cleaned: any = {};

  // --- 1. Date Normalization ---
  cleaned.Date = normalizeDate(row.Date);

  // --- 2. AgentName ---
  cleaned.AgentName = normalizeAgentName(row.AgentName);

  // --- 3. CallsHandled ---
  cleaned.CallsHandled = normalizeNumber(row.CallsHandled);

  // --- 4. AvgHandleTimeSeconds ---
  cleaned.AvgHandleTimeSeconds = normalizeAHT(row.AvgHandleTimeSeconds);

  // --- 5. CSAT ---
  cleaned.CSAT = normalizeCSAT(row.CSAT);

  // --- 6. Adherence ---
  cleaned.Adherence = normalizeNumber(row.Adherence);

  // --- 7. Compliance ---
  cleaned.Compliance = normalizeNumber(row.Compliance);

  // --- 8. Notes ---
  cleaned.Notes = normalizeNotes(row.Notes);

  // --- 9. Call meta ---
  cleaned.Call_Type = normalizeString(row.Call_Type);
  cleaned.Issue_Type = normalizeIssue(row.Issue_Type);
  cleaned.Resolution_Status = normalizeResolution(row.Resolution_Status);

  // --- 10. Error flagging ---
  cleaned.Error_Flag = detectErrors(cleaned);

  return cleaned;
}
function normalizeDate(v: any) { return v; }
function normalizeAgentName(v: any) { return v; }
function normalizeNumber(v: any) { return v; }
function normalizeAHT(v: any) { return v; }
function normalizeCSAT(v: any) { return v; }
function normalizeNotes(v: any) { return v; }
function normalizeString(v: any) { return v; }
function normalizeIssue(v: any) { return v; }
function normalizeResolution(v: any) { return v; }
function detectErrors(row: any) { return false; }
