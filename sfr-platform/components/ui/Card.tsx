import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-black/[0.07] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.04)]",
        padding && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("font-display text-[14px] tracking-[-0.2px]", className)}>
      {children}
    </div>
  );
}

export function CardBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "font-mono text-[9px] uppercase tracking-[0.08em] text-ink-4 bg-paper px-2 py-1 rounded border border-black/[0.06]",
      className
    )}>
      {children}
    </span>
  );
}
