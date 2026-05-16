import * as React from "react";

export interface SectionProgressProps {
  /** Section indices to render (e.g. [1, 2, 3, 4, 5]). */
  sections: number[];
  /** Index currently in view. `null` = no slot highlighted. */
  activeIndex?: number | null;
  /** Click handler — receives the section index. */
  onJump?: (index: number) => void;
  /** Optional className override on the outer card. */
  className?: string;
}

/**
 * SectionProgress — flat right-edge scroll indicator for case study pages.
 *
 * Visual
 * ------
 * Swiss editorial vocabulary: a thin rectangular card, hairline border,
 * no shadow, no rounded corners, no backdrop blur. Inside, mono numerals
 * stacked vertically. The numeral whose section is currently in view
 * sits at full foreground opacity with a 2px hairline rule on its LEFT
 * edge — that rule is the "you are here" marker that slides as the
 * reader scrolls. Inactive numerals sit at /30 opacity, hover /70.
 *
 * The card carries a near-white fill (HSL 0 0% 98%) so it stays legible
 * on every case-study surface (default light gray, warm cream, dark
 * near-black) via crisp edge + tonal contrast.
 *
 * Production behavior (lives in the site, not in this component)
 * --------------------------------------------------------------
 * - **Visibility**: the pill appears once section 01's top reaches
 *   the viewport. Before that (hero) it stays hidden.
 * - **Active row**: driven by an IntersectionObserver against numbered
 *   `<section data-cs-section="N">` elements. The section with the
 *   highest intersection ratio wins. In the back-to-homepage zone
 *   (past the last section, before the global Footer) no row is
 *   active — all numerals sit gray.
 * - **Positioning**: pinned to the viewport bottom by default. When
 *   the case-study footer nav (prev/next + progress dots, marked with
 *   `data-cs-footer-nav`) scrolls into view, the pill detaches from
 *   the viewport-bottom anchor and dynamically centers itself in the
 *   zone between that nav's bottom edge and the global `<footer>`'s
 *   top edge. It never overlaps either.
 * - **Portal**: rendered through `React.createPortal(card, document.body)`
 *   so any `transform` on an ancestor doesn't turn it into the
 *   containing block for fixed positioning. This is the fix for the
 *   "it scrolls with the page" bug.
 *
 * This component is the pure-presentational shell — pass in the
 * sections list, the currently active index, and a click handler.
 * Stories exercise its visual states; the production wiring is in
 * SectionProgress.tsx inside the site repo.
 *
 * Design-system note: radius 0 everywhere — this is NOT a radius
 * exception (the earlier pill prototype was, but the Swiss-flat
 * redesign brought the card back into the default radius rule).
 */
export const SectionProgress = ({
  sections,
  activeIndex,
  onJump,
  className,
}: SectionProgressProps) => {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Section progress"
      className={`
        flex flex-col items-stretch gap-1
        bg-[hsl(0_0%_98%)]
        border border-foreground/30
        px-3 py-3
        ${className ?? ""}
      `}
    >
      {sections.map((index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onJump?.(index)}
            aria-label={`Jump to section ${String(index).padStart(2, "0")}`}
            aria-current={isActive ? "true" : undefined}
            className="relative flex items-center min-w-[44px] py-1.5 pl-3 group"
          >
            {/* Active marker — thin 2px hairline rule on the left edge of
                the active row. Bauhaus / Swiss index-mark vocabulary. */}
            <span
              aria-hidden="true"
              className={`
                absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-foreground
                transition-opacity duration-300
                ${isActive ? "opacity-100" : "opacity-0"}
              `}
            />
            <span
              className={`
                font-mono text-[11px] tracking-[0.15em]
                transition-colors duration-300
                ${
                  isActive
                    ? "text-foreground"
                    : "text-foreground/30 group-hover:text-foreground/70"
                }
              `}
            >
              {String(index).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
