import { Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../altpayment';

import { BroadcastTxData } from './types';

export const txsListener = (socket: Socket, setNewTxs: Function): void => {
  socket.on('incoming-txs', (broadcastedTxData: BroadcastTxData) => {
    const unconfirmedTxs = broadcastedTxData.txs.filter(
      tx => tx.confirmed === false,
    );
    if (
      broadcastedTxData.messageType === 'NewTx' &&
      unconfirmedTxs.length !== 0
    ) {
      setNewTxs(unconfirmedTxs);
    }
  });
};

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

export const altpaymentListener = (params: AltpaymentListenerParams): void => {
  params.socket.on('send-altpayment-coins-info', (coins: AltpaymentCoin[]) => {
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
  params.socket.on('shift-created', (shift: AltpaymentShift) => {
    params.setAltpaymentShift(shift)
    params.setLoadingShift(false)
  });
  params.socket.on('send-altpayment-rate', (pair: AltpaymentPair) => {
    params.setCoinPair(pair)
    params.setLoadingPair(false)
  })
};
