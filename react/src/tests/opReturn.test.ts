import { exportedForTesting, parseOpReturnProps } from '../util/opReturn'

const { stringToHex, prependNonceWithPushdata, generatePushdataPrefixedNonce, getDataPushdata } = exportedForTesting

describe('stringToHex', () => {
  it ('Simple conversion 1', () => {
    expect(stringToHex('PAY\x00')).toBe('50415900')
  })
  it ('Simple conversion 2', () => {
    expect(stringToHex('aA1=-*&]]^!\x04\x14')).toBe('6141313d2d2a265d5d5e210414')
  })
  it('Works for non ASCII chars', () => {
    expect(stringToHex('a©æ😂👌')).toBe('61c2a9c3a6f09f9882f09f918c')
  })
});

describe('prependNonceWithPushdata', () => {
  it ('Simple nonce prepend 1', () => {
    expect(prependNonceWithPushdata('aa00bb')).toBe('03aa00bb')
  })
  it ('Simple nonce prepend 2', () => {
    const nonce = 'ff019349025bc95aefa6dfab756f6ea7cb96eadbfa696abd816abef6a97fbad8917afd5bbdf6a7b5976b95a6dc'
    expect(prependNonceWithPushdata(nonce)).toBe('2d' + nonce)
  })
  it ('Doesnt throw at limit', () => {
    expect(prependNonceWithPushdata('aa'.repeat(75))).toBe('4b' + 'aa'.repeat(75))
  })
  it ('Throws if too big', () => {
    expect(() =>
      prependNonceWithPushdata('aa'.repeat(76))
    ).toThrow('Maximum 75 byte size exceeded for nonce: 76')
  })
})

describe('generatePushdataPrefixedNonce', () => {
  it ('8 byte nonce', () => {
    const prefixedNonce = generatePushdataPrefixedNonce(8)
    expect(prefixedNonce.length).toBe(18) // 8 * 2 (two hex chars=byte) + 2(pushdata prefix)
    expect(prefixedNonce.slice(0,2)).toBe('08')
  })
  it ('16 byte nonce', () => {
    const prefixedNonce = generatePushdataPrefixedNonce(16)
    expect(prefixedNonce.length).toBe(34) // 16 * 2 + 2
    expect(prefixedNonce.slice(0,2)).toBe('10')
  })
  it ('75 byte nonce', () => {
    const prefixedNonce = generatePushdataPrefixedNonce(75)
    expect(prefixedNonce.length).toBe(152) // 75 * 2 + 2
    expect(prefixedNonce.slice(0,2)).toBe('4b')
  })
  it ('fails at 76 byte nonce', () => {
    expect(() =>
      generatePushdataPrefixedNonce(76)
    ).toThrow('Maximum 75 byte size exceeded for nonce: 76')
  })
})

describe('getDataPushdata', () => {
  it ('Simple data pushdata 1', () => {
    const data16Bytes = 'my 16 bytes data'
    expect(getDataPushdata(data16Bytes)).toBe('10')
  })
  it ('Simple data pushdata 2', () => {
    const data75bytes = '1'.repeat(75)
    expect(getDataPushdata(data75bytes)).toBe('4b')
  })
  it ('Composed data pushdata 1', () => {
    const data76bytes = '&'.repeat(76)
    expect(getDataPushdata(data76bytes)).toBe('4c4c')
  })
  it ('Composed data pushdata 2', () => {
    const data150bytes = 'm'.repeat(150)
    expect(getDataPushdata(data150bytes)).toBe('4c96')
  })
  it ('Composed data pushdata at limit', () => {
    const data205bytes = '['.repeat(205)
    expect(getDataPushdata(data205bytes)).toBe('4ccd')
  })
  it('Works for non ASCII chars', () => {
    // let b(x) := number of bytes of char x in UTF8 encoding
    // then...
    // (b(a) = 1) +
    // (b(©) = 2) +
    // (b(æ) = 2) +
    // (b(😂) = 4) +
    // (b(👌) = 4) +
    // = 13, 0d in hex
    const data13bytes = 'a©æ😂👌'
    expect(getDataPushdata(data13bytes)).toBe('0d')
  })
  it('Throws if data > 205 bytes', () => {
    const data206bytes = '%'.repeat(206)
    expect(() =>
      getDataPushdata(data206bytes)
    ).toThrow('Maximum 205 byte size exceeded for user data: 206')
   })
})

describe('parseOpReturnProps', () => {
  // protocol pushdata + protocol + version byte
  const allResultsPrefix = '04' + '50415900' + '00'
  const nonceDigits = 18
  const nonceRegex = /^[0-9a-fA-F]{18}$/
  it('Undefined data', () => {
    const fullResult = parseOpReturnProps(undefined)
    const resultNonce = fullResult?.slice(-nonceDigits)
    const resultNoNonce = fullResult?.slice(0, -nonceDigits)
    expect(resultNoNonce).toBe(allResultsPrefix + '00') // 00 is pushdata for no data
    expect(resultNonce).toMatch(nonceRegex)
  })
  it('Undefined data no nonce', () => {
    const fullResult = parseOpReturnProps(undefined, true)
    expect(fullResult).toBe(allResultsPrefix + '00') // 00 is pushdata for no data
  })
  it('Empty data', () => {
    const fullResult = parseOpReturnProps('')
    const resultNonce = fullResult?.slice(-nonceDigits)
    const resultNoNonce = fullResult?.slice(0, -nonceDigits)
    expect(resultNoNonce).toBe(allResultsPrefix + '00') // 00 is pushdata for no data
    expect(resultNonce).toMatch(nonceRegex)
  })
  it('Empty data no nonce', () => {
    const fullResult = parseOpReturnProps('', true)
    expect(fullResult).toBe(allResultsPrefix + '00') // 00 is pushdata for no data
  })
  it('Simple parse OpReturn 1', () => {
    const fullResult = parseOpReturnProps('myCustomUserData') // 16 bytes
    const resultNonce = fullResult?.slice(-nonceDigits)
    const resultNoNonce = fullResult?.slice(0,-nonceDigits)
    expect(resultNoNonce).toBe(allResultsPrefix +
      '10' + // 16 in hex
      '6d79437573746f6d5573657244617461')
    expect(resultNonce?.length).toBe(nonceDigits)
    expect(resultNonce).toMatch(nonceRegex)
  })
  it('Simple parse OpReturn 1 no nonce', () => {
    const fullResult = parseOpReturnProps('myCustomUserData', true) // 16 bytes
    expect(fullResult).toBe(allResultsPrefix +
      '10' + // 16 in hex
      '6d79437573746f6d5573657244617461')
  })
  it('Simple parse OpReturn 2', () => {
    const fullResult = parseOpReturnProps('my=Longer more=sensible|user|data') // 33 bytes
    const resultNonce = fullResult?.slice(-nonceDigits)
    const resultNoNonce = fullResult?.slice(0,-nonceDigits)
    expect(resultNoNonce).toBe(allResultsPrefix +
      '21' + // 33 in hex
      '6d793d4c6f6e676572206d6f72653d73656e7369626c657c757365727c64617461')
    expect(resultNonce?.length).toBe(nonceDigits)
    expect(resultNonce).toMatch(nonceRegex)
  })
  it('Simple parse OpReturn 2 no nonce', () => {
    const fullResult = parseOpReturnProps('my=Longer more=sensible|user|data', true) // 33 bytes
    expect(fullResult).toBe(allResultsPrefix +
      '21' + // 33 in hex
      '6d793d4c6f6e676572206d6f72653d73656e7369626c657c757365727c64617461')
  })
  it('Throws if too long', () => {
    const data208bytes = '😂'.repeat(52) // 52 * 4 = 208 bytes
    expect(() =>
      parseOpReturnProps(data208bytes)
    ).toThrow('Maximum 205 byte size exceeded for user data: 208')
  })
  it('Is not too long if no nonce', () => {
    const data208bytes = '😂'.repeat(52) // 52 * 4 = 208 bytes
    const fullResult = parseOpReturnProps(data208bytes, true)
    expect(fullResult).toBe(allResultsPrefix +
      '4cd0' + // 4c because pushData > 75; d0 is 208 in hex
      'f09f9882'.repeat(52)
    )
   })
  it('Throws if too long no nonce', () => {
    const data216bytes = '😂'.repeat(54) // 54 * 4 = 216 bytes
    expect(() =>
      parseOpReturnProps(data216bytes, true)
    ).toThrow('Maximum 214 byte size exceeded for user data: 216')
  })
})