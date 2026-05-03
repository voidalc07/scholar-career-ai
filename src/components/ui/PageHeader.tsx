import { Link } from "react-router-dom";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-outline pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-on-surface-2 sm:text-base">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link className="btn-primary whitespace-nowrap" to={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
