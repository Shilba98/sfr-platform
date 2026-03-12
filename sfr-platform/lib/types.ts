export type Posture = "protect" | "stabilise" | "grow" | "invest";
export type Channel = "am_direct" | "digital" | "specialist";
export type Severity = "critical" | "high" | "medium" | "low";
export type Sector =
  | "Retail" | "Logistics" | "Healthcare" | "Legal"
  | "Construction" | "Finance" | "Media" | "Tech"
  | "Hospitality" | "Manufacturing";

export interface Account {
  id: string;
  name: string;
  sector: Sector;
  am: string;
  mrr: number;
  tenure: number; // months
  productsActive: number;
  npsScore: number;
  npsTrend: number; // 3-month delta
  openCases: number;
  contractDaysLeft: number;
  autoRenew: boolean;
  lastContactDays: number;
  // Computed scores
  riskScore: number;
  opportunityScore: number;
  complexityScore: number;
  confidence: number;
  posture: Posture;
  conflictDetected: boolean;
  nba: string;
  nbaChannel: Channel;
  nbaSLA: number; // days
  // State
  nbaCompleted: boolean;
  overridePosture: Posture | null;
  overrideReason: string | null;
  // ROI
  isControl: boolean;
  outcome: "retained" | "churned" | "pending" | null;
}

export interface RoiMetrics {
  revenueProtected: number;
  incrementalRevenue: number;
  platformROI: number;
  churnDelta: number;
  decisionAccuracy: number;
  mrrStabilityIndex: number;
  quarterLabel: string;
}

export interface MonthlyROI {
  month: string;
  protected: number;
  incremental: number;
}

export interface CohortData {
  label: string;
  posture: Posture | "control";
  churnRate: number;
  delta: number;
  accounts: number;
}

export interface GapItem {
  id: string;
  severity: Severity;
  title: string;
  between: string;
  what: string;
  why: string;
  how: string;
  phase: number;
}

export interface OverrideLog {
  id: string;
  accountId: string;
  accountName: string;
  from: Posture;
  to: Posture;
  reason: string;
  am: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  type: "nba_completed" | "override" | "guardrail" | "sync" | "risk_escalation";
  accountName: string;
  description: string;
  posture: Posture;
  timestamp: string;
  am: string;
}
