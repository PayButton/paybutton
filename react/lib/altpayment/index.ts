import { Socket } from "socket.io-client"
import { SideshiftCoin, SideshiftError, SideshiftPair, SideshiftQuote, SideshiftShift } from "./sideshift"

export const SOCKET_MESSAGES = {
  GET_ALTPAYMENT_RATE: 'get-altpayment-rate',
  SEND_ALTPAYMENT_RATE: 'send-altpayment-rate',
  SEND_ALTPAYMENT_COINS_INFO: 'send-altpayment-coins-info',
  CREATE_ALTPAYMENT_QUOTE: 'create-altpayment-quote',
  SHIFT_CREATED: 'altpayment-shift-created',
  ERROR_WHEN_CREATING_QUOTE: 'quote-creation-error',
  ERROR_WHEN_CREATING_SHIFT: 'shift-creation-error'
}


export type AltpaymentCoin = SideshiftCoin
export type AltpaymentQuote = SideshiftQuote
export type AltpaymentPair = SideshiftPair
export type AltpaymentPayment = SideshiftShift
export type AltpaymentError = SideshiftError

interface AltpaymentListenerParams {
  addressType: string
  socket: Socket
  setCoins: Function
  setCoinPair: Function
  setLoadingPair: Function
  setAltpaymentShift: Function
  setLoadingShift: Function
  setAltpaymentError: Function
}

export interface AltpaymentClient {
  getPaymentStatus: (id: string) => Promise<AltpaymentPayment>
}

export const altpaymentListener = (params: AltpaymentListenerParams): void => {
  params.socket.on('send-sideshift-coins-info', (coins: AltpaymentCoin[]) => {
    params.setCoins(coins.filter(c => c.coin !== params.addressType))
  })
  params.socket.on('shift-creation-error', (error: AltpaymentError) => {
    params.setAltpaymentError(error)
    params.setLoadingShift(false)
    return
  });
  params.socket.on('quote-creation-error', (error: AltpaymentError) => {
    params.setAltpaymentError(error)
    params.setLoadingShift(false)
    return
  });
  params.socket.on('shift-created', (shift: AltpaymentPayment) => {
    params.setAltpaymentShift(shift)
    params.setLoadingShift(false)
  });
  params.socket.on('send-sideshift-rate', (pair: AltpaymentPair) => {
    params.setCoinPair(pair)
    params.setLoadingPair(false)
  })
};
