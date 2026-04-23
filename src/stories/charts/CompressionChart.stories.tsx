import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CompressionChart } from "../../charts/CompressionChart";

const meta: Meta<typeof CompressionChart> = {
  title: "Charts/Compression Chart",
  component: CompressionChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Animated bar comparison showing how AI compresses process phases and what teams do with the reclaimed time. Three rows stage in sequence: Old Process → Compressed Only (with empty 'time left on the table') → Compressed + Reinvested (new activities fill the gap).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CompressionChart>;

const Demo = () => {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col gap-8 items-start">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/60 px-4 py-2 transition-colors"
      >
        Replay
      </button>
      <CompressionChart key={key} />
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };
