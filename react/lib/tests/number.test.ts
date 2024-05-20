import BigNumber from 'bignumber.js';
import { zero, resolveNumber, isGreaterThanZero } from '../util/number'; // Adjust the import path

describe('zero', () => {
    it('zero should be an instance of BigNumber and equal to 0', () => {
        expect(zero).toBeInstanceOf(BigNumber);
        expect(zero.isEqualTo(0)).toBe(true);
    });    
})

describe('resolveNumber', () => {
    it('should convert int type to BigNumber', () => {
        expect(resolveNumber(42)).toBeInstanceOf(BigNumber);
        expect(resolveNumber(42).isEqualTo(42)).toBe(true);
      });
      
      it('should convert string representation of int type to BigNumber', () => {
        expect(resolveNumber('42')).toBeInstanceOf(BigNumber);
        expect(resolveNumber('42').isEqualTo(42)).toBe(true);
      });
      
      it('should convert float type to BigNumber', () => {
        const result = resolveNumber(42.8)
        expect(result).toBeInstanceOf(BigNumber);
        expect(result.isEqualTo(42.8)).toBe(true);
      });
      
      it('should convert string representation of float type to BigNumber', () => {
        const result = resolveNumber('42.8')
        expect(result).toBeInstanceOf(BigNumber);
        expect(result.isEqualTo(42.8)).toBe(true);
      });
      
      it('should handle BigNumber instance correctly', () => {
        const bigNumberInstance = new BigNumber(42);
        expect(resolveNumber(bigNumberInstance)).toBeInstanceOf(BigNumber);
        expect(resolveNumber(bigNumberInstance).isEqualTo(42)).toBe(true);
      });
})

describe('isGreaterThanZero', () => {
    it('should correctly identify values less than zero', () => {
        expect(isGreaterThanZero(-1)).toBe(false);
      });
      
      it('should correctly identify string representation of values less than zero', () => {
        expect(isGreaterThanZero('-1')).toBe(false);
      });
      
      it('should correctly identify BigNumber instance of values less than zero', () => {
        expect(isGreaterThanZero(new BigNumber(-1))).toBe(false);
      });
      
      it('should correctly identify zero as not greater than zero', () => {
        expect(isGreaterThanZero(0)).toBe(false);
      });
      
      it('should correctly identify string representation of zero as not greater than zero', () => {
        expect(isGreaterThanZero('0')).toBe(false);
      });
      
      it('should correctly identify zero BigNumber instance as not greater than zero', () => {
        expect(isGreaterThanZero(zero)).toBe(false);
      });
      
      it('should correctly identify values greater than zero', () => {
        expect(isGreaterThanZero(1)).toBe(true);
      });
      
      it('should correctly identify string representation of values greater than zero', () => {
        expect(isGreaterThanZero('1')).toBe(true);
      });
      
      it('should correctly identify BigNumber instance of values greater than zero', () => {
        expect(isGreaterThanZero(new BigNumber(1))).toBe(true);
      });
})


