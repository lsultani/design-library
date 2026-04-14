import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "../../components/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  args: {
    eyebrow: "Selected Work",
    title: "Fifteen years of systems, ships, and stubbornness.",
    lead: "A short, honest intro to the section below. Body-lg, muted, max 60ch so it stays readable.",
  },
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {};
export const Centered: Story = { args: { align: "center" } };
