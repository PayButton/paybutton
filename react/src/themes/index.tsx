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

const checkHash = (name: string): string => {
  const textColor = new RegExp(/^[A-Za-z]+$/, 'i');
  if (name.startsWith('#') || textColor.test(name)) {
    return name;
  }
  return `#${name}`;
};

const validateColors = (obj: any): Theme => {
  const regexp = new RegExp(
    /(#(?:[0-9a-f]{2}){2,4}$|(#[0-9a-f]{3}$)|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\)$|black$|silver$|gray$|whitesmoke$|maroon$|red$|purple$|fuchsia$|green$|lime$|olivedrab$|yellow$|navy$|blue$|teal$|aquamarine$|orange$|aliceblue$|antiquewhite$|aqua$|azure$|beige$|bisque$|blanchedalmond$|blueviolet$|brown$|burlywood$|cadetblue$|chartreuse$|chocolate$|coral$|cornflowerblue$|cornsilk$|crimson$|currentcolor$|darkblue$|darkcyan$|darkgoldenrod$|darkgray$|darkgreen$|darkgrey$|darkkhaki$|darkmagenta$|darkolivegreen$|darkorange$|darkorchid$|darkred$|darksalmon$|darkseagreen$|darkslateblue$|darkslategray$|darkslategrey$|darkturquoise$|darkviolet$|deeppink$|deepskyblue$|dimgray$|dimgrey$|dodgerblue$|firebrick$|floralwhite$|forestgreen$|gainsboro$|ghostwhite$|goldenrod$|gold$|greenyellow$|grey$|honeydew$|hotpink$|indianred$|indigo$|ivory$|khaki$|lavenderblush$|lavender$|lawngreen$|lemonchiffon$|lightblue$|lightcoral$|lightcyan$|lightgoldenrodyellow$|lightgray$|lightgreen$|lightgrey$|lightpink$|lightsalmon$|lightseagreen$|lightskyblue$|lightslategray$|lightslategrey$|lightsteelblue$|lightyellow$|limegreen$|linen$|mediumaquamarine$|mediumblue$|mediumorchid$|mediumpurple$|mediumseagreen$|mediumslateblue$|mediumspringgreen$|mediumturquoise$|mediumvioletred$|midnightblue$|mintcream$|mistyrose$|moccasin$|navajowhite$|oldlace$|olive$|orangered$|orchid$|palegoldenrod$|palegreen$|paleturquoise$|palevioletred$|papayawhip$|peachpuff$|peru$|pink$|plum$|powderblue$|rosybrown$|royalblue$|saddlebrown$|salmon$|sandybrown$|seagreen$|seashell$|sienna$|skyblue$|slateblue$|slategray$|slategrey$|snow$|springgreen$|steelblue$|tan$|thistle$|tomato$|transparent$|turquoise$|violet$|wheat$|white$|yellowgreen$|rebeccapurple$)/,
    'i',
  );

  if (obj === undefined || obj.palette === undefined) {
    return themes[DEFAULT_THEME];
  } else {
    let { primary, secondary, tertiary, logo } = obj.palette;

    primary = checkHash(primary);
    if (!regexp.test(primary)) {
      primary = '#4bc846';
    }

    secondary = checkHash(secondary);
    if (!regexp.test(secondary)) {
      secondary = '#f8fdf8';
    }

    tertiary = checkHash(tertiary);
    if (!regexp.test(tertiary)) {
      tertiary = '#374936';
    }

    logo = checkHash(logo);
    if (!regexp.test(logo)) {
      logo = '#4bc846';
    }
    return { palette: { primary, secondary, tertiary, logo } };
  }
};

export const useTheme = (defaultTheme?: ThemeName | Theme): Theme => {
  const validated =
    defaultTheme === 'orange' ? defaultTheme : validateColors(defaultTheme);

  const theme =
    useContext(ThemeContext) ??
    (typeof validated === 'object' ? validated : getTheme(validated));
  return theme;
};
