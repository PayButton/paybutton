import BigNumber from 'bignumber.js';

export const zero = new BigNumber(0);

export const resolveNumber = (value: BigNumber.Value) => {
  return new BigNumber(value);
};

export const zeroIsLessThan = (value: BigNumber.Value) => {
  return zero.isLessThan(value)
}