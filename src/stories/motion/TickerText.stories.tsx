import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TickerText } from "../../motion/TickerText";

const meta: Meta<typeof TickerText> = {
  title: "Motion/TickerText",
  component: TickerText,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Scramble-to-reveal text animation for eyebrow labels. Each character starts as a random glyph and cycles through several random characters before resolving left-to-right. Used on article promo slides for section tags like '/ FIELD OBSERVATION' and nav labels like 'THE DEBATE.'",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TickerText>;

const Demo = ({
  text,
  iterations,
  frameRate,
}: {
  text: string;
  iterations?: number;
  frameRate?: number;
}) => {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col gap-8 items-start">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
      >
        Replay
      </button>
      <TickerText
        key={key}
        text={text}
        iterations={iterations}
        frameRate={frameRate}
        playOnMount
        className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/60"
      />
    </div>
  );
};

export const FieldObservation: Story = {
  render: () => <Demo text="/ Field Observation" />,
};

export const TheDebate: Story = {
  render: () => <Demo text="THE DEBATE" />,
};

export const LongLabel: Story = {
  render: () => <Demo text="/ A Question for Your Team" />,
};

export const SlowDecode: Story = {
  render: () => (
    <Demo text="/ The Parts AI Doesn't Touch" iterations={10} frameRate={50} />
  ),
};
