import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "../../components/Divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Plain: Story = {
  render: () => (
    <div className="w-[500px]">
      <Divider />
    </div>
  ),
};

export const Labelled: Story = {
  render: () => (
    <div className="w-[500px]">
      <Divider label="Section break" />
    </div>
  ),
};
