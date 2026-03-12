"use client";
import { useState } from "react";
import { GAP_ITEMS } from "@/lib/data";
import { SEVERITY_META } from "@/lib/utils";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBadge } from "@/components/ui/Card";
import { ChevronDown } from "lucide-react";

const SF_OBJECTS = [
  {
    name: "Account", color: "#0EA5E9", soft: "#E0F5FF",
    fields: [
      { name: "Account_ID", type: "ID" },
      { name: "Name", type: "TEXT" },
      { name: "Segment__c", type: "PICKLIST" },
      { name: "Industry", type: "PICKLIST" },
      { name: "Account_Manager__c", type: "LOOKUP" },
      { name: "Tier__c", type: "PICKLIST" },
    ],
  },
  {
    name: "Contract", color: "#8B5CF6", soft: "#EDE9FE",
    fields: [
      { name: "Contract_ID", type: "ID" },
      { name: "MRR__c", type: "CURRENCY" },
      { name: "End_Date", type: "DATE" },
      { name: "Products__c", type: "MULTIPICK" },
      { name: "Auto_Renew__c", type: "BOOL" },
    ],
  },
  {
    name: "Case / Incident", color: "#EF4444", soft: "#FEE2E2",
    fields: [
      { name: "Case_ID", type: "ID" },
      { name: "Status", type: "ENUM" },
      { name: "Priority", type: "PICKLIST" },
      { name: "Open_Count__c", type: "INTEGER" },
      { name: "Avg_Resolution_Days", type: "FLOAT" },
    ],
  },
  {
    name: "Opportunity", color: "#F59E0B", soft: "#FFFBEB",
    fields: [
      { name: "Opp_ID", type: "ID" },
      { name: "Stage", type: "PICKLIST" },
      { name: "Amount", type: "CURRENCY" },
      { name: "Products_Proposed", type: "MULTIPICK" },
      { name: "Last_Activity_Date", type: "DATE" },
    ],
  },
  {
    name: "NPS (Custom)", color: "#10B981", soft: "#DCFCE7",
    fields: [
      { name: "NPS_Score__c", type: "INTEGER" },
      { name: "Survey_Date__c", type: "DATE" },
      { name: "Trend_3M__c", type: "FLOAT" },
      { name: "Verbatim__c", type: "LONGTEXT" },
    ],
  },
];

const STAGES = [
  {
    num: "01", label: "Account Intelligence", color: "#C8001A", statusBg: "#FEE2E2", statusText: "#DC2626", status: "Scoring Engine",
    inputs: ["NPS_Score + Trend_3M → sentiment decay", "Contract End_Date → days-to-renewal", "Open_Cases + Priority → incident pressure", "MRR + Products → revenue base", "Opp Stage → growth potential"],
    outputs: ["Risk Score (0–100)", "Opportunity Score (0–100)", "Complexity Score (0–100)", "Priority Rank", "Routing Flag"],
    warnings: ["⚠ NPS missing for 312 accounts (14.5%)", "⚠ Engagement gap: AM last contact >30d on 28%"],
  },
  {
    num: "02", label: "Decision & Activation", color: "#D97706", statusBg: "#FEF3C7", statusText: "#D97706", status: "Decision Engine",
    inputs: ["Risk Score → primary posture driver", "Opportunity Score → secondary driver", "Complexity → routing determinant", "MRR + Tier → offer eligibility"],
    outputs: ["Posture (PROTECT/STABILISE/GROW/INVEST)", "Conflict flag + resolution reason", "Next Best Action", "Channel + SLA", "Salesforce Task push"],
    warnings: ["⚠ 19 posture overrides this week (5.6%)", "⚠ Override reasons not captured → Gap #2"],
  },
  {
    num: "03", label: "Retention ROI", color: "#155E37", statusBg: "#DCFCE7", statusText: "#155E37", status: "Attribution Engine",
    inputs: ["NBA completed flag (from SF Task)", "Account status 60d post-action", "Control cohort accounts (no NBA)", "MRR delta at renewal"],
    outputs: ["Revenue Protected (€/quarter)", "Churn rate delta (treated vs control)", "Decision accuracy rate", "Platform ROI", "MRR Stability Index"],
    warnings: ["⚠ Attribution is modelled — not confirmed (Gap #3)", "⚠ SFR_Outcome__c field not yet in Salesforce"],
  },
  {
    num: "04", label: "Adoption & Governance", color: "#1E3A8A", statusBg: "#DBEAFE", statusText: "#1E3A8A", status: "Governance Engine",
    inputs: ["NBA follow-through rate per AM", "Override rate + reasons (partial)", "CRM export rate", "Decision accuracy from Stage 3"],
    outputs: ["Adoption rate (78%)", "NBA follow-through (71%)", "Override audit log", "Guardrail trigger log", "Executive dashboard"],
    warnings: ["⚠ AM-level impact view missing → Gap #4", "⚠ Override reasons not yet structured → Gap #2"],
  },
];

export default function PipelinePage() {
  const [openGap, setOpenGap] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Data Pipeline"
        subtitle="Salesforce → Intelligence Engine — every transformation, gap, and decision point"
      />

      {/* Salesforce Source */}
      <Card padding={false} className="mb-5">
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between"
          style={{ background: "#E0F5FF50", borderColor: "#00A1E020" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#00A1E0] flex items-center justify-content-center text-white font-mono text-[11px] font-medium flex items-center justify-center">
              SF
            </div>
            <div>
              <div className="font-mono text-[11px] font-medium text-[#00A1E0] uppercase tracking-[0.07em]">
                Salesforce CRM — Source of Record
              </div>
              <div className="text-[11px] text-ink-4">
                REST API · SOQL · OAuth 2.0 · Batch sync every 4h + event triggers
              </div>
            </div>
          </div>
          <CardBadge>5 Objects · 34 Fields</CardBadge>
        </div>
        <div className="grid grid-cols-5 divide-x divide-black/[0.06]">
          {SF_OBJECTS.map(obj => (
            <div key={obj.name} className="p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.09em] mb-3" style={{ color: obj.color }}>
                {obj.name}
              </div>
              <div className="space-y-1.5">
                {obj.fields.map(f => (
                  <div key={f.name} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: obj.color }} />
                    <span className="text-[10px] text-ink-2 truncate">{f.name}</span>
                    <span className="font-mono text-[9px] text-ink-4 ml-auto flex-shrink-0">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-2.5 bg-paper border-t border-black/[0.06] flex justify-between items-center">
          <span className="font-mono text-[10px] text-ink-4">
            Last sync: 09:42 · Next: 13:42 · Event triggers: Contract.End &lt; 90d, NPS &lt; 6, Case escalation
          </span>
          <button className="font-mono text-[10px] uppercase tracking-[0.07em] px-3 py-1.5 bg-[#00A1E0] text-white rounded hover:opacity-85 transition-opacity">
            ⟳ Simulate Sync
          </button>
        </div>
      </Card>

      {/* Pipeline Stages */}
      <div className="space-y-0">
        {STAGES.map((stage, idx) => (
          <div key={stage.num}>
            <Card padding={false} className="overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: stage.color }}>
              <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center font-mono text-[11px] text-white flex-shrink-0"
                    style={{ background: stage.color }}
                  >
                    {stage.num}
                  </div>
                  <div>
                    <div className="font-display text-[14px] tracking-[-0.2px]">{stage.label}</div>
                  </div>
                </div>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.07em] px-2 py-1 rounded"
                  style={{ background: stage.statusBg, color: stage.statusText }}
                >
                  {stage.status}
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-black/[0.06]">
                <div className="p-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">
                    Inputs
                  </div>
                  <div className="space-y-2">
                    {stage.inputs.map((inp, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: stage.color }} />
                        {inp}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">
                    Outputs
                  </div>
                  <div className="space-y-2">
                    {stage.outputs.map((out, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-paper last:border-0">
                        <span className="text-[11px] text-ink-2">{out}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-4 mb-3 pb-2 border-b border-black/[0.06]">
                    Flags
                  </div>
                  <div className="space-y-2">
                    {stage.warnings.map((w, i) => (
                      <div key={i} className="text-[11px] text-posture-stabilise bg-posture-stabilise-soft border border-posture-stabilise/15 rounded px-2.5 py-2 leading-relaxed">
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Gap between stages */}
            {idx < STAGES.length - 1 && (
              <div className="flex items-center gap-3 px-5 py-2.5 my-1 text-violet-500">
                <div className="w-px h-6 bg-violet-300 ml-3.5" />
                <span className="font-mono text-[9px] text-violet-400 uppercase tracking-[0.08em]">
                  ↓ transition — see Gap Analysis below
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gap Analysis */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-[18px] tracking-[-0.3px]">Gap Analysis</h2>
          <span className="font-mono text-[9px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-1 rounded uppercase tracking-[0.06em]">
            {GAP_ITEMS.length} gaps identified
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GAP_ITEMS.map(gap => {
            const sev = SEVERITY_META[gap.severity];
            const isOpen = openGap === gap.id;
            return (
              <Card key={gap.id} padding={false} className="overflow-hidden">
                <button
                  className="w-full px-5 py-4 text-left hover:bg-paper/50 transition-colors border-b border-black/[0.06]"
                  onClick={() => setOpenGap(isOpen ? null : gap.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.07em] px-2 py-0.5 rounded mt-0.5 flex-shrink-0 ${sev.bg} ${sev.text}`}>
                      {sev.label}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-display text-[13px] tracking-[-0.2px] mb-0.5">{gap.id} — {gap.title}</div>
                      <div className="font-mono text-[9px] text-ink-4 uppercase tracking-[0.07em]">{gap.between}</div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-ink-4 flex-shrink-0 mt-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 py-4 space-y-3 animate-fade-up">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4 mb-1">What</div>
                      <p className="text-[12px] text-ink-2 leading-relaxed">{gap.what}</p>
                    </div>
                    <div className="pl-3 border-l-2 border-violet-300 bg-violet-50 rounded-r py-2 px-2.5">
                      <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-violet-500 mb-1">Why it exists</div>
                      <p className="text-[12px] text-ink-2 leading-relaxed">{gap.why}</p>
                    </div>
                    <div className="pl-3 border-l-2 border-posture-grow bg-posture-grow-soft rounded-r py-2 px-2.5">
                      <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-posture-grow mb-1">How to close it</div>
                      <p className="text-[12px] text-ink-2 leading-relaxed">{gap.how}</p>
                    </div>
                    <div className="font-mono text-[9px] text-ink-4">
                      → Resolution target: Phase {gap.phase}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
