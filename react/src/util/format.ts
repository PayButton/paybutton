import currency from 'currency-formatter';
import { fiatCurrency } from './api-client';

export const amount = (x?: number | null): string | undefined => {
  const clean = +x!;
  if (clean === 0) return;
  return clean
    ?.toFixed(8)
    .replace(/\.0*$/, '')
    .replace(/(\.\d*?)0*$/, '$1');
};

export const formatPrice = (price: number, currencyType: fiatCurrency) => {
  let symbol;

  switch (currencyType) {
    case 'EUR':
      symbol = '€';
      break;
    case 'USD':
      symbol = '$';
      break;
    case 'AUD':
      symbol = '$';
      break;
    case 'CAD':
      symbol = '$';
      break;
    case 'GBP':
      symbol = '£';
      break;
  }

  return currency.format(price, {
    symbol,
    decimal: '.',
    thousand: ',',
    precision: 0,
    format: '%s%v',
  });
};

export default {
  amount,
  formatPrice,
};
