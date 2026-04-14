import * as React from "react";

export interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  display?: string;
}

/**
 * ProgressBar — single-row progress with mono label and value.
 * The "cousin" of BarChart when you have one thing to measure.
 */
export const ProgressBar = ({ label, value, max = 100, display }: ProgressBarProps) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
          {label}
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-foreground">
          {display ?? `${Math.round(pct)}%`}
        </span>
      </div>
      <div className="h-[2px] bg-foreground/10 w-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
