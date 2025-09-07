import { AUTO_CLOSE_DEFAULT_MS } from './constants';

export type AutoCloseValue = boolean | number | string | undefined;

/**
 * Determine auto-close delay (ms) from a variety of allowed input types.
 * Rules:
 * - undefined -> default enabled delay
 * - boolean -> true: default delay; false: disabled (undefined)
 * - number -> >0 seconds: round to nearest ms; <=0: disabled
 * - string -> 'true': default; 'false': disabled; numeric string parsed like number; other strings: default
 */
export function getAutoCloseDelay(value: AutoCloseValue): number | undefined {
  if (value === undefined) return AUTO_CLOSE_DEFAULT_MS;
  if (typeof value === 'boolean') return value ? AUTO_CLOSE_DEFAULT_MS : undefined;
  if (typeof value === 'number') return value > 0 ? Math.round(value * 1000) : undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') return AUTO_CLOSE_DEFAULT_MS;
    if (trimmed === 'false') return undefined;
    const num = +trimmed;
    if (!isNaN(num)) return num > 0 ? Math.round(num * 1000) : undefined;
    return AUTO_CLOSE_DEFAULT_MS;
  }
  return undefined;
}


