import { lib, enc } from 'crypto-js';

export const OP_RETURN_PREFIX = 'paybutton@';
// The prefix format is:
// paybutton@[random 12 base64 chars]$
// e.g.: paybutton@F8Ulk2rSf3Fj$

// 220 total bytes
// - 10 from prefix: 'paybutton@'
// - 9 random bytes for identification (the 12 base64 chars)
// - 1 from the ending '$'.
// = 200 available bytes
export const BYTES_LIMIT = 220 - 10 - 9 - 1; // 200

export function stringToHex(str: string): string {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function generateRandom9ByteString(): string {
  // Generate 9 random bytes
  const wordArray = lib.WordArray.random(9);

  // Convert the word array to a Base64 string
  const base64String = enc.Base64.stringify(wordArray);

  // Return it without the always-present single '=' at the end
  return base64String;
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
  return OP_RETURN_PREFIX + generateRandom9ByteString() + '$' + opReturn;
}
