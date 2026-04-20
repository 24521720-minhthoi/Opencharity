import { statusText } from "@/lib/format.js";

const tones = {
  ACTIVE: "bg-teal-soft text-teal-ink",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING_REVIEW: "bg-amber-100 text-amber-ink",
  REJECTED: "bg-rose-100 text-rose-700",
  PAYMENT_SUCCESS: "bg-teal-soft text-teal-ink",
  SUPPLIER_PROCESSING: "bg-sky-100 text-sky-800",
  PACKED: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-lime-100 text-lime-800",
  POD_UPLOADED: "bg-amber-100 text-amber-ink",
  POD_APPROVED: "bg-emerald-100 text-emerald-800",
  APPROVED: "bg-emerald-100 text-emerald-800"
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${tones[status] || "bg-slate-100 text-slate-700"}`}>
      {statusText(status)}
    </span>
  );
}
