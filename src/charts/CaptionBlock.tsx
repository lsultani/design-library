import * as React from "react";

export type CaptionBlockVariant = "default" | "warm" | "dark";

export interface CaptionBlockProps {
  /** The caption string. Short captions render as a mono label; long
   *  captions split on the first sentence boundary into a short mono
   *  label + light body prose. */
  caption?: string;
  /** Surface variant for color adaptation. */
  variant?: CaptionBlockVariant;
  /** Optional wrapper classes (e.g. spacing overrides). */
  className?: string;
}

const labelColor: Record<CaptionBlockVariant, string> = {
  default: "text-foreground/55",
  warm: "text-cs-ink-warm/55",
  dark: "text-white/55",
};

const bodyColor: Record<CaptionBlockVariant, string> = {
  default: "text-foreground/75",
  warm: "text-cs-ink-warm/70",
  dark: "text-white/75",
};

/** Split a caption into (label, body). Returns ("", "") for empty,
 *  (label, "") for short captions. */
const split = (caption: string): [string, string] => {
  const trimmed = caption.trim();
  if (trimmed.length <= 90) return [trimmed, ""];

  /* Find the first true sentence end. Look for ". " followed by a capital
   *  or opening quote so we don't split inside abbreviations like "U.S." */
  const sentenceMatch = trimmed.match(/^(.+?[.!?])\s+(?=[A-Z"'(])/);
  if (sentenceMatch) {
    const label = sentenceMatch[1].trim();
    const body = trimmed.slice(sentenceMatch[0].length).trim();
    if (body.length > 0) return [label, body];
  }

  /* Fallback: nearest word boundary around 80 chars. */
  const cut = trimmed.lastIndexOf(" ", 80);
  if (cut > 30) {
    return [trimmed.slice(0, cut).trim(), trimmed.slice(cut).trim()];
  }
  return [trimmed, ""];
};

/**
 * CaptionBlock — image caption with smart typographic split.
 *
 * Short captions (≤ ~90 characters) render as mono small-caps, the
 * traditional caption treatment. Long captions split on the first
 * sentence boundary: the first sentence becomes a short mono label,
 * everything after becomes light body prose. This stops the eye from
 * trying to read 60-word paragraphs in 12px mono.
 *
 * Use after any figure inside a case study. Adapts to default / warm /
 * dark surfaces.
 */
export const CaptionBlock = ({
  caption,
  variant = "default",
  className,
}: CaptionBlockProps) => {
  if (!caption) return null;
  const [label, body] = split(caption);

  return (
    <figcaption className={`mt-3 ${className ?? ""}`}>
      <p
        className={`text-[12px] font-mono tracking-[0.04em] ${labelColor[variant]}`}
      >
        {label}
      </p>
      {body && (
        <p
          className={`mt-3 text-[14px] sm:text-[15px] font-sans font-light leading-[1.7] max-w-[620px] ${bodyColor[variant]}`}
        >
          {body}
        </p>
      )}
    </figcaption>
  );
};
