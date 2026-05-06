import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "../../charts/Timeline";

const meta: Meta<typeof Timeline> = {
  title: "Charts/Timeline",
  component: Timeline,
  parameters: { layout: "padded" },
  args: {
    items: [
      { date: "2023 Q3", title: "Kickoff", description: "Aligned on scope with heads of product and engineering. One document, one deadline." },
      { date: "2023 Q4", title: "First components shipped", description: "Button, Input, Card. The 20% of the system that covered 70% of usage." },
      { date: "2024 Q1", title: "Cross-team adoption", description: "Four product teams onboarded. Tokens replaced the last of the hex-coded components." },
      { date: "2024 Q2", title: "Measured impact", description: "62% faster time-to-design, 41% fewer brand inconsistencies in QA." },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Timeline>;
export const Default: Story = {};
