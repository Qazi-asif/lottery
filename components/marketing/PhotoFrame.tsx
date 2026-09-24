import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";

/**
 * A photographic print: white stock, an even border, and a deeper margin at the
 * bottom where a caption would be written. `tilt` is for galleries — the frames
 * sit at slightly different angles and straighten on hover.
 */
export function PhotoFrame({
  file,
  alt,
  caption,
  priority = false,
  tilt = "",
  className = "",
}: {
  file: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  tilt?: string;
  className?: string;
}) {
  const fill = className.includes("h-full");

  return (
    <figure
      className={`sheet lift flex flex-col rounded-sm p-2.5 pb-3 transition-transform hover:rotate-0 ${tilt} ${className}`}
    >
      <div
        className={`overflow-hidden rounded-sm bg-paper-3 ${
          fill ? "min-h-[14rem] flex-1" : "aspect-[16/10]"
        }`}
      >
        <MarketingPhoto file={file} alt={alt} priority={priority} />
      </div>
      {caption ? (
        <figcaption className="px-1 pb-0.5 pt-3 text-center text-[13px] font-medium text-ink-soft">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
