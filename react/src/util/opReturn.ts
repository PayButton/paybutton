import { lib, enc } from 'crypto-js';

export const OP_RETURN_PREFIX = 'paybutton@';
// The prefix format is:
// paybutton@[random 16 hex chars]$
// e.g.: paybutton@f8a0391b8c89545$

// 220 total bytes
// - 10 from prefix: 'paybutton@'
// - 8 random bytes for identification (the 16 hex chars)
// - 1 from the ending '$'.
// = 201 available bytes
export const BYTES_LIMIT = 220 - 10 - 8 - 1; // 201

export function stringToHex(str: string): string {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function generateRandom8ByteString(): string {
  // Generate 8 random bytes
  const wordArray = lib.WordArray.random(8);

  // Convert the word array to a hex string
  const hexString = enc.Hex.stringify(wordArray);

  // The result is 16 char long:
  // ---
  // a hex character encodes 4 bits of information (2⁴ = 16);
  // ... therefore; 8 bytes = 72 bits => 72/4 = 16 hex chars
  return hexString;
}

export function parseOpReturn(
  opReturn: string | undefined,
): string | undefined {
  if (opReturn === undefined) return undefined;
  const bytesQuantity = new Blob([opReturn]).size;

  if (bytesQuantity > BYTES_LIMIT) {
    throw new Error(
      `Maximum ${BYTES_LIMIT} byte size exceeded: ${bytesQuantity}`,
    );
  }
  return OP_RETURN_PREFIX + generateRandom8ByteString() + '$' + opReturn;
}
