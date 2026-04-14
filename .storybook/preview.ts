import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "Sultani background",
      values: [
        { name: "Sultani background", value: "hsl(0 0% 88%)" },
        { name: "Ink 950", value: "hsl(0 0% 6%)" },
        { name: "White", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Welcome",
          "Tokens",
          ["Colors", "Typography", "Spacing", "Motion"],
          "Components",
          "Charts",
          "Motion",
        ],
      },
    },
  },
};

export default preview;
