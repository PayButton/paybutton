import { cryptoCurrency } from './api-client';

const DEFAULT = 3
const MAX = 4


export const getNSatoshis = (amount: number, randomSatoshis: boolean | number): number => {
  const amountDigits = amount.toString().replace('.', '').length;
  if (randomSatoshis === true) {
    return Math.min(DEFAULT, amountDigits)
  } else if (randomSatoshis === false) {
    throw new Error("Trying to randomize satoshis when not allowed.")
  }
  if (randomSatoshis > MAX) {
    randomSatoshis = MAX
  }
  return Math.min(randomSatoshis, amountDigits)
}

export const randomizeSatoshis = (amount: number, addressType: cryptoCurrency, randomSatoshis: boolean | number): number => {
  if (amount === 0) {
    return 0;
  }
  const nSatoshis = getNSatoshis(amount, randomSatoshis)

  const random = Math.floor(Math.random() * 10 ** nSatoshis);
  let randomToAdd: number
  let randomizedAmount: number
  let ret: number
  switch (addressType) {
    case 'BCH':
      randomToAdd = random * 1e-8
      randomizedAmount =
        Math.max(0, +amount.toFixed(nSatoshis)) + // zero out the least-significant digits
        randomToAdd
      ret = +randomizedAmount.toFixed(8);
      break
    case 'XEC':
      randomToAdd = random * 1e-2;
        const multiplier = 10 ** (nSatoshis - 2)
        randomizedAmount = Math.max(0, +(Math.floor(amount / multiplier) * multiplier)) + // zero out the least-significant digits
        randomToAdd
      ret = +randomizedAmount.toFixed(2);
      break
    default:
      throw new Error(`Invalid currency: ${addressType}`)
  }
  return ret
};

export default randomizeSatoshis;
