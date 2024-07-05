import { Socket } from 'socket.io-client';

import { BroadcastTxData, SideshiftCoin } from './types';

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

export const shiftListener = (socket: Socket, setCoins: Function): void => {
  socket.on('send-sideshift-coins-info', (coins: SideshiftCoin[]) => {
    console.log('setting coins pra', coins)
    setCoins(coins)
  })
  socket.on('shift-created', (wip: any) => {
    console.log('wip chegou', wip)
  });
};
