import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const COLS = 8;
const ROWS = 6;
const TOTAL = COLS * ROWS;
const TILE_DURATION = 400; // ms, matches production
const STAGGER_BASE = 30; // ms

export type PageTransitionPattern =
  | "radial"
  | "mirror"
  | "wave"
  | "scatter"
  | "staircase"
  | "diagonal";

type PatternFn = (col: number, row: number, cols: number, rows: number) => number;

const patternDiagonal: PatternFn = (col, row, cols, rows) =>
  (col + row) / (cols + rows - 2);

const patternRadial: PatternFn = (col, row, cols, rows) => {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  return (
    Math.sqrt((col - cx) ** 2 + (row - cy) ** 2) /
    Math.sqrt(cx ** 2 + cy ** 2)
  );
};

const patternMirror: PatternFn = (col, row, cols, rows) => {
  const cx = (cols - 1) / 2;
  return Math.abs(col - cx) / cx + row / (rows * 6);
};

const patternWave: PatternFn = (col, row, cols, rows) => {
  const colProgress = col / (cols - 1);
  const sineOffset = Math.sin((row / (rows - 1)) * Math.PI) * 0.3;
  return Math.max(0, Math.min(1, colProgress * 0.7 + sineOffset));
};

const patternScatter: PatternFn = (col, row) => {
  const hash = ((col * 7 + row * 13 + col * row * 3) * 2654435761) >>> 0;
  return (hash % 1000) / 1000;
};

const patternStaircase: PatternFn = (col, row, cols, rows) =>
  (col / (cols - 1)) * 0.65 + (row / (rows - 1)) * 0.35;

const PATTERN_MAP: Record<PageTransitionPattern, PatternFn> = {
  radial: patternRadial,
  mirror: patternMirror,
  wave: patternWave,
  scatter: patternScatter,
  staircase: patternStaircase,
  diagonal: patternDiagonal,
};

function computeDelays(pattern: PatternFn): { inDelays: number[]; outDelays: number[] } {
  const raw: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      raw.push(pattern(c, r, COLS, ROWS));
    }
  }
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const range = max - min || 1;
  const normalized = raw.map((v) => (v - min) / range);
  const maxStagger = TOTAL * STAGGER_BASE * 0.35;
  return {
    inDelays: normalized.map((n) => n * maxStagger),
    outDelays: normalized.map((n) => (1 - n) * maxStagger),
  };
}

type Phase = "idle" | "closing" | "hold" | "opening";

export interface PageTransitionProps {
  /** Which staging pattern to use. */
  pattern?: PageTransitionPattern;
  /** Tile color — defaults to foreground (the black ink of the site). */
  tileColor?: string;
  /** Auto-run the animation on mount. */
  autoPlay?: boolean;
}

/**
 * PageTransition — simplified version of the production tile-grid
 * transition. In the main site each route change swaps one page for
 * another using a choreographed 8×6 grid of tiles. Here in the library
 * we strip the router and run the choreography in a loop: tiles
 * CLOSE (scale in) over the canvas, hold for a beat, then OPEN
 * (scale out) to reveal the "new" page.
 *
 * Each pattern stages the tiles differently — radial, mirror, wave,
 * scatter, staircase, diagonal — but they all drive the same per-tile
 * `--delay` CSS variable.
 */
export const PageTransition = ({
  pattern = "radial",
  tileColor = "hsl(var(--foreground))",
  autoPlay = true,
}: PageTransitionProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState(0);

  const { inDelays, outDelays } = useMemo(
    () => computeDelays(PATTERN_MAP[pattern]),
    [pattern],
  );

  const maxInDelay = useMemo(() => Math.max(...inDelays), [inDelays]);
  const maxOutDelay = useMemo(() => Math.max(...outDelays), [outDelays]);

  const run = useCallback(() => {
    setPhase("closing");
  }, []);

  // Phase driver
  useEffect(() => {
    if (phase === "idle") return;
    if (phase === "closing") {
      const t = window.setTimeout(
        () => setPhase("hold"),
        maxInDelay + TILE_DURATION,
      );
      return () => window.clearTimeout(t);
    }
    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("opening"), 450);
      return () => window.clearTimeout(t);
    }
    if (phase === "opening") {
      const t = window.setTimeout(
        () => setPhase("idle"),
        maxOutDelay + TILE_DURATION,
      );
      return () => window.clearTimeout(t);
    }
  }, [phase, maxInDelay, maxOutDelay]);

  // Auto-play once per run
  useEffect(() => {
    if (!autoPlay) return;
    const t = window.setTimeout(run, 200);
    return () => window.clearTimeout(t);
  }, [autoPlay, runId, run]);

  const isClosing = phase === "closing" || phase === "hold";
  const isOpening = phase === "opening";
  const visible = phase !== "idle";

  const tiles = useMemo(() => {
    const out = [] as { col: number; row: number; inDelay: number; outDelay: number }[];
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({
          col: c,
          row: r,
          inDelay: inDelays[i],
          outDelay: outDelays[i],
        });
        i++;
      }
    }
    return out;
  }, [inDelays, outDelays]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stage */}
      <div
        className="relative w-full max-w-3xl overflow-hidden border border-foreground/10"
        style={{ aspectRatio: "16 / 9", backgroundColor: "hsl(var(--background))" }}
      >
        {/* Underlying "page" — just a label so you can see the reveal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
              Pattern
            </div>
            <div className="text-3xl font-medium tracking-tight">
              {pattern}
            </div>
          </div>
        </div>

        {/* Tile grid overlay */}
        {visible && (
          <div
            key={runId}
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {tiles.map((tile, i) => {
              const delay = isOpening ? tile.outDelay : tile.inDelay;
              const className = isOpening ? "pt-tile-out" : "pt-tile";
              return (
                <div
                  key={i}
                  className={className}
                  style={
                    {
                      backgroundColor: tileColor,
                      ["--delay"]: `${delay}ms`,
                      ["--tile-duration"]: `${TILE_DURATION}ms`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => setRunId((k) => k + 1)}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
      >
        Replay
      </button>
    </div>
  );
};

export default PageTransition;
