import * as React from "react";
import { ArrowUpRight } from "lucide-react";

export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface LinkStackProps {
  title?: string;
  links: LinkItem[];
}

/**
 * LinkStack — a vertical stack of understated links, each with a small
 * arrow glyph. Used in the footer and the About section.
 */
export const LinkStack = ({ title, links }: LinkStackProps) => (
  <div className="flex flex-col gap-3">
    {title && (
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1">
        {title}
      </p>
    )}
    <ul className="flex flex-col gap-2">
      {links.map((l, i) => (
        <li key={i}>
          <a
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            className="group inline-flex items-center gap-2 text-[14px] text-foreground hover:text-foreground/70 transition-colors"
          >
            <span>{l.label}</span>
            <ArrowUpRight
              size={13}
              className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </li>
      ))}
    </ul>
  </div>
);
