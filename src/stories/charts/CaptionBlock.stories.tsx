import type { Meta, StoryObj } from "@storybook/react-vite";
import { CaptionBlock } from "../../charts/CaptionBlock";

const meta: Meta<typeof CaptionBlock> = {
  title: "Charts/Caption Block",
  component: CaptionBlock,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "warm", "dark"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CaptionBlock>;

export const ShortLabel: Story = {
  args: {
    caption: "Operator at pick height — 3 min dwell.",
  },
};

export const LongCaptionSplits: Story = {
  args: {
    caption:
      "Two Demo Day story options mapped for executive review. I designed the decision as a visual so the room could compare the paths at a glance. Option B won, because it showcased Edge AI orchestration — the actual core differentiator.",
  },
};

export const OnWarmSurface: Story = {
  args: {
    variant: "warm",
    caption:
      "Mental model. Synthesized data into a comprehensive mental model of how people actually choose games. The reframe came from this artifact — the question wasn't catalog organization, it was emotional connection.",
  },
  decorators: [
    (Story) => (
      <div className="bg-cs-warm p-12">
        <Story />
      </div>
    ),
  ],
};

export const OnDarkSurface: Story = {
  args: {
    variant: "dark",
    caption:
      "Production line, post-deployment. 73% workforce reduction. Processing time dropped from 3–10 business days to 3–24 hours. The shift manager's response was the signal that mattered — the product had crossed over.",
  },
  decorators: [
    (Story) => (
      <div className="bg-cs-dark p-12">
        <Story />
      </div>
    ),
  ],
};
