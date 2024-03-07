import { StoryFn } from '@storybook/react';
import React from 'react';
import BarChart from './BarChart';

export default {
  title: 'BarChart',
  component: BarChart,
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
    jest: ['BarChart'],
  },
};

export const Default = {
  args: {
    value: 34,
    color: '#4bc846',
  },
};
