import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "../../charts/LineChart";

const meta: Meta<typeof LineChart> = {
  title: "Charts/Line Chart",
  component: LineChart,
  parameters: { layout: "padded" },
  args: {
    title: "Research-to-ship velocity",
    points: [
      { label: "Q1", value: 12 },
      { label: "Q2", value: 18 },
      { label: "Q3", value: 22 },
      { label: "Q4", value: 31 },
      { label: "Q5", value: 36 },
      { label: "Q6", value: 42 },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof LineChart>;
export const Default: Story = {};
