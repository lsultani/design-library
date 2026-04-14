import * as React from "react";

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

/**
 * Timeline — vertical timeline with 1px spine. Mono dates, sans-case titles.
 * Used for project milestones and career history.
 */
export const Timeline = ({ items }: TimelineProps) => (
  <ol className="relative flex flex-col gap-10 border-l border-foreground/15 pl-8">
    {items.map((it, i) => (
      <li key={i} className="relative">
        <span className="absolute -left-[33px] top-1.5 h-2 w-2 rounded-full bg-foreground" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
          {it.date}
        </p>
        <h4 className="mt-1 text-[17px] font-medium text-foreground">{it.title}</h4>
        {it.description && (
          <p className="mt-2 text-[14px] text-muted-foreground max-w-[60ch]">
            {it.description}
          </p>
        )}
      </li>
    ))}
  </ol>
);
