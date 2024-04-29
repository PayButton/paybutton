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

export const isAddressSupported = (address: string): boolean => {
  return xecaddr.isValidAddress(address);
};

export const compareAddresses = (
  addressA: string,
  addressB: string,
): boolean => {
  const prefixes = ['bitcoincash', 'bchtest', 'bchreg', 'ecash', 'ectest'];
  prefixes.forEach(prefix =>
    [addressA, addressB].forEach(a =>
      a.replace(prefix, '').toLocaleUpperCase(),
    ),
  );

  return addressA === addressB;
};

export default {
  isValidCashAddress,
  isValidXecAddress,
  getCurrencyTypeFromAddress,
};
