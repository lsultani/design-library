import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  tags: ['autodocs'],

  parameters: {
    layout: "centered",
    backgrounds: {
      options: {
        sultani_background: { name: "Sultani background", value: "hsl(0 0% 88%)" },
        ink_950: { name: "Ink 950", value: "hsl(0 0% 6%)" },
        white: { name: "White", value: "#ffffff" }
      }
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

  initialGlobals: {
    backgrounds: {
      value: "sultani_background"
    }
  }
};

export default preview;
