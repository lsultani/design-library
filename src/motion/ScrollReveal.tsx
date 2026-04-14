import * as React from "react";
import { useEffect, useRef, useState } from "react";

export type RevealVariant = "fade-up" | "slide-left" | "scale-up";

export interface ScrollRevealProps {
  variant?: RevealVariant;
  threshold?: number;
  children: React.ReactNode;
  /**
   * For Storybook demo — play immediately instead of waiting for
   * intersection observer. Useful in docs pages where elements
   * are already on screen.
   */
  playOnMount?: boolean;
}

/**
 * ScrollReveal — wrap any content to get the site's standard
 * scroll-triggered animation. Variants match the CSS classes in
 * the main site's index.css.
 */
export const ScrollReveal = ({
  variant = "fade-up",
  threshold = 0.15,
  children,
  playOnMount = false,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(playOnMount);

  useEffect(() => {
    if (playOnMount) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, playOnMount]);

  const classMap: Record<RevealVariant, string> = {
    "fade-up": "reveal-fade-up",
    "slide-left": "reveal-slide-left",
    "scale-up": "reveal-scale-up",
  };

  return (
    <div
      ref={ref}
      className={`${classMap[variant]} ${inView ? "in-view" : ""}`.trim()}
    >
      {children}
    </div>
  );
};
