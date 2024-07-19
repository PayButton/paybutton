import { Socket } from 'socket.io-client';

import { BroadcastTxData, SideshiftCoin, SideshiftError, SideshiftPair, SideshiftShift } from './types';

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

interface ShiftListenerParams {
  addressType: string
  socket: Socket
  setCoins: Function
  setCoinPair: Function
  setLoadingPair: Function
  setSideshiftShift: Function
  setLoadingShift: Function
  setSideshiftError: Function
}

export const sideshiftListener = (params: ShiftListenerParams): void => {
  params.socket.on('send-sideshift-coins-info', (coins: SideshiftCoin[]) => {
    params.setCoins(coins.filter(c => c.coin !== params.addressType))
  })
  params.socket.on('shift-creation-error', (error: SideshiftError) => {
    params.setSideshiftError(error)
    params.setLoadingShift(false)
    return
  });
  params.socket.on('quote-creation-error', (error: SideshiftError) => {
    params.setSideshiftError(error)
    params.setLoadingShift(false)
    return
  });
  params.socket.on('shift-created', (shift: SideshiftShift) => {
    params.setSideshiftShift(shift)
    params.setLoadingShift(false)
  });
  params.socket.on('send-sideshift-rate', (pair: SideshiftPair) => {
    params.setCoinPair(pair)
    params.setLoadingPair(false)
  })
};
