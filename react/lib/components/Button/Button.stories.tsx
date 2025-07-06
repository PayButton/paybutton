import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../themes';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  decorators: [
    (Story) => (
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

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const OrangeTheme: Story = {
  args: {
    theme: ThemeName.ORANGE,
    animation: 'invert',
  },
};
