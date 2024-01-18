import { lib, enc } from 'crypto-js';

// All the below variables are already encoded to HEX
export const OP_RETURN_PREFIX_PUSH_DATA = '04'; // \x04
export const OP_RETURN_PREFIX = '50415900'; // PAY\x00
export const VERSION = '00'; // \x00

// 223 total bytes
// - 1 from the OP_RETURN op code: '\x6a'
// - 1 from the protocol push data: '\x04'
// - 4 from the 4-byte procol prefix: 'PAY\x00'
// - 1 for the version byte: '\x00'
// - 1 from the 8-byte nonce push data: '\x08'
// - 8 from the 8-byte nonce
// - 2 from the maximum size for the data pushdata
// = 205 available bytes
export const USER_DATA_BYTES_LIMIT = 223 - 1 - 1 - 4 - 1 - 1 - 8 - 2; // 205

// Push data is self-describing up to 75 bytes, since 0x4c (76 in hex) is
// a special OP code. We therefore limit the nonce size to 75 bytes,
// since this is way more than necessary for security.
const NONCE_BYTES_LIMIT = 75;

function prependNonceWithPushData(hexString: string): string {
  // 2 hex chars == 1 byte
  const bytesQuantity = hexString.length / 2;
  if (bytesQuantity > NONCE_BYTES_LIMIT) {
    throw new Error(
      `Maximum ${NONCE_BYTES_LIMIT} byte size exceeded for nonce: ${bytesQuantity}`,
    );
  }
  const pushData = bytesQuantity.toString(16).padStart(2, '0');
  return `${pushData}${hexString}`;
}

function stringToHex(str: string): string {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

function generatePushDataPrefixedNonce(bytesAmount: number): string {
  // Generate 8 random bytes
  const wordArray = lib.WordArray.random(bytesAmount);

  // Convert the word array to a hex string
  const hexString = enc.Hex.stringify(wordArray);

  // The result is 18 char long:
  // ---
  // a hex character encodes 4 bits of information (2⁴ = 16);
  // ... therefore; 8 bytes = 64 bits => 64/4 = 16 hex chars
  // + 1 byte of push data at the beggining = 2 hex chars
  // = 18 chars
  return prependNonceWithPushData(hexString);
}

function getDataPushData(data: string) {
  const bytesQuantity = new Blob([data]).size;
  if (bytesQuantity > USER_DATA_BYTES_LIMIT) {
    throw new Error(
      `Maximum ${USER_DATA_BYTES_LIMIT} byte size exceeded: ${bytesQuantity}`,
    );
  }
  const rawPushData = bytesQuantity.toString(16).padStart(2, '0');
  if (bytesQuantity > 75) {
    return '4c' + rawPushData;
  }
  return rawPushData;
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
// `08` - pushdata for the optional nonce (paymentId), signifying this tx has 8 bytes of nonce data
// `0102030405060708` - The 8-byte nonce (paymentId)

export function parseOpReturnProps(
  opReturn: string | undefined,
): string | undefined {
  if (opReturn === undefined) {
    opReturn = '';
  }

  const pushData = getDataPushData(opReturn);
  return (
    OP_RETURN_PREFIX_PUSH_DATA +
    OP_RETURN_PREFIX +
    VERSION +
    pushData +
    stringToHex(opReturn) +
    generatePushDataPrefixedNonce(8)
  );
}
