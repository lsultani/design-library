import * as React from "react";
import { useState } from "react";

export interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
}

/**
 * CardTilt — 3D mouse hover tilt used on WorkCards. Exposed as a
 * standalone wrapper so any card-shaped thing can inherit the feel.
 */
export const CardTilt = ({
  children,
  className = "",
  maxRotate = 4,
}: CardTiltProps) => {
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  return (
    <div
      className={className}
      style={{ perspective: "1200px" }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setRy(-nx * maxRotate * 2);
        setRx(ny * maxRotate);
      }}
      onMouseLeave={() => {
        setRx(0);
        setRy(0);
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          transition: "transform 0.35s var(--ease-out-expo)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
