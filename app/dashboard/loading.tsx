export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-bg-secondary" />
      <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-bg-secondary" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="h-28 rounded-lg border border-border bg-bg-secondary" />
        <div className="h-28 rounded-lg border border-border bg-bg-secondary" />
        <div className="h-28 rounded-lg border border-border bg-bg-secondary" />
      </div>
    </div>
  );
}
