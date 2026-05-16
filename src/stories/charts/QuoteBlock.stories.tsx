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
    variant: "default",
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "warm", "dark"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof QuoteBlock>;

export const Default: Story = {};

export const Warm: Story = {
  args: { variant: "warm" },
  decorators: [
    (Story) => (
      <div className="bg-cs-warm p-12">
        <Story />
      </div>
    ),
  ],
};

export const Dark: Story = {
  args: { variant: "dark" },
  decorators: [
    (Story) => (
      <div className="bg-cs-dark p-12">
        <Story />
      </div>
    ),
  ],
};

export const WithoutRole: Story = {
  args: { role: undefined },
};
