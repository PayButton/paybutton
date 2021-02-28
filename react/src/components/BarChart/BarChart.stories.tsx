import { Story } from '@storybook/react';
import React from 'react';
import BarChart, { BarChartProps } from './BarChart';

export default {
  title: 'BarChart',
  component: BarChart,
  decorators: [
    (Story: Story): React.ReactNode => (
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

const Template: Story<BarChartProps> = props => <BarChart {...props} />;

export const Default = Template.bind({});
Default.args = {
  value: 34,
  color: '#4bc846',
};
