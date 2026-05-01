import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Infographic from "../../motion/Infographic";

/**
 * Infographic — continuous time-driven cinematic motion piece.
 *
 * One file, eight pieces (numbered "01" through "08"), one per article
 * in the AI-Native Design Series. Each is keyed by `num`. The component
 * is otherwise just an SVG with `viewBox="0 0 608 340"` and a `hovered`
 * boolean that turns the motion on or off.
 *
 * Architectural rules — the things that make these feel like motion
 * design and not UI transitions:
 *
 *   1. **No keyframes. No states. No scenes.** Every visual property
 *      (x, y, scale, rotation, pathLength) is computed live every frame
 *      as a sum of pure sinusoids:
 *
 *          value(t) = base + Σ sin(t / period_i + phase_i) * amp_i
 *
 *      Periods are chosen as primes / near-primes (9100, 11700, 13900,
 *      17300, 21300 ms…) so no two oscillators share a common multiple.
 *      The system never returns to its starting configuration.
 *
 *   2. **Hover is amplitude, not state.** A spring-driven `intensity`
 *      motion value swells from 0 (rest) to 1 (hover). Every amplitude
 *      multiplies by `intensity`, so at rest every sin contribution is
 *      exactly zero and the composition is held still. On hover the
 *      motion fades up; on hover-out it fades back down. There is no
 *      scene to switch to.
 *
 *   3. **Camera always drifts.** Each piece wraps its content in a
 *      parent `<motion.g>` with continuous x / scale / rotate driven
 *      by sine. Slow pan, scale, drift — never cuts to a new viewpoint.
 *
 *   4. **No opacity 0 → 1 pops.** Elements that need to "appear"
 *      either translate into frame from off-canvas, or draw themselves
 *      via `pathLength`. Opacity is reserved for trail echoes.
 *
 *   5. **Loop point is invisible.** Because the motion is two coupled
 *      sines on incommensurate periods, there is no "end" to the
 *      animation — and nowhere it could cut back to a start.
 *
 * The eight pieces:
 *
 *   01 RESHAPE — 10 rectangles on Lissajous orbits, sizes pulse on
 *      independent periods.
 *   02 DEFINITION — a red rectangle's width and height are inverse
 *      sinusoids; it morphs continuously through every aspect ratio
 *      from horizontal bolt to vertical column.
 *   03 NEW JOB — radiating spokes from a central hub, each with its
 *      own pulse period; small dots travel along each spoke.
 *   04 FRAMEWORK — a single red marker tracing a Lissajous figure
 *      across the 2x2 matrix; three trail circles sample older
 *      positions to leave a wake.
 *   05 ARGUMENT — 14 dashes shimmering at phase-offset frequencies;
 *      a single line below breathes via continuous pathLength.
 *   06 LIMIT — two horizontal tracks driven by ±sin(t/p₁); they
 *      pass through every relationship — converging, parallel,
 *      diverging — continuously.
 *   07 SHIFT — three textures stacked, each on its own oscillator:
 *      compression, inversion, parallel waves.
 *   08 GAP — three reaching segments from each side of a void,
 *      none ever simultaneously connect; a red ? in the middle.
 */

const HoverPlaying = ({ num, label }: { num: string; label?: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="bg-[#E0E0E0] rounded-none border border-foreground/[0.06] aspect-[608/340] w-full max-w-[480px] cursor-default focus:outline-none focus-visible:outline-2 focus-visible:outline-[#0F0F0F]"
      style={{ transition: "background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <Infographic num={num} hovered={hovered} className="w-full h-full block" />
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mt-3">
          {label}
        </p>
      )}
    </div>
  );
};

const meta: Meta<typeof Infographic> = {
  title: "Motion/Infographic",
  component: Infographic,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Continuous time-driven cinematic motion. Eight pieces (one per article in the AI-Native Series), each computed live every frame as a sum of sinusoids on incommensurate periods. Hover plays the motion; rest holds the composition still. No keyframes, no states, no cuts.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Infographic>;

/**
 * Reshape (01). Hover to see the field of rectangles drift on Lissajous
 * orbits. Each rectangle has its own (period_x, period_y, phase) — the
 * arrangement never repeats.
 */
export const Reshape: Story = {
  render: () => <HoverPlaying num="01" />,
};

/**
 * Definition (02). The red rectangle's width and height are inverse
 * sinusoids on the same period — as one shrinks the other grows. Hover
 * and watch it cycle through every aspect ratio between bolt-shape
 * (horizontal flat) and column-shape (vertical narrow). Its center
 * traces a Lissajous independent of its aspect cycle.
 */
export const Definition: Story = {
  render: () => <HoverPlaying num="02" />,
};

/**
 * Framework (04). A single red marker traces a Lissajous figure across
 * the 2x2 matrix. Three trail circles render the marker's position
 * 300ms, 600ms, and 900ms in the past, so the marker leaves a
 * continuous wake.
 */
export const Framework: Story = {
  render: () => <HoverPlaying num="04" />,
};

/**
 * Limit (06). Two horizontal tracks. Top track y = sin(t/11.3s) * 40.
 * Bottom track y = -sin(t/11.3s) * 40. The piece passes through
 * convergence, parallel, divergence continuously and never lands on
 * any of them.
 */
export const Limit: Story = {
  render: () => <HoverPlaying num="06" />,
};

/**
 * Gap (08). Three reaching segments oscillate inward toward the void
 * from each side, never simultaneously connect. A red ? swells in the
 * gap on its own period. The non-connection is the subject.
 */
export const Gap: Story = {
  render: () => <HoverPlaying num="08" />,
};

/**
 * All eight pieces in a 4x2 grid. Hover any tile to play that piece.
 * The motion is independent per tile — different periods, different
 * phases, no cross-card synchronization.
 */
export const AllEight: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-10">
      {["01", "02", "03", "04", "05", "06", "07", "08"].map((n) => (
        <HoverPlaying key={n} num={n} label={`No. ${n}`} />
      ))}
    </div>
  ),
};
