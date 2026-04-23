import * as React from "react";
import { useEffect, useState } from "react";

/**
 * GanttTimeline — multi-track Gantt-style chart with animated bars.
 * Shows parallel workstreams across a shared timeline (T0 → T1).
 *
 * From Article 09 (Slide 07 — SHIFT 03: PARALLELIZATION). Tracks
 * for Research, Design, Engineering, Testing, and AI Agent show
 * overlapping activity blocks that animate their width to convey
 * "the handoff disappears."
 *
 * Each track can have multiple segments (active periods) defined
 * by start/end positions (0–1 representing the T0–T1 span).
 */

export interface GanttSegment {
  /** Start position as 0–1 fraction of the timeline. */
  start: number;
  /** End position as 0–1 fraction of the timeline. */
  end: number;
}

export interface GanttTrack {
  label: string;
  segments: GanttSegment[];
}

export interface GanttTimelineProps {
  tracks?: GanttTrack[];
  /** Footer text below the chart. */
  caption?: string;
  /** Auto-play the reveal animation. */
  autoPlay?: boolean;
}

const DEFAULT_TRACKS: GanttTrack[] = [
  {
    label: "Research",
    segments: [
      { start: 0, end: 0.35 },
      { start: 0.55, end: 0.75 },
    ],
  },
  {
    label: "Design",
    segments: [{ start: 0.08, end: 0.8 }],
  },
  {
    label: "Engineering",
    segments: [{ start: 0.2, end: 0.95 }],
  },
  {
    label: "Testing",
    segments: [
      { start: 0.15, end: 0.4 },
      { start: 0.5, end: 0.7 },
      { start: 0.8, end: 0.95 },
    ],
  },
  {
    label: "AI Agent",
    segments: [{ start: 0.05, end: 0.88 }],
  },
];

export const GanttTimeline = ({
  tracks = DEFAULT_TRACKS,
  caption = "The handoff disappears.",
  autoPlay = true,
}: GanttTimelineProps) => {
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
      {/* Timeline header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          T0
        </span>
        <div className="flex-1 mx-3 h-px bg-foreground/15" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          T1
        </span>
      </div>

      {/* Tracks */}
      <div className="flex flex-col gap-3">
        {tracks.map((track, ti) => (
          <div key={ti} className="flex items-center gap-4">
            {/* Track label */}
            <span
              className="w-[100px] shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/60 text-right transition-opacity duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transitionDelay: `${ti * 100}ms`,
              }}
            >
              {track.label}
            </span>

            {/* Track bar area */}
            <div className="flex-1 relative h-6 bg-foreground/[0.04] border-b border-foreground/10">
              {track.segments.map((seg, si) => (
                <div
                  key={si}
                  className="absolute top-0 bottom-0 bg-foreground transition-all duration-1000"
                  style={{
                    left: `${seg.start * 100}%`,
                    width: visible ? `${(seg.end - seg.start) * 100}%` : "0%",
                    transitionDelay: `${ti * 100 + si * 60 + 200}ms`,
                    transitionTimingFunction:
                      "var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1))",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
          Time
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">
          Shared artifact
        </span>
      </div>

      {caption && (
        <p
          className="mt-8 text-[17px] text-foreground font-medium transition-opacity duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: `${tracks.length * 100 + 600}ms`,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
};
