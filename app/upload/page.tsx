"use client";
import { StatusBanner } from "@/app/components/StatusBanner";

import React, { useState } from "react";

type PreProcessResult = {
  rows: any[];
  errors: { row: number; column: string; type: string; message: string; raw?: string }[];
};

type AiCleanResult = {
  mode: "strict" | "relaxed";
  rowCount: number;
  errorCount: number;
  cleanedRows: any[];
  errors?: { row: number; field: string; type: string; message: string }[];
};

export default function UploadPage() {
  const [rawCsv, setRawCsv] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [preResult, setPreResult] = useState<PreProcessResult | null>(null);
  const [aiResult, setAiResult] = useState<AiCleanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ------- 集計用の値 --------
  const preRows = preResult?.rows?.length ?? 0;
  const preErrors = preResult?.errors?.length ?? 0;
  const aiRows = aiResult?.rowCount ?? 0;
  const aiErrors = aiResult?.errorCount ?? 0;
  const totalErrors = preErrors + aiErrors;
  const hasResult = !!preResult || !!aiResult;

  // ------- バナー用の値を組み立てる --------
  const hasCleanRows = aiRows > 0;

  let bannerStatus: "error" | "warning" | "success" = "success";
  let bannerTitle = "✅ データ品質 OK（厳格モード）";
  let bannerMessage = "";
  let bannerStats = "";

  if (totalErrors > 0) {
    bannerStatus = "error";
    bannerTitle = "⚠ データに問題があります（厳格モード）";
    bannerMessage = "詳細はエラー一覧を確認してください。";
  } else if (!hasCleanRows) {
    bannerStatus = "warning";
    bannerTitle = "ℹ まだ AI クレンジングは実行されていません";
    bannerMessage = "CSV をアップロードし、「前処理 → AI 実行」を押してください。";
  }

  bannerStats = `rows: ${aiRows || preRows || 0} / errors: ${totalErrors}（前処理: ${preErrors} ／ AIクレンジング: ${aiErrors}）`;

  // ------- ファイル選択 -------
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // まずは .csv のみに制限（xlsx はあとで対応）
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("まずは .csv ファイルだけテストしましょう（xlsx は後で対応）");
      return;
    }

    setFileName(file.name);

    const text = await file.text();
    setRawCsv(text);

    // 新しいファイルを入れたら結果はリセット
    setPreResult(null);
    setAiResult(null);
  };

  // ------- 前処理 → AIモック実行 -------
  const handleRunPipeline = async () => {
    if (!rawCsv) return;

    setIsLoading(true);
    try {
      // ① 前処理（/api/clean）
      const preRes = await fetch("/api/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: rawCsv }),
      });
      const preJson = (await preRes.json()) as PreProcessResult;
      setPreResult(preJson);

      // ② AI クレンジング（モック） /api/ai-clean
      const aiRes = await fetch("/api/ai-clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "strict",
          rows: preJson.rows,
        }),
      });
      const aiJson = (await aiRes.json()) as AiCleanResult;
      setAiResult(aiJson);

      console.log("pre-process:", preJson);
      console.log("ai-clean:", aiJson);
    } catch (e) {
      console.error(e);
      alert("パイプライン実行中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-5xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">XENTRIX – CSV Upload</h1>
        <p className="mt-1 text-sm text-slate-600">
          ここで CSV をアップロードして、まずは「前処理＋エラー検知 → AIクレンジング（モック）」まで一気に流れをテストします。
        </p>

        {/* 🔶 固定バナー（共通コンポーネント版） */}
        {hasResult && (
          <div className="mt-3">
            <StatusBanner
              status={bannerStatus}
              title={bannerTitle}
              message={bannerMessage}
              stats={bannerStats}
            />
          </div>
        )}

        {/* ファイル選択 & 実行ボタン */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="csv-input"
            className="inline-flex cursor-pointer items-center rounded-md border bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            CSV ファイルを選択
          </label>

          <button
            onClick={handleRunPipeline}
            disabled={!rawCsv || isLoading}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              !rawCsv || isLoading
                ? "cursor-not-allowed bg-slate-300 text-slate-500"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {isLoading ? "実行中..." : "前処理 → AI モック実行"}
          </button>

          <span className="text-xs text-slate-500">
            {fileName
              ? `選択中: ${fileName}`
              : "まだファイルが選択されていません。"}
          </span>
        </div>

        {/* 行数・エラー数のミニサマリ（パネルの上） */}
        <div className="mt-3 text-[11px] md:text-xs text-slate-500 flex flex-wrap gap-3">
          <div>
            Rows (pre-process):{" "}
            <span className="font-mono text-slate-700">{preRows}</span>
          </div>
          <div>
            Errors (pre-process):{" "}
            <span className="font-mono text-slate-700">{preErrors}</span>
          </div>
          <div>
            AI Cleaned Rows:{" "}
            <span className="font-mono text-slate-700">{aiRows}</span>
          </div>
        </div>

        {/* 3ペイン表示 */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {/* Raw CSV */}
          <div className="rounded-xl bg-slate-900 p-3 text-[11px] md:text-xs text-slate-100">
            <div className="mb-1 font-semibold text-slate-200">
              Raw CSV（先頭だけプレビュー）
            </div>
            <textarea
              readOnly
              className="mt-1 h-[26rem] w-full resize-none bg-slate-950/60 p-2 font-mono text-[10px] md:text-[11px] leading-4 text-slate-100 outline-none"
              value={
                rawCsv
                  ? rawCsv.slice(0, 4000)
                  : "まだファイルが選択されていません。"
              }
            />
          </div>

          {/* Pre-process Result */}
          <div className="rounded-xl bg-slate-900 p-3 text-[11px] md:text-xs text-slate-100">
            <div className="mb-1 flex items-center justify-between text-slate-200">
              <span className="font-semibold">
                Pre-process Result (/api/clean)
              </span>
            </div>
            <textarea
              readOnly
              className="mt-1 h-[26rem] w-full resize-none bg-slate-950/60 p-2 font-mono text-[10px] md:text-[11px] leading-4 text-slate-100 outline-none"
              value={
                preResult
                  ? JSON.stringify(preResult, null, 2)
                  : "まだ実行されていません。"
              }
            />
          </div>

          {/* AI Clean Result */}
          <div className="rounded-xl bg-slate-900 p-3 text-[11px] md:text-xs text-slate-100">
            <div className="mb-1 flex items-center justify-between text-slate-200">
              <span className="font-semibold">
                AI Clean Result (mock) (/api/ai-clean)
              </span>
              <span className="text-[10px]">
                rows:{" "}
                <span className="font-mono">{aiRows}</span>{" "}
                / errors:{" "}
                <span className="font-mono">
                  {aiErrors}
                </span>
              </span>
            </div>
            <textarea
              readOnly
              className="mt-1 h-[26rem] w-full resize-none bg-slate-950/60 p-2 font-mono text-[10px] md:text-[11px] leading-4 text-slate-100 outline-none"
              value={
                aiResult
                  ? JSON.stringify(aiResult, null, 2)
                  : "まだ AI クレンジングは実行されていません。"
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
