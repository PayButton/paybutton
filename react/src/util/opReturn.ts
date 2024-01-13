export const OP_RETURN_PREFIX = 'paybutton$'

export function parseOpReturn(opReturn: string | undefined): string | undefined {
  if (opReturn === undefined) return undefined
  const bytesQuantity = (new Blob([opReturn])).size
  if (bytesQuantity > 70) {
    throw new Error(`Maximum 70 byte size exceeded: ${bytesQuantity}`)
  }
  return OPRETURN_PREFIX + opReturn
}
