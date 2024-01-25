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
    "@storybook/preset-create-react-app",
  ],

  docs: {
    autodocs: true
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  }
};

export default config
