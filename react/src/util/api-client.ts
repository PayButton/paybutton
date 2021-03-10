import axios from 'axios';

export const getAddressDetails = async (
  address: string,
): Promise<AddressDetails> => {
  const res = await fetch(
    `https://rest.bitcoin.com/v2/address/details/${address}`,
  );
  return await res.json();
};

export const getFiatPrice = async (currency: currency): Promise<PriceData> => {
  const { data } = await axios.get(
    `https://markets.api.bitcoin.com/rates/convertor?c=BCH&q=${currency}`,
  );

  const { rate } = data[currency];
  const price: number = Math.round(rate * 100);
  return { price };
};

export const getTransactionDetails = async (
  txid: string,
): Promise<TransactionDetails> => {
  const res = await fetch(
    `https://rest.bitcoin.com/v2/transaction/details/${txid}`,
  );
  return await res.json();
};

export default {
  getAddressDetails,
  getTransactionDetails,
  getFiatPrice,
};

export type fiatCurrency = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';
export type cryptoCurrency = 'BCH' | 'SAT' | 'bits';
export type currency = cryptoCurrency | fiatCurrency;

export interface AddressDetails {
  balance: number;
  balanceSat: number;
  totalReceived: number;
  totalReceivedSat: number;
  totalSent: number;
  totalSentSat: number;
  unconfirmedBalance: number;
  unconfirmedBalanceSat: number;
  unconfirmedTxAppearances: number;
  txAppearances: number;
  transactions: [string];
  legacyAddress: string;
  cashAddress: string;
}

export interface PriceData {
  price: number;
}

export interface TransactionDetails {
  txid: string;
  version: number;
  locktime: number;
  vin: {
    coinbase: string;
    sequence: number;
    n: number;
  }[];
  vout: {
    value: string;
    n: number;
    scriptPubKey: {
      hex: string;
      asm: string;
      addresses: string[];
      type: string;
      cashAddrs: string[];
    };
    spentTxId: string | null;
    spentIndex: number | null;
    spentHeight: number | null;
  }[];
  blockhash: string;
  blockheight: number;
  confirmations: number;
  time: number;
  blocktime: number;
  firstSeenTime: number;
  isCoinBase: boolean;
  valueOut: number;
  size: number;
}
