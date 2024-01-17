import { lib, enc } from 'crypto-js';

// opReturn format is:
// `04` - Pushdata of the Protocol Identifier, `50415900`
// `50415900` - PayButton protocol identifier, ascii "PAY"
// `00` - Version 0, pushed as `OP_0`
// `09` - pushdata for the data payload, signifying this tx has 9 bytes of data
// `0102030405060708aa` - data payload
// `08` - pushdata for the optional nonce payload, signifying this tx has 8 bytes of nonce data
// `0102030405060708` - The 8-byte nonce

// All the below variables are already encoded to HEX
export const OP_RETURN_PREFIX_PUSH_DATA = '04'; // \x04
export const OP_RETURN_PREFIX = '50415900'; // PAY\x00
export const VERSION = '00'; // \x00

// 220 total bytes
// - 5 from the 4-byte procol prefix with push data: '\x04PAY\x00'
// - 1 for the version byte: '\x00'
// - 9 from the 8-byte nonce with push data
// = 205 available bytes
export const BYTES_LIMIT = 220 - 5 - 1 - 9; // 205

function prependHexStringWithPushData(hexString: string): string {
  // 2 hex chars == 1 byte
  const bytesQuantity = hexString.length / 2;
  if (bytesQuantity > BYTES_LIMIT) {
    throw new Error(
      `Maximum ${BYTES_LIMIT} byte size exceeded: ${bytesQuantity}`,
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

function generatePushDataPrefixed8ByteNonce(): string {
  // Generate 8 random bytes
  const wordArray = lib.WordArray.random(8);

  // Convert the word array to a hex string
  const hexString = enc.Hex.stringify(wordArray);

  // The result is 18 char long:
  // ---
  // a hex character encodes 4 bits of information (2⁴ = 16);
  // ... therefore; 8 bytes = 64 bits => 64/4 = 16 hex chars
  // + 1 byte of push data at the beggining = 2 hex chars
  // = 18 chars
  return prependHexStringWithPushData(hexString);
}

export function parseOpReturnProps(
  opReturn: string | undefined,
): string | undefined {
  if (opReturn === undefined) {
    opReturn = '';
  }
  const bytesQuantity = new Blob([opReturn]).size;

  if (bytesQuantity > BYTES_LIMIT) {
    throw new Error(
      `Maximum ${BYTES_LIMIT} byte size exceeded: ${bytesQuantity}`,
    );
  }
  const pushData = bytesQuantity.toString(16).padStart(2, '0');
  return (
    OP_RETURN_PREFIX_PUSH_DATA +
    OP_RETURN_PREFIX +
    VERSION +
    pushData +
    stringToHex(opReturn) +
    generatePushDataPrefixed8ByteNonce()
  );
}
