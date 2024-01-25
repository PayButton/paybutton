module.exports = {
  "stories": [
    "../lib/**/*.stories.mdx",
    "../lib/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-links",
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