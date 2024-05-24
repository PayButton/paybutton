import { FIAT_CURRENCIES } from "../../util/constants";
import { isCrypto, isValidCurrency, isFiat } from "../../util/currency";

describe('isCrypto', () => {
    it('recognizes valid crypto currencies', () => {
      expect(isCrypto('BCH')).toBeTruthy();
      expect(isCrypto('XEC')).toBeTruthy();
    });

    it('does not recognize invalid crypto currencies', () => {
      expect(isCrypto('BTC')).toBeFalsy();
      expect(isCrypto('ETH')).toBeFalsy();
    });

    it('is case-sensitive', () => {
      expect(isCrypto('bch')).toBeFalsy();
      expect(isCrypto('xec')).toBeFalsy();
    });

    it('returns false for empty strings', () => {
      expect(isCrypto('')).toBeFalsy();
    });

    it('returns false for whitespace or special characters', () => {
      expect(isCrypto(' BCH ')).toBeFalsy();
      expect(isCrypto('BCH@')).toBeFalsy();
    });
  });

  describe('isValidCurrency', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('identifies fiat currencies correctly', () => {
      expect(isValidCurrency('USD')).toBeTruthy();
      expect(isValidCurrency('CAD')).toBeTruthy();
      expect(isValidCurrency('EUR')).toBeFalsy();
      expect(isValidCurrency('GBP')).toBeFalsy();
      expect(isValidCurrency('AUD')).toBeFalsy();
    });

    it('identifies crypto currencies correctly', () => {
      expect(isValidCurrency('BCH')).toBeTruthy();
      expect(isValidCurrency('XEC')).toBeTruthy();
    });

    it('returns false for unrecognized currencies', () => {
      expect(isValidCurrency('XYZ')).toBeFalsy();
      expect(isValidCurrency('ABC')).toBeFalsy();
    });

    it('is case-sensitive', () => {
      expect(isValidCurrency('bch')).toBeFalsy();
      expect(isValidCurrency('usd')).toBeFalsy();
      expect(isValidCurrency('xec')).toBeFalsy();
    });

    it('returns false for spaces or special characters', () => {
      expect(isValidCurrency(' BCH ')).toBeFalsy();
      expect(isValidCurrency('USD@')).toBeFalsy();
    });
  });

  describe('isFiat', () => {
    test('returns true for valid fiat currencies', () => {
      FIAT_CURRENCIES.forEach(currency => {
        expect(isFiat(currency)).toBe(true);
      });
    });
  
    test('returns false for invalid fiat currencies', () => {
      const invalidCurrencies = ['INR', 'JPY', 'BTC', 'ETH', 'XYZ', 'EUR'];
      invalidCurrencies.forEach(currency => {
        expect(isFiat(currency)).toBe(false);
      });
    });
  });