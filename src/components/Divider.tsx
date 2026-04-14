import * as React from "react";

export interface DividerProps {
  label?: string;
  className?: string;
}

/**
 * Divider — 1px hairline with optional mono label, for section breaks.
 */
export const Divider = ({ label, className = "" }: DividerProps) => {
  if (!label) {
    return <hr className={`border-foreground/15 ${className}`.trim()} />;
  }
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      <span className="h-px flex-1 bg-foreground/15" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </span>
      <span className="h-px flex-1 bg-foreground/15" />
    </div>
  );
};
