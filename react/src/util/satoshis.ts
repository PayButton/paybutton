import BigNumber from 'bignumber.js';
import { formatPrice, formatComma, formatBCH, formatBits } from './format';
import { fiatCurrency } from './api-client';

const BCHdecimals = 8;
const XECdecimals = 2;

export type cryptoCurrency = 'BCH' | 'SAT' | 'bits' | 'XEC';
export type currency = cryptoCurrency | fiatCurrency;

export const satoshisToBch = (satoshis: number): number =>
  +(satoshis / 100_000_000).toFixed(8);

export const bchToSatoshis = (bch: number): number =>
  Math.round(bch * 100_000_000);

export type currencyObject = {
  float: number;
  string: string;
  currency: string;
  BCHstring?: string | undefined;
  satoshis?: number | undefined;
};

export const getCurrencyObject = (
  amount: number,
  currencyType: currency,
): currencyObject => {
  let string = '';
  let float = 0;
  let BCHval = '';
  let satoshiVal = 0;
  const bchObj = new BigNumber(amount).decimalPlaces(BCHdecimals);
  const inBCH = new BigNumber(amount)
    .dividedBy(10 ** BCHdecimals)
    .toFixed(BCHdecimals);

  const { c } = bchObj;
  // coefficient
  // exponent
  // sign

  if (bchObj && c) {
    if (currencyType === 'SAT') {
      float = c[0];
      string = formatComma(c[0]);
      BCHval = inBCH;
      satoshiVal = float;
    } else if (currencyType === 'BCH') {
      const satoshis = new BigNumber(`${amount}e+${BCHdecimals}`);

      if (satoshis !== null && satoshis.c !== null) {
        float = toBCH(satoshis.c[0]);
        string = new BigNumber(`${satoshis.c[0]}e-8`).toPrecision();
        string = formatBCH(string);
        BCHval = string;
        satoshiVal = satoshis.c[0];
      }
    } else if (currencyType === 'bits') {
      const inBits = new BigNumber(amount).decimalPlaces(2).toFixed(2);

      float = parseFloat(inBits);
      string = formatBits(float);
      BCHval = bchObj.dividedBy(1000000).toFixed(BCHdecimals);
      const sat = bchObj.times(100);
      if (sat.c !== null) {
        satoshiVal = sat.c[0];
      }
    } else {
      float = amount;
      string = formatPrice(amount, currencyType, 2);
    }
  }
  return {
    float: float,
    string,
    currency: currencyType,
    BCHstring: BCHval,
    satoshis: satoshiVal,
  };
};

const toBCH = (amount: number) => {
  const num = new BigNumber(amount).dividedBy(10 ** 8).toFixed(8);
  return parseFloat(num);
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
  satoshisToBch,
  bchToSatoshis,
  getCurrencyObject,
};
