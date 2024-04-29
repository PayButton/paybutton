import BigNumber from 'bignumber.js';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from './constants';
import { Transaction, cryptoCurrency, fiatCurrency } from './types';

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

export const shouldTriggerOnSuccess = (
  transaction: Transaction,
  thisPaymentId?: string,
  cryptoAmount?: string,
  thisOpReturn?: string,
) => {
  const { amount, paymentId, message } = transaction;

  const formattedTxAmount = new BigNumber(amount);
  const formattedAmountSet = cryptoAmount ? new BigNumber(cryptoAmount) : false;
  const formattedTxOpReturn = JSON.stringify(message);
  const formattedOpReturn = JSON.stringify(thisOpReturn);

  const isAmountValid = formattedAmountSet
    ? formattedTxAmount.isEqualTo(formattedAmountSet)
    : true;
  const isPaymentIdValid = thisPaymentId ? thisPaymentId === paymentId : true;
  const isOpReturnValid = thisOpReturn
    ? formattedOpReturn === formattedTxOpReturn
    : true;

  return isAmountValid && isPaymentIdValid && isOpReturnValid;
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
