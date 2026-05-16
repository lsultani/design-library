import * as React from "react";

export type QuoteBlockVariant = "default" | "warm" | "dark";

export interface QuoteBlockProps {
  /** The quote text. Do not include surrounding quotation marks; the
   *  component renders typographic ones around it. */
  quote: string;
  /** Speaker name (renders uppercase in mono). */
  attribution: string;
  /** Speaker role + company at the time (renders one notch quieter). */
  role?: string;
  /** Surface variant. Drives quote/attribution/rule color so the block
   *  reads correctly on default, warm, or dark case-study surfaces. */
  variant?: QuoteBlockVariant;
}

/**
 * QuoteBlock — large italic pull quote with mono attribution.
 *
 * Use for executive testimony, peer endorsements, or research insights —
 * any voice that is not the author's. For the author's own one-line
 * punchlines that break prose rhythm, use a PullQuote pattern instead.
 *
 * The `variant` prop adapts color to the surface the block sits on.
 * "default" is the light page background, "warm" is the cream pivot
 * surface, "dark" is the inverted outcome surface.
 */
const quoteColor: Record<QuoteBlockVariant, string> = {
  default: "text-foreground",
  warm: "text-cs-ink-warm",
  dark: "text-white",
};

const nameColor: Record<QuoteBlockVariant, string> = {
  default: "text-foreground",
  warm: "text-cs-ink-warm",
  dark: "text-white",
};

const roleColor: Record<QuoteBlockVariant, string> = {
  default: "text-foreground/55",
  warm: "text-cs-ink-warm/55",
  dark: "text-white/55",
};

const ruleColor: Record<QuoteBlockVariant, string> = {
  default: "bg-foreground/20",
  warm: "bg-cs-ink-warm/20",
  dark: "bg-white/20",
};

export const QuoteBlock = ({
  quote,
  attribution,
  role,
  variant = "default",
}: QuoteBlockProps) => (
  <blockquote className="max-w-[52ch]">
    <p
      className={`font-sans font-light italic text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.4] tracking-[-0.01em] ${quoteColor[variant]}`}
    >
      &ldquo;{quote}&rdquo;
    </p>
    <footer className="mt-6 sm:mt-8 flex items-center gap-4">
      <span className={`block h-px w-8 ${ruleColor[variant]}`} aria-hidden="true" />
      <span className="flex flex-col gap-1">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${nameColor[variant]}`}
        >
          {attribution}
        </span>
        {role && (
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${roleColor[variant]}`}
          >
            {role}
          </span>
        )}
      </span>
    </footer>
  </blockquote>
);
