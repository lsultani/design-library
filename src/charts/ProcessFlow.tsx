import * as React from "react";
import { useEffect, useState } from "react";

/**
 * ProcessFlow — horizontal flow diagram with labeled boxes and arrows.
 * Shows a "Traditional" vs "AI-Native" process comparison.
 *
 * From Article 09 (Slide 06 — SHIFT 02: INVERSION). The traditional
 * sequence (User → Problem → Solution → Prototype → Tech) flips to
 * an AI-native sequence (Capability → Prototype → User → Experience
 * → Refine). One box can be highlighted (e.g. red outline on "Tech"
 * to show it moving from last to first).
 */

export interface ProcessStep {
  label: string;
  /** Highlight this step with a distinct color. */
  highlight?: boolean;
}

export interface ProcessFlowRow {
  /** Row label (e.g. "Traditional", "AI-Native"). */
  title: string;
  /** Annotation on the right side (e.g. "Tech last", "Capability first"). */
  annotation?: string;
  steps: ProcessStep[];
}

export interface ProcessFlowProps {
  rows: ProcessFlowRow[];
  /** Footer text below the diagram. */
  caption?: string;
  /** Auto-play the staggered reveal. */
  autoPlay?: boolean;
}

const DEFAULT_ROWS: ProcessFlowRow[] = [
  {
    title: "Traditional",
    annotation: "Tech last",
    steps: [
      { label: "User" },
      { label: "Problem" },
      { label: "Solution" },
      { label: "Prototype" },
      { label: "Tech", highlight: true },
    ],
  },
  {
    title: "AI-Native",
    annotation: "Capability first",
    steps: [
      { label: "Capability" },
      { label: "Prototype" },
      { label: "User" },
      { label: "Experience" },
      { label: "Refine" },
    ],
  },
];

export const ProcessFlow = ({
  rows = DEFAULT_ROWS,
  caption = "Capability moves from last to first.",
  autoPlay = true,
}: ProcessFlowProps) => {
  const [visible, setVisible] = useState(!autoPlay);

  useEffect(() => {
    if (!autoPlay) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [autoPlay]);

  return (
    <div className="w-full max-w-[720px]">
      <div className="flex flex-col gap-10">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${ri * 300}ms`,
            }}
          >
            {/* Row header */}
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                {row.title}
              </span>
              {row.annotation && (
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                  {row.annotation}
                </span>
              )}
            </div>

            {/* Steps with arrows */}
            <div className="flex items-center gap-2">
              {row.steps.map((step, si) => (
                <React.Fragment key={si}>
                  <div
                    className="flex-1 h-12 flex items-center justify-center border transition-all duration-500"
                    style={{
                      borderColor: step.highlight
                        ? "hsl(0, 72%, 51%)"
                        : "hsl(var(--foreground) / 0.25)",
                      color: step.highlight
                        ? "hsl(0, 72%, 51%)"
                        : "hsl(var(--foreground))",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "scaleX(1)" : "scaleX(0.8)",
                      transitionDelay: `${ri * 300 + si * 80}ms`,
                    }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-medium">
                      {step.label}
                    </span>
                  </div>
                  {si < row.steps.length - 1 && (
                    <svg
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      className="shrink-0 text-foreground/40"
                      style={{
                        opacity: visible ? 1 : 0,
                        transitionDelay: `${ri * 300 + si * 80 + 40}ms`,
                        transition: "opacity 400ms",
                      }}
                    >
                      <path
                        d="M0 6h12M9 2l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {caption && (
        <p
          className="mt-8 text-[15px] text-foreground/70 font-medium transition-opacity duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: `${rows.length * 300 + 200}ms`,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
};
