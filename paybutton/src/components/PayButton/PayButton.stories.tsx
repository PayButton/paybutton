import { Story } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../themes';
import PayButton, { PayButtonProps } from './PayButton';

export default {
  title: 'PayButton',
  component: PayButton,
  decorators: [
    (Story: Story): JSX.Element => (
      <div style={{ margin: 'auto', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { table: { disable: true } },
  },
  args: {
    to: 'bitcoincash:qrtlhvv2dm79ltjq3tsdcn9qzsajpu86ccgjqjfq6j',
  },
  parameters: {
    jest: ['Button'],
  },
};

const Template: Story<PayButtonProps> = props => <PayButton {...props} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Orange = Template.bind({});
Orange.args = { theme: ThemeName.ORANGE };
