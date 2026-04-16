import { cn, percent } from "@/lib/utils";

export function ProgressBar({
  current,
  target,
  className
}: {
  current: number;
  target: number;
  className?: string;
}) {
  const value = percent(current, target);

  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-200", className)} aria-label={`${value}%`}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
