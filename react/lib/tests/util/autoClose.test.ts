import { getAutoCloseDelay } from '../../util/autoClose';
import { AUTO_CLOSE_DEFAULT_MS } from '../../util/constants';

describe('getAutoCloseDelay', () => {
  it('returns default delay for undefined', () => {
    expect(getAutoCloseDelay(undefined)).toBe(AUTO_CLOSE_DEFAULT_MS);
  });

  it('returns default delay for true', () => {
    expect(getAutoCloseDelay(true)).toBe(AUTO_CLOSE_DEFAULT_MS);
  });

  it('returns undefined for false (disabled)', () => {
    expect(getAutoCloseDelay(false)).toBeUndefined();
  });

  it('returns rounded ms for positive numeric seconds', () => {
    expect(getAutoCloseDelay(1)).toBe(1000);
    expect(getAutoCloseDelay(1.234)).toBe(1234);
  });

  it('returns undefined for zero or negative numeric values', () => {
    expect(getAutoCloseDelay(0)).toBeUndefined();
    expect(getAutoCloseDelay(-1)).toBeUndefined();
    expect(getAutoCloseDelay(-0.5)).toBeUndefined();
  });

  it('parses string booleans correctly', () => {
    expect(getAutoCloseDelay('true')).toBe(AUTO_CLOSE_DEFAULT_MS);
    expect(getAutoCloseDelay(' false ')).toBeUndefined();
  });

  it('parses numeric strings as seconds', () => {
    expect(getAutoCloseDelay('2')).toBe(2000);
    expect(getAutoCloseDelay(' 2.5 ')).toBe(2500);
    expect(getAutoCloseDelay('0')).toBeUndefined();
    expect(getAutoCloseDelay('-3')).toBeUndefined();
  });

  it('falls back to default for non-numeric, non-boolean strings', () => {
    expect(getAutoCloseDelay('abc')).toBe(AUTO_CLOSE_DEFAULT_MS);
  });
});


