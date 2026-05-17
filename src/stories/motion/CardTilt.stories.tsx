import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardTilt } from "../../motion/CardTilt";

const meta: Meta<typeof CardTilt> = {
  title: "Motion/CardTilt",
  component: CardTilt,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "3D mouse-tracked hover tilt with a cursor-tracked glare. Max rotation is 4° (line between physical and gimmick). Glare is a radial-gradient highlight set via CSS custom properties — moves with the cursor at 60fps without triggering React re-renders. Mix-blend-mode soft-light keeps it reading as light grazing a glossy surface rather than a painted spot.",
      },
    },
  },
  argTypes: {
    maxRotate: { control: { type: "number", min: 0, max: 20, step: 1 } },
    glareIntensity: { control: { type: "number", min: 0, max: 1, step: 0.02 } },
    glare: { control: { type: "boolean" } },
  },
  args: {
    maxRotate: 4,
    glareIntensity: 0.22,
    glare: true,
  },
};
export default meta;

type Story = StoryObj<typeof CardTilt>;

/** Default — premium-subtle glare on a light card. Move your cursor across the surface slowly. */
export const Default: Story = {
  render: (args) => (
    <CardTilt {...args} className="w-[320px]">
      <div className="bg-card border border-foreground/20 p-10 rounded-2xl aspect-[3/4] flex flex-col justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          Hover me
        </p>
        <h3 className="text-[22px] font-medium tracking-[-0.015em]">
          Move your cursor slowly across this card. Watch how the light
          tracks your position and fades on exit.
        </h3>
      </div>
    </CardTilt>
  ),
};

/** Tilt only — same wrapper, glare disabled. Useful for cards where the surface should stay matte. */
export const NoGlare: Story = {
  args: { glare: false },
  render: (args) => (
    <CardTilt {...args} className="w-[320px]">
      <div className="bg-card border border-foreground/20 p-10 rounded-2xl aspect-[3/4] flex flex-col justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          Tilt only
        </p>
        <h3 className="text-[22px] font-medium tracking-[-0.015em]">
          No glare overlay. Just the 3D tilt.
        </h3>
      </div>
    </CardTilt>
  ),
};

/** Stronger glare — for surfaces that should read as more reflective (a hero card, a featured tile). */
export const StrongerGlare: Story = {
  args: { glareIntensity: 0.4 },
  render: (args) => (
    <CardTilt {...args} className="w-[320px]">
      <div className="bg-card border border-foreground/20 p-10 rounded-2xl aspect-[3/4] flex flex-col justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
          More reflective
        </p>
        <h3 className="text-[22px] font-medium tracking-[-0.015em]">
          Glare intensity bumped to 0.4 for a glossier feel.
        </h3>
      </div>
    </CardTilt>
  ),
};

/** On a dark surface — the glare reads as a soft highlight against near-black. */
export const OnDarkSurface: Story = {
  decorators: [
    (Story) => (
      <div className="bg-cs-dark p-16">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <CardTilt {...args} className="w-[320px]">
      <div className="bg-[#1a1a1a] border border-white/15 p-10 rounded-2xl aspect-[3/4] flex flex-col justify-between text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
          Hover me
        </p>
        <h3 className="text-[22px] font-medium tracking-[-0.015em]">
          Soft-light blend keeps the glare premium on dark surfaces too.
        </h3>
      </div>
    </CardTilt>
  ),
};
