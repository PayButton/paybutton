export type ParsedAltpayment = {
  showAltpaymentLink: boolean
  autoStart: boolean
  preselectedCoin?: string
}

const DEFAULT_CONFIG: ParsedAltpayment = {
  showAltpaymentLink: true,
  autoStart: false,
}

export function parseAltpayment (value?: string | boolean | null): ParsedAltpayment {
  if (value === undefined || value === null || value === '' || value === false || value === 'false') {
    return DEFAULT_CONFIG
  }

  if (value === true || value === 'true') {
    return DEFAULT_CONFIG
  }

  const ticker = String(value).toUpperCase()

  if (ticker === 'XEC' || ticker === 'BCH') {
    return { showAltpaymentLink: false, autoStart: false }
  }

  if (ticker === 'BTC') {
    return { showAltpaymentLink: false, autoStart: true, preselectedCoin: 'BTC' }
  }

  return DEFAULT_CONFIG
}
