import { StoryFn } from '@storybook/react';
import React from 'react';

import { ButtonThemeName } from '../../buttonThemes';
import Widget from './Widget';

import { to } from '../../../.storybook/default-args';

export default {
  title: 'Widget',
  component: Widget,
  decorators: [
    (Story: StoryFn): React.ReactNode => (
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
    to,
    loading: false,
    success: false,
  },
};

export const Default = {
  args: {},
};

export const Success = {
  args: {
    success: true,
  },
};

export const Loading = {
  args: {
    loading: true,
  },
};

export const OrangeButtonTheme = {
  args: {
    buttonTheme: ButtonThemeName.ORANGE,
  },
};

export const CustomButtonTheme = {
  args: {
    buttonTheme: {
      palette: {
        primary: '#d05050',
        secondary: '#bee',
        tertiary: '#084',
        logo: '#404',
      },
    },
  },
};

export const WithGoal = {
  args: {
    goalAmount: 100,
    buttonTheme: {
      palette: {
        primary: '#d05050',
        secondary: '#bee',
        tertiary: '#084',
        logo: '#404',
      },
    },
  },
};
