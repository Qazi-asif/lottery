"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Fraction of latex that has to come off before the rest falls away on its own. */
const REVEAL_AT = 0.5;
/** Brush radius in CSS pixels — roughly a coin edge. */
const BRUSH = 24;

/**
 * A real scratch-off panel: silver latex on a canvas, erased by pointer drag
 * with `destination-out`, clearing itself once half of it is gone.
 *
 * Accessibility notes, because a drag-only interaction excludes a lot of people:
 * the canvas is `aria-hidden` and the prize underneath stays in the DOM and the
 * accessibility tree the whole time, there is a real `<button>` that reveals it
 * without any pointer work, and `prefers-reduced-motion` skips the latex
 * entirely. `touch-action: pan-y` keeps vertical scrolling working on phones —
 * a horizontal drag scratches, a vertical one still scrolls the page.
 */
export function ScratchCard({
  children,
  label = "Scratch to reveal",
  className = "",
  tone = "ink",
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  tone?: "ink" | "paper";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);

  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moveCount = useRef(0);
  // Read inside listeners and the resize observer, which close over the first
  // render's state otherwise.
  const revealedRef = useRef(false);
  const touchedRef = useRef(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    // Landing latex is red-on-black only — no silver/gray third color.
    const metal = ctx.createLinearGradient(0, 0, width, height);
    metal.addColorStop(0, "#f11112");
    metal.addColorStop(0.35, "#b00d0e");
    metal.addColorStop(0.6, "#f11112");
    metal.addColorStop(1, "#7a090a");
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.lineWidth = 1;
    for (let x = -height; x < width; x += 7) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }

    for (let i = 0; i < width * height * 0.04; i++) {
      ctx.fillStyle =
        Math.random() > 0.5 ? "rgba(0,0,0,0.35)" : "rgba(241,17,18,0.22)";
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        "3px";
    }
    ctx.font =
      '600 11px ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace';
    ctx.fillText(label.toUpperCase(), width / 2, height / 2);
  }, [label]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealedRef.current = true;
      setRevealed(true);
      return;
    }

    paint();

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Repaint on resize only while the panel is untouched; repainting after a
    // scratch would hand back latex the visitor already removed.
    const observer = new ResizeObserver(() => {
      if (!revealedRef.current && !touchedRef.current) paint();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paint]);

  const clearedFraction = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    // Every 16th pixel: plenty for a threshold, cheap enough to run mid-drag.
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 24) clear++;
    }
    return total ? clear / total : 0;
  };

  const reveal = () => {
    revealedRef.current = true;
    setRevealed(true);
  };

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";

    if (lastPoint.current) {
      ctx.lineWidth = BRUSH * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
    lastPoint.current = { x, y };

    if (++moveCount.current % 10 === 0 && clearedFraction() > REVEAL_AT) reveal();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    drawing.current = true;
    touchedRef.current = true;
    setTouched(true);
    // Capture keeps the stroke alive if the pointer leaves the canvas mid-drag.
    // It throws when the pointer isn't active (synthetic events, odd pen
    // hardware), and losing capture is far better than losing the interaction.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* capture is an enhancement, not a requirement */
    }
    scratch(event);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealedRef.current) return;
    scratch(event);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    if (!revealedRef.current && clearedFraction() > REVEAL_AT) reveal();
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-lg">
        {children}

        <canvas
          ref={canvasRef}
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`absolute inset-0 h-full w-full cursor-grab transition-opacity duration-700 active:cursor-grabbing ${
            revealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ touchAction: "pan-y" }}
        />
      </div>

      <div className="mt-3 flex h-6 items-center justify-between gap-4">
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            "text-ink-faint"
          }`}
        >
          {revealed ? "Illustrative — your numbers will differ" : "Drag across the panel"}
        </p>
        {revealed ? null : (
          <button
            type="button"
            onClick={reveal}
            className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-flag underline decoration-flag/40 underline-offset-4 transition-colors hover:decoration-flag"
          >
            {touched ? "Reveal the rest" : "Reveal instead"}
          </button>
        )}
      </div>
    </div>
  );
}
