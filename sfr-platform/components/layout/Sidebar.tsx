"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BrainCircuit, Zap, TrendingUp,
  ShieldCheck, GitBranch, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, sub: "Portfolio at a glance" },
  { href: "/intelligence", label: "Account Intelligence", icon: BrainCircuit, sub: "Risk · Opportunity · Complexity" },
  { href: "/decisions", label: "Decision & Activation", icon: Zap, sub: "Postures · NBA Queue" },
  { href: "/roi", label: "Retention ROI", icon: TrendingUp, sub: "Attribution · Executive view" },
  { href: "/governance", label: "Governance", icon: ShieldCheck, sub: "Adoption · Override log" },
  { href: "/pipeline", label: "Data Pipeline", icon: GitBranch, sub: "Salesforce → Engine · Gaps" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0D0D0D] flex flex-col z-50">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <div className="font-display text-[22px] text-[#C8001A] leading-none mb-1">SFR</div>
        <div className="font-mono text-[9px] text-white/35 uppercase tracking-[0.1em] leading-tight">
          Commercial Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 px-4 py-3 mx-2 rounded-md transition-all duration-150 group",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/75 hover:bg-white/5"
              )}
            >
              <item.icon
                size={15}
                className={cn("mt-0.5 flex-shrink-0", active ? "text-[#C8001A]" : "text-current")}
              />
              <div className="min-w-0">
                <div className="text-[12px] font-medium leading-tight truncate">{item.label}</div>
                <div className={cn(
                  "text-[10px] font-mono leading-tight mt-0.5 truncate",
                  active ? "text-white/40" : "text-white/20 group-hover:text-white/30"
                )}>
                  {item.sub}
                </div>
              </div>
              {active && (
                <ChevronRight size={12} className="ml-auto mt-0.5 text-white/30 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live" />
          <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.08em]">
            Live · Q2 2025
          </span>
        </div>
        <div className="font-mono text-[9px] text-white/20">
          Prototype v0.1 · Mock data
        </div>
      </div>
    </aside>
  );
}
