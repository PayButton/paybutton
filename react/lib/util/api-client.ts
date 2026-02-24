import axios from 'axios';
import _ from 'lodash';
import config from '../paybutton-config.json'
import { getAddressPrefix, isValidCashAddress, isValidXecAddress } from './address';
import {
  Transaction,
  UtxoDetails,
  PriceData,
  TransactionDetails,
  Currency,
} from './types';
import { isFiat } from './currency';
import { CURRENCY_TYPES_MAP, DECIMALS } from './constants';
import Decimal from 'decimal.js';

interface SimplifiedTransaction {
  hash: string
  amount: Decimal
  paymentId: string
  confirmed?: boolean
  message: string
  timestamp: number
  address: string
  rawMessage: string
  inputAddresses: Array<{
    address: string
    amount: Decimal
  }>
  outputAddresses: Array<{
    address: string
    amount: Decimal
  }>
  prices: Array<{
    price: {
      value: Decimal
      quoteId: number
    }
  }>
}

export const getAddressDetails = async (
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<Transaction[]> => {
  const res = await fetch(`${rootUrl}/address/transactions/${address}`);

  if (!res.ok) {
    console.warn(`Received invalid response from ${rootUrl}/address/transactions/${address}`);
    return [];
  }

  let apiTransactions;
  try {
    apiTransactions = await res.json();
  } catch (error) {
    console.warn(`Failed to fetch address transactions from ${rootUrl}/address/transactions/${address}`, error);
    return [];
  }

  if (!Array.isArray(apiTransactions)) {
    console.warn(`Received invalid data from ${rootUrl}/address/transactions/${address}`, apiTransactions);
    return [];
  }

  const transactions: Transaction[] = [];
  apiTransactions.forEach((apiTransaction: SimplifiedTransaction) => {
    const opReturn = {
      rawMessage: apiTransaction.rawMessage,
      message: apiTransaction.message,
      paymentId: apiTransaction.paymentId,
    };
    const transaction: Transaction = {
      hash: apiTransaction.hash,
      amount: apiTransaction.amount.toString(),
      paymentId: apiTransaction.paymentId,
      confirmed: apiTransaction.confirmed,
      message: apiTransaction.message,
      timestamp: apiTransaction.timestamp,
      address: apiTransaction.address,
      rawMessage: apiTransaction.rawMessage,
      // Only keep the address string, drop the amount
      inputAddresses: Array.isArray(apiTransaction.inputAddresses) ? apiTransaction.inputAddresses.map((input: { address: string, amount: string }) => input.address) : [],
      opReturn: JSON.stringify(opReturn),
    };
    transactions.push(transaction);
  });

  return transactions;
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

export const createPayment = async (
  amount: string | number | undefined,
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<string | undefined> => {
  const prefix = getAddressPrefix(address)
  const decimals = DECIMALS[CURRENCY_TYPES_MAP[prefix]]
  const safeAmount = amount !== undefined && amount !== null
    ? Number(amount).toFixed(decimals)
    : undefined
  const { data, status } = await axios.post(
    `${rootUrl}/api/payments/paymentId`,
    { amount: safeAmount, address }
  );

  if (status === 200) {
    return data.paymentId;
  }
  throw new Error(`Failed to generate payment ID. Status: ${status}, Response: ${JSON.stringify(data)}`)

};


export default {
  getAddressDetails,
  getTransactionDetails,
  getBchFiatPrice,
  getXecFiatPrice,
  getAddressBalance,
};

