import axios from 'axios';

// export const getAddressDetails = async (
//   address: string,
// ): Promise<AddressDetails> => {
//   const res = await fetch(
//     `https://rest.bitcoin.com/v2/address/details/${address}`,
//   );
//   return await res.json();
// };
export const getAddressDetails = async (
  address: string,
  rootUrl = process.env.REACT_APP_API_URL,
): Promise<AddressDetails> => {
  const res = await fetch(`${rootUrl}/address/transactions/${address}`);
  return await res.json();
};

export const getAddressBalance = async (
  address: string,
  rootUrl = process.env.REACT_APP_API_URL,
): Promise<{ balance: number }> => {
  const res = await fetch(`${rootUrl}/address/balance/${address}`);
  return await res.json();
};

export const getUTXOs = async (
  address: string,
  rootUrl = process.env.REACT_APP_API_URL,
): Promise<UtxoDetails> => {
  const res = await fetch(`${rootUrl}/address/utxo/${address}`);
  return await res.json();
};

export const getBchFiatPrice = async (
  currency: currency,
): Promise<PriceData> => {
  // TODO: rename this. add another function for grabbing xec conversions
  const { data } = await axios.get(
    `https://markets.api.bitcoin.com/rates/convertor?c=BCH&q=${currency}`,
  );

  const { rate } = data[currency];
  const price: number = rate;
  return { price };
};

export const getXecFiatPrice = async (
  currency: currency,
): Promise<PriceData> => {
  // TODO: Actually add a xec endpoint to get live data from

  const { data } = await axios.get(
    `https://markets.api.bitcoin.com/rates/convertor?c=BCH&q=${currency}`,
  );

  if (!currency) {
    // TODO: remove this ifstatement. waiting on a way to get xec price
    // this is a do nothing if statement to prevent ts complaining about not using currency
    console.log(currency);
    console.log(data);
  }

  // 0.00002894 xec price in usd on nov 29 2022
  // const { rate } = data[currency];
  // const price: number = Math.round(rate * 100);
  const price = 0.00002894;
  return { price };
};

// export const getTransactionDetails = async (
//   txid: string,
// ): Promise<TransactionDetails> => {
//   const res = await fetch(
//     `https://rest.bitcoin.com/v2/transaction/details/${txid}`,
//   );
//   return await res.json();
// };

export const getTransactionDetails = async (
  txid: string,
  rootUrl = `https://api.paybutton.org`, // TODO: don't hardcode this url in
): Promise<TransactionDetails> => {
  const res = await fetch(`${rootUrl}/transactions/details/${txid}`);
  return await res.json();
};

export default {
  getAddressDetails,
  getTransactionDetails,
  getBchFiatPrice,
  getXecFiatPrice,
  getAddressBalance,
};

export type fiatCurrency = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';
export const fiatCurrencies = ['USD', 'CAD', 'EUR', 'GBP', 'AUD'];
export type cryptoCurrency = 'BCH' | 'XEC';
export const cryptoCurrencies = ['BCH', 'XEC'];
export type currency = cryptoCurrency | fiatCurrency;

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
