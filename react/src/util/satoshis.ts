import BigNumber from 'bignumber.js';
import { formatPrice, formatBCH, formatXEC, DECIMALS } from './format';
import { currency } from './api-client';
import { randomizeSatoshis } from './randomizeSats';

export type currencyObject = {
  float: number;
  string: string;
  currency: string;
};

export const getCurrencyObject = (
  amount: number,
  currencyType: currency,
  randomSatoshis: boolean | number
): currencyObject => {
  let string = '';
  let float = 0;

  if (currencyType === 'BCH' || currencyType === 'XEC') {
    let newAmount = amount
    if (randomSatoshis) {
      newAmount = randomizeSatoshis(amount, currencyType)
    }
    let primaryUnit = new BigNumber(`${newAmount}`);
    if (primaryUnit !== null && primaryUnit.c !== null) {
      float = parseFloat(new BigNumber(primaryUnit).toFixed(DECIMALS[currencyType]));
      string = new BigNumber(`${primaryUnit}`).toFixed(DECIMALS[currencyType]);
      if (currencyType === 'BCH') {
        string = formatBCH(string);
      } else if (currencyType === 'XEC') {
        string = formatXEC(string);
      }
    }
  } else {
    float = amount;
    string = formatPrice(amount, currencyType, DECIMALS.FIAT);
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
