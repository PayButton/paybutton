import * as xecaddr from 'xecaddrjs';

export const validateCashAddress = (to: string): boolean => {
  console.log('hello 3');
  try {
    return xecaddr.isCashAddress(to);
  } catch (err) {
    console.log('hello 1');
    return false;
  }
};

export const validateXecAddress = (to: string): boolean => {
  try {
    return xecaddr.isXecAddress(to);
  } catch (err) {
    console.log('hello 2');
    return false;
  }
};

export default {
  validateCashAddress,
  validateXecAddress,
};
