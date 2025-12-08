"use client";

import React from "react";
import Papa from "papaparse";

// ★ STEP3：これを追加（cleaning.ts へのパイプ準備）
import { cleanCsvRow } from "@/lib/cleaning";

export default function UploadPage() {

  // ▼ CSV ファイルを読み込むロジック
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("RAW CSV DATA:", results.data);

        // ★ STEP3：ここで cleaning.ts に流す準備だけ行う
        const cleaned = results.data.map((row: any) => cleanCsvRow(row));
        console.log("CLEANED:", cleaned);

        alert("CSV 読み込み成功！（console に CLEANED が表示されます）");
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        alert("CSV 読み込み中にエラーが発生しました");
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          xentrix – CSV Upload
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          ここで生CSVをアップロードして、1クリックでクレンジングする画面になります。
          <br />
          今はまだ「枠」だけのダミーUIです（動作は後で実装）。
        </p>

        <
