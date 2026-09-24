import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  /** `paper` for ink / bronze bands where the type has to flip. */
  tone?: "ink" | "paper";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const onPaper = tone === "paper";

  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? (
        <p
          className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}
        >
          <span
            className={`h-0.5 w-6 shrink-0 ${onPaper ? "bg-foil-light" : "bg-flag"}`}
            aria-hidden
          />
          <span
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${
              onPaper ? "text-foil-light" : "text-flag"
            }`}
          >
            {eyebrow}
          </span>
        </p>
      ) : null}

      <h2
        className={`wonk font-display text-h2 font-semibold tracking-[-0.02em] ${
          onPaper ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-4 text-[17px] leading-relaxed ${
            onPaper ? "text-paper-2/75" : "text-ink-soft"
          } ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
