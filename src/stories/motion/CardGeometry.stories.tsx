import type { Meta, StoryObj } from "@storybook/react";
import { CardGeometry, type CardGeometryId } from "../../motion/CardGeometry";

/**
 * Demo wrapper that puts the canvas on a dark stage. In production the
 * geometry sits on top of the ink-toned 55% image area of a WorkCard;
 * here we show it in a 16:9 frame so you can inspect the animation
 * without the rest of the card chrome.
 */
const Stage = ({ id }: { id: CardGeometryId }) => (
  <div className="w-full max-w-3xl">
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        backgroundColor: "hsl(var(--foreground))",
      }}
    >
      <CardGeometry id={id} size="hero" />
    </div>
    <div className="mt-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-foreground/60">
      geometry-{id}
    </div>
  </div>
);

const meta: Meta<typeof CardGeometry> = {
  title: "Motion/CardGeometry",
  component: CardGeometry,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Canvas-based Swiss-style wireframe animations that sit on the image area of each WorkCard. Each variant is a different drawing function running at 60fps on a `requestAnimationFrame` loop, sized to the container via `ResizeObserver`. Line weight, dash, and alpha all scale with the `size` prop so the same geometry reads on a small card and a hero-sized cover.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CardGeometry>;

export const Robotics: Story = {
  name: "robotics \u2014 fleet orchestration",
  render: () => <Stage id="robotics" />,
  parameters: {
    docs: {
      description: {
        story:
          "Orbiting agents around a central hub. Three dashed orbit rings rotate at different speeds, connected to the hub by flickering lines. A pulsing ring radiates outward from the center every few seconds.",
      },
    },
  },
};

export const DigitalTwin: Story = {
  name: "digital-twin \u2014 mirrored structure",
  render: () => <Stage id="digital-twin" />,
  parameters: {
    docs: {
      description: {
        story:
          "Two halves of a structure \u2014 left side solid, right side dashed \u2014 separated by an animated mirror line. Sync pulses travel horizontally across the mirror at four heights.",
      },
    },
  },
};

export const SignalStrategy: Story = {
  name: "5g-strategy \u2014 flowing waves",
  render: () => <Stage id="5g-strategy" />,
  parameters: {
    docs: {
      description: {
        story:
          "18 horizontal wave lines flow across the canvas. Each has its own phase, amplitude, and frequency modulation, plus traveling dots that ride the wave. Faint vertical accent lines mark signal intervals.",
      },
    },
  },
};

export const NeuralFinance: Story = {
  name: "en-verite \u2014 neural network",
  render: () => <Stage id="en-verite" />,
  parameters: {
    docs: {
      description: {
        story:
          "A 4-layer feed-forward network (3 \u2192 4 \u2192 3 \u2192 2 nodes). Each node breathes at its own frequency; pulses travel along every connection with staggered periods. The output layer has a second, outer glow ring.",
      },
    },
  },
};

export const IsometricGrid: Story = {
  name: "gaming \u2014 isometric blocks",
  render: () => <Stage id="gaming" />,
  parameters: {
    docs: {
      description: {
        story:
          "A 5\u00d75 isometric grid of blocks that rise and fall on independent sine offsets. Depth-sorted polygons render the top, left, and right faces; a dot marks the top-face center.",
      },
    },
  },
};
