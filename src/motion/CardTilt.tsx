import * as React from "react";
import { useState, useRef } from "react";

export interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. Default 4 — the line between
   *  physical and gimmick. */
  maxRotate?: number;
  /** Peak glare opacity at full hover. 0 = no glare, 1 = harsh.
   *  Default 0.22 (premium-subtle). */
  glareIntensity?: number;
  /** Set to false to disable the glare overlay entirely while keeping
   *  the tilt. Default true. */
  glare?: boolean;
}

/**
 * CardTilt — 3D hover tilt with cursor-tracked glare reflection.
 *
 * Tilts the wrapped element a few degrees in response to cursor
 * position (max 4° by default), and lays a translucent radial-gradient
 * highlight on top that tracks the cursor exactly. The glare fades in
 * on mouseenter and out on mouseleave, blended with `soft-light` so it
 * reads as light grazing a semi-glossy surface rather than a painted
 * spot.
 *
 * How the mouse → visual path works
 * ---------------------------------
 * Cursor position flows through CSS custom properties (`--glare-x`,
 * `--glare-y`) set directly on the inner DOM node, so the glare moves
 * at 60fps without triggering React re-renders. Rotation still updates
 * React state — the 0.35s transform transition smooths it out.
 *
 * Surface assumptions
 * -------------------
 * Children own their own background, padding, and border-radius. The
 * glare overlay sits on top, blended, with `pointer-events: none` so
 * it never intercepts clicks. Spillover onto transparent areas (e.g.
 * around rounded corners) vanishes thanks to the blend mode — soft-
 * light + transparent = no visual contribution.
 */
export const CardTilt = ({
  children,
  className = "",
  maxRotate = 4,
  glareIntensity = 0.22,
  glare = true,
}: CardTiltProps) => {
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const innerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={className}
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setRy(-nx * maxRotate * 2);
        setRx(ny * maxRotate);

        if (glare && innerRef.current) {
          // CSS custom properties — repainting the gradient at the
          // cursor position is a compositor-friendly operation and
          // doesn't trigger React reconciliation.
          innerRef.current.style.setProperty(
            "--glare-x",
            `${((nx + 0.5) * 100).toFixed(2)}%`
          );
          innerRef.current.style.setProperty(
            "--glare-y",
            `${((ny + 0.5) * 100).toFixed(2)}%`
          );
        }
      }}
      onMouseLeave={() => {
        setRx(0);
        setRy(0);
        setIsHovered(false);
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          transition: "transform 0.35s var(--ease-out-expo)",
        }}
      >
        {children}

        {glare && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.4s var(--ease-out-expo)",
              mixBlendMode: "soft-light",
              // Two-stop falloff: bright but small center, soft halo
              // out to ~60% of the card's farthest corner.
              background: `radial-gradient(
                circle at var(--glare-x, 50%) var(--glare-y, 50%),
                rgba(255, 255, 255, ${glareIntensity}) 0%,
                rgba(255, 255, 255, ${(glareIntensity * 0.4).toFixed(3)}) 25%,
                rgba(255, 255, 255, 0) 60%
              )`,
            }}
          />
        )}
      </div>
    </div>
  );
};
