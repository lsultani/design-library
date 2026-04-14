import * as React from "react";

export interface StatCalloutProps {
  stat: string;
  headline: string;
  supporting?: string;
}

/**
 * StatCallout — one oversized stat paired with a sentence that earns it.
 * Use sparingly. Designed for hero stats in case studies.
 */
export const StatCallout = ({ stat, headline, supporting }: StatCalloutProps) => (
  <div className="max-w-[56ch]">
    <p className="font-sans font-medium text-[clamp(4rem,10vw,8rem)] leading-[0.9] tracking-[-0.04em] text-foreground">
      {stat}
    </p>
    <p className="mt-6 text-section font-medium text-foreground tracking-[-0.02em]">
      {headline}
    </p>
    {supporting && (
      <p className="mt-4 text-body-lg text-muted-foreground">{supporting}</p>
    )}
  </div>
);
