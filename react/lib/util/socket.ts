import { Socket } from 'socket.io-client';

import { BroadcastTxData } from './types';

export const setListener = (socket: Socket, setNewTxs: Function): void => {
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
