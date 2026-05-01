/**
 * Cinematic motion pieces — gated to hover.
 *
 * At rest each card sits as a still composition. The motion only plays
 * while the card is hovered or focused. Intensity is a spring-driven
 * motion value that swells smoothly from 0 → 1 on hover-in and recedes
 * 1 → 0 on hover-out. Every visual amplitude in this file is multiplied
 * by intensity, so at rest every sin contribution is exactly zero and
 * the composition is held perfectly still.
 *
 * When motion plays, it is built from continuous sums of sinusoids on
 * irrational-ratio periods. Because no two frequencies share a common
 * multiple, the system never repeats and never lands. There are no
 * compositions to morph between, no destinations, no scenes — only one
 * evolving environment that swells in and recedes. PathLength values
 * lerp from 1 (drawn) at rest to oscillating bands during hover, so
 * lines never "appear" — they breathe.
 *
 * If a moment during the hovered motion could be lifted out and shown
 * as a still that makes sense, that's the failure mode. The whole
 * point is that no such moment exists during the swell.
 */
import {
  motion,
  useTime,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

const BLACK = "#0F0F0F";
const GRAY = "#737373";
const RED = "#EF4343";
const FONT_MONO = "Space Mono, monospace";

const TAU = Math.PI * 2;
// pure sinusoid in [-1, 1]; all motion in this file is a sum of these
const sn = (t: number, periodMs: number, phase = 0) =>
  Math.sin(((t / periodMs) + phase) * TAU);
const cs = (t: number, periodMs: number, phase = 0) =>
  Math.cos(((t / periodMs) + phase) * TAU);

interface Ctx {
  time: MotionValue<number>;
  intensity: MotionValue<number>;
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Video infographic — used by article 08.                            */
/*  Plays from frame 0 on hover, pauses & rewinds to frame 0 on        */
/*  hover-out, mirroring the rest/swell behavior of the SVG pieces.    */
/*  Muted, looped, lazy-loaded via preload="metadata".                 */
/* ─────────────────────────────────────────────────────────────────── */
const VIDEO_INFOGRAPHICS: Record<string, string> = {
  // No video-backed infographics right now. Article 08 was briefly wired to
  // article-08.mp4 but is now a code-rendered piece living in this file
  // (see I08), matching the architecture of the other seven.
};

const VideoInfographic = ({
  src,
  hovered,
  className,
}: {
  src: string;
  hovered: boolean;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {
        /* autoplay sometimes rejects; silent retry happens on next hover */
      });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  Top-level wrapper                                                  */
/* ─────────────────────────────────────────────────────────────────── */
const Infographic = ({
  num,
  hovered,
  className,
}: {
  num: string;
  hovered: boolean;
  className?: string;
}) => {
  // Video-backed infographics short-circuit before any of the SVG /
  // Framer Motion machinery runs.
  const videoSrc = VIDEO_INFOGRAPHICS[num];
  if (videoSrc) {
    return <VideoInfographic src={videoSrc} hovered={hovered} className={className} />;
  }

  // SVG / continuous-motion path for every other article.
  const time = useTime();
  const intensity = useMotionValue(0);

  useEffect(() => {
    const controls = animate(intensity, hovered ? 1 : 0, {
      type: "spring",
      stiffness: 60,
      damping: 22,
      mass: 0.9,
    });
    return () => controls.stop();
  }, [hovered, intensity]);

  const Comp = INFOGRAPHICS[num];
  if (!Comp) return null;

  return (
    <svg viewBox="0 0 608 340" xmlns="http://www.w3.org/2000/svg" className={className}>
      <Comp time={time} intensity={intensity} />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  Reusable: a rectangle on a Lissajous orbit. Used by 01.            */
/*  Two coupled sinusoids on prime-like period ratios → orbit never     */
/*  repeats. Size also pulses on a third independent period.           */
/* ─────────────────────────────────────────────────────────────────── */
const OrbitRect = ({
  time,
  intensity,
  cx,
  cy,
  ax,
  ay,
  pxMs,
  pyMs,
  phx,
  phy,
  w,
  h,
  pulseMs,
  pulsePhase,
  pulseAmp,
  fill,
  rotateAmp = 0,
  rotateMs = 11000,
  rotatePhase = 0,
}: {
  time: MotionValue<number>;
  intensity: MotionValue<number>;
  cx: number; cy: number;
  ax: number; ay: number;
  pxMs: number; pyMs: number;
  phx: number; phy: number;
  w: number; h: number;
  pulseMs: number;
  pulsePhase: number;
  pulseAmp: number;
  fill: string;
  rotateAmp?: number;
  rotateMs?: number;
  rotatePhase?: number;
}) => {
  const x = useTransform(() => {
    const it = intensity.get();
    return cx + sn(time.get(), pxMs, phx) * ax * it - w / 2;
  });
  const y = useTransform(() => {
    const it = intensity.get();
    return cy + sn(time.get(), pyMs, phy) * ay * it - h / 2;
  });
  const scale = useTransform(() => {
    const it = intensity.get();
    return 1 + sn(time.get(), pulseMs, pulsePhase) * pulseAmp * it;
  });
  const rotate = useTransform(() => {
    const it = intensity.get();
    return sn(time.get(), rotateMs, rotatePhase) * rotateAmp * it;
  });
  return (
    <motion.rect
      width={w}
      height={h}
      fill={fill}
      style={{ x, y, scale, rotate, transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  01 — a field that perpetually reshapes itself                      */
/*  10 rectangles on Lissajous orbits, irrational-ratio periods, no    */
/*  two share a common multiple → the field never repeats. Sizes pulse  */
/*  on third independent periods. Camera drifts horizontally always.   */
/* ─────────────────────────────────────────────────────────────────── */
const I01 = ({ time, intensity }: Ctx) => {
  const camX = useTransform(() => sn(time.get(), 13700) * 6 * intensity.get());
  const camS = useTransform(() => 1 + sn(time.get(), 17300) * 0.018 * intensity.get());
  const camR = useTransform(() => sn(time.get(), 23100) * 0.5 * intensity.get());
  return (
    <motion.g style={{ x: camX, scale: camS, rotate: camR, transformBox: "fill-box", transformOrigin: "center" }}>
      <OrbitRect time={time} intensity={intensity} cx={170} cy={140} ax={70} ay={32} pxMs={9100} pyMs={11700} phx={0} phy={0.3} w={56} h={56} pulseMs={6300} pulsePhase={0.0} pulseAmp={0.22} fill={BLACK} rotateAmp={6} rotateMs={19300} />
      <OrbitRect time={time} intensity={intensity} cx={290} cy={120} ax={90} ay={28} pxMs={8300} pyMs={12700} phx={0.18} phy={0.55} w={36} h={36} pulseMs={5700} pulsePhase={0.21} pulseAmp={0.28} fill={GRAY} rotateAmp={9} rotateMs={17900} rotatePhase={0.13} />
      <OrbitRect time={time} intensity={intensity} cx={400} cy={160} ax={64} ay={40} pxMs={10300} pyMs={9700} phx={0.45} phy={0.1} w={84} h={28} pulseMs={6900} pulsePhase={0.42} pulseAmp={0.18} fill={BLACK} rotateAmp={4} rotateMs={21100} />
      <OrbitRect time={time} intensity={intensity} cx={460} cy={130} ax={70} ay={48} pxMs={11900} pyMs={9300} phx={0.7} phy={0.4} w={28} h={64} pulseMs={7300} pulsePhase={0.7} pulseAmp={0.22} fill={GRAY} rotateAmp={8} rotateMs={18700} rotatePhase={0.27} />
      <OrbitRect time={time} intensity={intensity} cx={300} cy={210} ax={100} ay={36} pxMs={7700} pyMs={13100} phx={0.92} phy={0.62} w={48} h={20} pulseMs={5300} pulsePhase={0.34} pulseAmp={0.30} fill={BLACK} rotateAmp={5} rotateMs={20300} />
      <OrbitRect time={time} intensity={intensity} cx={210} cy={210} ax={70} ay={32} pxMs={10100} pyMs={11300} phx={0.6} phy={0.28} w={40} h={40} pulseMs={6700} pulsePhase={0.55} pulseAmp={0.24} fill={GRAY} rotateAmp={7} rotateMs={19700} rotatePhase={0.41} />
      <OrbitRect time={time} intensity={intensity} cx={365} cy={75} ax={90} ay={28} pxMs={9700} pyMs={11900} phx={0.33} phy={0.81} w={44} h={20} pulseMs={5900} pulsePhase={0.69} pulseAmp={0.26} fill={BLACK} rotateAmp={6} rotateMs={18300} />
      <OrbitRect time={time} intensity={intensity} cx={140} cy={80} ax={60} ay={36} pxMs={11300} pyMs={9100} phx={0.05} phy={0.95} w={28} h={44} pulseMs={6100} pulsePhase={0.83} pulseAmp={0.20} fill={GRAY} rotateAmp={5} rotateMs={20900} rotatePhase={0.6} />
      <OrbitRect time={time} intensity={intensity} cx={500} cy={210} ax={50} ay={44} pxMs={8900} pyMs={10700} phx={0.78} phy={0.5} w={56} h={20} pulseMs={5500} pulsePhase={0.94} pulseAmp={0.28} fill={BLACK} rotateAmp={7} rotateMs={19100} />
      {/* the red — a single accent that wanders the canvas */}
      <OrbitRect time={time} intensity={intensity} cx={304} cy={170} ax={140} ay={70} pxMs={14300} pyMs={17900} phx={0.12} phy={0.62} w={36} h={36} pulseMs={4700} pulsePhase={0.0} pulseAmp={0.32} fill={RED} rotateAmp={14} rotateMs={15300} />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  02 — surface and system as continuous strata                        */
/*  A horizontal band (the surface) breathes vertically.               */
/*  Five vertical columns rise and fall on independent periods.        */
/*  A red rectangle perpetually morphs — its width and height swing on  */
/*  inverse oscillators, so it's never bolt and never column, always   */
/*  somewhere on the spectrum between the two. It also drifts in space. */
/* ─────────────────────────────────────────────────────────────────── */
const Column = ({ x, w, time, intensity, period, phase }: { x: number; w: number; time: MotionValue<number>; intensity: MotionValue<number>; period: number; phase: number }) => {
  const sy = useTransform(() => {
    const it = intensity.get();
    return 0.7 + sn(time.get(), period, phase) * 0.25 * it;
  });
  const dy = useTransform(() => sn(time.get(), period * 1.3, phase + 0.1) * 2 * intensity.get());
  return (
    <motion.rect
      x={x}
      y="100"
      width={w}
      height="160"
      fill={BLACK}
      style={{ scaleY: sy, y: dy, transformBox: "fill-box", transformOrigin: "bottom center" }}
    />
  );
};
const I02 = ({ time, intensity }: Ctx) => {
  // Surface band — y position breathes
  const bandY = useTransform(() => 84 + sn(time.get(), 9700) * 4 * intensity.get());
  const bandH = useTransform(() => 18 + sn(time.get(), 7300, 0.3) * 3 * intensity.get());
  // Red traveler — perpetually transforms aspect ratio and position. Width and
  // height are driven by inverse sinusoids → as one shrinks the other grows,
  // so it's continuously between bolt-shape (wide flat) and column-shape (tall
  // narrow). The center traces a Lissajous, never landing in either anchor.
  const redCx = useTransform(() => 304 + sn(time.get(), 13900) * 130 * intensity.get());
  const redCy = useTransform(() => 178 + sn(time.get(), 16300, 0.31) * 70 * intensity.get());
  const redW = useTransform(() => {
    const o = sn(time.get(), 11700);
    // when o = +1 → wide bolt (~80×28). when o = -1 → tall column (~36×140).
    return 58 + o * 22 * intensity.get();
  });
  const redH = useTransform(() => {
    const o = sn(time.get(), 11700);
    return 84 - o * 56 * intensity.get();
  });
  const redRotate = useTransform(() => sn(time.get(), 14300, 0.4) * 6 * intensity.get());
  // Camera
  const camX = useTransform(() => sn(time.get(), 19100) * 4 * intensity.get());
  const camS = useTransform(() => 1 + sn(time.get(), 21300) * 0.012 * intensity.get());
  return (
    <motion.g style={{ x: camX, scale: camS, transformBox: "fill-box", transformOrigin: "center" }}>
      {/* surface band */}
      <motion.rect x="24" width="560" fill={BLACK} style={{ y: bandY, height: bandH }} />
      {/* columns */}
      <Column x="60"  w="36" time={time} intensity={intensity} period={6900}  phase={0.0} />
      <Column x="142" w="36" time={time} intensity={intensity} period={7300}  phase={0.2} />
      <Column x="224" w="36" time={time} intensity={intensity} period={6700}  phase={0.4} />
      <Column x="306" w="36" time={time} intensity={intensity} period={7100}  phase={0.6} />
      <Column x="388" w="36" time={time} intensity={intensity} period={6500}  phase={0.8} />
      <Column x="470" w="36" time={time} intensity={intensity} period={7700}  phase={0.1} />
      <Column x="552" w="32" time={time} intensity={intensity} period={6300}  phase={0.3} />
      {/* red traveler — continuous morph */}
      <motion.rect
        fill={RED}
        style={{
          x: useTransform(() => redCx.get() - redW.get() / 2),
          y: useTransform(() => redCy.get() - redH.get() / 2),
          width: redW,
          height: redH,
          rotate: redRotate,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  03 — radiating system, perpetually reaching outward                 */
/*  A central rectangle. Multiple lines extending in different          */
/*  directions, each with continuously oscillating length. Small dots   */
/*  travel along each line at independent rates. One line is red.       */
/*  No labels appear — only the geometry breathing.                     */
/* ─────────────────────────────────────────────────────────────────── */
const Spoke = ({ angleDeg, length, color, time, intensity, period, phase, dotPeriod, dotPhase }: { angleDeg: number; length: number; color: string; time: MotionValue<number>; intensity: MotionValue<number>; period: number; phase: number; dotPeriod: number; dotPhase: number }) => {
  const cx = 304, cy = 170;
  const angleRad = (angleDeg * Math.PI) / 180;
  const ex = cx + Math.cos(angleRad) * length;
  const ey = cy + Math.sin(angleRad) * length;
  // pathLength: rest = 1 (line fully drawn). hover = 0.5 + sn*0.4 (oscillates 0.1..0.9).
  // lerp from 1 to (0.5 + sn*0.4) by intensity.
  const pl = useTransform(() => {
    const it = intensity.get();
    return 1 - it * 0.5 + it * sn(time.get(), period, phase) * 0.4;
  });
  // Dot at rest sits at midpoint of spoke. On hover it oscillates between hub and end.
  const dotT = useTransform(() => 0.5 + sn(time.get(), dotPeriod, dotPhase) * 0.5 * intensity.get());
  const dotX = useTransform(() => cx + (ex - cx) * dotT.get());
  const dotY = useTransform(() => cy + (ey - cy) * dotT.get());
  return (
    <>
      <motion.path
        d={`M ${cx} ${cy} L ${ex} ${ey}`}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{ pathLength: pl }}
      />
      <motion.circle r="3.5" fill={color} cx={dotX} cy={dotY} />
    </>
  );
};
const I03 = ({ time, intensity }: Ctx) => {
  const hubScale = useTransform(() => 1 + sn(time.get(), 4300) * 0.075 * intensity.get());
  const camR = useTransform(() => sn(time.get(), 27100) * 1.2 * intensity.get());
  const camS = useTransform(() => 1 + sn(time.get(), 21700) * 0.012 * intensity.get());
  const camX = useTransform(() => sn(time.get(), 17900) * 3 * intensity.get());
  return (
    <motion.g style={{ x: camX, scale: camS, rotate: camR, transformBox: "fill-box", transformOrigin: "center" }}>
      {/* spokes — all radiating from hub. red is one of many. */}
      <Spoke angleDeg={180} length={150} color={BLACK} time={time} intensity={intensity} period={6300} phase={0.0} dotPeriod={5700} dotPhase={0.0} />
      <Spoke angleDeg={210} length={130} color={BLACK} time={time} intensity={intensity} period={7100} phase={0.18} dotPeriod={6300} dotPhase={0.2} />
      <Spoke angleDeg={150} length={130} color={GRAY}  time={time} intensity={intensity} period={6700} phase={0.36} dotPeriod={6700} dotPhase={0.45} />
      <Spoke angleDeg={270} length={120} color={BLACK} time={time} intensity={intensity} period={5900} phase={0.54} dotPeriod={5300} dotPhase={0.6} />
      <Spoke angleDeg={300} length={100} color={GRAY}  time={time} intensity={intensity} period={7300} phase={0.72} dotPeriod={6100} dotPhase={0.83} />
      <Spoke angleDeg={240} length={100} color={GRAY}  time={time} intensity={intensity} period={6900} phase={0.9} dotPeriod={5500} dotPhase={0.32} />
      <Spoke angleDeg={0}   length={150} color={RED}   time={time} intensity={intensity} period={7700} phase={0.27} dotPeriod={4900} dotPhase={0.0} />
      <Spoke angleDeg={30}  length={130} color={RED}   time={time} intensity={intensity} period={5700} phase={0.45} dotPeriod={5100} dotPhase={0.13} />
      <Spoke angleDeg={330} length={120} color={RED}   time={time} intensity={intensity} period={6500} phase={0.63} dotPeriod={6100} dotPhase={0.27} />
      {/* hub */}
      <motion.g style={{ scale: hubScale, transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x={304 - 36} y={170 - 36} width="72" height="72" fill={BLACK} />
      </motion.g>
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  04 — the matrix, marker tracing forever                            */
/*  A point of light follows a Lissajous path through the 2x2.         */
/*  Two coupled sinusoids on incommensurate periods → path never        */
/*  repeats. Marker has a faint trail (echo circles at sample times).   */
/*  Grid lines breathe via subtle thickness oscillation.                */
/* ─────────────────────────────────────────────────────────────────── */
const I04 = ({ time, intensity }: Ctx) => {
  const Mx = 124, My = 60, sz = 200;
  const center = [Mx + sz, My + sz / 2] as const;
  const cxV = useTransform(() => {
    const it = intensity.get();
    return center[0] + sn(time.get(), 9300) * sz * 0.95 * it;
  });
  const cyV = useTransform(() => {
    const it = intensity.get();
    return center[1] + sn(time.get(), 7100, 0.27) * sz * 0.4 * it;
  });
  // Echo trail — three older positions. fillOpacity scales with intensity so
  // trail only appears when motion is active.
  const trail = (delayMs: number, alpha: number) => {
    const tcx = useTransform(() => {
      const it = intensity.get();
      return center[0] + sn(time.get() - delayMs, 9300) * sz * 0.95 * it;
    });
    const tcy = useTransform(() => {
      const it = intensity.get();
      return center[1] + sn(time.get() - delayMs, 7100, 0.27) * sz * 0.4 * it;
    });
    const op = useTransform(() => alpha * intensity.get());
    return <motion.circle r="6" fill={RED} cx={tcx} cy={tcy} style={{ opacity: op }} />;
  };
  const camR = useTransform(() => sn(time.get(), 23700) * 0.8 * intensity.get());
  const camS = useTransform(() => 1 + sn(time.get(), 17900) * 0.01 * intensity.get());
  return (
    <motion.g style={{ rotate: camR, scale: camS, transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={Mx} y={My} width={sz * 2} height="2" fill={BLACK} />
      <rect x={Mx} y={My + sz} width={sz * 2} height="2" fill={BLACK} />
      <rect x={Mx} y={My} width="2" height={sz} fill={BLACK} />
      <rect x={Mx + sz * 2} y={My} width="2" height={sz} fill={BLACK} />
      <rect x={Mx + sz} y={My} width="2" height={sz} fill={BLACK} />
      <rect x={Mx} y={My + sz / 2} width={sz * 2} height="2" fill={BLACK} />
      {trail(900, 0.1)}
      {trail(600, 0.18)}
      {trail(300, 0.32)}
      <motion.circle r="9" fill={RED} cx={cxV} cy={cyV} />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  05 — two textures of motion coexisting                             */
/*  Top: a row of dashes shimmering. Each dash on its own oscillator,  */
/*  phase-offset, so the row is perpetually disordered. Bottom: a      */
/*  single line whose length perpetually breathes via pathLength       */
/*  oscillating 0.3–1.0. A red dot rides at the right end.              */
/*  Two textures, no transition between them, both running always.      */
/* ─────────────────────────────────────────────────────────────────── */
const Dash = ({ i, time, intensity }: { i: number; time: MotionValue<number>; intensity: MotionValue<number> }) => {
  const x = useTransform(() => {
    const it = intensity.get();
    return sn(time.get(), 3700 + (i % 5) * 430, i * 0.071) * 6 * it;
  });
  const y = useTransform(() => {
    const it = intensity.get();
    return sn(time.get(), 4900 + (i % 4) * 290, i * 0.13) * 1.8 * it;
  });
  const sx = useTransform(() => 1 + sn(time.get(), 5300, i * 0.197) * 0.12 * intensity.get());
  return (
    <motion.rect x={24 + i * 40} y="120" width="24" height="3" fill={GRAY} style={{ x, y, scaleX: sx, transformBox: "fill-box", transformOrigin: "center" }} />
  );
};
const I05 = ({ time, intensity }: Ctx) => {
  // pathLength: rest = 1 (line drawn). hover oscillates 0.3..1.0.
  const linePath = useTransform(() => {
    const it = intensity.get();
    return 1 - it * 0.35 + it * sn(time.get(), 9700) * 0.35;
  });
  // Red dot rides along the right end of the line as it grows/recedes
  const dotX = useTransform(() => {
    const it = intensity.get();
    return 24 + linePath.get() * 540 + sn(time.get(), 4700, 0.4) * 2 * it;
  });
  const dotScale = useTransform(() => 1 + sn(time.get(), 3900, 0.2) * 0.18 * intensity.get());
  // Camera
  const camX = useTransform(() => sn(time.get(), 17300) * 3 * intensity.get());
  return (
    <motion.g style={{ x: camX }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <Dash key={i} i={i} time={time} intensity={intensity} />
      ))}
      <motion.path
        d="M 24 220 L 564 220"
        stroke={BLACK}
        strokeWidth="6"
        strokeLinecap="butt"
        fill="none"
        style={{ pathLength: linePath }}
      />
      <motion.rect
        y="211"
        width="12"
        height="18"
        fill={RED}
        style={{ x: dotX, scale: dotScale, transformBox: "fill-box", transformOrigin: "center" }}
      />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  06 — two lines that perpetually braid                               */
/*  Top track y is sin(t/p1). Bottom track y is -sin(t/p1).              */
/*  When sin = 0 they're at baseline (parallel). When +1 they meet.     */
/*  When -1 they diverge. They pass through every relationship          */
/*  continuously and never stop at any of them. A red modulator         */
/*  contributes a slower second sine so the pattern never repeats.      */
/* ─────────────────────────────────────────────────────────────────── */
const I06 = ({ time, intensity }: Ctx) => {
  const yA = 100, yB = 220;
  const topY = useTransform(() => {
    const it = intensity.get();
    return (sn(time.get(), 11300) * 40 + sn(time.get(), 17900, 0.13) * 6) * it;
  });
  const botY = useTransform(() => {
    const it = intensity.get();
    return -(sn(time.get(), 11300) * 40 + sn(time.get(), 17900, 0.13) * 6) * it;
  });
  // A red accent that oscillates in width — sometimes spans, sometimes a fragment
  const redX = useTransform(() => 24 + sn(time.get(), 19100) * 100 * intensity.get());
  const redW = useTransform(() => 200 + sn(time.get(), 13700, 0.27) * 200 * intensity.get());
  const redY = useTransform(() => 160 + sn(time.get(), 9300, 0.41) * 30 * intensity.get());
  // Camera
  const camY = useTransform(() => sn(time.get(), 21300) * 2 * intensity.get());
  const camS = useTransform(() => 1 + sn(time.get(), 18900) * 0.01 * intensity.get());
  return (
    <motion.g style={{ y: camY, scale: camS, transformBox: "fill-box", transformOrigin: "center" }}>
      <motion.rect x="24" y={yA} width="560" height="3" fill={BLACK} style={{ y: topY }} />
      <motion.rect x="24" y={yB} width="560" height="3" fill={BLACK} style={{ y: botY }} />
      {/* red bar as a third oscillating presence */}
      <motion.rect y={0} height="3" fill={RED} style={{ x: redX, width: redW, y: redY }} />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  07 — three textures stacked, each its own oscillator               */
/*  Top: blocks shifting horizontally on phase-offset oscillators.     */
/*  Middle: pairs of segments orbiting positions.                       */
/*  Bottom: parallel lines riding waves at different y-offsets.         */
/*  All running continuously, no row "starts" or "ends".                */
/* ─────────────────────────────────────────────────────────────────── */
const ShiftBlock = ({ i, baseX, baseY, w, time, intensity }: { i: number; baseX: number; baseY: number; w: number; time: MotionValue<number>; intensity: MotionValue<number> }) => {
  const x = useTransform(() => {
    const it = intensity.get();
    return sn(time.get(), 6300 + i * 510, i * 0.21) * 22 * it;
  });
  const sx = useTransform(() => 1 + sn(time.get(), 4900, i * 0.13) * 0.2 * intensity.get());
  return <motion.rect x={baseX} y={baseY} width={w} height="14" fill={i % 2 === 0 ? BLACK : i === 3 ? RED : BLACK} style={{ x, scaleX: sx, transformBox: "fill-box", transformOrigin: "center" }} />;
};
const ShiftSegment = ({ i, baseX, baseY, w, time, intensity }: { i: number; baseX: number; baseY: number; w: number; time: MotionValue<number>; intensity: MotionValue<number> }) => {
  const x = useTransform(() => {
    const it = intensity.get();
    const dir = i % 2 === 0 ? 1 : -1;
    return dir * sn(time.get(), 7100 + i * 430, i * 0.27) * 60 * it;
  });
  const fill = i === 2 ? RED : BLACK;
  return <motion.rect x={baseX} y={baseY} width={w} height="3" fill={fill} style={{ x }} />;
};
const ShiftWave = ({ i, baseY, time, intensity }: { i: number; baseY: number; time: MotionValue<number>; intensity: MotionValue<number> }) => {
  const y = useTransform(() => {
    const it = intensity.get();
    return sn(time.get(), 5700 + i * 470, i * 0.31) * 14 * it;
  });
  const fill = i === 2 ? RED : BLACK;
  return <motion.rect x="24" y={baseY} width="540" height="3" fill={fill} style={{ y }} />;
};
const I07 = ({ time, intensity }: Ctx) => {
  const camY = useTransform(() => sn(time.get(), 19300) * 2.5 * intensity.get());
  const camX = useTransform(() => sn(time.get(), 21100, 0.21) * 1.5 * intensity.get());
  return (
    <motion.g style={{ x: camX, y: camY }}>
      {/* top texture: 5 blocks compressing/spreading */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ShiftBlock key={i} i={i} baseX={120 + i * 70} baseY={64} w={48} time={time} intensity={intensity} />
      ))}
      {/* middle texture: 3 segments inverting */}
      {[0, 1, 2].map((i) => (
        <ShiftSegment key={i} i={i} baseX={140 + i * 110} baseY={170} w={70} time={time} intensity={intensity} />
      ))}
      {/* bottom texture: 3 parallel waves */}
      <ShiftWave i={0} baseY={244} time={time} intensity={intensity} />
      <ShiftWave i={1} baseY={258} time={time} intensity={intensity} />
      <ShiftWave i={2} baseY={272} time={time} intensity={intensity} />
    </motion.g>
  );
};

/* ─────────────────────────────────────────────────────────────────── */
/*  08 — AI decides. Humans sign off.                                  */
/*                                                                      */
/*  Recreated from a Remotion Cinema composition; same idea, same       */
/*  irrational period set, scaled to this card's 608×340 viewBox and    */
/*  hover-gated through the shared `intensity` motion value.            */
/*                                                                      */
/*  Visual translation of the article:                                  */
/*    AI            = a black CIRCLE drifting on the left               */
/*    Human         = a black SQUARE drifting on the right              */
/*    Contract      = a dashed line connecting them — alive, not still  */
/*    Decision      = a small red square oscillating along the line,    */
/*                    pulled between the two poles, never resting       */
/*    Surrounds     = a constellation of small grey dots at sub-pixel   */
/*                    drift rates — the system around the model         */
/*    Hairlines     = three architectural rules at three y values       */
/*                    that pan slowly via dashOffset                    */
/*    Type          = none — geometry alone carries the meaning         */
/* ─────────────────────────────────────────────────────────────────── */
// Single dot in the surrounding constellation
const I08Dot = ({ baseX, baseY, seed, time, intensity }: { baseX: number; baseY: number; seed: number; time: MotionValue<number>; intensity: MotionValue<number> }) => {
  const cx = useTransform(() => baseX + sn(time.get(), 12700 + (seed % 5) * 300, seed * 0.07) * 1.6 * intensity.get());
  const cy = useTransform(() => baseY + cs(time.get(), 11700 + (seed % 7) * 200, seed * 0.11) * 1.2 * intensity.get());
  const r = useTransform(() => 0.9 + sn(time.get(), 9300, seed * 0.05) * 0.25 * intensity.get());
  const op = useTransform(() => 0.16 + (sn(time.get(), 17300, seed * 0.13) + 1) * 0.06 * intensity.get());
  return <motion.circle cx={cx} cy={cy} r={r} fill={GRAY} style={{ opacity: op }} />;
};
const I08 = ({ time, intensity }: Ctx) => {
  // Camera — every shape lives inside this drifting parent
  const camX = useTransform(() => sn(time.get(), 17300) * 5 * intensity.get());
  const camY = useTransform(() => sn(time.get(), 19100, 0.31) * 3 * intensity.get());
  const camScale = useTransform(() => 1 + sn(time.get(), 21300) * 0.012 * intensity.get());
  const camRot = useTransform(() => sn(time.get(), 13900, 0.71) * 0.5 * intensity.get());

  // AI — circle on the left
  const aiCx = useTransform(() => 175 + sn(time.get(), 9300) * 18 * intensity.get());
  const aiCy = useTransform(() => 170 + sn(time.get(), 11700, 0.27) * 12 * intensity.get());
  const aiR = useTransform(() => 65 + sn(time.get(), 7100, 0.41) * 3 * intensity.get());
  const aiOuterR = useTransform(() => aiR.get() + 14);
  const aiOuterDashA = useTransform(() => 3 + sn(time.get(), 7100, 0.5) * 0.8 * intensity.get());
  const aiOuterOffset = useTransform(() => -time.get() * 0.004 * intensity.get());

  // Human — square on the right
  const huCx = useTransform(() => 435 + sn(time.get(), 11700, 0.53) * 20 * intensity.get());
  const huCy = useTransform(() => 168 + sn(time.get(), 9300, 0.83) * 14 * intensity.get());
  const huSize = useTransform(() => 110 + sn(time.get(), 7100, 0.13) * 5 * intensity.get());
  const huX = useTransform(() => huCx.get() - huSize.get() / 2);
  const huY = useTransform(() => huCy.get() - huSize.get() / 2);
  const huOuterX = useTransform(() => huCx.get() - (huSize.get() + 22) / 2);
  const huOuterY = useTransform(() => huCy.get() - (huSize.get() + 22) / 2);
  const huOuterSize = useTransform(() => huSize.get() + 22);
  const huOuterDashA = useTransform(() => 3.5 + sn(time.get(), 9300, 0.7) * 1 * intensity.get());
  const huOuterOffset = useTransform(() => time.get() * 0.003 * intensity.get());

  // Contract dashed line between the two
  const lineDashA = useTransform(() => 4 + sn(time.get(), 9300, 0.6) * 1.5 * intensity.get());
  const lineDashB = useTransform(() => 7 + sn(time.get(), 11700, 0.2) * 2 * intensity.get());
  const lineOffset = useTransform(() => -time.get() * 0.008 * intensity.get());

  // Decision accent — red square oscillating along the line, never reaching either pole
  const u = useTransform(() => 0.5 + sn(time.get(), 11700) * 0.30 * intensity.get() + sn(time.get(), 7100, 0.4) * 0.05 * intensity.get());
  const accCx = useTransform(() => aiCx.get() + (huCx.get() - aiCx.get()) * u.get());
  const accCy = useTransform(() => aiCy.get() + (huCy.get() - aiCy.get()) * u.get() + sn(time.get(), 19100, 0.17) * 5 * intensity.get());
  const accSize = useTransform(() => 12 + sn(time.get(), 7100, 0.08) * 1.5 * intensity.get());
  const accRot = useTransform(() => (time.get() * 0.012 + sn(time.get(), 13900, 0.3) * 12) * intensity.get());
  const accOuterDashA = useTransform(() => 1.8 + sn(time.get(), 9300, 0.2) * 0.6 * intensity.get());
  const accOuterOffset = useTransform(() => -time.get() * 0.008 * intensity.get());

  // Hairlines — pan via dashOffset
  const hl1Y = useTransform(() => 50 + sn(time.get(), 13900) * 3 * intensity.get());
  const hl1Off = useTransform(() => -time.get() * 0.014 * intensity.get());
  const hl2Y = useTransform(() => 290 + sn(time.get(), 17300, 0.5) * 2 * intensity.get());
  const hl2Off = useTransform(() => time.get() * 0.009 * intensity.get());
  const hl3Y = useTransform(() => 170 + sn(time.get(), 19100, 0.21) * 6 * intensity.get());
  const hl3Off = useTransform(() => -time.get() * 0.005 * intensity.get());

  // Architectural axis — vertical dashed rule that slowly rotates
  const axisRot = useTransform(() => sn(time.get(), 21300, 0.13) * 5 * intensity.get());
  const axisOff = useTransform(() => -time.get() * 0.006 * intensity.get());

  // Pre-built dot grid positions (4 rows × 7 columns)
  const dots: { baseX: number; baseY: number; seed: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 7; c++) {
      dots.push({ baseX: 32 + c * 90, baseY: 42 + r * 86, seed: r * 7 + c * 13 });
    }
  }

  return (
    <motion.g
      style={{ x: camX, y: camY, scale: camScale, rotate: camRot, transformBox: "fill-box", transformOrigin: "center" }}
    >
      {/* Surrounds — constellation of drifting dots */}
      {dots.map((d) => (
        <I08Dot key={d.seed} baseX={d.baseX} baseY={d.baseY} seed={d.seed} time={time} intensity={intensity} />
      ))}

      {/* Hairlines — three architectural rules panning via dashOffset */}
      <motion.line x1={-40} x2={648} stroke={BLACK} strokeOpacity={0.18} strokeWidth={0.8} strokeDasharray="5 11" style={{ y: hl1Y, strokeDashoffset: hl1Off } as any} y1={50} y2={50} />
      <motion.line x1={-40} x2={648} stroke={BLACK} strokeOpacity={0.18} strokeWidth={0.8} strokeDasharray="5 11" style={{ y: hl2Y, strokeDashoffset: hl2Off } as any} y1={290} y2={290} />
      <motion.line x1={-40} x2={648} stroke={BLACK} strokeOpacity={0.10} strokeWidth={0.8} strokeDasharray="5 11" style={{ y: hl3Y, strokeDashoffset: hl3Off } as any} y1={170} y2={170} />

      {/* Architectural axis — vertical rule, slowly rotates */}
      <motion.g style={{ rotate: axisRot, transformBox: "fill-box", transformOrigin: "center" }}>
        <motion.line x1={304} y1={-20} x2={304} y2={360} stroke={BLACK} strokeOpacity={0.10} strokeWidth={0.8} strokeDasharray="2 9" style={{ strokeDashoffset: axisOff } as any} />
      </motion.g>

      {/* Contract dashed line — connecting AI and Human */}
      <motion.line
        x1={aiCx}
        y1={aiCy}
        x2={huCx}
        y2={huCy}
        stroke={BLACK}
        strokeWidth={1.1}
        style={{ strokeDasharray: useTransform(() => `${lineDashA.get()} ${lineDashB.get()}`), strokeDashoffset: lineOffset } as any}
      />

      {/* AI — outer breathing ring + filled circle */}
      <motion.circle
        cx={aiCx}
        cy={aiCy}
        r={aiOuterR}
        fill="none"
        stroke={BLACK}
        strokeOpacity={0.32}
        strokeWidth={0.9}
        style={{ strokeDasharray: useTransform(() => `${aiOuterDashA.get()} 7`), strokeDashoffset: aiOuterOffset } as any}
      />
      <motion.circle cx={aiCx} cy={aiCy} r={aiR} fill={BLACK} />

      {/* Human — outer breathing frame + filled square */}
      <motion.rect
        x={huOuterX}
        y={huOuterY}
        width={huOuterSize}
        height={huOuterSize}
        fill="none"
        stroke={BLACK}
        strokeOpacity={0.30}
        strokeWidth={0.9}
        style={{ strokeDasharray: useTransform(() => `${huOuterDashA.get()} 8`), strokeDashoffset: huOuterOffset } as any}
      />
      <motion.rect x={huX} y={huY} width={huSize} height={huSize} fill={BLACK} />

      {/* Decision accent — red square + outer ring, drifts along the line */}
      <motion.g style={{ x: accCx, y: accCy, rotate: accRot, transformBox: "fill-box", transformOrigin: "center" }}>
        <motion.rect
          x={useTransform(() => -accSize.get() / 2)}
          y={useTransform(() => -accSize.get() / 2)}
          width={accSize}
          height={accSize}
          fill={RED}
        />
        <motion.rect
          x={useTransform(() => -accSize.get() / 2 - 5)}
          y={useTransform(() => -accSize.get() / 2 - 5)}
          width={useTransform(() => accSize.get() + 10)}
          height={useTransform(() => accSize.get() + 10)}
          fill="none"
          stroke={RED}
          strokeOpacity={0.55}
          strokeWidth={0.8}
          style={{ strokeDasharray: useTransform(() => `${accOuterDashA.get()} 4`), strokeDashoffset: accOuterOffset } as any}
        />
      </motion.g>

    </motion.g>
  );
};

const INFOGRAPHICS: Record<string, (props: Ctx) => JSX.Element> = {
  "01": I01,
  "02": I02,
  "03": I03,
  "04": I04,
  "05": I05,
  "06": I06,
  "07": I07,
  "08": I08,
};

export default Infographic;
