import * as xecaddr from 'xecaddrjs';

/*
import {
  cashAddressToLockingBytecode,
  decodeCashAddressFormatWithoutPrefix,
} from '@bitauth/libauth';
*/
export const validateCashAddress = (to: string): boolean => {
  /*
  const withPrefix = cashAddressToLockingBytecode(to);
  const withoutPrefix = decodeCashAddressFormatWithoutPrefix(to);

  const isValid =
    typeof withPrefix === 'object' || typeof withoutPrefix === 'object';
  return isValid;
  */
  return xecaddr.isCashAddress(to);
};

export default {
  validateCashAddress,
};
