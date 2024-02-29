import { Meta, StoryObj } from '@storybook/react';
import Widget, { WidgetProps } from './Widget';
import { to } from '../../../.storybook/default-args';
import { ThemeName } from '../../themes';

const defaultArgs = {
  to,
  success: false,
  loading: false,
};

const meta: Meta<WidgetProps> = {
  component: Widget,
  decorators: [
    Story => (
      <div style={{ margin: 'auto', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: defaultArgs,
};

export default meta;
type Story = StoryObj<typeof Widget>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

export const Default: Story = {};

export const Success: Story = {
  args: {
    ...defaultArgs,
    success: true,
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    loading: true,
  },
};

export const WithGoal: Story = {
  args: {
    ...defaultArgs,
    goalAmount: 100,
    theme: {
      palette: {
        primary: '#d05050',
        secondary: '#bee',
        tertiary: '#084',
        logo: '#404',
      },
    },
  },
};

export const OrangeTheme: Story = {
  args: {
    ...defaultArgs,
    theme: ThemeName.ORANGE, //TODO change to themeNames
  },
};

export const CustomTheme: Story = {
  args: {
    ...defaultArgs,
    theme: {
      palette: {
        primary: '#d05050',
        secondary: '#bee',
        tertiary: '#084',
        logo: '#404',
      },
    },
  },
};
