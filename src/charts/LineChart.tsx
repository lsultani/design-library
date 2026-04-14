import * as React from "react";

export interface LinePoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  points: LinePoint[];
  height?: number;
  title?: string;
}

/**
 * LineChart — single series, thin 1px line, dots at inflection points.
 * No axis chrome. Labels render along the bottom.
 */
export const LineChart = ({ points, height = 180, title }: LineChartProps) => {
  if (points.length < 2) return null;
  const width = 600;
  const padding = { top: 12, right: 8, bottom: 28, left: 8 };
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = padding.left + (i / (points.length - 1)) * (width - padding.left - padding.right);
    const y =
      padding.top +
      (1 - (p.value - min) / range) * (height - padding.top - padding.bottom);
    return { x, y };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className="w-full">
      {title && (
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60 mb-6">
          {title}
        </p>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img">
        <path d={path} stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={2} fill="hsl(var(--foreground))" />
        ))}
        {points.map((p, i) => (
          <text
            key={i}
            x={coords[i].x}
            y={height - 6}
            textAnchor="middle"
            fontFamily="Space Mono, monospace"
            fontSize="10"
            letterSpacing="0.1em"
            fill="hsl(var(--foreground) / 0.55)"
          >
            {p.label.toUpperCase()}
          </text>
        ))}
      </svg>
    </div>
  );
};
