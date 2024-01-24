import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],

  docs: {
    autodocs: true
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {babelModeV7: true}
  }
};

export default config
