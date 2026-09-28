"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-serif text-h2 font-semibold text-ink">
        This screen could not load
      </h1>
      <p className="mt-3 text-body text-ink-soft">
        The database was busy. Wait a few seconds and try again.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-small text-ink-faint">
          Digest {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
      >
        Try again
      </button>
    </div>
  );
}
