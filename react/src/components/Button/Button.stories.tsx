import { StoryFn } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../themes';
import Button, { ButtonProps } from './Button';

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

const Template: StoryFn<ButtonProps> = props => <Button {...props} />;

export const Default = Template.bind({});
Default.args = {};

export const OrangeTheme = Template.bind({});
OrangeTheme.args = {
  theme: ThemeName.ORANGE,
  animation: 'invert',
};
