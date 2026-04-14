import { useCallback, useEffect, useRef } from "react";

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  scale: number,
) => void;

/* ------------------------------------------------------------------ */
/*  Shared canvas wrapper                                              */
/* ------------------------------------------------------------------ */
function CanvasGeometry({
  draw,
  scale = 1,
  className,
}: {
  draw: DrawFn;
  scale?: number;
  className?: string;
}) {
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const cleanupRef = useRef<(() => void) | null>(null);

  const containerCallbackRef = useCallback(
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
          const t = (performance.now() - start) / 1000;
          drawRef.current(ctx, cw, ch, t, scaleRef.current);
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
    [],
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
      ref={containerCallbackRef}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Drawing helpers                                                    */
/* ------------------------------------------------------------------ */
function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fill();
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, alpha: number, width = 0.8) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function strokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number, width = 0.8) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function strokeCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, width = 0.8) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function polygon(ctx: CanvasRenderingContext2D, points: [number, number][], alpha: number, width = 0.8) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function dashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, alpha: number, dash: number[], width = 0.8) {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.setLineDash([]);
}

function dashedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number, dash: number[], width = 0.8) {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.rect(x, y, w, h);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.setLineDash([]);
}

function dashedCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, dash: number[], width = 0.8) {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.setLineDash([]);
}

/* ------------------------------------------------------------------ */
/*  1. Fleet Orchestration — orbiting agents around a hub              */
/* ------------------------------------------------------------------ */
const drawFleet: DrawFn = (ctx, w, h, t, k) => {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const sz = h * 0.9;

  const gridSpacing = 22;
  const gridAlpha = 0.12 + 0.06 * Math.sin(t * 0.5);
  for (let x = gridSpacing; x < w; x += gridSpacing) {
    line(ctx, x, 0, x, h, gridAlpha, 0.5 * k);
  }
  for (let y = gridSpacing; y < h; y += gridSpacing) {
    line(ctx, 0, y, w, y, gridAlpha, 0.5 * k);
  }

  dot(ctx, cx, cy, 4 * k, 0.9);
  dashedCircle(ctx, cx, cy, sz * 0.06, 0.55, [3, 3], 0.8 * k);

  const orbits = [
    { r: sz * 0.18, speed: 0.4, agents: 3, size: 5 * k },
    { r: sz * 0.32, speed: -0.25, agents: 4, size: 4.5 * k },
    { r: sz * 0.46, speed: 0.15, agents: 5, size: 4 * k },
  ];

  for (const orbit of orbits) {
    dashedCircle(ctx, cx, cy, orbit.r, 0.28, [3, 6], 0.6 * k);
    for (let a = 0; a < orbit.agents; a++) {
      const angle = (a / orbit.agents) * Math.PI * 2 + t * orbit.speed;
      const ax = cx + Math.cos(angle) * orbit.r;
      const ay = cy + Math.sin(angle) * orbit.r;
      const lineAlpha = 0.18 + 0.22 * Math.sin(t * 2 + a);
      line(ctx, cx, cy, ax, ay, lineAlpha, 0.5 * k);
      const s = orbit.size;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(Math.PI / 4);
      strokeRect(ctx, -s / 2, -s / 2, s, s, 0.8, 0.9 * k);
      ctx.restore();
      dot(ctx, ax, ay, 2 * k, 0.7);
    }
  }

  const pulseR = ((t * 0.3) % 1) * sz * 0.5;
  const pulseAlpha = 0.5 * (1 - pulseR / (sz * 0.5));
  strokeCircle(ctx, cx, cy, pulseR, pulseAlpha, 0.7 * k);
};

/* ------------------------------------------------------------------ */
/*  2. Digital Twin — mirrored structure with sync pulses              */
/* ------------------------------------------------------------------ */
const drawDigitalTwin: DrawFn = (ctx, w, h, t, k) => {
  const midX = w * 0.5;

  ctx.beginPath();
  ctx.setLineDash([8, 5]);
  ctx.lineDashOffset = -t * 15;
  ctx.moveTo(midX, h * 0.05);
  ctx.lineTo(midX, h * 0.95);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.0 * k;
  ctx.stroke();
  ctx.setLineDash([]);

  const f1 = Math.sin(t * 0.5) * 5;
  const f2 = Math.sin(t * 0.4 + 1) * 6;
  const f3 = Math.sin(t * 0.6 + 2) * 4;

  const blockW = w * 0.3;
  const blockH1 = h * 0.3;
  const blockH2 = h * 0.22;

  const lx = midX - w * 0.06 - blockW;
  strokeRect(ctx, lx, h * 0.12 + f1, blockW, blockH1, 0.7, 1.1 * k);
  strokeRect(ctx, lx + blockW * 0.15, h * 0.52 + f2, blockW * 0.7, blockH2, 0.55, 0.9 * k);
  line(ctx, lx + blockW * 0.5, h * 0.12 + blockH1 + f1, lx + blockW * 0.5, h * 0.52 + f2, 0.4, 0.7 * k);

  dot(ctx, lx + blockW * 0.25, h * 0.2 + f1, 3 * k, 0.55 + 0.3 * Math.sin(t * 1.5));
  dot(ctx, lx + blockW * 0.7, h * 0.26 + f1, 3 * k, 0.55 + 0.3 * Math.sin(t * 1.8));
  dot(ctx, lx + blockW * 0.45, h * 0.6 + f2, 2.5 * k, 0.55 + 0.3 * Math.sin(t * 2));

  line(ctx, lx + blockW * 0.1, h * 0.18 + f1, lx + blockW * 0.85, h * 0.18 + f1, 0.28, 0.6 * k);
  line(ctx, lx + blockW * 0.1, h * 0.24 + f1, lx + blockW * 0.6, h * 0.24 + f1, 0.22, 0.6 * k);
  line(ctx, lx + blockW * 0.1, h * 0.30 + f1, lx + blockW * 0.75, h * 0.30 + f1, 0.18, 0.6 * k);

  const rx = midX + w * 0.06;
  dashedRect(ctx, rx, h * 0.12 + f1, blockW, blockH1, 0.55, [6, 5], 1.1 * k);
  dashedRect(ctx, rx + blockW * 0.15, h * 0.52 + f2, blockW * 0.7, blockH2, 0.45, [5, 5], 0.9 * k);
  dashedLine(ctx, rx + blockW * 0.5, h * 0.12 + blockH1 + f1, rx + blockW * 0.5, h * 0.52 + f2, 0.35, [4, 4], 0.7 * k);

  dot(ctx, rx + blockW * 0.25, h * 0.2 + f1, 3 * k, 0.35 + 0.2 * Math.sin(t * 1.5));
  dot(ctx, rx + blockW * 0.7, h * 0.26 + f1, 3 * k, 0.35 + 0.2 * Math.sin(t * 1.8));
  dot(ctx, rx + blockW * 0.45, h * 0.6 + f2, 2.5 * k, 0.35 + 0.2 * Math.sin(t * 2));

  dashedLine(ctx, rx + blockW * 0.1, h * 0.18 + f1, rx + blockW * 0.85, h * 0.18 + f1, 0.2, [4, 4], 0.6 * k);
  dashedLine(ctx, rx + blockW * 0.1, h * 0.24 + f1, rx + blockW * 0.6, h * 0.24 + f1, 0.16, [4, 4], 0.6 * k);
  dashedLine(ctx, rx + blockW * 0.1, h * 0.30 + f1, rx + blockW * 0.75, h * 0.30 + f1, 0.14, [4, 4], 0.6 * k);

  const pulsePositions = [0.25, 0.42, 0.60, 0.78];
  const pulseSpan = w * 0.12;
  for (let i = 0; i < pulsePositions.length; i++) {
    const py = h * pulsePositions[i] + f3;
    const progress = (t * 0.4 + i * 0.25) % 1;
    const px = midX - pulseSpan + progress * pulseSpan * 2;
    const alpha = 0.65 * Math.sin(progress * Math.PI);
    dot(ctx, px, py, 2.5 * k, alpha);
    line(ctx, midX - pulseSpan, py, midX + pulseSpan, py, 0.16, 0.6 * k);
  }
};

/* ------------------------------------------------------------------ */
/*  3. 5G Signal Strategy — flowing wave lines                         */
/* ------------------------------------------------------------------ */
const drawSignalStrategy: DrawFn = (ctx, w, h, t, k) => {
  const numLines = 18;
  const spacing = h / (numLines + 1);

  for (let i = 0; i < numLines; i++) {
    const baseY = spacing * (i + 1);
    const lineAlpha = 0.12 + 0.18 * Math.sin(t * 0.3 + i * 0.4);
    const amplitude = 8 + 12 * Math.sin(t * 0.25 + i * 0.6);
    const freq = 0.008 + 0.003 * Math.sin(t * 0.15 + i * 0.3);
    const phaseShift = t * 0.6 + i * 0.35;

    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = baseY
        + Math.sin(x * freq + phaseShift) * amplitude
        + Math.sin(x * freq * 2.3 + phaseShift * 0.7) * amplitude * 0.3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
    ctx.lineWidth = (0.6 + 0.4 * Math.sin(t * 0.5 + i * 0.8)) * k;
    ctx.stroke();

    const dotCount = 2;
    for (let d = 0; d < dotCount; d++) {
      const progress = (t * 0.08 + d * 0.5 + i * 0.12) % 1;
      const dx = progress * w;
      const dy = baseY
        + Math.sin(dx * freq + phaseShift) * amplitude
        + Math.sin(dx * freq * 2.3 + phaseShift * 0.7) * amplitude * 0.3;
      const dotAlpha = 0.5 * Math.sin(progress * Math.PI);
      if (dotAlpha > 0.05) {
        dot(ctx, dx, dy, 1.8 * k, dotAlpha);
      }
    }
  }

  const vertCount = 6;
  for (let v = 0; v < vertCount; v++) {
    const vx = w * ((v + 0.5) / vertCount);
    const vAlpha = 0.06 + 0.04 * Math.sin(t * 0.4 + v * 1.2);
    line(ctx, vx, 0, vx, h, vAlpha, 0.4 * k);
  }
};

/* ------------------------------------------------------------------ */
/*  4. AI Neural Finance — layered network with traveling pulses       */
/* ------------------------------------------------------------------ */
const drawNeuralFinance: DrawFn = (ctx, w, h, t, k) => {
  const s = Math.min(w, h);

  const layers = [
    [
      { x: w * 0.12, y: h * 0.25 },
      { x: w * 0.12, y: h * 0.5 },
      { x: w * 0.12, y: h * 0.75 },
    ],
    [
      { x: w * 0.35, y: h * 0.18 },
      { x: w * 0.35, y: h * 0.4 },
      { x: w * 0.35, y: h * 0.62 },
      { x: w * 0.35, y: h * 0.84 },
    ],
    [
      { x: w * 0.58, y: h * 0.22 },
      { x: w * 0.58, y: h * 0.5 },
      { x: w * 0.58, y: h * 0.78 },
    ],
    [
      { x: w * 0.82, y: h * 0.35 },
      { x: w * 0.82, y: h * 0.65 },
    ],
  ];

  const connections: { x1: number; y1: number; x2: number; y2: number; idx: number }[] = [];
  let idx = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    for (const from of layers[l]) {
      for (const to of layers[l + 1]) {
        connections.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, idx: idx++ });
      }
    }
  }

  for (const c of connections) {
    const alpha = 0.12 + 0.1 * Math.sin(t * 0.8 + c.idx * 0.3);
    line(ctx, c.x1, c.y1, c.x2, c.y2, alpha, 0.5 * k);
  }

  for (const c of connections) {
    const period = 3 + (c.idx % 5) * 0.6;
    const progress = (t / period + c.idx * 0.1) % 1;
    const px = c.x1 + (c.x2 - c.x1) * progress;
    const py = c.y1 + (c.y2 - c.y1) * progress;
    const alpha = 0.6 * Math.sin(progress * Math.PI);
    if (alpha > 0.05) {
      dot(ctx, px, py, 1.5 * k, alpha);
    }
  }

  const nodeR = s * 0.02 * k;
  for (let l = 0; l < layers.length; l++) {
    for (let n = 0; n < layers[l].length; n++) {
      const node = layers[l][n];
      const breathe = 1 + 0.15 * Math.sin(t * 1.2 + l * 0.7 + n * 0.5);
      strokeCircle(ctx, node.x, node.y, nodeR * breathe, 0.5, 0.7 * k);
      dot(ctx, node.x, node.y, 2 * k, 0.5 + 0.35 * Math.sin(t * 1.5 + l + n));
    }
  }

  for (const node of layers[layers.length - 1]) {
    const glowR = nodeR * (1.8 + 0.3 * Math.sin(t * 1.5));
    strokeCircle(ctx, node.x, node.y, glowR, 0.15 + 0.1 * Math.sin(t * 1.5), 0.4 * k);
  }
};

/* ------------------------------------------------------------------ */
/*  5. Gaming Platform — isometric blocks rising and falling           */
/* ------------------------------------------------------------------ */
const drawIsometricGrid: DrawFn = (ctx, w, h, t, k) => {
  const cx = w * 0.5;
  const cellW = h * 0.12;
  const cellH = cellW * 0.58;
  const gridSize = 5;
  const gridVisualH = gridSize * cellH;
  const cy = k > 1 ? h * 0.5 - gridVisualH * 0.5 : h * 0.5 - gridVisualH * 0.25;

  const isoX = (col: number, row: number) => cx + (col - row) * cellW;
  const isoY = (col: number, row: number, height: number) =>
    cy + (col + row) * cellH - height;

  for (let i = 0; i <= gridSize; i++) {
    const x1 = isoX(i, 0),
      y1 = isoY(i, 0, 0);
    const x2 = isoX(i, gridSize),
      y2 = isoY(i, gridSize, 0);
    line(ctx, x1, y1, x2, y2, 0.15, 0.4 * k);

    const x3 = isoX(0, i),
      y3 = isoY(0, i, 0);
    const x4 = isoX(gridSize, i),
      y4 = isoY(gridSize, i, 0);
    line(ctx, x3, y3, x4, y4, 0.15, 0.4 * k);
  }

  const blocks: { col: number; row: number; baseH: number; speed: number; phase: number }[] = [];
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize; row++) {
      const seed = col * 7 + row * 13;
      blocks.push({
        col,
        row,
        baseH: 25 + (seed % 4) * 22,
        speed: 0.3 + (seed % 5) * 0.12,
        phase: (seed % 10) * 0.6,
      });
    }
  }

  blocks.sort((a, b) => a.col + a.row - (b.col + b.row));

  for (const block of blocks) {
    const bh = block.baseH * (0.5 + 0.5 * Math.sin(t * block.speed + block.phase));
    const topX = isoX(block.col + 0.5, block.row + 0.5);
    const topY = isoY(block.col + 0.5, block.row + 0.5, bh);

    const tl = [isoX(block.col, block.row), isoY(block.col, block.row, bh)] as [number, number];
    const tr = [isoX(block.col + 1, block.row), isoY(block.col + 1, block.row, bh)] as [number, number];
    const br = [isoX(block.col + 1, block.row + 1), isoY(block.col + 1, block.row + 1, bh)] as [number, number];
    const bl = [isoX(block.col, block.row + 1), isoY(block.col, block.row + 1, bh)] as [number, number];

    const btl = [isoX(block.col, block.row), isoY(block.col, block.row, 0)] as [number, number];
    const btr = [isoX(block.col + 1, block.row), isoY(block.col + 1, block.row, 0)] as [number, number];
    const bbr = [isoX(block.col + 1, block.row + 1), isoY(block.col + 1, block.row + 1, 0)] as [number, number];
    const bbl = [isoX(block.col, block.row + 1), isoY(block.col, block.row + 1, 0)] as [number, number];

    const heightAlpha = 0.2 + 0.3 * (bh / block.baseH);

    polygon(ctx, [tr, btr, bbr, br], heightAlpha * 0.7, 0.6 * k);
    polygon(ctx, [bl, bbl, btl, tl], heightAlpha * 0.5, 0.6 * k);
    polygon(ctx, [tl, tr, br, bl], heightAlpha, 0.7 * k);

    dot(ctx, topX, topY, 1.2 * k, heightAlpha * 1.3);
  }
};

/* ------------------------------------------------------------------ */
/*  Export map                                                         */
/* ------------------------------------------------------------------ */
export type CardGeometryId =
  | "robotics"
  | "digital-twin"
  | "5g-strategy"
  | "en-verite"
  | "gaming";

export type CardGeometrySize = "hero" | "card";

const geometryMap: Record<CardGeometryId, DrawFn> = {
  robotics: drawFleet,
  "digital-twin": drawDigitalTwin,
  "5g-strategy": drawSignalStrategy,
  "en-verite": drawNeuralFinance,
  gaming: drawIsometricGrid,
};

const SCALE_MAP: Record<CardGeometrySize, number> = {
  hero: 2,
  card: 1,
};

export interface CardGeometryProps {
  /** Which geometry to render. */
  id: CardGeometryId;
  /** `hero` doubles linework so lines stay readable in a big container. */
  size?: CardGeometrySize;
  className?: string;
}

/**
 * CardGeometry — canvas-based Swiss-style wireframe animations.
 *
 * Each `id` maps to a different geometric animation used on the work
 * cards in the main site. Ported from `/src/components/CardGeometry.tsx`
 * unchanged so readers can inspect the same drawing code running here
 * in the library.
 *
 * Swiss/International Typographic Style — wireframe, minimal, elegant.
 * Uses `requestAnimationFrame` + a `ResizeObserver` so the canvas stays
 * in sync with its container at any size.
 *
 * Variants
 * --------
 *   robotics       → orbiting agents around a hub
 *   digital-twin   → mirrored structure with sync pulses
 *   5g-strategy    → flowing horizontal wave lines
 *   en-verite      → 4-layer neural network with traveling pulses
 *   gaming         → isometric grid of rising and falling blocks
 */
export const CardGeometry = ({ id, size = "card", className }: CardGeometryProps) => {
  const draw = geometryMap[id];
  if (!draw) return null;
  const classes = [`geometry-${id}`, `geometry-${size}`, className].filter(Boolean).join(" ");
  return <CanvasGeometry draw={draw} scale={SCALE_MAP[size]} className={classes} />;
};

export default CardGeometry;
