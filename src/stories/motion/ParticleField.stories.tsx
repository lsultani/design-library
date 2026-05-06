import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { ParticleField } from "../../motion/ParticleField";
import { CinematicIntro } from "../../motion/CinematicIntro";

const meta: Meta<typeof ParticleField> = {
  title: "Motion/ParticleField",
  component: ParticleField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Three.js particle field that flies 22 wireframe solids (tetrahedra, boxes, dodecahedra, icosahedra) out of the hero name on ignite, then settles into an idle drift. **Interactions**: move the pointer for parallax, click a shape to bump it and emit sparks, click three times within ~2s to dissolve it. Shape-on-shape collisions also occasionally dissolve shapes. On the production site this component mounts full-viewport and listens for the `intro-ignite` window event fired by `CinematicIntro` at the spark moment. In the library we render it inside a 16:9 storybook stage so you can see and click the shapes in isolation.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ParticleField>;

const Stage = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="w-full max-w-3xl">
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
      {children}
    </div>
    {hint && (
      <div className="mt-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-foreground/60">
        {hint}
      </div>
    )}
  </div>
);

/** Runs ParticleField on its own and auto-ignites on mount. */
export const Solo: Story = {
  name: "Solo \u2014 auto-ignite on mount",
  render: () => (
    <Stage hint="click shapes \u2022 3 clicks dissolves them \u2022 move pointer for parallax">
      <ParticleField autoIgnite autoIgniteDelay={300} />
    </Stage>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The shapes fire out of the origin on mount, then decelerate into their idle drift. Use Replay (bottom-right of the canvas) to re-run the burst.",
      },
    },
  },
};

/** Shapes already scattered in idle state \u2014 no burst. */
export const IdleDrift: Story = {
  name: "Idle drift \u2014 skip the intro",
  render: () => (
    <Stage hint="pointer parallax + click interactions, no intro burst">
      <ParticleField introComplete />
    </Stage>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`introComplete` skips the intro and shows the field in its steady-state drift, as it would appear on a return-nav to the home page after the intro has already played once.",
      },
    },
  },
};

/**
 * Combined hero demo: CinematicIntro drives the storyboard on top of a
 * ParticleField layer. The intro fires `intro-ignite` on the window at
 * the spark phase; the particle field listens and bursts its shapes
 * outward at the same instant \u2014 identical wiring to the production
 * hero. Replay remounts both layers together.
 */
const CombinedDemo = () => {
  const [runId, setRunId] = useState(0);
  const [bursted, setBursted] = useState(false);

  // Reset bg when a replay starts, then listen for the burst event from
  // CinematicIntro to flip the stage bg to light in sync with the CSS
  // intro-bg-burst keyframes.
  useEffect(() => {
    setBursted(false);
    const handleBurst = () => setBursted(true);
    window.addEventListener("intro-burst", handleBurst);
    return () => window.removeEventListener("intro-burst", handleBurst);
  }, [runId]);

  return (
    <div className="w-full max-w-3xl">
      <div
        className={`relative w-full overflow-hidden ${bursted ? "intro-bg-burst" : ""}`}
        style={{ aspectRatio: "16 / 9", background: "hsl(var(--foreground))" }}
      >
        {/* Particle field layer \u2014 transparent bg so the stage bg
            shows through, and bursts on the intro-ignite event. */}
        <div className="absolute inset-0" key={`pf-${runId}`}>
          <ParticleField background="transparent" />
        </div>

        {/* Intro in overlay mode \u2014 just the text, no stage, no Replay.
            runKey={runId} makes it restart in sync with the remount above. */}
        <CinematicIntro overlay runKey={runId} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          click shapes after the burst \u2022 intro fires intro-ignite at spark
        </div>
        <button
          onClick={() => setRunId((k) => k + 1)}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
        >
          Replay
        </button>
      </div>
    </div>
  );
};

export const WithIntro: Story = {
  name: "With CinematicIntro (combined hero)",
  render: () => <CombinedDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Closest match to the production hero. The particle field sits behind the intro text. At the spark phase the intro fires `intro-ignite`, the particle field hears it and bursts its 22 shapes outward in sync with the light burst, and the background inverts. After the burst you can click the shapes.",
      },
    },
  },
};
