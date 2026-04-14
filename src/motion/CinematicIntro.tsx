import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const SENTENCE = "I design the human layer of complex systems";

/*
 * CinematicIntro — full storyboard of the home-page intro.
 *
 * STORYBOARD
 * ----------
 *   1. CURSOR   Black background. Name outlined. Cursor blinks alone.
 *   2. TYPING   Sentence types out character-by-character.
 *   3. HOLD     Two calm blinks.
 *   4. SPARK    Cursor catches fire. Flickers, widens, embers radiate.
 *               Fires `intro-ignite` on window so a sibling ParticleField
 *               can burst its 3D shapes in sync.
 *   5. BURST    Light fills the name, blinds, inverts bg to light.
 *   6. DONE     Rests in the final state. Click Replay to re-run.
 *
 * MODES
 * -----
 *   default    renders its own 16:9 stage + black background + Replay button.
 *   overlay    renders just the text layer inside the caller's stage — no
 *              background, no Replay. Use this when stacking the intro on
 *              top of ParticleField. The caller drives replay via `runKey`.
 */

type Phase = "cursor" | "typing" | "hold" | "spark" | "burst" | "done";

export interface CinematicIntroProps {
  /** Render as a transparent overlay inside a caller-owned stage. */
  overlay?: boolean;
  /** Bump this to re-run the storyboard from the outside. */
  runKey?: number;
}

export const CinematicIntro = ({
  overlay = false,
  runKey = 0,
}: CinematicIntroProps = {}) => {
  const [phase, setPhase] = useState<Phase>("cursor");
  const [charIndex, setCharIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const embers = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      angle: `${(i / 28) * 360 + (Math.random() - 0.5) * 40}deg`,
      dist: `${20 + Math.random() * 60}px`,
      size: `${1 + Math.random() * 2}px`,
      delay: `${i * 0.04 + Math.random() * 0.2}s`,
      duration: `${0.4 + Math.random() * 0.6}s`,
    }));
    // embers regenerate on every run (internal replay or external key bump)
  }, [runId, runKey]);

  // Reset on replay (internal runId OR external runKey)
  useEffect(() => {
    setPhase("cursor");
    setCharIndex(0);
  }, [runId, runKey]);

  // 1 → 2: cursor blink, then start typing
  useEffect(() => {
    if (phase !== "cursor") return;
    const t = window.setTimeout(() => setPhase("typing"), 900);
    return () => window.clearTimeout(t);
  }, [phase, runId, runKey]);

  // 2: typing
  useEffect(() => {
    if (phase !== "typing") return;
    intervalRef.current = window.setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= SENTENCE.length - 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          window.setTimeout(() => setPhase("hold"), 100);
          return SENTENCE.length;
        }
        return prev + 1;
      });
    }, 55);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  // 3 → 4: hold, then spark
  useEffect(() => {
    if (phase !== "hold") return;
    const t = window.setTimeout(() => setPhase("spark"), 1200);
    return () => window.clearTimeout(t);
  }, [phase]);

  // 4 → 5: spark, then burst. Also fires `intro-ignite` so a sibling
  // ParticleField can burst its shapes at the same instant.
  useEffect(() => {
    if (phase !== "spark") return;
    window.dispatchEvent(new CustomEvent("intro-ignite"));
    const t = window.setTimeout(() => setPhase("burst"), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  // 5 → 6: burst then done. Also fires `intro-burst` so a caller hosting
  // the overlay can flip its own stage background in sync.
  useEffect(() => {
    if (phase !== "burst") return;
    window.dispatchEvent(new CustomEvent("intro-burst"));
    const t = window.setTimeout(() => setPhase("done"), 2200);
    return () => window.clearTimeout(t);
  }, [phase]);

  const isBurst = phase === "burst" || phase === "done";
  const showCursor =
    phase === "cursor" ||
    phase === "typing" ||
    phase === "hold" ||
    phase === "spark";
  const showTypedText = phase !== "cursor";

  const textLayer = (
    <div className="flex flex-col items-center gap-3">
      {/* NAME */}
      <span
        className={`block intro-name-line ${
          isBurst ? "intro-name-burst" : "intro-name-outlined"
        }`}
        style={{ position: "relative" }}
      >
        Leslie Sultani
      </span>

      {/* SENTENCE + CURSOR */}
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "2.2em" }}
      >
        {/* invisible ghost to reserve width — prevents layout shift while typing */}
        <span
          className="intro-sentence"
          style={{ visibility: "hidden", position: "absolute" }}
          aria-hidden="true"
        >
          {SENTENCE}
        </span>

        <span
          className={`intro-sentence ${isBurst ? "intro-sentence-burst" : ""}`}
          style={{
            color: isBurst ? undefined : "hsl(var(--primary-foreground))",
          }}
        >
          {showTypedText ? SENTENCE.slice(0, charIndex) : ""}
        </span>

        {showCursor && (
          <span
            className={
              phase === "spark"
                ? "intro-cursor intro-cursor-spark"
                : "intro-cursor"
            }
            style={{ position: "relative" }}
          >
            {phase === "spark" && (
              <span className="intro-ember-origin">
                {embers.map((e, i) => (
                  <span
                    key={i}
                    className="intro-ember"
                    style={
                      {
                        ["--ember-angle"]: e.angle,
                        ["--ember-dist"]: e.dist,
                        ["--ember-size"]: e.size,
                        ["--ember-delay"]: e.delay,
                        ["--ember-duration"]: e.duration,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );

  // Overlay mode — text layer only, transparent, for stacking on top of
  // another layer (e.g. ParticleField). Caller owns the stage + Replay.
  if (overlay) {
    return (
      <div
        key={`${runId}-${runKey}`}
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{ pointerEvents: "none" }}
      >
        {textLayer}
      </div>
    );
  }

  // Default mode — self-contained stage + bg + Replay button
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        key={runId}
        className="relative w-full max-w-3xl overflow-hidden rounded-[2px]"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* Background layer — starts black, bursts to light */}
        <div
          className={`absolute inset-0 ${isBurst ? "intro-bg-burst" : ""}`}
          style={{ backgroundColor: "hsl(var(--foreground))" }}
        />

        {/* Text stage */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          {textLayer}
        </div>
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
