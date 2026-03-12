"use client";
import { ACTIVITY_EVENTS, OVERRIDE_LOG } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBadge } from "@/components/ui/Card";
import PostureChip from "@/components/ui/PostureChip";

const METRICS = [
  { label: "Platform Adoption", value: 78, suffix: "%", target: "Target: 85% Q3", color: "#155E37" },
  { label: "NBA Follow-Through", value: 71, suffix: "%", target: "AMs completing recommended actions", color: "#1E3A8A" },
  { label: "Override Rate", value: 5.6, suffix: "%", target: "Within threshold (<10%)", color: "#B45309" },
  { label: "CRM Export Rate", value: 94, suffix: "%", target: "NBA tasks pushed to Salesforce", color: "#155E37" },
  { label: "Avg Prep Time Saved", value: 38, suffix: " min", target: "Per AM per day", color: "#1E3A8A" },
  { label: "Guardrails Triggered", value: 43, suffix: "", target: "Upsell blocks on PROTECT accounts", color: "#C8001A" },
];

const eventTypeStyle: Record<string, { dot: string; badge: string; text: string; label: string }> = {
  nba_completed: { dot: "bg-posture-grow", badge: "bg-posture-grow-soft border-posture-grow/20", text: "text-posture-grow", label: "Completed" },
  override: { dot: "bg-posture-stabilise", badge: "bg-posture-stabilise-soft border-posture-stabilise/20", text: "text-posture-stabilise", label: "Override" },
  guardrail: { dot: "bg-posture-protect", badge: "bg-posture-protect-soft border-posture-protect/20", text: "text-posture-protect", label: "Guardrail" },
  risk_escalation: { dot: "bg-posture-protect", badge: "bg-posture-protect-soft border-posture-protect/20", text: "text-posture-protect", label: "Escalation" },
  sync: { dot: "bg-slate-400", badge: "bg-slate-100 border-slate-200", text: "text-slate-500", label: "Sync" },
};

export default function GovernancePage() {
  return (
    <div>
      <PageHeader
        title="Adoption & Governance"
        subtitle="Platform trust, usage patterns, override tracking, and incentive alignment"
        right={
          <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live" />
            Real-time
          </div>
        }
      />

      {/* Adoption Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {METRICS.map(m => (
          <Card key={m.label}>
            <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-2">{m.label}</div>
            <div className="font-display text-[26px] leading-none mb-2" style={{ color: m.value > 80 ? "#155E37" : m.value > 50 ? "#0D0D0D" : "#C8001A" }}>
              {m.value}{m.suffix}
            </div>
            <div className="bg-paper rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(m.value, 100)}%`, background: m.color }}
              />
            </div>
            <div className="font-mono text-[10px] text-ink-4">{m.target}</div>
          </Card>
        ))}
      </div>

      {/* Activity Feed + Override Log */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between">
            <CardTitle>Live Activity Feed</CardTitle>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live" />
              <span className="font-mono text-[9px] text-emerald-600 uppercase tracking-[0.07em]">Live</span>
            </div>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {ACTIVITY_EVENTS.map(ev => {
              const style = eventTypeStyle[ev.type] ?? eventTypeStyle.sync;
              return (
                <div key={ev.id} className="flex items-start gap-3 px-5 py-3 hover:bg-paper/40 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] leading-snug">
                      <span className="font-medium">{ev.accountName}</span>
                      {" — "}{ev.description}
                    </div>
                    <div className="font-mono text-[10px] text-ink-4 mt-0.5">{ev.timestamp} · {ev.am}</div>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.05em] px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${style.badge} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between">
            <CardTitle>Override Log</CardTitle>
            <CardBadge>This week · 5.6% rate</CardBadge>
          </div>
          <div className="px-5 py-3 text-[12px] text-ink-3 bg-paper/50 border-b border-black/[0.04]">
            Override reasons are currently not captured — see Gap #2 in the pipeline view.
          </div>
          <div className="divide-y divide-black/[0.04]">
            {OVERRIDE_LOG.map(o => (
              <div key={o.id} className="px-5 py-3 hover:bg-paper/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-[12px]">{o.accountName}</span>
                  <span className="font-mono text-[10px] text-ink-4">{o.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <PostureChip posture={o.from} size="sm" />
                  <span className="text-ink-4 text-[11px]">→</span>
                  <PostureChip posture={o.to} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ink-4">{o.reason}</span>
                  <span className="font-mono text-[10px] text-ink-4">{o.am}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-paper border-t border-black/[0.06]">
            <div className="text-[11px] text-ink-3">
              Override reasons are not yet captured systematically.{" "}
              <span className="text-posture-invest underline cursor-pointer">See Gap #2 →</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
