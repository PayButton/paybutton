import { parseAltpayment } from '../../util/altpayment'

describe('parseAltpayment', () => {
  const defaultConfig = { showAltpaymentLink: true, autoStart: false }

  it('returns default for undefined, null, empty, and false', () => {
    expect(parseAltpayment(undefined)).toEqual(defaultConfig)
    expect(parseAltpayment(null)).toEqual(defaultConfig)
    expect(parseAltpayment('')).toEqual(defaultConfig)
    expect(parseAltpayment(false)).toEqual(defaultConfig)
    expect(parseAltpayment('false')).toEqual(defaultConfig)
  })

  it('returns default for true', () => {
    expect(parseAltpayment(true)).toEqual(defaultConfig)
    expect(parseAltpayment('true')).toEqual(defaultConfig)
  })

  it('disables altpayment link for XEC and BCH', () => {
    expect(parseAltpayment('XEC')).toEqual({ showAltpaymentLink: false, autoStart: false })
    expect(parseAltpayment('xec')).toEqual({ showAltpaymentLink: false, autoStart: false })
    expect(parseAltpayment('BCH')).toEqual({ showAltpaymentLink: false, autoStart: false })
    expect(parseAltpayment('bch')).toEqual({ showAltpaymentLink: false, autoStart: false })
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
  })
})
