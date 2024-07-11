import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from "./constants"

export type CurrencyObject = {
    float: number;
    string: string;
    currency: string;
};

export interface Transaction {
    hash: string
    amount: string
    paymentId: string
    confirmed?: boolean
    message: string
    timestamp: number
    address: string
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

type FiatCurrenciesTuple = typeof FIAT_CURRENCIES;
type CyptoCurrenciesTuple = typeof CRYPTO_CURRENCIES;
type TxBroadcast = 'NewTx' | 'OldTx'

export type CryptoCurrency = FiatCurrenciesTuple[number];
export type FiatCurrency = CyptoCurrenciesTuple[number];
export type Currency = CryptoCurrency | FiatCurrency;


export interface BroadcastTxData {
  address: string
  txs: Transaction[]
  messageType: TxBroadcast
}

interface SideshiftTokenDetails {
  [network: string]: {
    contractAddress: string;
    decimals: number;
  }
}

export interface SideshiftCoin {
    networks: string[];
    coin: string;
    name: string;
    hasMemo: boolean;
    fixedOnly: string[] | boolean;
    variableOnly: string[] | boolean;
    tokenDetails: SideshiftTokenDetails;
    depositOffline?: string[] | boolean;
    settleOffline?: string[] | boolean;
}

export interface SideshiftQuote {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  expiresAt: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  affiliateId: string;
}

export interface SideshiftPair {
  min: string;
  max: string;
  rate: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
}

export interface SideshiftShift {
    id: string;
    createdAt: string;
    depositCoin: string;
    settleCoin: string;
    depositNetwork: string;
    settleNetwork: string;
    depositAddress: string;
    settleAddress: string;
    depositMin: string;
    depositMax: string;
    averageShiftSeconds: string;
    depositAmount: string;
    expiresAt: string;
    quoteId: string;
    rate: string;
    settleAmount: string;
    status: string;
    type: string;
}


