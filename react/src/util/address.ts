import * as xecaddr from 'xecaddrjs';
import { currency } from '../util/api-client';

export const isValidCashAddress = (address: string): boolean => {
  if (!address) return false;
  try {
    // This should always work, but the xecaddrjs docs warn that some libraries
    // it depends on can return InvalidAddressError
    return xecaddr.isCashAddress(address);
  } catch (err) {
    return false;
  }
};

export const isValidXecAddress = (address: string): boolean => {
  if (!address) return false;
  try {
    // This should always work, but the xecaddrjs docs warn that some libraries
    // it depends on can return InvalidAddressError
    return xecaddr.isXecAddress(address);
  } catch (err) {
    return false;
  }
};

export const getCurrencyTypeFromAddress = (address: string): currency => {
  if (isValidCashAddress(address)) {
    return 'BCH';
  } else if (isValidXecAddress(address)) {
    return 'XEC';
  } else {
    throw new Error('Invalid currency');
  }
};

export default {
  isValidCashAddress,
  isValidXecAddress,
  getCurrencyTypeFromAddress,
};
