import type { ReactNode } from "react";

export function DashboardPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <h1 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 text-small leading-relaxed text-ink-soft">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}

export function DashboardNotice({
  tone = "error",
  children,
}: {
  tone?: "error" | "ok";
  children: ReactNode;
}) {
  return (
    <p
      className={`mt-4 text-small ${
        tone === "ok" ? "text-success" : "text-error"
      }`}
    >
      {children}
    </p>
  );
}
