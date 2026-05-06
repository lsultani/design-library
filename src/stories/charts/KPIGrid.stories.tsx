import type { Meta, StoryObj } from "@storybook/react-vite";
import { KPIGrid } from "../../charts/KPIGrid";

const meta: Meta<typeof KPIGrid> = {
  title: "Charts/KPI Grid",
  component: KPIGrid,
  parameters: { layout: "padded" },
  args: {
    items: [
      { value: "62%", label: "Faster time-to-design", caption: "Across 14 product lines after the system rollout." },
      { value: "14", label: "Product lines unified" },
      { value: "3x", label: "Increase in research-to-ship velocity" },
    ],
    columns: 3,
  },
};
export default meta;
type Story = StoryObj<typeof KPIGrid>;
export const Default: Story = {};
