"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up once, the first time it scrolls into view.
 *
 * Deliberately limited to the marketing stat bar, whose figures are explicitly
 * placeholder claims. Never wrap a number read off live data in this — a
 * retailer reading a stock count or a commission total needs the real value on
 * the first frame, not an animation climbing toward it.
 *
 * Renders the final value on the server so the figure is in the HTML and in the
 * accessibility tree whether or not the animation ever runs.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // Ease-out quint: most of the travel happens immediately, so the figure
      // settles rather than crawling to the finish.
      const eased = 1 - Math.pow(1 - t, 5);
      setShown(value * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
