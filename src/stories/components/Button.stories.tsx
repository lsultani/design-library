import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Quiet, squared, letter-spaced. Three variants cover the whole site: primary (ink fill), ghost (hairline outline), text (mono label).",
      },
    },
  },
  args: {
    children: "Start here",
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Text: Story = {
  args: { variant: "text", children: "View work" },
};

export const WithArrow: Story = {
  args: { variant: "primary", arrow: true, children: "Explore" },
};

export const Small: Story = {
  args: { variant: "ghost", size: "sm", children: "Small" },
};
