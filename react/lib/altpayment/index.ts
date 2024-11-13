import { MockedPaymentClient } from "./mocked"
import { SideshiftClient, SideshiftCoin, SideshiftError, SideshiftPair, SideshiftQuote, SideshiftShift } from "./sideshift"
import config from '../../../paybutton-config.json'

export const MINIMUM_ALTPAYMENT_DOLLAR_AMOUNT = 10

export const SOCKET_MESSAGES = {
  GET_ALTPAYMENT_RATE: 'get-altpayment-rate',
  SEND_ALTPAYMENT_RATE: 'send-altpayment-rate',
  SEND_ALTPAYMENT_COINS_INFO: 'send-altpayment-coins-info',
  CREATE_ALTPAYMENT_QUOTE: 'create-altpayment-quote',
  SHIFT_CREATED: 'altpayment-shift-created',
  ERROR_WHEN_CREATING_QUOTE: 'quote-creation-error',
  ERROR_WHEN_CREATING_SHIFT: 'shift-creation-error'
}

export type AltpaymentClientOptions = 'sideshift' | 'mocked'

export type AltpaymentCoin = SideshiftCoin
export type AltpaymentQuote = SideshiftQuote
export type AltpaymentPair = SideshiftPair
export type AltpaymentShift = SideshiftShift
export type AltpaymentError = SideshiftError

export interface AltpaymentClient {
  getPaymentStatus: (id: string) => Promise<AltpaymentShift>
}

export function getAltpaymentClient (): AltpaymentClient {
  switch (config.altpaymentClient) {
    case 'sideshift' as AltpaymentClientOptions:
      return new SideshiftClient()
    case 'mocked' as AltpaymentClientOptions:
      return new MockedPaymentClient()
    default:
      throw new Error("ERROR: Invalid alternative payment client")
  }
}
