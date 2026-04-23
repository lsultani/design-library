import * as React from "react";
import { useEffect, useState } from "react";

/**
 * CompressionChart — animated horizontal bar comparison showing
 * "Old Process" → "Compressed Only" → "Compressed + Reinvested."
 *
 * From Article 09 (Slide 04 — SHIFT 01: COMPRESSION). The original
 * blocks shrink to show time savings, then new blocks appear to show
 * how teams reinvest the reclaimed time.
 *
 * Plays automatically on mount with staggered reveals. Hit Replay
 * in the Storybook story to re-run.
 */

export interface CompressionChartProps {
  /** Labels for the original process phases (default 4). */
  phases?: string[];
  /** Labels for the reinvested activities. */
  reinvested?: string[];
  /** Auto-play the staged animation on mount. */
  autoPlay?: boolean;
}

const DEFAULT_PHASES = ["Research", "Design", "Build", "Test"];
const DEFAULT_REINVESTED = ["Framing", "User obs.", "Judgment"];

export const CompressionChart = ({
  phases = DEFAULT_PHASES,
  reinvested = DEFAULT_REINVESTED,
  autoPlay = true,
}: CompressionChartProps) => {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!autoPlay && runId === 0) return;
    setStage(0);
    const t1 = window.setTimeout(() => setStage(1), 400);
    const t2 = window.setTimeout(() => setStage(2), 1600);
    const t3 = window.setTimeout(() => setStage(3), 2800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [runId, autoPlay]);

  const phaseCount = phases.length;
  const reinvestedCount = reinvested.length;
  const totalSlots = phaseCount + reinvestedCount;

  return (
    <div className="w-full max-w-[640px]">
      {/* Row 1: Old Process */}
      <div
        className="mb-10 transition-opacity duration-700"
        style={{ opacity: stage >= 1 ? 1 : 0 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
          Old Process
        </p>
        <div className="flex gap-[2px]">
          {phases.map((label, i) => (
            <div
              key={i}
              className="h-10 bg-foreground flex items-center justify-center transition-all duration-700"
              style={{
                flex: `1 1 ${100 / phaseCount}%`,
                transitionDelay: `${i * 80}ms`,
                opacity: stage >= 1 ? 1 : 0,
                transform: stage >= 1 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
              }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-background/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Compressed Only */}
      <div
        className="mb-10 transition-opacity duration-700"
        style={{ opacity: stage >= 2 ? 1 : 0 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
          Compressed Only
        </p>
        <div className="flex gap-[2px]">
          {phases.map((label, i) => (
            <div
              key={i}
              className="h-10 bg-foreground flex items-center justify-center transition-all duration-700"
              style={{
                flex: `1 1 ${100 / totalSlots}%`,
                transitionDelay: `${i * 80}ms`,
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
              }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-background/70">
                {label}
              </span>
            </div>
          ))}
          <div
            className="h-10 border border-foreground/20 flex items-center justify-center transition-all duration-700"
            style={{
              flex: `1 1 ${(reinvestedCount / totalSlots) * 100}%`,
              opacity: stage >= 2 ? 1 : 0,
            }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/40">
              Time left on the table
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Compressed + Reinvested */}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: stage >= 3 ? 1 : 0 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
          Compressed + Reinvested
        </p>
        <div className="flex gap-[2px]">
          {phases.map((label, i) => (
            <div
              key={`p-${i}`}
              className="h-10 bg-foreground flex items-center justify-center transition-all duration-700"
              style={{
                flex: `1 1 ${100 / totalSlots}%`,
                transitionDelay: `${i * 80}ms`,
                opacity: stage >= 3 ? 1 : 0,
                transform: stage >= 3 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
              }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-background/70">
                {label}
              </span>
            </div>
          ))}
          {reinvested.map((label, i) => (
            <div
              key={`r-${i}`}
              className="h-10 bg-foreground/80 flex items-center justify-center transition-all duration-700"
              style={{
                flex: `1 1 ${100 / totalSlots}%`,
                transitionDelay: `${(phaseCount + i) * 80 + 200}ms`,
                opacity: stage >= 3 ? 1 : 0,
                transform: stage >= 3 ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
              }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-background/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
