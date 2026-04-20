export function StatCard({ label, value, helper, icon }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        {icon ? <div className="rounded-md bg-teal-soft p-2 text-teal-ink">{icon}</div> : null}
      </div>
      {helper ? <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p> : null}
    </div>
  );
}
