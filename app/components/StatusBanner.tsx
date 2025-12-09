// app/components/StatusBanner.tsx
type Status = "error" | "warning" | "success";

interface StatusBannerProps {
  status: Status;
  title: string;
  message?: string;
  stats?: string; // 例: "rows: 40 / errors: 26（前処理）/ AIクレンジング: 0"
}

export function StatusBanner({ status, title, message, stats }: StatusBannerProps) {
  const color =
    status === "error"
      ? "bg-red-600 text-white"
      : status === "warning"
      ? "bg-amber-500 text-black"
      : "bg-emerald-600 text-white";

  return (
    <div className={`w-full px-4 py-2 md:px-6 md:py-3 ${color}`}>
      <div className="max-w-5xl mx-auto flex flex-col gap-1 md:flex-row md:items-center md:justify-between text-sm md:text-base">
        <div className="font-semibold">{title}</div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          {message && <p className="opacity-90">{message}</p>}
          {stats && <p className="font-mono text-xs md:text-sm opacity-80">{stats}</p>}
        </div>
      </div>
    </div>
  );
}
