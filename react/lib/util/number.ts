import BigNumber from 'bignumber.js';

export const zero = new BigNumber(0);

export const resolveNumber = (value: BigNumber.Value) => {
  return new BigNumber(value);
};

export const isLessThanZero = (value: BigNumber.Value) => {
  const formmatedValue = new BigNumber(value)
  return zero.isLessThan(formmatedValue)
}