import type { Meta, StoryObj } from "@storybook/react";
import { NavLink } from "../../components/NavLink";

const meta: Meta<typeof NavLink> = {
  title: "Components/NavLink",
  component: NavLink,
  args: { label: "Hero" },
};
export default meta;
type Story = StoryObj<typeof NavLink>;

export const Inactive: Story = {};
export const Active: Story = { args: { active: true } };

export const RightRail: Story = {
  render: () => (
    <nav className="flex flex-col gap-2">
      {[
        { label: "Hero", active: true },
        { label: "Work", active: false },
        { label: "Impact", active: false },
        { label: "About", active: false },
        { label: "Contact", active: false },
      ].map((l) => (
        <NavLink key={l.label} label={l.label} active={l.active} />
      ))}
    </nav>
  ),
};
