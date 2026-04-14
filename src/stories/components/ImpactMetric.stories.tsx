import type { Meta, StoryObj } from "@storybook/react";
import { ImpactMetric } from "../../components/ImpactMetric";

const meta: Meta<typeof ImpactMetric> = {
  title: "Components/ImpactMetric",
  component: ImpactMetric,
  args: {
    value: "62%",
    label: "Faster time-to-design",
    caption: "Measured across 14 product lines after the system rollout.",
  },
};
export default meta;
type Story = StoryObj<typeof ImpactMetric>;

export const Default: Story = {};

export const WithoutCaption: Story = {
  args: { caption: undefined, value: "14", label: "Product lines unified" },
};
