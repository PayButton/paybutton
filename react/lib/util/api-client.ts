import axios from 'axios';
import _ from 'lodash';
import config from '../config.json'
import { isValidCashAddress, isValidXecAddress } from './address';
import {
  Transaction,
  UtxoDetails,
  PriceData,
  TransactionDetails,
  Currency,
  SideshiftShift,
} from './types';
import { isFiat } from './currency';
import { BASE_SIDESHIFT_URL } from './constants';

export const getAddressDetails = async (
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<Transaction[]> => {
  const res = await fetch(`${rootUrl}/address/transactions/${address}`);
  return res.json();
};

export const getAddressBalance = async (
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<number | undefined> => {
  try {
    const res = await axios.get(`${rootUrl}/address/balance/${address}`);

    return isNaN(res.data) ? null : res.data;
  } catch (error) {
    return;
  }

};

export const getUTXOs = async (
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<UtxoDetails> => {
  const res = await fetch(`${rootUrl}/address/utxo/${address}`);
  return res.json();
};

export const getBchFiatPrice = async (
  currency: Currency,
  rootUrl = config.apiBaseUrl,
): Promise<PriceData> => {
  const { data } = await axios.get(
    `${rootUrl}/price/bitcoincash/${_.lowerCase(currency)}`,
  );

  const price: number = data;
  return { price };
};

export const getXecFiatPrice = async (
  currency: Currency,
  rootUrl = config.apiBaseUrl,
): Promise<PriceData> => {
  const { data } = await axios.get(
    `${rootUrl}/price/ecash/${_.lowerCase(currency)}`,
  );

  const price: number = data;
  return { price };
};

export const getFiatPrice = async (currency: string, to: string, apiBaseUrl?: string): Promise<number | null> => {
  try {
    if (isFiat(currency) && isValidCashAddress(to)) {
      const data = await getBchFiatPrice(currency, apiBaseUrl);
      return data.price;
    } else if (isFiat(currency) && isValidXecAddress(to)) {
      const data = await getXecFiatPrice(currency, apiBaseUrl);
      return data.price;
    }
    return null
  } catch (error) {
    console.log('err', error);
  }
  return null
}

export const getTransactionDetails = async (
  txid: string,
  rootUrl = config.apiBaseUrl,
): Promise<TransactionDetails> => {
  const res = await fetch(`${rootUrl}/transactions/details/${txid}`);
  return res.json();
};

export default {
  getAddressDetails,
  getTransactionDetails,
  getBchFiatPrice,
  getXecFiatPrice,
  getAddressBalance,
};

export const getCashtabProviderStatus = () => {
  const windowAny = window as any
  if (window && windowAny.bitcoinAbc && windowAny.bitcoinAbc === 'cashtab') {
    return true;
  }
  return false;
};

export const getShiftStatus = async (shiftId: string): Promise<SideshiftShift> => {
  const res = await fetch(`${BASE_SIDESHIFT_URL}/shifts/${shiftId}`);
  return (await res.json()) as SideshiftShift;
}
