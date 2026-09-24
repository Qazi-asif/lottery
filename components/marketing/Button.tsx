import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost" | "gold";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  href?: string;
};

/**
 * Buttons are the one genuinely pill-shaped thing on the page, so they are the
 * one place `rounded-full` is used. Cards stay square-ish.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium tracking-tight transition-all duration-150";

const variants: Record<ButtonVariant, string> = {
  /** Vermilion is the page's only loud fill, and this is where it belongs. */
  primary:
    "bg-flag text-white shadow-[0_2px_6px_rgb(174_44_12/0.28)] hover:-translate-y-0.5 hover:bg-flag-deep hover:shadow-[0_8px_20px_-6px_rgb(174_44_12/0.45)]",
  secondary:
    "border-2 border-ink/15 bg-sheet text-ink hover:-translate-y-0.5 hover:border-ink/40",
  /** For the ink CTA and footer blocks, where paper becomes the foreground. */
  inverse:
    "bg-paper text-ink hover:-translate-y-0.5 hover:bg-white",
  ghost: "text-ink hover:bg-ink/[0.06]",
  /** Gold stays an outline — a large gold fill reads cheap instantly. */
  gold: "border-2 border-foil/45 text-foil hover:border-foil hover:bg-foil/5",
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
