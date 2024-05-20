import BigNumber from 'bignumber.js';
import { zero, resolveNumber, isGreaterThanZero } from '../util/number'; // Adjust the import path

describe('Number util functions', () => {
  it('zero should be an instance of BigNumber and equal to 0', () => {
    expect(zero).toBeInstanceOf(BigNumber);
    expect(zero.isEqualTo(0)).toBe(true);
  });

  it('resolveNumber should convert various types to BigNumber', () => {
    expect(resolveNumber(42)).toBeInstanceOf(BigNumber);
    expect(resolveNumber(42).isEqualTo(42)).toBe(true);
    
    expect(resolveNumber('42')).toBeInstanceOf(BigNumber);
    expect(resolveNumber('42').isEqualTo(42)).toBe(true);
    
    const bigNumberInstance = new BigNumber(42);
    expect(resolveNumber(bigNumberInstance)).toBeInstanceOf(BigNumber);
    expect(resolveNumber(bigNumberInstance).isEqualTo(42)).toBe(true);
  });

  it('isGreaterThanZero should correctly identify values less than zero', () => {
    expect(isGreaterThanZero(-1)).toBe(false);
    expect(isGreaterThanZero('-1')).toBe(false);
    expect(isGreaterThanZero(new BigNumber(-1))).toBe(false);

    expect(isGreaterThanZero(0)).toBe(false);
    expect(isGreaterThanZero('0')).toBe(false);
    expect(isGreaterThanZero(zero)).toBe(false);

    expect(isGreaterThanZero(1)).toBe(true);
    expect(isGreaterThanZero('1')).toBe(true);
    expect(isGreaterThanZero(new BigNumber(1))).toBe(true);
  });
});
