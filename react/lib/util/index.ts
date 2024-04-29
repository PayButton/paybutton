import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from './constants';
import { cryptoCurrency, fiatCurrency } from './types';

export function isFiat(unknownString: string): unknownString is fiatCurrency {
  return FIAT_CURRENCIES.includes(unknownString);
}

export function isCrypto(
  unknownString: string,
): unknownString is cryptoCurrency {
  return CRYPTO_CURRENCIES.includes(unknownString);
}

export function isValidCurrency(
  unknownString: string,
): unknownString is cryptoCurrency {
  return isFiat(unknownString) || isCrypto(unknownString);
}

export const getCashtabProviderStatus = () => {
  const windowAny = window as any;
  if (window && windowAny.bitcoinAbc && windowAny.bitcoinAbc === 'cashtab') {
    return true;
  }
  return false;
};

export * from './address';
export * from './api-client';
export * from './constants';
export * from './format';
export * from './opReturn';
export * from './randomizeSats';
export * from './satoshis';
export * from './socket';
export * from './types';
