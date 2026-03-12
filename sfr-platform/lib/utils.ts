import { type ClassValue, clsx } from "clsx";
import type { Posture, Severity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}M`;
  }
  if (compact && value >= 1_000) {
    return `€${(value / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const POSTURE_META: Record<
  Posture,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  protect: {
    label: "PROTECT",
    color: "#C8001A",
    bg: "bg-posture-protect-soft",
    border: "border-posture-protect",
    text: "text-posture-protect",
  },
  stabilise: {
    label: "STABILISE",
    color: "#B45309",
    bg: "bg-posture-stabilise-soft",
    border: "border-posture-stabilise",
    text: "text-posture-stabilise",
  },
  grow: {
    label: "GROW",
    color: "#155E37",
    bg: "bg-posture-grow-soft",
    border: "border-posture-grow",
    text: "text-posture-grow",
  },
  invest: {
    label: "INVEST",
    color: "#1E3A8A",
    bg: "bg-posture-invest-soft",
    border: "border-posture-invest",
    text: "text-posture-invest",
  },
};

export const SEVERITY_META: Record<
  Severity,
  { label: string; bg: string; text: string }
> = {
  critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700" },
  high: { label: "High", bg: "bg-amber-100", text: "text-amber-700" },
  medium: { label: "Medium", bg: "bg-violet-100", text: "text-violet-700" },
  low: { label: "Low", bg: "bg-slate-100", text: "text-slate-600" },
};

export function scoreColor(score: number, invert = false): string {
  const high = invert ? score < 40 : score >= 70;
  const mid = invert ? score < 70 : score >= 40;
  if (high) return "text-posture-protect";
  if (mid) return "text-posture-stabilise";
  return "text-posture-grow";
}
