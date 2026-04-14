import type { Meta, StoryObj } from "@storybook/react";
import { LinkStack } from "../../components/LinkStack";

const meta: Meta<typeof LinkStack> = {
  title: "Components/LinkStack",
  component: LinkStack,
  args: {
    title: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "#", external: true },
      { label: "Substack — AI Native Design", href: "#", external: true },
      { label: "Email", href: "mailto:leslie@example.com" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof LinkStack>;

export const Default: Story = {};
