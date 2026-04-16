import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-sky-100 text-sky-800",
  danger: "bg-red-100 text-red-800"
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}

export function toneFromStatus(status: string): keyof typeof tones {
  if (["ACTIVE", "APPROVED", "SUCCESS", "VERIFIED", "COMPLETED"].includes(status)) return "success";
  if (["PENDING", "PENDING_REVIEW", "DRAFT"].includes(status)) return "warning";
  if (["REJECTED", "FAILED", "SUSPENDED"].includes(status)) return "danger";
  return "info";
}
