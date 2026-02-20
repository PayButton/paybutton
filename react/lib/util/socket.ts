import { io, Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../altpayment';
import config from '../paybutton-config.json';

import { CheckSuccessInfo, Transaction } from './types';
import { shouldTriggerOnSuccess } from './validate';
import { initializeChronikWebsocket } from './chronik';
import { WsEndpoint } from 'chronik-client';

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
  txsSocket?: Socket | WsEndpoint
  apiBaseUrl?: string
  wsBaseUrl?: string
  setTxsSocket: Function
  setNewTxs: Function
  setDialogOpen?: Function
  checkSuccessInfo?: CheckSuccessInfo
}

export const setupChronikWebSocket = async (params: SetupTxsSocketParams): Promise<void> => {
  if (params.txsSocket !== undefined) {
    console.log(`Closing existing Chronik WebSocket for address: ${params.address}`);
    params.txsSocket.close();
    params.setTxsSocket(undefined);
  }
  
  const newChronikSocket = await initializeChronikWebsocket(params.address, (transactions: Transaction[]) => { 
    params.setNewTxs(transactions);
  }); 
  
  params.setTxsSocket(newChronikSocket);
}

export const onMessage = (transactions: Transaction[], setNewTxs: Function, setDialogOpen?: Function, checkSuccessInfo?: CheckSuccessInfo) => {
  if (setDialogOpen !== undefined && checkSuccessInfo !== undefined) {
    for (const tx of transactions) {
      if (shouldTriggerOnSuccess(
        tx,
        checkSuccessInfo.currency,
        checkSuccessInfo.price,
        checkSuccessInfo.randomSatoshis,
        checkSuccessInfo.disablePaymentId,
        checkSuccessInfo.expectedPaymentId,
        checkSuccessInfo.expectedAmount,
        checkSuccessInfo.expectedOpReturn,
        checkSuccessInfo.currencyObj
      )) {
        setDialogOpen(true)
        setTimeout(() => {
          setNewTxs(transactions);
        }, 700);
        break
      }
    }
  } else {
    setNewTxs(transactions);
  }
};