type MarketingPhotoProps = {
  file: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function MarketingPhoto({
  file,
  alt,
  className = "",
  priority = false,
}: MarketingPhotoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/marketing/${file}`}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
