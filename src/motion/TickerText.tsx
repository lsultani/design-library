import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * TickerText — scramble-to-reveal text animation for eyebrow labels.
 * Each character starts as a random glyph and cycles through several
 * random characters before settling on the correct letter, resolving
 * left-to-right with a stagger. Used on article promo slides for
 * section tags like "/ FIELD OBSERVATION" and nav labels like
 * "THE DEBATE."
 *
 * The effect is sometimes called "decode text", "hacker text", or
 * "scramble reveal." Characters are drawn from a mono-spaced glyph
 * set so the width stays stable during the scramble.
 */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+-_/.,";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export interface TickerTextProps {
  /** The final text to resolve to. */
  text: string;
  /** How many random characters each position cycles through before resolving. */
  iterations?: number;
  /** Milliseconds between each tick (frame). */
  frameRate?: number;
  /** Delay before the scramble starts (ms). */
  startDelay?: number;
  /** Play immediately instead of waiting for IntersectionObserver. */
  playOnMount?: boolean;
  /** IntersectionObserver threshold. */
  threshold?: number;
  className?: string;
}

export const TickerText = ({
  text,
  iterations = 6,
  frameRate = 35,
  startDelay = 200,
  playOnMount = false,
  threshold = 0.15,
  className,
}: TickerTextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [triggered, setTriggered] = useState(false);
  const [display, setDisplay] = useState(
    text
      .split("")
      .map((ch) => (ch === " " ? " " : randomChar()))
      .join(""),
  );
  const frameRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Trigger via IntersectionObserver or playOnMount
  useEffect(() => {
    if (playOnMount) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setTriggered(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setTriggered(true);
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, playOnMount]);

  const tick = useCallback(() => {
    frameRef.current++;
    const frame = frameRef.current;

    const result = text.split("").map((targetChar, i) => {
      if (targetChar === " ") return " ";

      // This position resolves after (i * 1) + iterations frames
      const resolveAt = i + iterations;

      if (frame >= resolveAt) {
        return targetChar;
      }
      return randomChar();
    });

    setDisplay(result.join(""));

    // Stop when all characters are resolved
    const lastResolve = text.length - 1 + iterations;
    if (frame >= lastResolve) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplay(text);
    }
  }, [text, iterations]);

  // Start scramble after trigger + delay
  useEffect(() => {
    if (!triggered) return;

    // Reset for replay
    frameRef.current = 0;
    setDisplay(
      text
        .split("")
        .map((ch) => (ch === " " ? " " : randomChar()))
        .join(""),
    );

    const delayTimer = window.setTimeout(() => {
      intervalRef.current = window.setInterval(tick, frameRate);
    }, startDelay);

    return () => {
      window.clearTimeout(delayTimer);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [triggered, startDelay, frameRate, tick, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};
