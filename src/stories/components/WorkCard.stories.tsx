import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkCard } from "../../components/WorkCard";

const meta: Meta<typeof WorkCard> = {
  title: "Components/WorkCard",
  component: WorkCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "3:4 portrait case study card with a 3D hover tilt. Upper 55% is image, lower 45% is title + hook, tags reveal on hover. Bottom and right edges render the card's physical thickness.",
      },
    },
  },
  args: {
    title: "Enterprise Design System at Verizon",
    hook: "Scaled a unified design system across 14 product lines, reducing time-to-design by 62% while holding brand consistency.",
    tags: ["Systems", "Leadership", "B2B"],
  },
};
export default meta;
type Story = StoryObj<typeof WorkCard>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
      <WorkCard title="Enterprise Design System" hook="Scaled across 14 product lines." tags={["Systems", "Leadership"]} />
      <WorkCard title="Customer Onboarding Rebuild" hook="From a 9-step form to a 3-step conversation." tags={["Research", "B2C"]} />
      <WorkCard title="Founder-led Product Launch" hook="Zero-to-one product, shipped in 11 weeks." tags={["0-1", "Founder"]} />
    </div>
  ),
};
