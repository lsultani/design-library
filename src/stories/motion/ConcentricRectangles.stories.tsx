import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConcentricRectangles } from "../../motion/ConcentricRectangles";

const meta: Meta<typeof ConcentricRectangles> = {
  title: "Motion/ConcentricRectangles",
  component: ConcentricRectangles,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Nested rectangles that pulse inward toward a vanishing point. Used as a background graphic on article slides (e.g. 'Compression isn't the goal'). Each layer breathes at a staggered phase creating a receding tunnel effect.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ConcentricRectangles>;

const Stage = (props: React.ComponentProps<typeof ConcentricRectangles>) => (
  <div className="w-full max-w-3xl">
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        backgroundColor: "hsl(var(--foreground))",
      }}
    >
      <ConcentricRectangles {...props} />
    </div>
  </div>
);

export const Default: Story = {
  render: () => <Stage />,
};

export const DenseLayers: Story = {
  render: () => <Stage layers={14} speed={0.6} baseOpacity={0.15} />,
};

export const LightBackground: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          backgroundColor: "hsl(var(--background))",
        }}
      >
        <ConcentricRectangles strokeColor="0,0,0" baseOpacity={0.18} />
      </div>
    </div>
  ),
};
