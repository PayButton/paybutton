import {
  cashAddressToLockingBytecode,
  decodeCashAddressFormatWithoutPrefix,
} from '@bitauth/libauth';

export const validateCashAddress = (to: string): boolean => {
  const withPrefix = cashAddressToLockingBytecode(to);
  const withoutPrefix = decodeCashAddressFormatWithoutPrefix(to);

  const isValid =
    typeof withPrefix === 'object' || typeof withoutPrefix === 'object';
  return isValid;
};

export default {
  validateCashAddress,
};
