import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "../../charts/BarChart";

const meta: Meta<typeof BarChart> = {
  title: "Charts/Bar Chart",
  component: BarChart,
  parameters: { layout: "padded" },
  args: {
    title: "Adoption by product line",
    rows: [
      { label: "Payments",   value: 98, display: "98%" },
      { label: "Wireless",   value: 82, display: "82%" },
      { label: "Enterprise", value: 71, display: "71%" },
      { label: "Consumer",   value: 54, display: "54%" },
      { label: "Research",   value: 39, display: "39%" },
    ],
    max: 100,
  },
};
export default meta;
type Story = StoryObj<typeof BarChart>;
export const Default: Story = {};
