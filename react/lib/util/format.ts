import currencyFormat from 'currency-formatter';
import { Currency } from './types';
import { DECIMALS } from './constants'

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
  currencyType: Currency,
  precision = DECIMALS.FIAT,
) => {
  return Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyType,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(price);
};

export const formatComma = (number: number) => {
  const formattedString = currencyFormat.format(number, {
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
  const formattedString = currencyFormat.format(val, {
    symbol: '',
    decimal: '.',
    thousand: ',',
    precision: 8,
    format: '%v',
  });

  return formattedString;
};

export const formatXEC = (xec: string) => {
  const val = +xec;
  const formattedString = currencyFormat.format(val, {
    symbol: '',
    decimal: '.',
    thousand: ',',
    precision: 2,
    format: '%v',
  });

  return formattedString;
};

export const isPropsTrue = (value?: string | boolean) => {
  switch (typeof value) {
    case "string":
      return value === "true"
    case "boolean":
      return value
    case "undefined":
      return false
  }
}

export default {
  amount,
  formatPrice,
  formatComma,
  formatBCH,
  formatXEC,
};
