import { Story } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../../themes';
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
    address: 'bitcoincash:qrtlhvv2dm79ltjq3tsdcn9qzsajpu86ccgjqjfq6j',
    loading: false,
    success: false,
  },
};

const Template: Story<WidgetProps> = props => <Widget {...props} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Success = Template.bind({});
Success.args = { success: true };

export const Loading = Template.bind({});
Loading.args = { loading: true };

export const OrangeTheme = Template.bind({});
OrangeTheme.args = { theme: ThemeName.ORANGE };
