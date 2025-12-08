// app/result/page.tsx
import React from "react";

export default function ResultPage({ searchParams }: any) {
  // CSV → JSON に変換したデータが URL パラメータとして来る想定
  const raw = searchParams?.data ? JSON.parse(searchParams.data) : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">XENTRIX – Cleansing Result</h1>

        <p className="mt-2 text-sm text-slate-600">
          CSV クレンジング後のサマリー、KPI 分析、Top/Bottom Quartile、エラー行、
          ダウンロードボタンなどがここに並ぶ予定です。
        </p>

        {/* 🔽 後でここにサマリーカードや KPI を追加 */}
        <div className="mt-6 space-y-2 text-sm">
          <p>✅ Clean CSV / JSON ダウンロードボタン予定</p>
          <p>✅ KPI サマリー（CSAT / AHT / CallsHandled 等）予定</p>
          <p>✅ Top / Bottom Quartile 予定</p>
          <p>✅ AI Insights（気づきコメント）予定</p>
        </div>

        {/* Raw JSON の表示（デバッグ用 / MVP 用） */}
        {raw && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Raw Data Preview</h2>
            <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
