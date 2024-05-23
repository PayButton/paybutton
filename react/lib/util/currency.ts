import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from "./constants";
import { CryptoCurrency, FiatCurrency } from "./types";

export function isFiat(unknownString: string): unknownString is FiatCurrency {
    return FIAT_CURRENCIES.includes(unknownString);
  }
  
  export function isCrypto(
    unknownString: string,
  ): unknownString is CryptoCurrency {
    return CRYPTO_CURRENCIES.includes(unknownString);
  }
  
  export function isValidCurrency(
    unknownString: string,
  ): unknownString is CryptoCurrency {
    return isFiat(unknownString) || isCrypto(unknownString);
  }