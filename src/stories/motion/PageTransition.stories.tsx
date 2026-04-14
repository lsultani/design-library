import type { Meta, StoryObj } from "@storybook/react";
import { PageTransition } from "../../motion/PageTransition";

const meta: Meta<typeof PageTransition> = {
  title: "Motion/PageTransition",
  component: PageTransition,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Swiss-geometry page transition. An 8\u00d76 grid of tiles choreographs the exit of one page and the entrance of the next \u2014 each case study in the main site gets its own staging pattern so the transition foreshadows the content. The library demo loops the full sequence (close \u2192 hold \u2192 open) against a placeholder page so you can see the choreography in isolation. Click Replay to re-run.",
      },
    },
  },
  argTypes: {
    pattern: {
      control: "select",
      options: ["radial", "mirror", "wave", "scatter", "staircase", "diagonal"],
    },
    autoPlay: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof PageTransition>;

export const Radial: Story = {
  name: "radial \u2014 burst from center",
  args: { pattern: "radial" },
  parameters: {
    docs: {
      description: {
        story:
          "Radial burst from the canvas center outward. Used for the Robotics case study in the production site \u2014 echoes the orbit geometry on that card.",
      },
    },
  },
};

export const Mirror: Story = {
  name: "mirror \u2014 split from center column",
  args: { pattern: "mirror" },
  parameters: {
    docs: {
      description: {
        story:
          "Mirror split from the center column outward. Used for the Digital Twin case study \u2014 reinforces the mirrored-structure motif.",
      },
    },
  },
};

export const Wave: Story = {
  name: "wave \u2014 horizontal sine",
  args: { pattern: "wave" },
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal sweep with a sine offset per row. Used for 5G Strategy \u2014 the wave shape prefigures the signal geometry on that card.",
      },
    },
  },
};

export const Scatter: Story = {
  name: "scatter \u2014 deterministic random",
  args: { pattern: "scatter" },
  parameters: {
    docs: {
      description: {
        story:
          "Deterministic hash-based scatter. Used for En Verite \u2014 the neural-network card pulses without a predictable order, and this transition matches that feeling.",
      },
    },
  },
};

export const Staircase: Story = {
  name: "staircase \u2014 columns stepping down",
  args: { pattern: "staircase" },
  parameters: {
    docs: {
      description: {
        story:
          "Diagonal staircase from top-left to bottom-right. Used for the Gaming card \u2014 it echoes the rising isometric blocks.",
      },
    },
  },
};

export const Diagonal: Story = {
  name: "diagonal \u2014 top-left sweep",
  args: { pattern: "diagonal" },
  parameters: {
    docs: {
      description: {
        story:
          "Simple diagonal sweep. The fallback pattern for routes outside the case-study set.",
      },
    },
  },
};
