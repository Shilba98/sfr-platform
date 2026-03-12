import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface Props {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}

export default function KpiCard({ label, value, sub, trend, trendUp, accent }: Props) {
  return (
    <Card>
      <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-2">{label}</div>
      <div className={cn("font-display text-[30px] leading-none mb-1", accent ?? "text-ink")}>{value}</div>
      {sub && <div className="text-[11px] text-ink-3">{sub}</div>}
      {trend && (
        <div className={cn(
          "text-[11px] font-medium mt-2 flex items-center gap-1",
          trendUp ? "text-posture-grow" : "text-posture-protect"
        )}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </Card>
  );
}
