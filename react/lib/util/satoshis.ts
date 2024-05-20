import BigNumber from 'bignumber.js';
import { formatPrice, formatBCH, formatXEC } from './format';
import { DECIMALS } from './constants'


import { isCrypto } from './api-client';
import { randomizeSatoshis } from './randomizeSats';
import { Currency, CurrencyObject } from './types';


export const getCurrencyObject = (
  amount: number,
  currencyType: Currency,
  randomSatoshis: boolean | number | undefined,
): CurrencyObject => {
  let string = '';
  let float = 0;

  if (isCrypto(currencyType)) {
    let newAmount = randomSatoshis ? randomizeSatoshis(amount, currencyType, randomSatoshis) : amount;
    const decimals = DECIMALS[currencyType]
    const primaryUnit = new BigNumber(`${newAmount}`);

    if (primaryUnit?.c !== null) {
      float = parseFloat(new BigNumber(primaryUnit).toFixed(decimals));
      string = new BigNumber(`${primaryUnit}`).toFixed(decimals);

      if (currencyType === 'BCH') {
        string = formatBCH(string);
      } else if (currencyType === 'XEC') {
        string = formatXEC(string);
      }
    }
  } else {
    float = amount;
    string = formatPrice(amount, currencyType, DECIMALS.FIAT)
  }

  return {
    float,
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
