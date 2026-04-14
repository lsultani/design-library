import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CountUp } from "../../motion/CountUp";

const meta: Meta<typeof CountUp> = {
  title: "Motion/CountUp",
  component: CountUp,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animates from 0 → target when scrolled into view, using the ease-out-expo token. Used on ImpactMetrics to turn a static number into the moment of recognition.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CountUp>;

export const Default: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    return (
      <div className="flex flex-col items-center gap-6">
        <span
          key={key}
          className="font-sans font-medium text-[clamp(4rem,10vw,8rem)] leading-none tracking-[-0.04em] text-foreground"
        >
          <CountUp to={62} suffix="%" duration={1400} />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
          Faster time-to-design
        </span>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
        >
          Replay
        </button>
      </div>
    );
  },
};
