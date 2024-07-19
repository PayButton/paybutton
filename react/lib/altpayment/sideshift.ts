import { AltpaymentClient } from ".";

export const BASE_SIDESHIFT_URL = 'https://sideshift.ai/api/v2/'
export const MINIMUM_SIDESHIFT_DOLLAR_AMOUNT = 10

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

type ErrorType = 'quote-error' | 'shift-error'
export interface SideshiftError {
  errorType: ErrorType
  errorMessage: string
}

export class SideshiftClient implements AltpaymentClient {
  public async getPaymentStatus (shiftId: string): Promise<SideshiftShift> {
  const res = await fetch(`${BASE_SIDESHIFT_URL}/shifts/${shiftId}?t=${(new Date()).getTime()}`);
  return (await res.json()) as SideshiftShift;
  }
}
