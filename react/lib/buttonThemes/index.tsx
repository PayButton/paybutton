import React, { useContext } from 'react';
import { Theme, createTheme } from '@mui/material/styles'

import { ButtonTheme } from './ButtonTheme';
import orange from './buttonThemes/orange';
import paybutton from './buttonThemes/paybutton';
import xec from './buttonThemes/xec';

export const buttonThemes: Record<ButtonThemeName, ButtonTheme> = { orange, paybutton, xec };

export * from './ButtonTheme';
export default buttonThemes;

export enum ButtonThemeName {
  ORANGE = 'orange',
  PAYBUTTON = 'paybutton',
  XEC = 'xec',
}

export const DEFAULT_THEME = ButtonThemeName.PAYBUTTON;

export const getButtonTheme = (name: ButtonThemeName = DEFAULT_THEME): ButtonTheme =>
  buttonThemes[name];

const ButtonThemeContext = React.createContext<ButtonTheme | undefined>(undefined);

export const ButtonThemeProvider:any = ButtonThemeContext.Provider;

const checkHash = (name: string): string => {
  // const textColor = new RegExp(/^[A-Za-z]+$/, 'i');
  if (name.startsWith('#')) {
    return name;
  } else {
    return `#${name}`;
  }
};

const validateColors = (obj: any, isXec?: boolean): ButtonTheme => {
  const regexp = new RegExp(
    /(#(?:[0-9a-f]{2}){2,4}$|(#[0-9a-f]{3}$)|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\)$|black$|silver$|gray$|whitesmoke$|maroon$|red$|purple$|fuchsia$|green$|lime$|olivedrab$|yellow$|navy$|blue$|teal$|aquamarine$|orange$|aliceblue$|antiquewhite$|aqua$|azure$|beige$|bisque$|blanchedalmond$|blueviolet$|brown$|burlywood$|cadetblue$|chartreuse$|chocolate$|coral$|cornflowerblue$|cornsilk$|crimson$|currentcolor$|darkblue$|darkcyan$|darkgoldenrod$|darkgray$|darkgreen$|darkgrey$|darkkhaki$|darkmagenta$|darkolivegreen$|darkorange$|darkorchid$|darkred$|darksalmon$|darkseagreen$|darkslateblue$|darkslategray$|darkslategrey$|darkturquoise$|darkviolet$|deeppink$|deepskyblue$|dimgray$|dimgrey$|dodgerblue$|firebrick$|floralwhite$|forestgreen$|gainsboro$|ghostwhite$|goldenrod$|gold$|greenyellow$|grey$|honeydew$|hotpink$|indianred$|indigo$|ivory$|khaki$|lavenderblush$|lavender$|lawngreen$|lemonchiffon$|lightblue$|lightcoral$|lightcyan$|lightgoldenrodyellow$|lightgray$|lightgreen$|lightgrey$|lightpink$|lightsalmon$|lightseagreen$|lightskyblue$|lightslategray$|lightslategrey$|lightsteelblue$|lightyellow$|limegreen$|linen$|mediumaquamarine$|mediumblue$|mediumorchid$|mediumpurple$|mediumseagreen$|mediumslateblue$|mediumspringgreen$|mediumturquoise$|mediumvioletred$|midnightblue$|mintcream$|mistyrose$|moccasin$|navajowhite$|oldlace$|olive$|orangered$|orchid$|palegoldenrod$|palegreen$|paleturquoise$|palevioletred$|papayawhip$|peachpuff$|peru$|pink$|plum$|powderblue$|rosybrown$|royalblue$|saddlebrown$|salmon$|sandybrown$|seagreen$|seashell$|sienna$|skyblue$|slateblue$|slategray$|slategrey$|snow$|springgreen$|steelblue$|tan$|thistle$|tomato$|transparent$|turquoise$|violet$|wheat$|white$|yellowgreen$|rebeccapurple$)/,
    'i',
  );
  if (obj === undefined || obj.palette === undefined) {
    return buttonThemes[DEFAULT_THEME];
  } else {
    let { primary, secondary, tertiary, logo } = obj.palette;

    if (primary === undefined || !regexp.test(primary)) {
      primary = isXec ? xec.palette.primary : paybutton.palette.primary
    } else {
      primary = checkHash(primary);
    }

    if (secondary === undefined || !regexp.test(secondary)) {
      secondary = isXec ? xec.palette.secondary : paybutton.palette.secondary
    } else {
      secondary = checkHash(secondary);
    }

    if (tertiary === undefined || !regexp.test(tertiary)) {
      tertiary = isXec ? xec.palette.tertiary : paybutton.palette.tertiary
    } else {
      tertiary = checkHash(tertiary);
    }

    if (logo === undefined || !regexp.test(logo)) {
      logo = isXec ? xec.palette.logo : paybutton.palette.logo
    } else {
      logo = checkHash(logo);
    }

    return { palette: { primary, secondary, tertiary, logo } };
  }
};

export const useButtonTheme = (
  defaultButtonTheme?: ButtonThemeName | ButtonTheme,
  isXec?: boolean,
): ButtonTheme => {
  const validated =
    defaultButtonTheme === undefined && isXec === true
      ? ButtonThemeName.XEC
      : defaultButtonTheme === 'orange' || defaultButtonTheme === 'xec'
      ? defaultButtonTheme
      : validateColors(defaultButtonTheme, isXec);

  const buttonTheme =
    useContext(ButtonThemeContext) ??
    (typeof validated === 'object' ? validated : getButtonTheme(validated));
  return buttonTheme;
};

export const getThemeFromButtonTheme = (buttonTheme: ButtonTheme): Theme => {
  return createTheme({
    palette: {
      primary: {
        main: buttonTheme.palette.primary
      },
      secondary: {
        main: buttonTheme.palette.secondary
      },
    }
  })
}
