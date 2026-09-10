type FeatureCardProps = {
  title: string;
  description: string;
  index: string;
};

export function FeatureCard({ title, description, index }: FeatureCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-bg p-8">
      <div className="mb-8 h-px w-10 bg-gold" />
      <p className="text-small font-medium uppercase tracking-[0.16em] text-gold">
        {index}
      </p>
      <h3 className="mt-4 font-serif text-h3 font-semibold text-ink">{title}</h3>
      <p className="mt-4 flex-1 text-body leading-relaxed text-ink-soft">
        {description}
      </p>
    </article>
  );
}
