import type { Meta, StoryObj } from "@storybook/react";
import { ProcessFlow } from "../../charts/ProcessFlow";

const meta: Meta<typeof ProcessFlow> = {
  title: "Charts/Process Flow",
  component: ProcessFlow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal flow diagram comparing Traditional vs AI-Native process sequences. Boxes with arrows show how capability moves from last to first when teams adopt AI-native workflows. Supports highlighted steps (red outline) to call attention to what shifted.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProcessFlow>;

export const Default: Story = {};
