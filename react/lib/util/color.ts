/**
 * Map of common CSS color names to their hex values
 * Focused on colors that are relevant for light/dark detection
 */
const colorNameToHex: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  whitesmoke: '#f5f5f5',
  snow: '#fffafa',
  ghostwhite: '#f8f8ff',
  floralwhite: '#fffaf0',
  ivory: '#fffff0',
  beige: '#f5f5dc',
  azure: '#f0ffff',
  aliceblue: '#f0f8ff',
  mintcream: '#f5fffa',
  honeydew: '#f0fff0',
  seashell: '#fff5ee',
  linen: '#faf0e6',
  oldlace: '#fdf5e6',
  lavenderblush: '#fff0f5',
  mistyrose: '#ffe4e1',
  gainsboro: '#dcdcdc',
  lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  dimgray: '#696969',
  dimgrey: '#696969',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  slategray: '#708090',
  slategrey: '#708090',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  yellow: '#ffff00',
  lightyellow: '#ffffe0',
  lemonchiffon: '#fffacd',
  lightgoldenrodyellow: '#fafad2',
  papayawhip: '#ffefd5',
  moccasin: '#ffe4b5',
  peachpuff: '#ffdab9',
  palegoldenrod: '#eee8aa',
  khaki: '#f0e68c',
  cornsilk: '#fff8dc',
  blanchedalmond: '#ffebcd',
  bisque: '#ffe4c4',
  navajowhite: '#ffdead',
  wheat: '#f5deb3',
  antiquewhite: '#faebd7',
  lightcyan: '#e0ffff',
  cyan: '#00ffff',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  paleturquoise: '#afeeee',
  lightblue: '#add8e6',
  powderblue: '#b0e0e6',
  lightsteelblue: '#b0c4de',
  lightskyblue: '#87cefa',
  skyblue: '#87ceeb',
  lavender: '#e6e6fa',
  plum: '#dda0dd',
  thistle: '#d8bfd8',
  pink: '#ffc0cb',
  lightpink: '#ffb6c1',
  palevioletred: '#db7093',
  lightcoral: '#f08080',
  lightsalmon: '#ffa07a',
  lightgreen: '#90ee90',
  palegreen: '#98fb98',
  lime: '#00ff00',
  limegreen: '#32cd32',
  springgreen: '#00ff7f',
  mediumspringgreen: '#00fa9a',
  greenyellow: '#adff2f',
  chartreuse: '#7fff00',
  lawngreen: '#7cfc00',
  maroon: '#800000',
  darkred: '#8b0000',
  red: '#ff0000',
  brown: '#a52a2a',
  firebrick: '#b22222',
  indianred: '#cd5c5c',
  crimson: '#dc143c',
  tomato: '#ff6347',
  orangered: '#ff4500',
  coral: '#ff7f50',
  darkorange: '#ff8c00',
  orange: '#ffa500',
  gold: '#ffd700',
  goldenrod: '#daa520',
  darkgoldenrod: '#b8860b',
  peru: '#cd853f',
  chocolate: '#d2691e',
  saddlebrown: '#8b4513',
  sienna: '#a0522d',
  burlywood: '#deb887',
  tan: '#d2b48c',
  rosybrown: '#bc8f8f',
  sandybrown: '#f4a460',
  salmon: '#fa8072',
  darksalmon: '#e9967a',
  purple: '#800080',
  darkmagenta: '#8b008b',
  fuchsia: '#ff00ff',
  magenta: '#ff00ff',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  blueviolet: '#8a2be2',
  darkviolet: '#9400d3',
  darkorchid: '#9932cc',
  violet: '#ee82ee',
  orchid: '#da70d6',
  hotpink: '#ff69b4',
  deeppink: '#ff1493',
  rebeccapurple: '#663399',
  indigo: '#4b0082',
  slateblue: '#6a5acd',
  darkslateblue: '#483d8b',
  mediumslateblue: '#7b68ee',
  navy: '#000080',
  darkblue: '#00008b',
  mediumblue: '#0000cd',
  blue: '#0000ff',
  royalblue: '#4169e1',
  cornflowerblue: '#6495ed',
  dodgerblue: '#1e90ff',
  deepskyblue: '#00bfff',
  cadetblue: '#5f9ea0',
  steelblue: '#4682b4',
  teal: '#008080',
  darkcyan: '#008b8b',
  darkturquoise: '#00ced1',
  mediumturquoise: '#48d1cc',
  turquoise: '#40e0d0',
  mediumaquamarine: '#66cdaa',
  green: '#008000',
  darkgreen: '#006400',
  seagreen: '#2e8b57',
  mediumseagreen: '#3cb371',
  forestgreen: '#228b22',
  olive: '#808000',
  darkolivegreen: '#556b2f',
  olivedrab: '#6b8e23',
  darkseagreen: '#8fbc8f',
  yellowgreen: '#9acd32',
};

/**
 * Converts a hex color to RGB values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');
  
  // Handle 3-character hex codes
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Normalizes a color value to a hex code
 * Handles hex codes (with or without #) and named CSS colors
 */
export const normalizeColorToHex = (color: string): string | null => {
  if (!color) return null;
  
  const trimmed = color.trim().toLowerCase();
  
  // Check if it's a named color
  if (colorNameToHex[trimmed]) {
    return colorNameToHex[trimmed];
  }
  
  // Otherwise treat as hex
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
};

/**
 * Calculates the relative luminance of a color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * Returns a value between 0 (black) and 1 (white)
 */
export const getLuminance = (color: string): number => {
  const hex = normalizeColorToHex(color);
  if (!hex) return 0;
  
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // Convert to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Apply gamma correction
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Determines if a color is considered "light"
 * A color is considered light if its luminance is greater than 0.5
 * This threshold can be adjusted based on needs
 */
export const isLightColor = (color: string, threshold = 0.5): boolean => {
  return getLuminance(color) > threshold;
};
