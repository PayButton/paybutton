import { Story } from '@storybook/react';
import React from 'react';

import { ThemeName } from '../../themes';
import Button, { ButtonProps } from './Button';

export default {
  title: 'Button',
  component: Button,
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
    jest: ['Button'],
  },
};

const Template: Story<ButtonProps> = props => <Button {...props} />;

export const Primary = Template.bind({});
Primary.args = {};

export const OrangeTheme = Template.bind({});
OrangeTheme.args = { theme: ThemeName.ORANGE };
