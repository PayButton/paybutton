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
    onSuccess: { table: { disable: true } },
    onTransaction: { table: { disable: true } },
  },
  args: {
    to: 'bitcoincash:qrtlhvv2dm79ltjq3tsdcn9qzsajpu86ccgjqjfq6j',
  },
  parameters: {
    jest: ['Button'],
  },
};

const Template: Story<PayButtonProps> = props => <PayButton {...props} />;

export const Default = Template.bind({});
Default.args = {};

export const OrangeTheme = Template.bind({});
OrangeTheme.args = {
  theme: ThemeName.ORANGE,
  animation: 'invert',
};

export const UsdAmount = Template.bind({});
UsdAmount.storyName = 'USD Amount';
UsdAmount.args = {
  amount: 5,
  currency: 'USD',
  text: '$5',
  hoverText: 'Pay with BCH',
  animation: 'none',
};
