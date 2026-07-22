import { parseAltpayment } from '../../util/altpayment'

describe('parseAltpayment', () => {
  const defaultConfig = { showAltpaymentLink: true, autoStart: false }
  const disabledConfig = { showAltpaymentLink: false, autoStart: false }

  it('returns default for undefined, null, and empty', () => {
    expect(parseAltpayment(undefined)).toEqual(defaultConfig)
    expect(parseAltpayment(null)).toEqual(defaultConfig)
    expect(parseAltpayment('')).toEqual(defaultConfig)
  })

  it('disables altpayment for false', () => {
    expect(parseAltpayment(false)).toEqual(disabledConfig)
    expect(parseAltpayment('false')).toEqual(disabledConfig)
  })

  it('returns default for true', () => {
    expect(parseAltpayment(true)).toEqual(defaultConfig)
    expect(parseAltpayment('true')).toEqual(defaultConfig)
  })

  it('disables altpayment link for XEC and BCH', () => {
    expect(parseAltpayment('XEC')).toEqual(disabledConfig)
    expect(parseAltpayment('xec')).toEqual(disabledConfig)
    expect(parseAltpayment('BCH')).toEqual(disabledConfig)
    expect(parseAltpayment('bch')).toEqual(disabledConfig)
  })

  it('auto-starts with BTC preselected for BTC ticker', () => {
    expect(parseAltpayment('BTC')).toEqual({
      showAltpaymentLink: false,
      autoStart: true,
      preselectedCoin: 'BTC',
    })
    expect(parseAltpayment('btc')).toEqual({
      showAltpaymentLink: false,
      autoStart: true,
      preselectedCoin: 'BTC',
    })
  })

  it('returns default for unrecognized tickers', () => {
    expect(parseAltpayment('ETH')).toEqual(defaultConfig)
    expect(parseAltpayment('DOGE')).toEqual(defaultConfig)
    expect(parseAltpayment('blahInvalidTicker')).toEqual(defaultConfig)
  })
})
