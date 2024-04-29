import { formatPrice, formatBCH, formatXEC, DECIMALS, Currency, isCrypto, randomizeSatoshis, CurrencyObject } from './index';
import { resolveNumber } from './number';


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
    const primaryUnit = resolveNumber(`${newAmount}`);

    if (primaryUnit?.c !== null) {
      float = parseFloat(resolveNumber(primaryUnit).toFixed(decimals));
      string = resolveNumber(`${primaryUnit}`).toFixed(decimals);

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

export default {
  getCurrencyObject,
};
