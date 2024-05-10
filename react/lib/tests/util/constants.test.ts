import { CRYPTO_CURRENCIES, DECIMALS } from "../../util/constants";

describe('Constants Tests', () => {
    describe('CRYPTO_CURRENCIES array', () => {
        test('contains specific cryptocurrencies', () => {
            const expectedCurrencies = ['BCH', 'XEC'];
            expectedCurrencies.forEach(currency => {
                expect(CRYPTO_CURRENCIES).toContain(currency);
            });
        });

        test('only contains strings', () => {
            CRYPTO_CURRENCIES.forEach(currency => {
                expect(typeof currency).toBe('string');
            });
        });
    });

    describe('DECIMALS object', () => {
        test('contains keys for BCH, XEC, and FIAT', () => {
            const expectedKeys = ['BCH', 'XEC', 'FIAT'];
            expectedKeys.forEach(key => {
                expect(DECIMALS).toHaveProperty(key);
            });
        });

        test('has correct decimal values', () => {
            expect(DECIMALS.BCH).toBe(8);
            expect(DECIMALS.XEC).toBe(2);
            expect(DECIMALS.FIAT).toBe(2);
        });

        test('values are numbers', () => {
            Object.values(DECIMALS).forEach(value => {
                expect(typeof value).toBe('number');
            });
        });
    });
});