import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardTilt } from "../../motion/CardTilt";

const meta: Meta<typeof CardTilt> = {
  title: "Motion/CardTilt",
  component: CardTilt,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "3D mouse-tracked hover tilt. WorkCard uses this, but it's exposed as a wrapper so any card-shaped thing can inherit the feel. Max rotation is 4°, which is the line between 'physical' and 'gimmick'.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CardTilt>;

export const Default: Story = {
  render: () => (
    <CardTilt className="w-[320px]">
      <div className="bg-card border border-foreground/20 p-10 rounded-2xl aspect-[3/4] flex flex-col justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          Hover me
        </p>
        <h3 className="text-[22px] font-medium tracking-[-0.015em]">
          Move your cursor across this card slowly. Notice how it arrives and settles.
        </h3>
      </div>
    </CardTilt>
  ),
};
