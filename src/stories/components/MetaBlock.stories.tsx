import type { Meta, StoryObj } from "@storybook/react";
import { MetaBlock } from "../../components/MetaBlock";

const meta: Meta<typeof MetaBlock> = {
  title: "Components/MetaBlock",
  component: MetaBlock,
  args: {
    items: [
      { label: "Role", value: "Design Director" },
      { label: "Timeline", value: "Q3 2023 — Q2 2024" },
      { label: "Team", value: "8 designers, 3 researchers" },
      { label: "Scope", value: "Design system, 4 product lines" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof MetaBlock>;

export const Default: Story = {};
