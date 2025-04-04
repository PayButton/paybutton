import { io, Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../altpayment';
import config from '../../../paybutton-config.json';

import { BroadcastTxData } from './types';
import { getAddressDetails } from './api-client';
import { getAddressPrefixed } from './address';

export const txsListener = (txsSocket: Socket, setNewTxs: Function): void => {
  txsSocket.on('incoming-txs', (broadcastedTxData: BroadcastTxData) => {
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
  altpaymentSocket: Socket
  setCoins: Function
  setCoinPair: Function
  setLoadingPair: Function
  setAltpaymentShift: Function
  setLoadingShift: Function
  setAltpaymentError: Function
}

export const altpaymentListener = (params: AltpaymentListenerParams): void => {
  params.altpaymentSocket.on('send-altpayment-coins-info', (coins: AltpaymentCoin[]) => {
    params.setCoins(coins.filter(c => c.coin !== params.addressType))
  })
  params.altpaymentSocket.on('shift-creation-error', (error: AltpaymentError) => {
    params.setAltpaymentError(error)
    params.setLoadingShift(false)
    return
  });
  params.altpaymentSocket.on('quote-creation-error', (error: AltpaymentError) => {
    params.setAltpaymentError(error)
    params.setLoadingShift(false)
    return
  });
  params.altpaymentSocket.on('shift-created', (shift: AltpaymentShift) => {
    params.setAltpaymentShift(shift)
    params.setLoadingShift(false)
  });
  params.altpaymentSocket.on('send-altpayment-rate', (pair: AltpaymentPair) => {
    params.setCoinPair(pair)
    params.setLoadingPair(false)
  })
};

interface SetupAltpaymentSocketParams {
  addressType: string
  altpaymentSocket?: Socket
  wsBaseUrl?: string
  setAltpaymentSocket: Function
  setCoins: Function
  setCoinPair: Function
  setLoadingPair: Function
  setAltpaymentShift: Function
  setLoadingShift: Function
  setAltpaymentError: Function
}

export const setupAltpaymentSocket = async (params: SetupAltpaymentSocketParams): Promise<void> => {
  if (params.altpaymentSocket !== undefined) {
    params.altpaymentSocket.disconnect();
    params.setAltpaymentSocket(undefined);
  }
  const newSocket = io(`${params.wsBaseUrl ?? config.wsBaseUrl}/altpayment`, {
    forceNew: true,
  });
  params.setAltpaymentSocket(newSocket);
  altpaymentListener({
    addressType: params.addressType,
    altpaymentSocket: newSocket,
    setCoins: params.setCoins,
    setCoinPair: params.setCoinPair,
    setLoadingPair: params.setLoadingPair,
    setAltpaymentShift: params.setAltpaymentShift,
    setLoadingShift: params.setLoadingShift,
    setAltpaymentError: params.setAltpaymentError,
  })
}

interface SetupTxsSocketParams {
  address: string
  txsSocket?: Socket
  apiBaseUrl?: string
  wsBaseUrl?: string
  setTxsSocket: Function
  setNewTxs: Function
}

export const setupTxsSocket = async (params: SetupTxsSocketParams): Promise<void> => {
  void getAddressDetails(params.address, params.apiBaseUrl);
  if (params.txsSocket !== undefined) {
    params.txsSocket.disconnect();
    params.setTxsSocket(undefined);
  }
  const newSocket = io(`${params.wsBaseUrl ?? config.wsBaseUrl}/addresses`, {
    forceNew: true,
    query: { addresses: [getAddressPrefixed(params.address)] },
  });
  params.setTxsSocket(newSocket);
  txsListener(newSocket, params.setNewTxs);
}
