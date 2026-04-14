import * as React from "react";

export interface TagProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Tag / pill used for tech stack, case study meta, and categorization.
 * Mono, all-caps, wide tracking. Never styled for marketing emphasis.
 */
export const Tag = ({ children, className = "" }: TagProps) => (
  <span
    className={`font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/70 border border-foreground/20 rounded-full px-3 py-1 ${className}`.trim()}
  >
    {children}
  </span>
);
