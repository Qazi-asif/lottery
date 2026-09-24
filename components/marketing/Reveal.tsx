"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * `up` rises, `left` slides in from the margin, `scale` settles, and `mask`
 * wipes left-to-right — used on rules and connectors where a fade would read as
 * a glitch rather than a draw.
 */
type RevealVariant = "up" | "left" | "scale" | "mask" | "pop";

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animation = `reveal reveal-${variant} ${visible ? "is-visible" : ""}`;
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  /**
   * The mask variant hides with `clip-path`, and IntersectionObserver folds an
   * element's own clip into its intersection rect — so an element clipped to
   * zero width reports `isIntersecting: false` forever and never un-hides
   * itself. The clip therefore goes on a child, leaving the observed node
   * unclipped. The transform-based variants have no such problem: a translated
   * or scaled box still has area.
   */
  if (variant === "mask") {
    return (
      <div ref={ref} className={className}>
        <div className={animation} style={style}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`${animation} ${className}`} style={style}>
      {children}
    </div>
  );
}
