import { ChronikClient, WsEndpoint, Tx} from 'chronik-client-cashtokens';
import { encodeCashAddress, decodeCashAddress } from 'ecashaddrjs'
import { AddressType } from 'ecashaddrjs/dist/types'
import xecaddr from 'xecaddrjs'
import { parseOpReturnData } from './opReturn';
import Decimal from 'decimal.js'
import { Buffer } from 'buffer';
import { Transaction } from './types';
import { getAddressPrefix } from './address';
import config from '../paybutton-config.json'

const decoder = new TextDecoder()
export interface OpReturnData {
    rawMessage: string
    message: string
    paymentId: string
}

export function getNullDataScriptData (outputScript: string): OpReturnData | null {
    if (outputScript.length < 2 || outputScript.length % 2 !== 0) {
      throw new Error(`Invalid outputScript length`)
    }
    const opReturnCode = '6a'
    const encodedProtocolPushData = '04' // '\x04'
    const encodedProtocol = '50415900' // 'PAY\x00'
  
    const prefixLen = (
      opReturnCode.length +
      encodedProtocolPushData.length +
      encodedProtocol.length +
      2 // version byte
    )
  
    const regexPattern = new RegExp(
      `${opReturnCode}${encodedProtocolPushData}${encodedProtocol}.{2}`,
      'i'
    )
  
    if (!regexPattern.test(outputScript.slice(0, prefixLen))) {
      return null
    }
  
    let dataStartIndex = prefixLen + 2
  
    if (outputScript.length < dataStartIndex) {
      return null
    }
  
    let dataPushDataHex = outputScript.slice(prefixLen, dataStartIndex)
    if (dataPushDataHex.toLowerCase() === '4c') {
      dataStartIndex = dataStartIndex + 2
      dataPushDataHex = outputScript.slice(prefixLen + 2, dataStartIndex)
    }
    const dataPushData = parseInt(dataPushDataHex, 16)
    if (outputScript.length < dataStartIndex + dataPushData * 2) {
      return null
    }
  
    const dataHexBuffer = Buffer.from(
      outputScript.slice(dataStartIndex, dataStartIndex + dataPushData * 2),
      'hex'
    )
    const dataString = decoder.decode(dataHexBuffer)
  
    const ret: OpReturnData = {
      rawMessage: dataString,
      message: parseOpReturnData(dataString),
      paymentId: ''
    }
  
    const paymentIdPushDataIndex = dataStartIndex + dataPushData * 2
    const paymentIdStartIndex = paymentIdPushDataIndex + 2
    const hasPaymentId = outputScript.length >= paymentIdStartIndex
    if (!hasPaymentId) {
      return ret
    }
  
    const paymentIdPushDataHex = outputScript.slice(paymentIdPushDataIndex, paymentIdStartIndex)
    const paymentIdPushData = parseInt(paymentIdPushDataHex, 16)
    let paymentIdString = ''
    if (outputScript.length < paymentIdStartIndex + paymentIdPushData * 2) {
      return ret
    }
    for (let i = 0; i < paymentIdPushData; i++) {
      const hexByte = outputScript.slice(paymentIdStartIndex + (i * 2), paymentIdStartIndex + (i * 2) + 2)
      // we don't decode the hex for the paymentId, since those are just random bytes.
      paymentIdString += hexByte
    }
    ret.paymentId = paymentIdString
  
    return ret
}
  
export function toHash160 (address: string): {type: AddressType, hash160: string} {
    try {
      const { type, hash } = decodeCashAddress(address)
      return { type, hash160: hash }
    } catch (err) {
      console.log('[CHRONIK]: Error converting address to hash160')
      throw err
    }
}

export async function satoshisToUnit(satoshis: bigint, networkFormat: string): Promise<string> {
    const decimal = new Decimal(satoshis.toString())
    
    if (networkFormat === xecaddr.Format.Xecaddr) {
      return decimal.div(1e2).toString()
    } else if (networkFormat === xecaddr.Format.Cashaddr) {
      return decimal.div(1e8).toString()
    }
  
    throw new Error('[CHRONIK]: Invalid address')
}

const getTransactionAmountAndData = async  (transaction: Tx, addressString: string): Promise<{amount: string, opReturn: string}> => {
    let totalOutput = BigInt(0);
    let totalInput = BigInt(0);
    const addressFormat = xecaddr.detectAddressFormat(addressString)
    const script = toHash160(addressString).hash160
    let opReturn = ''

    for (const output of transaction.outputs) {
      if (output.outputScript.includes(script)) {
        totalOutput += output.sats
      }
      if (opReturn === '') {
        const nullScriptData = getNullDataScriptData(output.outputScript)
        if (nullScriptData !== null) {
          opReturn = JSON.stringify(
            nullScriptData
          )
        }
      }
    }
    for (const input of transaction.inputs) {
      if (input?.outputScript?.includes(script) === true) {
        totalInput += input.sats
      }
    }
    const satoshis = totalOutput - totalInput
    return {
      amount: await satoshisToUnit(satoshis, addressFormat),
      opReturn
    }
}

const getTransactionFromChronikTransaction = async (transaction: Tx, address: string): Promise<Transaction> => {
    const { amount, opReturn } = await getTransactionAmountAndData(transaction, address)
    const parsedOpReturn = resolveOpReturn(opReturn)
    return {
      hash: transaction.txid,
      amount,
      address,
      timestamp: transaction.block !== undefined ? transaction.block.timestamp : transaction.timeFirstSeen,
      confirmed: transaction.block !== undefined,
      opReturn,
      paymentId: parsedOpReturn?.paymentId ?? '',
      message: parsedOpReturn?.message ?? '',
      rawMessage: parsedOpReturn?.rawMessage ?? '',
    }
}

export const fromHash160  = (networkSlug: string, type: AddressType, hash160: string): string => {
    const buffer = Buffer.from(hash160, 'hex')
  
    // Because ecashaddrjs only accepts Uint8Array as input type, convert
    const hash160ArrayBuffer = new ArrayBuffer(buffer.length)
    const hash160Uint8Array = new Uint8Array(hash160ArrayBuffer)
    for (let i = 0; i < hash160Uint8Array.length; i += 1) {
      hash160Uint8Array[i] = buffer[i]
    }
  
    return encodeCashAddress(
      networkSlug,
      type,
      hash160Uint8Array
    )
}

export function outputScriptToAddress (networkSlug: string, outputScript: string | undefined): string | undefined {
    if (outputScript === undefined) return undefined
  
    const typeTestSlice = outputScript.slice(0, 4)
    let addressType
    let hash160
    switch (typeTestSlice) {
      case '76a9':
        addressType = 'p2pkh'
        hash160 = outputScript.substring(
          outputScript.indexOf('76a914') + '76a914'.length,
          outputScript.lastIndexOf('88ac')
        )
        break
      case 'a914':
        addressType = 'p2sh'
        hash160 = outputScript.substring(
          outputScript.indexOf('a914') + 'a914'.length,
          outputScript.lastIndexOf('87')
        )
        break
      default:
        return undefined
    }
  
    if (hash160.length !== 40) return undefined
  
    return fromHash160(networkSlug, addressType as AddressType, hash160)
}

const resolveOpReturn = (opReturn: string): OpReturnData | null => {
  try {
    return opReturn === '' ? null : JSON.parse(opReturn)
  } catch (e) {
    return null
  }
}

export const parseWebsocketMessage = async (
    wsMsg: any,
    onTransaction: Function,
    chronik: ChronikClient,
    address: string
) => {
    const getTime = () => new Date().toISOString();
    console.time("processing message")
    console.log(`[${getTime()}][CHRONIK]: Received websocket message`);
    const { type } = wsMsg;
    if (type === 'Error') {
        return;
    }
    const { msgType } = wsMsg;
    switch (msgType) {
        case 'TX_ADDED_TO_MEMPOOL': {
            const rawTransaction = await chronik.tx(wsMsg.txid);
            console.timeEnd("processing message")
            console.time("firing on success")

            console.log(`[${getTime()}][CHRONIK]: Got message details`);
            
            const transaction = await getTransactionFromChronikTransaction(rawTransaction, address ?? '')

            onTransaction([transaction]);
        }
        default:
            return;
    }
};

export const initializeChronikWebsocket = async (
    address: string,
    onTransaction: Function
): Promise<WsEndpoint> => {
    const networSlug = getAddressPrefix(address)
    const blockchainUrls = config.networkBlockchainURLs[networSlug];
    const chronik = new ChronikClient(blockchainUrls);
    const ws = chronik.ws({
        onMessage: async (msg: any) => {
            await parseWebsocketMessage(
                msg,
                onTransaction,
                chronik,
                address
            );
        },
    });
    await ws.waitForOpen();
    ws.subscribeToAddress(address);

    return ws;
};