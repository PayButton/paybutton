import axios from 'axios';
import _ from 'lodash';
import { Socket } from 'socket.io-client'
import config from '../config.json'
import { isValidCashAddress, isValidXecAddress } from './address';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from './constants';

export const getAddressDetails = async (
  address: string,
  rootUrl = config.apiBaseUrl,
): Promise<Transaction[]> => {
  const res = await fetch(`${rootUrl}/address/transactions/${address}`);
  return res.json();
};

type TxBroadcast = 'NewTx' | 'OldTx'
export interface BroadcastTxData {
  address: string
  txs: Transaction[]
  messageType: TxBroadcast
}

export const setListener = (socket: Socket, setNewTxs: Function): void => {
  socket.on('incoming-txs', (broadcastedTxData: BroadcastTxData) => {
    const unconfirmedTxs = broadcastedTxData.txs.filter(tx => tx.confirmed === false)
    if (broadcastedTxData.messageType === 'NewTx' && unconfirmedTxs.length !== 0) {
      setNewTxs(unconfirmedTxs)
    }
  })
}


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
  currency: currency,
  rootUrl = config.apiBaseUrl,
): Promise<PriceData> => {
  const { data } = await axios.get(
    `${rootUrl}/price/bitcoincash/${_.lowerCase(currency)}`,
  );

  const price: number = data;
  return { price };
};

export const getXecFiatPrice = async (
  currency: currency,
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

export const fiatCurrencies = ['USD', 'CAD'] as const;
export const cryptoCurrencies = ['BCH', 'XEC'] as const;


export function isFiat(unknownString: string): unknownString is fiatCurrency {
  return FIAT_CURRENCIES.includes(unknownString as fiatCurrency);
}

export function isCrypto(
  unknownString: string,
): unknownString is cryptoCurrency {
  return CRYPTO_CURRENCIES.includes(unknownString as cryptoCurrency)
}

export function isValidCurrency(
  unknownString: string,
): unknownString is cryptoCurrency {
  return isFiat(unknownString) || isCrypto(unknownString)
}

export const getCashtabProviderStatus = () => {
  const windowAny = window as any
  if (window && windowAny.bitcoinAbc && windowAny.bitcoinAbc === 'cashtab') {
    return true;
  }
  return false;
};

export interface UtxoDetails {
  outputsList: [Output];
  tokenMetadataList: [TokenMetaData];
}

export interface PriceData {
  price: number;
}
