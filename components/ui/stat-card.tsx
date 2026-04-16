import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          {helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p> : null}
        </div>
        {icon ? <div className="rounded-md bg-secondary p-2 text-primary">{icon}</div> : null}
      </div>
    </Card>
  );
}
