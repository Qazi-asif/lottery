export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-40 rounded-md bg-paper-2" />
      <div className="mt-2 h-4 w-72 max-w-full rounded-md bg-paper-2" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-lg border border-border bg-sheet" />
        <div className="h-24 rounded-lg border border-border bg-sheet" />
        <div className="h-24 rounded-lg border border-border bg-sheet" />
      </div>
    </div>
  );
}
