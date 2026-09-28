"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#000",
          color: "#fff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", padding: "2rem" }}>
          <p style={{ letterSpacing: "0.2em", fontSize: 11, color: "#F11112" }}>
            SCRATCHCREST
          </p>
          <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 600 }}>
            ScratchCrest could not start
          </h1>
          <p style={{ marginTop: 12, color: "#ccc", lineHeight: 1.5 }}>
            Refresh the page. If this repeats, open Vercel Runtime Logs and
            search for digest {error.digest ?? "unknown"}.
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
      </body>
    </html>
  );
}
