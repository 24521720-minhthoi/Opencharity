export function Progress({ value = 0 }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-100">
      <div className="h-full rounded-sm bg-teal-brand transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
