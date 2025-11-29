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
 * Normalizes any CSS color value to a hex code using the browser's canvas API
 * Handles hex codes, named colors (e.g., "navy"), rgb(), hsl(), etc.
 */
export const normalizeColorToHex = (color: string): string | null => {
  if (!color) return null;
  
  const trimmed = color.trim();
  if (!trimmed) return null;
  
  // Use canvas to parse any CSS color value
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;
  
  ctx.fillStyle = trimmed;
  // The browser normalizes the color to a hex string (or rgb() for transparent colors)
  return ctx.fillStyle;
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
 * Determines if dark mode should be used based on the color
 * Dark mode is enabled when the color is light (luminance > 0.5)
 * This threshold can be adjusted based on needs
 */
export const darkMode = (color: string, threshold = 0.5): boolean => {
  return getLuminance(color) > threshold;
};
