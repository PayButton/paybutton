import { fiatCurrencies, cryptoCurrencies } from "./api-client";

export type currencyObject = {
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

type fiatCurrenciesTuple = typeof fiatCurrencies;
export type fiatCurrency = fiatCurrenciesTuple[number];

type cryptoCurrenciesTuple = typeof cryptoCurrencies;            
export type cryptoCurrency = cryptoCurrenciesTuple[number];

export type currency = cryptoCurrency | fiatCurrency;


type TxBroadcast = 'NewTx' | 'OldTx'


export interface BroadcastTxData {
  address: string
  txs: Transaction[]
  messageType: TxBroadcast
}
