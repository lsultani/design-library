import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuoteBlock } from "../../charts/QuoteBlock";

const meta: Meta<typeof QuoteBlock> = {
  title: "Charts/Quote Block",
  component: QuoteBlock,
  parameters: { layout: "padded" },
  args: {
    quote:
      "The system didn't make us faster. It made us stop arguing about the wrong things.",
    attribution: "Design Director, Fortune 100 telco",
    role: "Post-launch retro, Q2",
  },
};
export default meta;
type Story = StoryObj<typeof QuoteBlock>;
export const Default: Story = {};
