import * as React from "react";

export interface BarRow {
  label: string;
  value: number;
  display?: string;
}

export interface BarChartProps {
  rows: BarRow[];
  max?: number;
  title?: string;
}

/**
 * BarChartHorizontal — mono label, 1px rule, thin filled bar.
 * No tick grid. Values are secondary, labels are primary.
 */
export const BarChart = ({ rows, max, title }: BarChartProps) => {
  const maxValue = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <div className="w-full">
      {title && (
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60 mb-6">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-5">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] text-foreground">{r.label}</span>
              <span className="font-mono text-[11px] tracking-[0.1em] text-foreground/60">
                {r.display ?? r.value.toLocaleString()}
              </span>
            </div>
            <div className="h-[2px] bg-foreground/10 w-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-700 ease-out"
                style={{ width: `${(r.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
