import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  href?: string;
};

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 text-body font-medium transition-colors duration-200";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-2 border-transparent bg-ink text-bg hover:border-gold",
  secondary:
    "border border-ink bg-transparent text-ink hover:border-gold hover:text-ink",
  inverse:
    "border-2 border-gold-soft bg-bg text-ink hover:border-gold",
  ghost:
    "border border-white/35 bg-transparent text-bg hover:border-gold",
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
