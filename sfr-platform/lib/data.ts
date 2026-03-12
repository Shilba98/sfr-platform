import type {
  Account, Posture, Sector, Channel,
  RoiMetrics, MonthlyROI, CohortData, GapItem,
  OverrideLog, ActivityEvent,
} from "./types";

// ── Seeded RNG ──────────────────────────────────────────────
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rng = seededRng(2025);

// ── Account generation ──────────────────────────────────────
const COMPANIES = [
  "Bouygues Construction","Carrefour Market","Axa France","BNP Paribas","Renault Services",
  "Michelin B2B","Leclerc Digital","Veolia Eau","Orange Partners","SNCF Logistics",
  "Sodexo France","Dassault Systèmes","L'Oréal Pro","TotalEnergies","Vivendi Media",
  "Fnac Darty Pro","Decathlon B2B","Accor Hospitality","EDF Business","Capgemini SME",
  "Deloitte France","KPMG Services","Publicis Groupe","JCDecaux","Eiffage Infra",
  "Vinci Energies","Rexel France","Schneider Elec.","Saint-Gobain Pro","Legrand B2B",
  "Alstom Services","Thales B2B","Safran Digital","Airbus Partners","Suez Environ.",
  "Elior Group","Fleury Michon","Pierre Fabre","Ipsen Pharma","Guerbet Medical",
];

const SECTORS: Sector[] = [
  "Retail","Logistics","Healthcare","Legal","Construction",
  "Finance","Media","Tech","Hospitality","Manufacturing",
];

const AMS = ["L. Moreau","C. Dupont","F. Bernard","A. Leblanc","M. Petit"];

const NBA_MAP: Record<Posture, string[]> = {
  protect: [
    "Proactive retention call — contract review",
    "Service recovery protocol — open incident",
    "Loyalty discount eligibility check",
    "Escalate to senior AM immediately",
  ],
  stabilise: [
    "Schedule quarterly business review",
    "Usage coaching session — improve adoption",
    "NPS follow-up call — address concerns",
    "Soft renewal conversation — no hard pitch",
  ],
  grow: [
    "Cross-sell: SFR Business mobile + cloud bundle",
    "Bandwidth upsell proposal",
    "Multi-site expansion offer",
    "Digital outreach — personalised email",
  ],
  invest: [
    "Assign to senior account manager",
    "Executive relationship mapping",
    "Bespoke enterprise proposal",
    "Specialist routing — complex deal",
  ],
};

function computePosture(risk: number, opp: number): Posture {
  if (risk > 70) return "protect";
  if (risk > 45) return "stabilise";
  if (opp > 80) return "invest";
  if (opp > 50) return "grow";
  return "grow";
}

function computeChannel(complexity: number, posture: Posture): Channel {
  if (posture === "protect") return "am_direct";
  if (complexity > 70) return "specialist";
  if (posture === "invest") return "am_direct";
  return "digital";
}

export function generateAccounts(): Account[] {
  return COMPANIES.map((name, i) => {
    const r = seededRng(i * 137 + 42);
    const npsScore = Math.round(-30 + r() * 110);
    const npsTrend = Math.round(-25 + r() * 40);
    const openCases = Math.floor(r() * 6);
    const contractDaysLeft = Math.round(10 + r() * 355);
    const mrr = Math.round(2000 + r() * 38000);
    const tenure = Math.round(6 + r() * 60);
    const productsActive = Math.floor(1 + r() * 5);
    const lastContactDays = Math.round(1 + r() * 60);
    const autoRenew = r() > 0.4;

    // Risk score (weighted)
    const npsRisk = Math.max(0, Math.min(100, ((0 - npsScore) / 100) * 100 * 0.3 + (npsTrend < -10 ? 15 : 0)));
    const contractRisk = Math.max(0, Math.min(35, ((180 - contractDaysLeft) / 180) * 35));
    const caseRisk = Math.min(20, openCases * 5);
    const engagementRisk = Math.min(15, (lastContactDays / 60) * 15);
    const riskScore = Math.round(Math.min(99, Math.max(1, npsRisk + contractRisk + caseRisk + engagementRisk + r() * 10)));

    // Opportunity score
    const walletGap = Math.round(r() * 100);
    const productFit = Math.round(r() * 100);
    const opportunityScore = Math.round(Math.min(99, Math.max(1, walletGap * 0.4 + productFit * 0.35 + r() * 25)));

    const complexityScore = Math.round(Math.min(99, Math.max(1,
      productsActive * 10 + (tenure > 24 ? 20 : 0) + r() * 40
    )));

    const confidence = Math.round(60 + r() * 38);
    const posture = computePosture(riskScore, opportunityScore);
    const conflictDetected = riskScore > 60 && opportunityScore > 60;
    const nbaList = NBA_MAP[posture];
    const nba = nbaList[Math.floor(r() * nbaList.length)];
    const nbaChannel = computeChannel(complexityScore, posture);
    const nbaSLA = posture === "protect" ? 2 : posture === "stabilise" ? 5 : posture === "invest" ? 10 : 10;
    const isControl = r() > 0.8;

    return {
      id: `ACC-${String(i + 1).padStart(5, "0")}`,
      name,
      sector: SECTORS[Math.floor(r() * SECTORS.length)],
      am: AMS[Math.floor(r() * AMS.length)],
      mrr,
      tenure,
      productsActive,
      npsScore,
      npsTrend,
      openCases,
      contractDaysLeft,
      autoRenew,
      lastContactDays,
      riskScore,
      opportunityScore,
      complexityScore,
      confidence,
      posture,
      conflictDetected,
      nba,
      nbaChannel,
      nbaSLA,
      nbaCompleted: r() > 0.65,
      overridePosture: null,
      overrideReason: null,
      isControl,
      outcome: r() > 0.85 ? "churned" : r() > 0.4 ? "retained" : "pending",
    };
  });
}

// ── ROI Metrics ─────────────────────────────────────────────
export const ROI_METRICS: RoiMetrics = {
  revenueProtected: 4720000,
  incrementalRevenue: 1380000,
  platformROI: 11.4,
  churnDelta: -1.8,
  decisionAccuracy: 84,
  mrrStabilityIndex: 92.3,
  quarterLabel: "Q2 2025",
};

export const MONTHLY_ROI: MonthlyROI[] = [
  { month: "Jan", protected: 620, incremental: 180 },
  { month: "Feb", protected: 710, incremental: 210 },
  { month: "Mar", protected: 850, incremental: 240 },
  { month: "Apr", protected: 930, incremental: 280 },
  { month: "May", protected: 1100, incremental: 320 },
  { month: "Jun", protected: 1380, incremental: 390 },
];

export const COHORT_DATA: CohortData[] = [
  { label: "PROTECT", posture: "protect", churnRate: 4.6, delta: -3.1, accounts: 187 },
  { label: "STABILISE", posture: "stabilise", churnRate: 3.2, delta: -1.9, accounts: 601 },
  { label: "GROW", posture: "grow", churnRate: 1.8, delta: -0.7, accounts: 1031 },
  { label: "INVEST", posture: "invest", churnRate: 0.9, delta: -0.4, accounts: 329 },
  { label: "CONTROL", posture: "control", churnRate: 7.7, delta: 0, accounts: 412 },
];

// ── Gap Items ────────────────────────────────────────────────
export const GAP_ITEMS: GapItem[] = [
  {
    id: "G1", severity: "high", phase: 2,
    title: "Score Freshness & Missing Signals",
    between: "Salesforce → Intelligence Engine",
    what: "14.5% of accounts have no NPS data. 22% have stale contract dates. The engine treats all inputs identically regardless of age.",
    why: "NPS surveys run quarterly. Between cycles, scores age silently. No staleness flag exists — the engine computes risk on 9-month-old data identically to last week's.",
    how: "Add field-level freshness timestamps. Apply a confidence penalty per stale field (>60d). Surface low-confidence accounts with a 'data gap' flag rather than a clean score.",
  },
  {
    id: "G2", severity: "critical", phase: 2,
    title: "Override Loop — Decisions Without Learning",
    between: "Decision Engine → Decision Engine (no loop)",
    what: "When AMs override posture, the reason is not captured. The engine cannot learn from systematic AM disagreement and repeats misclassification each cycle.",
    why: "Override UI has a single button with no reason field. Adding a selector was deprioritised in Phase 1 to reduce friction. The consequence: a one-way system.",
    how: "Add a mandatory 5-option override reason picker. Feed accepted overrides as training labels into the scoring model quarterly.",
  },
  {
    id: "G3", severity: "critical", phase: 2,
    title: "CRM Write-Back — No Outcome Captured",
    between: "Decision Engine → ROI Engine",
    what: "The platform pushes NBA tasks to Salesforce but receives no outcome signal back. Pipeline flows one direction only.",
    why: "Salesforce Task objects do not have a native outcome field in SFR's current configuration. Adding custom fields requires CRM admin approval.",
    how: "Add SFR_Outcome__c custom picklist to SF Task object. AMs complete in one click after each NBA. Map to attribution engine in Stage 3.",
  },
  {
    id: "G4", severity: "medium", phase: 3,
    title: "ROI Visibility — Executive Only",
    between: "ROI Engine → Governance",
    what: "Revenue protected and decision accuracy are visible only in executive dashboards. AMs cannot see the cumulative impact of their own decisions.",
    why: "Governance layer was designed top-down: leadership visibility first. AM-facing metrics require different aggregation logic.",
    how: "Add AM-level performance view: personal accuracy rate, NBAs completed, revenue attributed, override rate vs team average.",
  },
  {
    id: "G5", severity: "medium", phase: 3,
    title: "No Real-Time Product Usage Signal",
    between: "Salesforce → Intelligence Engine",
    what: "SFR's network/provisioning systems hold granular usage data (bandwidth, feature activation) not accessible through Salesforce.",
    why: "Usage data lives in BSS/OSS infrastructure (Amdocs). Not synced to Salesforce in the SME segment — integration out of Phase 1 scope.",
    how: "Add usage data connector (Kafka stream or daily ETL) from provisioning system in Phase 2.",
  },
  {
    id: "G6", severity: "medium", phase: 3,
    title: "Posture Recalibration — Quarterly is Too Slow",
    between: "Intelligence Engine → Decision Engine (model drift)",
    what: "Scoring weights recalibrated quarterly. In a competitive market, risk patterns can shift materially within a quarter.",
    why: "Quarterly calibration chosen for operational simplicity. More frequent recalibration requires A/B testing infrastructure.",
    how: "Build a model monitoring layer: track distribution shift in risk scores weekly. Trigger early recalibration if shift >1 std dev. Target monthly by Phase 3.",
  },
];

// ── Activity Events ──────────────────────────────────────────
export const ACTIVITY_EVENTS: ActivityEvent[] = [
  { id: "e1", type: "nba_completed", accountName: "Bouygues Construction", description: "Retention call completed — contract review initiated", posture: "protect", timestamp: "2 min ago", am: "L. Moreau" },
  { id: "e2", type: "nba_completed", accountName: "Carrefour Market", description: "Cross-sell proposal sent — SFR Business mobile bundle", posture: "grow", timestamp: "8 min ago", am: "C. Dupont" },
  { id: "e3", type: "override", accountName: "Axa France", description: "Posture override: PROTECT → STABILISE. Reason: Relationship factor", posture: "stabilise", timestamp: "14 min ago", am: "F. Bernard" },
  { id: "e4", type: "guardrail", accountName: "BNP Paribas", description: "Upsell proposal blocked — account on PROTECT posture (risk 91)", posture: "protect", timestamp: "22 min ago", am: "A. Leblanc" },
  { id: "e5", type: "nba_completed", accountName: "Michelin B2B", description: "QBR scheduled — STABILISE posture, 5-day SLA met", posture: "stabilise", timestamp: "31 min ago", am: "L. Moreau" },
  { id: "e6", type: "risk_escalation", accountName: "Renault Services", description: "Risk score escalated to 84 — NPS drop detected (-22 trend)", posture: "protect", timestamp: "45 min ago", am: "M. Petit" },
  { id: "e7", type: "nba_completed", accountName: "Vinci Energies", description: "Enterprise proposal created and sent — INVEST tier", posture: "invest", timestamp: "1h ago", am: "C. Dupont" },
  { id: "e8", type: "sync", accountName: "Salesforce", description: "Batch sync completed — 2,148 records updated, 7 new risk flags", posture: "protect", timestamp: "2h ago", am: "System" },
];

// ── Override Log ─────────────────────────────────────────────
export const OVERRIDE_LOG: OverrideLog[] = [
  { id: "o1", accountId: "ACC-00003", accountName: "Axa France", from: "protect", to: "stabilise", reason: "Relationship factor", am: "F. Bernard", timestamp: "Today 09:28" },
  { id: "o2", accountId: "ACC-00011", accountName: "Sodexo France", from: "stabilise", to: "grow", reason: "Account context not in data", am: "L. Moreau", timestamp: "Today 08:15" },
  { id: "o3", accountId: "ACC-00019", accountName: "Fnac Darty Pro", from: "grow", to: "invest", reason: "Relationship factor", am: "C. Dupont", timestamp: "Yesterday 16:42" },
  { id: "o4", accountId: "ACC-00027", accountName: "Rexel France", from: "protect", to: "stabilise", reason: "Tactical exception", am: "M. Petit", timestamp: "Yesterday 11:07" },
];
