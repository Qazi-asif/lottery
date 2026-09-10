type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";
  const titleColor = tone === "dark" ? "text-bg" : "text-ink";
  const bodyColor = tone === "dark" ? "text-white/65" : "text-ink-soft";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-4 text-small font-medium uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`font-serif text-h2 font-semibold ${titleColor}`}>{title}</h2>
      {description ? (
        <p className={`mt-5 text-body leading-relaxed ${bodyColor}`}>{description}</p>
      ) : null}
    </div>
  );
}
