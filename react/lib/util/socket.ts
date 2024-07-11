import { Socket } from 'socket.io-client';

import { BroadcastTxData, SideshiftCoin, SideshiftPair, SideshiftShift } from './types';

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
  setShift: Function
  setLoadingShift: Function
}

export const sideshiftListener = (params: ShiftListenerParams): void => {
  params.socket.on('send-sideshift-coins-info', (coins: SideshiftCoin[]) => {
    params.setCoins(coins.filter(c => c.coin !== params.addressType))
  })
  params.socket.on('shift-created', (shift: SideshiftShift) => {
    params.setShift(shift)
    params.setLoadingShift(false)
  });
  params.socket.on('send-sideshift-rate', (pair: SideshiftPair) => {
    params.setCoinPair(pair)
    params.setLoadingPair(false)
  })
};
