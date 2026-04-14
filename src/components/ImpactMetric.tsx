import * as React from "react";

export interface ImpactMetricProps {
  value: string;
  label: string;
  caption?: string;
}

/**
 * ImpactMetric — large display number with a mono label.
 * On the real site, the value counts up on scroll; this component
 * renders the static end-state. Use the CountUp motion demo for the
 * animated version.
 */
export const ImpactMetric = ({ value, label, caption }: ImpactMetricProps) => (
  <div className="flex flex-col">
    <span className="font-sans font-medium text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.03em] text-foreground">
      {value}
    </span>
    <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
      {label}
    </span>
    {caption && (
      <span className="mt-2 text-[13px] text-muted-foreground leading-relaxed max-w-[28ch]">
        {caption}
      </span>
    )}
  </div>
);
