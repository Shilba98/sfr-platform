"use client";
import { useState, useMemo } from "react";
import { generateAccounts } from "@/lib/data";
import { scoreColor } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import PostureChip from "@/components/ui/PostureChip";
import type { Account, Posture } from "@/lib/types";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";

const accounts = generateAccounts();
const POSTURES: Array<Posture | "all"> = ["all", "protect", "stabilise", "grow", "invest"];

function ScorePill({ value, invert = false }: { value: number; invert?: boolean }) {
  const col = scoreColor(value, invert);
  const bg = invert
    ? value < 40 ? "bg-posture-grow-soft" : value < 70 ? "bg-posture-stabilise-soft" : "bg-posture-protect-soft"
    : value >= 70 ? "bg-posture-protect-soft" : value >= 40 ? "bg-posture-stabilise-soft" : "bg-posture-grow-soft";
  return (
    <span className={`score-pill ${bg} ${col}`}>{value}</span>
  );
}

function ConfidenceBars({ value }: { value: number }) {
  const filled = Math.round(value / 20);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-3 rounded-sm ${i < filled
            ? filled >= 4 ? "bg-posture-grow" : filled >= 3 ? "bg-posture-stabilise" : "bg-posture-protect"
            : "bg-paper-3"}`}
        />
      ))}
    </div>
  );
}

type SortKey = keyof Pick<Account, "name" | "mrr" | "riskScore" | "opportunityScore" | "complexityScore" | "posture" | "npsScore" | "contractDaysLeft">;

export default function IntelligencePage() {
  const [filter, setFilter] = useState<Posture | "all">("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [selected, setSelected] = useState<Account | null>(null);

  const filtered = useMemo(() => {
    let data = accounts;
    if (filter !== "all") data = data.filter(a => a.posture === filter);
    if (search) data = data.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sector.toLowerCase().includes(search.toLowerCase())
    );
    return [...data].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (typeof av === "string") return (av as string).localeCompare(bv as string) * sortDir;
      return ((av as number) - (bv as number)) * sortDir;
    });
  }, [filter, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortKey(key); setSortDir(-1); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-ink-4 ml-1">↕</span>;
    return sortDir === 1 ? <ChevronUp size={11} className="inline ml-1" /> : <ChevronDown size={11} className="inline ml-1" />;
  }

  const postureCount = (p: Posture) => accounts.filter(a => a.posture === p).length;

  return (
    <div>
      <PageHeader
        title="Account Intelligence"
        subtitle="Risk, opportunity & complexity scoring across the full SME portfolio"
      />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {POSTURES.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`font-mono text-[10px] uppercase tracking-[0.06em] px-3 py-1.5 rounded border transition-all ${
              filter === p
                ? p === "all"
                  ? "bg-ink text-white border-ink"
                  : p === "protect" ? "bg-posture-protect text-white border-posture-protect"
                  : p === "stabilise" ? "bg-posture-stabilise text-white border-posture-stabilise"
                  : p === "grow" ? "bg-posture-grow text-white border-posture-grow"
                  : "bg-posture-invest text-white border-posture-invest"
                : "bg-white text-ink-3 border-black/[0.1] hover:text-ink hover:border-black/20"
            }`}
          >
            {p === "all" ? `All (${accounts.length})` : `${p} (${postureCount(p as Posture)})`}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-white border border-black/[0.08] rounded px-3 py-1.5">
          <Search size={13} className="text-ink-4" />
          <input
            className="text-[12px] outline-none bg-transparent w-44 placeholder:text-ink-4"
            placeholder="Search accounts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card padding={false} className="overflow-hidden mb-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-paper border-b border-black/[0.06]">
                {([
                  ["name", "Account"],
                  ["sector", null],
                  ["riskScore", "Risk"],
                  ["opportunityScore", "Opp"],
                  ["complexityScore", "Cpx"],
                  ["posture", "Posture"],
                  ["nba", "Next Best Action"],
                  ["confidence", "Confidence"],
                  ["am", "AM"],
                ] as [SortKey | string, string | null][]).map(([key, label]) => (
                  label !== null && (
                    <th
                      key={key}
                      className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3 px-4 py-2.5 text-left whitespace-nowrap cursor-pointer hover:text-ink select-none"
                      onClick={() => ["name","riskScore","opportunityScore","complexityScore","posture","mrr"].includes(key) && toggleSort(key as SortKey)}
                    >
                      {label}
                      {["name","riskScore","opportunityScore","complexityScore","posture"].includes(key) && (
                        <SortIcon k={key as SortKey} />
                      )}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`border-b border-black/[0.04] hover:bg-paper/60 cursor-pointer transition-colors ${selected?.id === a.id ? "bg-sfr-red-soft" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[12px]">{a.name}</div>
                    <div className="font-mono text-[10px] text-ink-4 mt-0.5">
                      €{a.mrr.toLocaleString()}/mo · {a.tenure}mo
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[9px] border border-black/[0.1] px-1.5 py-0.5 rounded text-ink-3">
                      {a.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScorePill value={a.riskScore} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScorePill value={a.opportunityScore} invert />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScorePill value={a.complexityScore} />
                  </td>
                  <td className="px-4 py-3">
                    <PostureChip posture={a.posture} size="sm" />
                    {a.conflictDetected && (
                      <span className="ml-1 font-mono text-[8px] text-posture-stabilise border border-posture-stabilise/30 bg-posture-stabilise-soft px-1 py-0.5 rounded">
                        conflict
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="text-[11px] truncate">{a.nba}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBars value={a.confidence} />
                    <div className="font-mono text-[9px] text-ink-4 mt-0.5">{a.confidence}%</div>
                  </td>
                  <td className="px-4 py-3 text-[11px] whitespace-nowrap text-ink-3">{a.am}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-paper border-t border-black/[0.06]">
          <span className="font-mono text-[10px] text-ink-4">
            Showing {filtered.length} of {accounts.length} accounts
          </span>
        </div>
      </Card>

      {/* Account Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl z-50 overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-black/[0.07] px-6 py-4 flex items-start justify-between z-10">
              <div>
                <div className="font-display text-[16px] tracking-[-0.3px] mb-1">{selected.name}</div>
                <div className="font-mono text-[10px] text-ink-4">
                  {selected.sector} · {selected.am} · €{selected.mrr.toLocaleString()}/mo
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-paper rounded transition-colors">
                <X size={16} className="text-ink-3" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Scores */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">Intelligence Scores</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Risk", val: selected.riskScore, invert: false },
                    { label: "Opportunity", val: selected.opportunityScore, invert: true },
                    { label: "Complexity", val: selected.complexityScore, invert: false },
                  ].map(s => (
                    <div key={s.label} className="bg-paper rounded-lg p-3 text-center">
                      <div className={`font-display text-[26px] leading-none mb-1 ${scoreColor(s.val, s.invert)}`}>{s.val}</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.07em] text-ink-4">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signals */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">Account Signals</div>
                <div className="space-y-2">
                  {[
                    { label: "MRR", val: `€${selected.mrr.toLocaleString()}` },
                    { label: "Tenure", val: `${selected.tenure} months` },
                    { label: "NPS Score", val: String(selected.npsScore), bad: selected.npsScore < 0 },
                    { label: "NPS Trend (3M)", val: `${selected.npsTrend > 0 ? "+" : ""}${selected.npsTrend}`, bad: selected.npsTrend < -5 },
                    { label: "Open Incidents", val: String(selected.openCases), bad: selected.openCases > 2 },
                    { label: "Days to Renewal", val: String(selected.contractDaysLeft), bad: selected.contractDaysLeft < 90 },
                    { label: "Last AM Contact", val: `${selected.lastContactDays}d ago`, bad: selected.lastContactDays > 30 },
                    { label: "Products Active", val: String(selected.productsActive) },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-paper last:border-0">
                      <span className="text-[11px] text-ink-3">{row.label}</span>
                      <span className={`font-mono text-[11px] font-medium ${row.bad ? "text-posture-protect" : "text-ink"}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posture */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">Commercial Posture</div>
                <div className="flex items-center justify-between mb-3">
                  <PostureChip posture={selected.posture} />
                  <span className="text-[11px] text-ink-4">Confidence: {selected.confidence}%</span>
                </div>
                {selected.conflictDetected && (
                  <div className="bg-posture-stabilise-soft border border-posture-stabilise/20 rounded p-2.5 mb-3 text-[11px] text-posture-stabilise">
                    ⚠ Conflict detected: Risk {selected.riskScore} + Opp {selected.opportunityScore} — resolved to {selected.posture.toUpperCase()} by priority rule
                  </div>
                )}
                <div className="bg-paper rounded-lg p-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4 mb-1.5">Next Best Action</div>
                  <div className="text-[12px] leading-relaxed">{selected.nba}</div>
                  <div className="font-mono text-[9px] text-ink-4 mt-1.5">
                    Channel: {selected.nbaChannel.replace("_", " ")} · SLA: {selected.nbaSLA}d
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full bg-ink text-white font-mono text-[10px] uppercase tracking-[0.08em] py-2.5 rounded-md hover:bg-posture-protect transition-colors">
                  → Push NBA to CRM (Salesforce)
                </button>
                <button className="w-full bg-paper text-ink border border-black/[0.1] font-mono text-[10px] uppercase tracking-[0.08em] py-2.5 rounded-md hover:bg-paper-2 transition-colors">
                  Schedule AM Contact
                </button>
                <button className="w-full bg-paper text-ink border border-black/[0.1] font-mono text-[10px] uppercase tracking-[0.08em] py-2.5 rounded-md hover:bg-paper-2 transition-colors">
                  Override Posture
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
