import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../../charts/ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Charts/Progress Bar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  args: {
    label: "Adoption",
    value: 71,
    max: 100,
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <ProgressBar label="Tokens migrated"    value={92} />
      <ProgressBar label="Components adopted" value={71} />
      <ProgressBar label="Teams onboarded"    value={54} />
    </div>
  ),
};
