import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { GanttTimeline } from "../../charts/GanttTimeline";

const meta: Meta<typeof GanttTimeline> = {
  title: "Charts/Gantt Timeline",
  component: GanttTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Multi-track Gantt chart showing parallel workstreams (Research, Design, Engineering, Testing, AI Agent) across a T0→T1 timeline. Bars animate their width on reveal to convey 'streams run together — the handoff disappears.'",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof GanttTimeline>;

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
      <GanttTimeline key={key} />
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };
