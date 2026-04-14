import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** Use ease-out-expo (matches the token) */
  easing?: (t: number) => number;
  className?: string;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * CountUp — animates from 0 → target when scrolled into view.
 * Uses the ease-out-expo curve that the rest of the site uses.
 */
export const CountUp = ({
  to,
  duration = 1400,
  suffix = "",
  prefix = "",
  decimals = 0,
  easing = easeOutExpo,
  className = "",
}: CountUpProps) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const tick = (t: number) => {
            if (!start) start = t;
            const progress = Math.min(1, (t - start) / duration);
            setValue(to * easing(progress));
            if (progress < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, easing]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
