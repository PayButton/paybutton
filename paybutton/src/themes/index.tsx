import React, { useContext } from 'react';

import { Theme } from './Theme';
import orange from './themes/orange';
import paybutton from './themes/paybutton';

export const themes: Record<ThemeName, Theme> = { orange, paybutton };

export * from './Theme';
export default themes;

export enum ThemeName {
  ORANGE = 'orange',
  PAYBUTTON = 'paybutton',
}

const DEFAULT_THEME = ThemeName.PAYBUTTON;

export const getTheme = (name: ThemeName = DEFAULT_THEME): Theme =>
  themes[name];

const ThemeContext = React.createContext<Theme | undefined>(undefined);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = (defaultTheme?: ThemeName | Theme): Theme => {
  const theme =
    useContext(ThemeContext) ??
    (typeof defaultTheme === 'object' ? defaultTheme : getTheme(defaultTheme));
  return theme;
};
