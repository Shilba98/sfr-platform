import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, right, className }: Props) {
  return (
    <div className={cn("flex items-start justify-between mb-6", className)}>
      <div>
        <h1 className="font-display text-[24px] tracking-[-0.4px] leading-tight mb-1">{title}</h1>
        {subtitle && <p className="text-[13px] text-ink-3 max-w-xl leading-relaxed">{subtitle}</p>}
      </div>
      {right && <div className="ml-6 flex-shrink-0">{right}</div>}
    </div>
  );
}
