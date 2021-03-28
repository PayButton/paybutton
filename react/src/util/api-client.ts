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
): Promise<AddressDetails> => {
  const res = await fetch(
    `https://api.paybutton.org/address/transactions/${address}`,
  );
  return await res.json();
};

export const getSatoshiBalance = async (
  address: string,
): Promise<{ satoshis: number }> => {
  const res = await fetch(
    `https://api.paybutton.org/address/balance/${address}`,
  );
  return await res.json();
};

export const getUTXOs = async (address: string): Promise<UtxoDetails> => {
  const res = await fetch(`https://api.paybutton.org/address/utxo/${address}`);
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
): Promise<TransactionDetails> => {
  const res = await fetch(
    `https://api.paybutton.org/transactions/details/${txid}`,
  );
  return await res.json();
};

export default {
  getAddressDetails,
  getTransactionDetails,
  getFiatPrice,
  getSatoshiBalance,
};

export type fiatCurrency = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';
export type cryptoCurrency = 'BCH' | 'SAT' | 'bits';
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
