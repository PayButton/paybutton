import { Story } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../themes';
import Widget, { WidgetProps } from './Widget';

export default {
  title: 'Widget',
  component: Widget,
  decorators: [
    (Story: Story): React.ReactNode => (
      <div style={{ margin: 'auto', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    success: { control: 'boolean' },
    ButtonComponent: { table: { disable: true } },
    foot: { table: { disable: true } },
  },
  args: {
    to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
    loading: false,
    success: false,
  },
};

const Template: Story<WidgetProps> = props => <Widget {...props} />;

export const Default = Template.bind({});
Default.args = {};

export const Success = Template.bind({});
Success.args = {
  success: true,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const OrangeTheme = Template.bind({});
OrangeTheme.args = {
  theme: ThemeName.ORANGE,
};

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  theme: {
    palette: {
      primary: '#d05050',
      secondary: '#bee',
      tertiary: '#084',
      logo: '#404',
    },
  },
};

export const WithGoal = Template.bind({});
WithGoal.args = {
  goalAmount: 950,
  theme: {
    palette: {
      primary: '#d05050',
      secondary: '#bee',
      tertiary: '#084',
      logo: '#404',
    },
  },
};
