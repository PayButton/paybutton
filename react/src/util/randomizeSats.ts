import { cryptoCurrency } from './api-client';
export const randomizeSatoshis = (amount: number, addressType: cryptoCurrency): number => {
  if (amount === 0) {
    return 0;
  }
  const date = new Date();

  // 0-99: 10 second window, resets every 16.5 minutes
  const window =
    Math.floor((date.getUTCMinutes() * 60 + date.getUTCSeconds()) / 10) % 100;
  // 0-99: random
  const random = Math.floor(Math.random() * 100);
  let randomToAdd: number
  let randomizedAmount: number
  let ret: number
  switch (addressType) {
    case 'BCH':
      randomToAdd = random * 1e-6 + // Two random digits
        window * 1e-8; // Two digits for the time window
      randomizedAmount =
        Math.max(0, +amount.toFixed(4)) + // zero out the 4 least-significant digits
        randomToAdd
      ret = +randomizedAmount.toFixed(8);
      break
    case 'XEC':
      randomToAdd = random * 1 + // Two random digits
        window * 1e-2; // Two digits for the time window
      randomizedAmount =
        Math.max(0, +(amount/100).toFixed(0)) + // zero out the 4 least-significant digits
        randomToAdd
      ret = +randomizedAmount.toFixed(2);
      break
    default:
      throw new Error(`Invalid currency: ${addressType}`)
  }
  return ret
};

export default randomizeSatoshis;
