"use client";
import { generateAccounts } from "@/lib/data";
import { POSTURE_META } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBadge } from "@/components/ui/Card";
import PostureChip from "@/components/ui/PostureChip";
import type { Posture } from "@/lib/types";

const accounts = generateAccounts();

const POSTURE_CONFIG: Record<Posture, { desc: string; nbas: string[] }> = {
  protect: {
    desc: "High churn risk. All commercial activity paused except retention. AM contact within 48h mandatory. Upsell guardrail active.",
    nbas: [
      "Proactive retention call — address NPS decline",
      "Service recovery protocol if incident open",
      "Contract review & loyalty offer eligibility check",
      "Block all upsell proposals — guardrail active",
    ],
  },
  stabilise: {
    desc: "Moderate risk signals. Focus on satisfaction and relationship health before any commercial push.",
    nbas: [
      "Quarterly business review scheduling",
      "Usage coaching — improve product adoption",
      "NPS follow-up if score < 6",
      "Soft renewal conversation — no hard pitch",
    ],
  },
  grow: {
    desc: "Healthy base, identified growth potential. Expand share-of-wallet with contextually appropriate offers.",
    nbas: [
      "Cross-sell: SFR Business mobile + cloud bundle",
      "Bandwidth upsell proposal",
      "Multi-site expansion offer",
      "Digital outreach — personalised email",
    ],
  },
  invest: {
    desc: "Strategic accounts with high growth ceiling. Assign senior AM, dedicate resources, pursue enterprise deals.",
    nbas: [
      "Assign to senior account manager",
      "Executive relationship mapping",
      "Bespoke enterprise proposal development",
      "Dedicated specialist routing — complex needs",
    ],
  },
};

const conflicts = accounts.filter(a => a.conflictDetected).slice(0, 6);
const postureCount = (p: Posture) => accounts.filter(a => a.posture === p).length;

const CHANNEL_LABEL: Record<string, string> = {
  am_direct: "AM Direct",
  digital: "Digital Outreach",
  specialist: "Specialist Routing",
};

export default function DecisionsPage() {
  return (
    <div>
      <PageHeader
        title="Decision & Activation"
        subtitle="Conflict-resolved commercial postures and Next Best Actions across the portfolio"
      />

      {/* Conflict Resolution Box */}
      <Card padding={false} className="mb-5">
        <div className="px-5 py-4 border-b border-black/[0.06] flex items-center gap-3">
          <CardTitle>Conflict Resolution Log</CardTitle>
          <span className="font-mono text-[9px] bg-posture-protect-soft text-posture-protect border border-posture-protect/20 px-2 py-0.5 rounded uppercase tracking-[0.06em]">
            {conflicts.length} active
          </span>
          <CardBadge className="ml-auto">Risk overrides Opportunity</CardBadge>
        </div>
        <div className="px-5 py-3 text-[12px] text-ink-3 bg-paper/50 border-b border-black/[0.04]">
          Accounts where Risk &gt; 60 and Opportunity &gt; 60 coexist. Posture resolved by priority logic — risk always dominates.
        </div>
        <div className="divide-y divide-black/[0.04]">
          {conflicts.map(a => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-paper/40 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-[12px]">{a.name}</div>
                <div className="font-mono text-[10px] text-ink-4 mt-0.5">{a.sector}</div>
              </div>
              <div className="font-mono text-[10px] text-ink-3">
                Risk: <span className="text-posture-protect font-medium">{a.riskScore}</span>
                {" · "}
                Opp: <span className="text-posture-invest font-medium">{a.opportunityScore}</span>
              </div>
              <div className="text-ink-4 text-[12px]">→</div>
              <PostureChip posture={a.posture} size="sm" />
            </div>
          ))}
        </div>
      </Card>

      {/* Posture Cards */}
      <div className="grid grid-cols-2 gap-4">
        {(["protect", "stabilise", "grow", "invest"] as Posture[]).map(p => {
          const meta = POSTURE_META[p];
          const config = POSTURE_CONFIG[p];
          const count = postureCount(p);
          return (
            <Card padding={false} key={p} className="overflow-hidden">
              <div
                className="px-5 py-4 flex items-center justify-between border-b"
                style={{ background: `${meta.color}0D`, borderColor: `${meta.color}25` }}
              >
                <div
                  className="font-display text-[20px] tracking-[-0.5px]"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </div>
                <div className="font-mono text-[10px]" style={{ color: meta.color, opacity: 0.65 }}>
                  {count} accounts
                </div>
              </div>
              <div className="p-5">
                <p className="text-[12px] text-ink-3 leading-relaxed mb-4">{config.desc}</p>
                <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-2">NBA Actions</div>
                <ul className="space-y-2">
                  {config.nbas.map((nba, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[12px]">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: meta.color }}
                      />
                      {nba}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* NBA Queue Summary */}
      <div className="mt-5">
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <CardTitle>NBA Queue — Pending Actions</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-paper border-b border-black/[0.06]">
                  {["Account", "Posture", "Action", "Channel", "SLA", "Status"].map(h => (
                    <th key={h} className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 px-4 py-2.5 text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.filter(a => !a.nbaCompleted).slice(0, 10).map(a => (
                  <tr key={a.id} className="border-b border-black/[0.04] hover:bg-paper/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[12px]">{a.name}</div>
                      <div className="font-mono text-[10px] text-ink-4">{a.am}</div>
                    </td>
                    <td className="px-4 py-3"><PostureChip posture={a.posture} size="sm" /></td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-[11px] truncate">{a.nba}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-ink-3">{CHANNEL_LABEL[a.nbaChannel]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] ${a.nbaSLA <= 2 ? "text-posture-protect" : "text-ink-3"}`}>
                        {a.nbaSLA}d
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[9px] bg-posture-stabilise-soft text-posture-stabilise border border-posture-stabilise/20 px-2 py-0.5 rounded uppercase tracking-[0.05em]">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
