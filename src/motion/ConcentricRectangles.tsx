import { useCallback, useEffect, useRef } from "react";

/**
 * ConcentricRectangles — nested rectangles that pulse inward toward
 * a vanishing point. Used as a background graphic on article slides
 * (e.g. "Compression isn't the goal" in Article 09).
 *
 * Each rectangle is slightly smaller and offset toward the center,
 * with staggered opacity pulsing that creates a "receding tunnel"
 * effect. Runs on `requestAnimationFrame` + `ResizeObserver` like
 * the other canvas-based motion components.
 */

export interface ConcentricRectanglesProps {
  /** Number of nested rectangles. */
  layers?: number;
  /** Stroke color — defaults to white for dark backgrounds. */
  strokeColor?: string;
  /** Base stroke opacity (0–1). */
  baseOpacity?: number;
  /** Speed multiplier for the pulsing animation. */
  speed?: number;
  className?: string;
}

export const ConcentricRectangles = ({
  layers = 8,
  strokeColor = "255,255,255",
  baseOpacity = 0.25,
  speed = 1,
  className,
}: ConcentricRectanglesProps) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  const containerRef = useCallback(
    (container: HTMLDivElement | null) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!container) return;

      let canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.style.display = "block";
        container.appendChild(canvas);
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let cw = 0;
      let ch = 0;
      let alive = true;

      const applySize = (width: number, height: number) => {
        const dpr = window.devicePixelRatio || 1;
        cw = width;
        ch = height;
        canvas!.width = width * dpr;
        canvas!.height = height * dpr;
        canvas!.style.width = width + "px";
        canvas!.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) applySize(width, height);
        }
      });
      ro.observe(container);

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

      const start = performance.now();
      let animId = 0;

      const render = () => {
        if (!alive) return;
        if (cw > 0 && ch > 0) {
          ctx.clearRect(0, 0, cw, ch);
          const t = ((performance.now() - start) / 1000) * speed;

          const cx = cw * 0.55;
          const cy = ch * 0.5;
          const maxW = cw * 0.85;
          const maxH = ch * 0.85;

          for (let i = 0; i < layers; i++) {
            const progress = (i + 1) / (layers + 1);
            const w = maxW * (1 - progress * 0.85);
            const h = maxH * (1 - progress * 0.85);

            // Staggered pulse — each layer breathes at a slightly offset phase
            const pulse = Math.sin(t * 1.2 + i * 0.5) * 0.5 + 0.5;
            const alpha = baseOpacity * (0.3 + pulse * 0.7) * (1 - progress * 0.4);

            const x = cx - w / 2;
            const y = cy - h / 2;

            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.strokeStyle = `rgba(${strokeColor},${alpha})`;
            ctx.lineWidth = Math.max(0.5, 1.2 - progress * 0.8);
            ctx.stroke();
          }
        }
        animId = requestAnimationFrame(render);
      };
      animId = requestAnimationFrame(render);

      cleanupRef.current = () => {
        alive = false;
        cancelAnimationFrame(animId);
        ro.disconnect();
      };
    },
    [layers, strokeColor, baseOpacity, speed],
  );

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
