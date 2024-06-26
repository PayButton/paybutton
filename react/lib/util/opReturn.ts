import { lib, enc } from 'crypto-js';

// All the below variables are already encoded to HEX
export const OP_RETURN_PREFIX_PUSHDATA = '04'; // \x04
export const OP_RETURN_PREFIX = '50415900'; // PAY\x00
export const VERSION = '00'; // \x00

// 223 total bytes
// - 1 from the OP_RETURN op code: '\x6a'
// - 1 from the protocol pushdata: '\x04'
// - 4 from the 4-byte procol prefix: 'PAY\x00'
// - 1 for the version byte: '\x00'
// - 2 from the maximum size for the data pushdata
// - 1 from the paymentId pushdata
// = 213 available bytes
export const USER_DATA_BYTES_LIMIT = 213;

// Pushdata is self-describing up to 75 bytes, since 0x4c (76 in hex) is
// a special OP code.
const SINGLE_PUSHDATA_BYTE_LIMIT = 75;

function prependPaymentIdWithPushdata(hexString: string): string {
  // 2 hex chars == 1 byte
  if (hexString.length % 2 !== 0) {
    throw new Error(
      `Malformed input; paymentId hex should never be of odd length`,
    );
  }
  const bytesQuantity = hexString.length / 2;
  // We limit the paymentId size to 75 bytes,
  // since this is way more than necessary for security.
  if (bytesQuantity > SINGLE_PUSHDATA_BYTE_LIMIT) {
    throw new Error(
      `Maximum ${SINGLE_PUSHDATA_BYTE_LIMIT} byte size exceeded for paymentId: ${bytesQuantity}`,
    );
  }
  const pushdata = bytesQuantity.toString(16).padStart(2, '0');
  return `${pushdata}${hexString}`;
}

// UTF8 encoding
function stringToHex(str: string): string {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const encodedBytes = Array.from(encoded);
  return encodedBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function generatePaymentId(bytesAmount: number): string {
  // Generate random bytes
  const wordArray = lib.WordArray.random(bytesAmount);

  // Convert the word array to a hex string
  return enc.Hex.stringify(wordArray);
}

function generatePushdataPrefixedPaymentId(
  bytesAmount: number,
  disabled = false,
): string {
  if (disabled) {
    return '00';
  }
  const hexString = generatePaymentId(bytesAmount);

  // The result is 18 char long:
  // ---
  // a hex character encodes 4 bits of information (2⁴ = 16);
  // ... therefore; 8 bytes = 64 bits => 64/4 = 16 hex chars
  // + 1 byte of pushdata at the beggining = 2 hex chars
  // = 18 chars
  return prependPaymentIdWithPushdata(hexString);
}

function getDataPushdata(data: string, disablePaymentId = false): string {
  const bytesQuantity = new Blob([data]).size;
  // If paymentId is expected, limit is 8 bytes smaller
  const bytesLimit = USER_DATA_BYTES_LIMIT - (disablePaymentId ? 0 : 8);
  if (bytesQuantity > bytesLimit) {
    throw new Error(
      `Maximum ${bytesLimit} byte size exceeded for user data: ${bytesQuantity}`,
    );
  }
  const rawPushdata = bytesQuantity.toString(16).padStart(2, '0');
  if (bytesQuantity > SINGLE_PUSHDATA_BYTE_LIMIT) {
    return '4c' + rawPushdata;
  }
  return rawPushdata;
}

// Example:
// If the user wants to send "hello world" in the OP_RETURN, the
// function below constructs it in the following way:
//
// `04` - Pushdata of the Protocol Identifier, `50415900`
// `50415900` - PayButton protocol identifier, ascii "PAY"
// `00` - Version 0, pushed as `OP_0`
// `16` - pushdata for the data payload, signifying this tx has 22 bytes of data
// `68656c6c6f20776f726c64` - data payload, 'hello world' as ASCII encoded to hex
// `08` - pushdata for the optional paymentId (paymentId), signifying this tx has 8 bytes of paymentId data
// `0102030405060708` - The 8-byte paymentId (paymentId)
//
// Result: 0450415900001668656c6c6f20776f726c64080102030405060708

export interface EncodeOpReturnParams {
  opReturn?: string;
  disablePaymentId: boolean;
  paymentId?: string;
}

// specs defined at:
// https://github.com/Bitcoin-ABC/bitcoin-abc/blob/master/doc/standards/paybutton.md
export function encodeOpReturnProps({
  opReturn,
  disablePaymentId,
  paymentId
}: EncodeOpReturnParams): string {
  if (opReturn === undefined) {
    opReturn = '';
  }

  const dataPushdata = getDataPushdata(opReturn, disablePaymentId);
  if (paymentId === undefined || disablePaymentId) {
    paymentId = ''
  }
  const pushDataPrefixedPaymentId = prependPaymentIdWithPushdata(paymentId ?? '');
  return (
    OP_RETURN_PREFIX_PUSHDATA +
    OP_RETURN_PREFIX +
    VERSION +
    dataPushdata +
    stringToHex(opReturn) +
    pushDataPrefixedPaymentId
  );
}

export const exportedForTesting = {
  prependPaymentIdWithPushdata,
  generatePaymentId,
  generatePushdataPrefixedPaymentId,
  stringToHex,
  getDataPushdata,
};
