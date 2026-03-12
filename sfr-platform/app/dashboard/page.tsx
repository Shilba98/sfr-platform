"use client";
import { generateAccounts, ROI_METRICS, ACTIVITY_EVENTS } from "@/lib/data";
import { formatCurrency, POSTURE_META } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import { Card, CardHeader, CardTitle, CardBadge } from "@/components/ui/Card";
import PostureChip from "@/components/ui/PostureChip";
import type { Posture } from "@/lib/types";

const accounts = generateAccounts();
const postureCounts = accounts.reduce((acc, a) => {
  acc[a.posture] = (acc[a.posture] ?? 0) + 1;
  return acc;
}, {} as Record<Posture, number>);

const POSTURES: Posture[] = ["protect", "stabilise", "grow", "invest"];

const eventTypeStyle: Record<string, { dot: string; badge: string; badgeText: string }> = {
  nba_completed: { dot: "bg-posture-grow", badge: "bg-posture-grow-soft", badgeText: "text-posture-grow" },
  override: { dot: "bg-posture-stabilise", badge: "bg-posture-stabilise-soft", badgeText: "text-posture-stabilise" },
  guardrail: { dot: "bg-posture-protect", badge: "bg-posture-protect-soft", badgeText: "text-posture-protect" },
  risk_escalation: { dot: "bg-posture-protect", badge: "bg-posture-protect-soft", badgeText: "text-posture-protect" },
  sync: { dot: "bg-slate-400", badge: "bg-slate-100", badgeText: "text-slate-500" },
};

export default function DashboardPage() {
  const totalMRR = accounts.reduce((s, a) => s + a.mrr, 0);
  const protectMRR = accounts.filter(a => a.posture === "protect").reduce((s, a) => s + a.mrr, 0);

  return (
    <div>
      <PageHeader
        title="Portfolio Overview"
        subtitle="2,148 active B2B SME accounts · Marketing Director view"
        right={
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-live" />
            Last sync: 09:42
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Portfolio Accounts"
          value="2,148"
          sub="Active B2B SME contracts"
          trend="+42 this quarter"
          trendUp
        />
        <KpiCard
          label="Revenue Protected (Q2)"
          value="€4.7M"
          sub="Churn prevented via NBA actions"
          trend="+18% vs Q1"
          trendUp
          accent="text-posture-grow"
        />
        <KpiCard
          label="High-Risk Accounts"
          value={String(postureCounts.protect ?? 0)}
          sub="Flagged for PROTECT posture"
          trend={`${formatCurrency(protectMRR, true)} MRR at risk`}
          trendUp={false}
          accent="text-posture-protect"
        />
        <KpiCard
          label="Decision Accuracy"
          value={`${ROI_METRICS.decisionAccuracy}%`}
          sub="Correct posture vs outcome"
          trend="+6pp vs Q1"
          trendUp
          accent="text-posture-invest"
        />
      </div>

      {/* Posture Distribution + Queue */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Posture Distribution</CardTitle>
              <CardBadge>2,148 accounts</CardBadge>
            </CardHeader>
            <div className="space-y-3">
              {POSTURES.map((p) => {
                const count = postureCounts[p] ?? 0;
                const pct = ((count / accounts.length) * 100).toFixed(1);
                const meta = POSTURE_META[p];
                return (
                  <div key={p} className="flex items-center gap-3">
                    <div className="font-mono text-[10px] w-20 flex-shrink-0" style={{ color: meta.color }}>
                      {meta.label}
                    </div>
                    <div className="flex-1 bg-paper rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <div className="font-mono text-[11px] font-medium w-8 text-right" style={{ color: meta.color }}>
                      {count}
                    </div>
                    <div className="font-mono text-[10px] text-ink-4 w-10 text-right">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AM Queue Status</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              { label: "Actions pending", val: "342", pct: 72, color: "#C8001A" },
              { label: "Completed today", val: "128", pct: 37, color: "#155E37" },
              { label: "Overrides logged", val: "19", pct: 14, color: "#B45309" },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-ink-3">{row.label}</span>
                  <span className="font-mono text-[11px] font-medium">{row.val}</span>
                </div>
                <div className="bg-paper rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            ))}
            <div className="pt-1 border-t border-black/[0.06]">
              <div className="flex justify-between">
                <span className="text-[11px] text-ink-3">Avg prep time saved</span>
                <span className="font-mono text-[11px] font-medium">38 min/day</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <CardTitle>Live Activity Feed</CardTitle>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live" />
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-emerald-600">Live</span>
          </div>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {ACTIVITY_EVENTS.slice(0, 6).map(ev => {
            const style = eventTypeStyle[ev.type] ?? eventTypeStyle.sync;
            return (
              <div key={ev.id} className="flex items-start gap-3 px-5 py-3 hover:bg-paper/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] leading-snug">
                    <span className="font-medium">{ev.accountName}</span>
                    {" — "}
                    {ev.description}
                  </div>
                  <div className="font-mono text-[10px] text-ink-4 mt-0.5">{ev.timestamp} · {ev.am}</div>
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-[0.05em] px-2 py-0.5 rounded border border-transparent flex-shrink-0 mt-0.5 ${style.badge} ${style.badgeText}`}>
                  {ev.type.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
