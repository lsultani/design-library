import * as React from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "ghost" | "text";
type Size = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: React.ReactNode;
}

/**
 * Sultani Button.
 * Mirrors the voice of the site — quiet, squared, letter-spaced.
 * Variants: primary (ink fill), ghost (outline), text (mono label).
 */
export const Button = ({
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  const base =
    "inline-flex items-center gap-2 font-sans font-medium transition-all duration-300 ease-out";
  const sizes: Record<Size, string> = {
    sm: "text-[13px] px-4 py-2",
    md: "text-[14px] px-5 py-2.5",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90",
    ghost:
      "border border-foreground/30 text-foreground hover:border-foreground",
    text:
      "font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground px-0 py-0",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          size={size === "sm" ? 13 : 14}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </button>
  );
};
