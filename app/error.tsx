"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#000",
        color: "#fff",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <p style={{ letterSpacing: "0.2em", fontSize: 11, color: "#F11112" }}>
          SCRATCHCREST
        </p>
        <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 600 }}>
          This page could not load
        </h1>
        <p style={{ marginTop: 12, color: "#ccc", lineHeight: 1.5 }}>
          Refresh and try again. If it keeps happening, check the Vercel
          Runtime Logs for digest {error.digest ?? "unknown"}.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 24,
            background: "#F11112",
            color: "#fff",
            border: 0,
            padding: "12px 20px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
