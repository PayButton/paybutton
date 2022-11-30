import BigNumber from 'bignumber.js';
import { formatPrice, formatBCH, formatXEC } from './format';
import { currency } from './api-client';

const BCHdecimals = 8;
const XECdecimals = 2;

export type currencyObject = {
  float: number;
  string: string;
  currency: string;
};

export const getCurrencyObject = (
  amount: number,
  currencyType: currency,
): currencyObject => {
  let string = '';
  let float = 0;

  if (currencyType === 'BCH') {
    const primaryUnit = new BigNumber(`${amount}`);

    if (primaryUnit !== null && primaryUnit.c !== null) {
      float = parseFloat(new BigNumber(primaryUnit).toFixed(BCHdecimals));
      string = new BigNumber(`${primaryUnit}`).toFixed(BCHdecimals);
      string = formatBCH(string);
    }
  } else if (currencyType === 'XEC') {
    const primaryUnit = new BigNumber(`${amount}`);

    if (primaryUnit !== null && primaryUnit.c !== null) {
      float = parseFloat(new BigNumber(primaryUnit).toFixed(XECdecimals));
      string = new BigNumber(`${primaryUnit}`).toFixed(XECdecimals);
      string = formatXEC(string);
    }
  } else {
    float = amount;
    string = formatPrice(amount, currencyType, 2);
  }

  return {
    float: float,
    string,
    currency: currencyType,
  };
};

// future token functions

// const toSLPfloat = (amount: number, decimalCount: number) => {
//   let val;
//   if (isDecimal(amount)) {
//     val = new BigNumber(`${amount}e+${decimalCount}`);
//   } else {
//     val = new BigNumber(amount);
//   }

//   return val;
// };

// const isDecimal = (n: number) => {
//   const result = n - Math.floor(n) !== 0;
//   return result;
// };

export default {
  getCurrencyObject,
};
