import { cn } from "@/lib/utils";
import type { Posture } from "@/lib/types";

const STYLES: Record<Posture, string> = {
  protect: "bg-posture-protect-soft text-posture-protect border-posture-protect/20",
  stabilise: "bg-posture-stabilise-soft text-posture-stabilise border-posture-stabilise/20",
  grow: "bg-posture-grow-soft text-posture-grow border-posture-grow/20",
  invest: "bg-posture-invest-soft text-posture-invest border-posture-invest/20",
};

interface Props {
  posture: Posture;
  size?: "sm" | "md";
  className?: string;
}

export default function PostureChip({ posture, size = "md", className }: Props) {
  return (
    <span className={cn(
      "inline-flex items-center font-mono uppercase tracking-[0.05em] border rounded-[3px]",
      size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1",
      STYLES[posture],
      className
    )}>
      {posture}
    </span>
  );
}
