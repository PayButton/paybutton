import { stringToHex } from '../util/opReturn'

describe('Sample', () => {
  it ('', () => {
    expect(stringToHex('PAY\x00')).toBe('50415900')
  })
});
