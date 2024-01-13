export const OP_RETURN_PREFIX = 'paybutton$';

export function stringToHex(str: string): string {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

export function parseOpReturn(
  opReturn: string | undefined,
): string | undefined {
  if (opReturn === undefined) return undefined;
  const bytesQuantity = new Blob([opReturn]).size;

  if (bytesQuantity > 70) {
    throw new Error(`Maximum 70 byte size exceeded: ${bytesQuantity}`);
  }
  return OP_RETURN_PREFIX + opReturn;
}
