import * as xecaddr from 'xecaddrjs';
import { CryptoCurrency } from './types';

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

export const getCurrencyTypeFromAddress = (address: string): CryptoCurrency => {
  if (isValidCashAddress(address)) {
    return 'BCH';
  } else if (isValidXecAddress(address)) {
    return 'XEC';
  } else {
    throw new Error('Invalid currency');
  }
};

// Rendering must not blow up on a mistyped address: components use this to keep
// showing their "Invalid Recipient" message instead of crashing.
export const getCurrencyTypeFromAddressOrDefault = (
  address: string,
  fallback: CryptoCurrency = 'XEC',
): CryptoCurrency => {
  try {
    return getCurrencyTypeFromAddress(address);
  } catch {
    return fallback;
  }
};

export default {
  isValidCashAddress,
  isValidXecAddress,
  getCurrencyTypeFromAddress,
  getCurrencyTypeFromAddressOrDefault,
};


const removeAddressPrefix = function (addressString: string): string {
  if (addressString.includes(':')) {
    return addressString.split(':')[1]
  }
  return addressString
}

type NetworkSlugsType = 'ecash' | 'bitcoincash'

export const getAddressPrefix = function (addressString: string): NetworkSlugsType {
  try {
    const format = xecaddr.detectAddressFormat(addressString)
    if (format === xecaddr.Format.Xecaddr) {
      return 'ecash'
    } else if (format === xecaddr.Format.Cashaddr) {
      return 'bitcoincash'
    }
  } catch {
    throw new Error("Invalid address prefix.")
  }
  throw new Error("Invalid address prefix.")
}

export const getAddressPrefixed = function (addressString: string): string {
  return `${getAddressPrefix(addressString)}:${removeAddressPrefix(addressString)}`
}

