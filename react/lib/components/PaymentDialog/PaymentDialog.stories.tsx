import { StoryFn } from '@storybook/react';
import { ButtonThemeName } from '../../buttonThemes';
import PaymentDialog from './PaymentDialog';

import { defaultCurrency, to } from '../../../.storybook/default-args';

export default {
  title: 'PaymentDialog',
  component: PaymentDialog,
  decorators: [
    (Story: StoryFn): JSX.Element => (
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
  args: { to },
  parameters: {
    jest: ['Button'],
  },
};

export const Default = {
  args: {},
};

export const OrangeButtonTheme = {
  args: {
    buttonTheme: ButtonThemeName.ORANGE,
    animation: 'invert',
  },
};

export const UsdAmount = {
  name: 'USD Amount',

  args: {
    amount: 5,
    currency: 'USD',
    text: '$5',
    hoverText: `Pay with ${defaultCurrency}`,
    animation: 'none',
  },
};

export const withGoal = {
  name: 'With Goal',

  args: {
    hoverText: `Pay with ${defaultCurrency}`,
    animation: 'none',
    goalAmount: 100,
  },
};
