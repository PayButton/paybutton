import { StoryFn } from '@storybook/react';
import React from 'react';

import { ButtonThemeName } from '../../buttonThemes';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  decorators: [
    (Story: StoryFn): React.ReactNode => (
      <div style={{ margin: 'auto', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { table: { disable: true } },
  },
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
