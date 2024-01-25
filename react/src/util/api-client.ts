import axios from 'axios';
import _ from 'lodash';
import { Socket } from 'socket.io-client'
import config from '../paybutton-config.json'

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

export const getFiatPrice = async (
  fiat: fiatCurrency,
  crypto: cryptoCurrency,
  rootUrl = config.apiBaseUrl,
): Promise<PriceData> => {
  // TODO: get rid of 'getXecFiatPrice' && 'getBchFiatPrice' and replace
  // with this function.
  let url = '';

  switch (crypto) {
    case 'BCH':
      url = `${rootUrl}/price/bitcoincash/${_.lowerCase(fiat)}`;
      break;
    case 'XEC':
      url = `${rootUrl}/price/ecash/${_.lowerCase(fiat)}`;
      break;
  }
  if (!url) {
    throw new Error('No url');
  } else {
    const { data } = await axios.get(url);

    const price: number = data;
    return { price };
  }
};

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

export const fiatCurrencies = ['USD', 'CAD', 'EUR', 'GBP', 'AUD'] as const;
type fiatCurrenciesTuple = typeof fiatCurrencies; // readonly ['USD', 'CAD', 'EUR', 'GBP', 'AUD']
export type fiatCurrency = fiatCurrenciesTuple[number]; // "USD" | "CAD" | "EUR" | "GBP" | "AUD"

export const cryptoCurrencies = ['BCH', 'XEC'] as const;
type cryptoCurrenciesTuple = typeof cryptoCurrencies; // readonly ['BCH', 'XEC']
export type cryptoCurrency = cryptoCurrenciesTuple[number]; // "BCH" | "XEC"

export type currency = cryptoCurrency | fiatCurrency;

export function isFiat(unknownString: string): unknownString is fiatCurrency {
  return fiatCurrencies.includes(unknownString as fiatCurrency);
}

export function isCrypto(
  unknownString: string,
): unknownString is cryptoCurrency {
  return cryptoCurrencies.includes(unknownString as cryptoCurrency)
}

export function isValidCurrency(
  unknownString: string,
): unknownString is cryptoCurrency {
  return isFiat(unknownString) || isCrypto(unknownString)
}

// export interface AddressDetails {
//   balance: number;
//   balanceSat: number;
//   totalReceived: number;
//   totalReceivedSat: number;
//   totalSent: number;
//   totalSentSat: number;
//   unconfirmedBalance: number;
//   unconfirmedBalanceSat: number;
//   unconfirmedTxAppearances: number;
//   txAppearances: number;
//   transactions: [string];
//   legacyAddress: string;
//   cashAddress: string;
// }

export const getCashtabProviderStatus = () => {
  const windowAny = window as any
  console.log(windowAny.bitcoinAbc);
  if (window && windowAny.bitcoinAbc && windowAny.bitcoinAbc === 'cashtab') {
    return true;
  }
  return false;
};

export interface Transaction {
  id: string;
  hash: string;
  amount: string;
  opReturn?: {
    paymentId: string;
    data: any;
  };
  confirmed: boolean;
  timestamp: number;
  addressId: string;
  createdAt: string;
  updatedAt: string;
  address: {
    id: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    networkId: number;
    lastSynced: string;
  };
  prices: [
    {
      priceId: number;
      transactionId: string;
      createdAt: string;
      updatedAt: string;
      price: {
        id: number;
        value: string;
        createdAt: string;
        updatedAt: string;
        timestamp: number;
        networkId: 1;
        quoteId: 1;
      };
    },
  ];
}

// This below is old, it referred to the GRPC implementation
/*
export interface AddressDetails {
  confirmedTransactionsList: [ConfirmedTransaction];
  unconfirmedTransactionsList: [UnconfirmedTransaction];
}
export interface ConfirmedTransaction {
  hash: string;
  version: number;
  inputsList: {
    index: number;
    outpoint: {
      hash: string;
      index: number;
    };
    signatureScript: string;
    sequence: number;
    value: number;
    previousScript: string;
    address: string;
  }[];
  outputsList: {
    index: number;
    value: number;
    pubkeyScript: string;
    address: string;
    scriptClass: string;
    disassembledScript: string;
  }[];
  lockTime: number;
  size: number;
  timestamp: number;
  confirmations: number;
  blockHeight: number;
  blockHash: string;
  slpTransactionInfo: {
    slpAction: number;
    validityJudgement: number;
    parseError: string;
    tokenId: string;
    burnFlagsList: [];
  };
}

export interface UnconfirmedTransaction {
  transaction: {
    hash: string;
    version: number;
    inputsList: {
      index: number;
      outpoint: {
        hash: string;
        index: number;
      };
      signatureScript: string;
      sequence: number;
      value: number;
      previousScript: string;
      address: string;
    }[];
    outputsList: {
      index: number;
      value: number;
      pubkeyScript: string;
      address: string;
      scriptClass: string;
      disassembledScript: string;
    }[];
    lockTime: number;
    size: number;
    timestamp: number;
    confirmations: number;
    blockHeight: number;
    blockHash: string;
    slpTransactionInfo: {
      slpAction: number;
      validityJudgement: number;
      parseError: string;
      tokenId: string;
      burnFlagsList: [];
    };
  };
  addedTime: number;
  addedHeight: number;
  fee: number;
  feePerKb: number;
  startingPriority: number;
}
*/

export interface UtxoDetails {
  outputsList: [Output];
  tokenMetadataList: [TokenMetaData];
}

export interface Output {
  outpoint: {
    hash: string;
    index: number;
  };
  pubkeyScript: string;
  value: number;
  isCoinbase: boolean;
  blockHeight: number;
}

export interface TokenMetaData {
  tokenId: string;
  tokenType: number;
  v1Fungible: {
    tokenTicker: string;
    tokenName: string;
    tokenDocumentUrl: string;
    tokenDocumentHash: string;
    decimals: number;
    mintBatonHash: string;
    mintBatonVout: number;
  };
}

export interface PriceData {
  price: number;
}

export interface TransactionDetails {
  transaction: {
    hash: string;
    version: number;
    inputsList: {
      index: number;
      outpoint: {
        hash: string;
        index: number;
      };
      signatureScript: string;
      sequence: number;
      value: number;
      previousScript: string;
      address: string;
      slpToken: {
        tokenId: string;
        amount: string;
        isMintBaton: boolean;
        address: string;
        decimals: number;
        slpAction: number;
        tokenType: number;
      };
    }[];
    outputsList: {
      index: number;
      value: number;
      pubkeyScript: string;
      address: string;
      scriptClass: string;
      disassembledScript: string;
      slpToken?: {
        tokenId: string;
        amount: string;
        isMintBaton: boolean;
        address: string;
        decimals: number;
        slpAction: number;
        tokenType: number;
      };
    }[];
    lockTime: number;
    size: number;
    timestamp: number;
    confirmations: number;
    blockHeight: number;
    blockHash: string;
    slpTransactionInfo: {
      slpAction: number;
      validityJudgement: number;
      parseError: string;
      tokenId: string;
      burnFlagsList: [number];
      v1Nft1ChildGenesis: {
        name: string;
        ticker: string;
        documentUrl: string;
        documentHash: string;
        decimals: number;
        groupTokenId: string;
      };
    };
  };
  tokenMetadata: {
    tokenId: string;
    tokenType: number;
    v1Nft1Child: {
      tokenTicker: string;
      tokenName: string;
      tokenDocumentUrl: string;
      tokenDocumentHash: string;
      groupId: string;
    };
  };
}

// export interface TransactionDetails {
//   txid: string;
//   version: number;
//   locktime: number;
//   vin: {
//     coinbase: string;
//     sequence: number;
//     n: number;
//   }[];
//   vout: {
//     value: string;
//     n: number;
//     scriptPubKey: {
//       hex: string;
//       asm: string;
//       addresses: string[];
//       type: string;
//       cashAddrs: string[];
//     };
//     spentTxId: string | null;
//     spentIndex: number | null;
//     spentHeight: number | null;
//   }[];
//   blockhash: string;
//   blockheight: number;
//   confirmations: number;
//   time: number;
//   blocktime: number;
//   firstSeenTime: number;
//   isCoinBase: boolean;
//   valueOut: number;
//   size: number;
// }
