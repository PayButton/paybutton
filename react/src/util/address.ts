import * as xecaddr from 'xecaddrjs';

export const validateCashAddress = (to: string): boolean => {
  return xecaddr.isCashAddress(to);
};

export default {
  validateCashAddress,
};
