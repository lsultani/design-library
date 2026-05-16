import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionProgress } from "../../components/SectionProgress";

const meta: Meta<typeof SectionProgress> = {
  title: "Components/Section Progress",
  component: SectionProgress,
  parameters: { layout: "centered" },
  args: {
    sections: [1, 2, 3, 4, 5],
    activeIndex: 3,
  },
  argTypes: {
    activeIndex: {
      control: { type: "number", min: 0, max: 10 },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SectionProgress>;

/** Static — pass activeIndex directly via the control. */
export const Default: Story = {};

/** No section in view yet (e.g. user is on the case study hero). */
export const NoActive: Story = {
  args: { activeIndex: null },
};

/** Last section in view (footer reading). */
export const LastActive: Story = {
  args: { activeIndex: 5 },
};

/** Three sections instead of five. The pill resizes naturally. */
export const ThreeSections: Story = {
  args: { sections: [1, 2, 3], activeIndex: 2 },
};

/** Interactive — clicking a slot becomes the active one. */
export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState<number | null>(3);
    return (
      <SectionProgress
        sections={[1, 2, 3, 4, 5]}
        activeIndex={active}
        onJump={setActive}
      />
    );
  },
};

/** On a dark surface — the pill carries its own translucent background so
 *  it stays legible. */
export const OverDarkSurface: Story = {
  decorators: [
    (Story) => (
      <div className="bg-cs-dark p-16">
        <Story />
      </div>
    ),
  ],
};
