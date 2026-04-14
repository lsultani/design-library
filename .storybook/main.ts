import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/welcome/**/*.mdx",
    "../src/stories/tokens/**/*.mdx",
    "../src/stories/**/*.stories.@(ts|tsx)",
    "../src/stories/**/*.mdx",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-mcp", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Docs",
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
