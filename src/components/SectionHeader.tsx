import * as React from "react";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}

/**
 * SectionHeader — the consistent heading for major site sections.
 * Mono eyebrow → section title → optional lead paragraph.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  lead,
  align = "left",
}: SectionHeaderProps) => (
  <header className={align === "center" ? "text-center" : "text-left"}>
    {eyebrow && (
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60 mb-4">
        {eyebrow}
      </p>
    )}
    <h2 className="text-section font-medium tracking-[-0.02em] text-foreground">
      {title}
    </h2>
    {lead && (
      <p className="mt-4 text-body-lg text-muted-foreground max-w-[60ch]">
        {lead}
      </p>
    )}
  </header>
);
