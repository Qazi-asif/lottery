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
    "bg-[#f11112] text-white hover:-translate-y-0.5 hover:bg-[#c10e0f]",
  secondary:
    "border-2 border-[#f11112] bg-black text-white hover:-translate-y-0.5 hover:bg-[#f11112] hover:text-white",
  inverse:
    "bg-[#f11112] text-white hover:-translate-y-0.5 hover:bg-[#c10e0f]",
  ghost: "text-white hover:bg-[#f11112]/15",
  gold: "border-2 border-[#f11112] text-white hover:bg-[#f11112] hover:text-white",
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
