import * as React from "react";

export interface MetaItem {
  label: string;
  value: string;
}

export interface MetaBlockProps {
  items: MetaItem[];
}

/**
 * MetaBlock — mono uppercase label on top, sentence-case value below.
 * Used for project meta (role, timeline, team, scope) and page metadata.
 */
export const MetaBlock = ({ items }: MetaBlockProps) => (
  <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
    {items.map((it) => (
      <div key={it.label} className="flex flex-col gap-1">
        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
          {it.label}
        </dt>
        <dd className="text-[14px] text-foreground leading-snug">{it.value}</dd>
      </div>
    ))}
  </dl>
);
