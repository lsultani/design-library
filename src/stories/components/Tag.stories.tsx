import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "../../components/Tag";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    docs: {
      description: {
        component:
          "Mono, uppercase, wide-tracked pill. Used for tech stack, case study meta, and categorization. Never for marketing emphasis.",
      },
    },
  },
  args: {
    children: "React",
  },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const Row: Story = {
  render: () => (
    <div className="flex gap-2">
      {["React", "TypeScript", "Three.js", "Tailwind", "Vite"].map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  ),
};
