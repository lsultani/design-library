import * as React from "react";

export interface QuoteBlockProps {
  quote: string;
  attribution: string;
  role?: string;
}

/**
 * QuoteBlock — large italic pull quote with a mono attribution.
 * Used to surface research insights or executive testimony in case studies.
 */
export const QuoteBlock = ({ quote, attribution, role }: QuoteBlockProps) => (
  <blockquote className="max-w-[52ch]">
    <p className="font-sans font-light italic text-[clamp(1.3rem,2.5vw,1.75rem)] leading-[1.4] text-foreground">
      &ldquo;{quote}&rdquo;
    </p>
    <footer className="mt-6 flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
        {attribution}
      </span>
      {role && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
          {role}
        </span>
      )}
    </footer>
  </blockquote>
);
