import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} className="mt-5">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
