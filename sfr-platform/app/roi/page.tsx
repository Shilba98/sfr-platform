"use client";
import { ROI_METRICS, MONTHLY_ROI, COHORT_DATA } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import { Card, CardHeader, CardTitle, CardBadge } from "@/components/ui/Card";
import PostureChip from "@/components/ui/PostureChip";
import type { Posture } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const POSTURE_COLORS: Record<string, string> = {
  protect: "#C8001A",
  stabilise: "#B45309",
  grow: "#155E37",
  invest: "#1E3A8A",
  control: "#A8A8A8",
};

export default function RoiPage() {
  return (
    <div>
      <PageHeader
        title="Retention Value & ROI"
        subtitle="CFO-grade attribution of revenue protected, churn avoided, and platform return on investment"
        right={
          <span className="font-mono text-[10px] text-ink-4 bg-white border border-black/[0.08] px-3 py-1.5 rounded">
            {ROI_METRICS.quarterLabel} · Treated vs Control
          </span>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard
          label="Revenue Protected"
          value={formatCurrency(ROI_METRICS.revenueProtected, true)}
          sub="Churn-avoidance value this quarter"
          trend="+18% vs Q1 (€4.0M)"
          trendUp
          accent="text-posture-grow"
        />
        <KpiCard
          label="Incremental Revenue"
          value={formatCurrency(ROI_METRICS.incrementalRevenue, true)}
          sub="Upsell & cross-sell attributed"
          trend="+31% vs Q1 (€1.05M)"
          trendUp
          accent="text-posture-invest"
        />
        <KpiCard
          label="Platform ROI"
          value={`${ROI_METRICS.platformROI}×`}
          sub="Return on platform investment"
          trend="+2.1× improvement"
          trendUp
        />
        <KpiCard
          label="Churn Rate Delta"
          value={`${ROI_METRICS.churnDelta}pp`}
          sub="Treated vs control cohort"
          trend="Control: 6.4% · Treated: 4.6%"
          trendUp
          accent="text-posture-grow"
        />
        <KpiCard
          label="Decision Accuracy"
          value={`${ROI_METRICS.decisionAccuracy}%`}
          sub="Correct posture vs account outcome"
          trend="+6pp vs Q1"
          trendUp
          accent="text-posture-invest"
        />
        <KpiCard
          label="MRR Stability Index"
          value={String(ROI_METRICS.mrrStabilityIndex)}
          sub="0–100 scale · Downgrade prevention +34%"
          trend="↑ from 87.1 in Q1"
          trendUp
          accent="text-posture-invest"
        />
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Protected by Month (€k)</CardTitle>
              <CardBadge>Q2 2025</CardBadge>
            </CardHeader>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_ROI} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0DDD4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "#A8A8A8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "#A8A8A8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontFamily: "DM Mono", fontSize: 11, border: "1px solid #E0DDD4", borderRadius: 4, background: "white" }}
                    formatter={(val: number, name: string) => [`€${val}k`, name === "protected" ? "Protected" : "Incremental"]}
                  />
                  <Legend
                    iconType="square"
                    iconSize={8}
                    wrapperStyle={{ fontFamily: "DM Mono", fontSize: 10, color: "#6E6E6E" }}
                  />
                  <Bar dataKey="protected" name="Revenue Protected" fill="#155E37" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="incremental" name="Incremental" fill="#1E3A8A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card padding={false} className="h-full">
            <div className="px-5 py-4 border-b border-black/[0.06]">
              <CardTitle>Cohort Churn Comparison</CardTitle>
            </div>
            <div className="divide-y divide-black/[0.04]">
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-paper">
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4">Cohort</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4 text-right">Churn %</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4 text-right">Δ vs Ctrl</div>
              </div>
              {COHORT_DATA.map(c => (
                <div key={c.label} className={`grid grid-cols-3 gap-2 px-4 py-3 ${c.posture === "control" ? "bg-paper/50" : ""}`}>
                  <div className="flex items-center gap-2">
                    {c.posture !== "control" ? (
                      <PostureChip posture={c.posture as Posture} size="sm" />
                    ) : (
                      <span className="font-mono text-[10px] text-ink-3 uppercase">Control</span>
                    )}
                  </div>
                  <div className={`font-mono text-[11px] font-medium text-right ${c.posture === "control" ? "text-posture-protect" : ""}`}>
                    {c.churnRate}%
                  </div>
                  <div className={`font-mono text-[10px] text-right ${c.delta < 0 ? "text-posture-grow" : "text-ink-4"}`}>
                    {c.delta < 0 ? `${c.delta}pp` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Attribution Note */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-posture-stabilise text-[16px] flex-shrink-0">⚠</span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-posture-stabilise mb-1">Attribution note — Gap #3</div>
            <div className="text-[12px] text-ink-2 leading-relaxed">
              Revenue protection figures are currently <strong>modelled attribution</strong>, not confirmed. The Salesforce Task object does not yet have a custom <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded">SFR_Outcome__c</code> field to capture NBA results. Once deployed, attribution shifts from estimated to observed — which strengthens the CFO-grade claim significantly.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
