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

export const formatPrice = (
  price: number,
  currencyType: fiatCurrency,
  precision = 0,
) => {
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
    precision: precision,
    format: '%s%v',
  });
};

export const formatComma = (number: number) => {
  const formattedString = currency.format(number, {
    symbol: '',
    decimal: '',
    thousand: ',',
    precision: 0,
    format: '%v',
  });

  return formattedString;
};

export const formatBCH = (bch: string) => {
  const val = +bch;
  const formattedString = currency.format(val, {
    symbol: '',
    decimal: '.',
    thousand: ',',
    precision: 8,
    format: '%v',
  });

  return formattedString;
};

export default {
  amount,
  formatPrice,
  formatComma,
  formatBCH,
};
