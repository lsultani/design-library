import type { Meta, StoryObj } from "@storybook/react";
import { CinematicIntro } from "../../motion/CinematicIntro";

const meta: Meta<typeof CinematicIntro> = {
  title: "Motion/CinematicIntro",
  component: CinematicIntro,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Full storyboard of the home-page intro: blinking cursor \u2192 sentence types in \u2192 brief hold \u2192 cursor catches fire with radiating embers \u2192 light burst that inverts the background \u2192 rest state. The production hero layers a Three.js particle field on top of this; the rest of the choreography is identical. Click Replay to re-run.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CinematicIntro>;
export const Default: Story = {};
