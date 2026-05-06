import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCallout } from "../../charts/StatCallout";

const meta: Meta<typeof StatCallout> = {
  title: "Charts/Stat Callout",
  component: StatCallout,
  parameters: { layout: "padded" },
  args: {
    stat: "62%",
    headline: "Faster time-to-design, measured across 14 product lines.",
    supporting:
      "The system didn't replace judgment. It removed the time we used to spend re-solving the same five problems.",
  },
};
export default meta;
type Story = StoryObj<typeof StatCallout>;
export const Default: Story = {};
