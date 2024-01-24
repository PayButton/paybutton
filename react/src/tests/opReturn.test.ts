import {
  exportedForTesting,
  encodeOpReturnProps,
} from '../util/opReturn';

const {
  stringToHex,
  prependPaymentIdWithPushdata,
  generatePushdataPrefixedPaymentId,
  getDataPushdata,
} = exportedForTesting;

describe('stringToHex', () => {
  it('Converts paybutton protocol lokad', () => {
    expect(stringToHex('PAY\x00')).toBe('50415900');
  });
  it('Converts ASCII printable and non printable', () => {
    expect(stringToHex('aA1=-*&]]^!\x04\x14')).toBe(
      '6141313d2d2a265d5d5e210414',
    );
  });
  it('Converts extended ASCII into the expected UTF8 encoding', () => {
    expect(stringToHex('‡‰Œÿë')).toBe(
      'e280a1e280b0c592c3bfc3ab',
    );
  });
  it('Converts non-ASCII into the expected UTF8 encoding', () => {
    expect(stringToHex('😂👌🇧🇷简体中文傳統中文Русский')).toBe(
      'f09f9882f09f918cf09f87a7f09f87b7e7ae80e4bd93e4b8ade69687e582b3e7b5b1e4b8ade69687d0a0d183d181d181d0bad0b8d0b9',
    );
  });
  it('Converts mix of ASCII, extended ASCII and non-ASCII', () => {
    expect(stringToHex('a©æ😂👌')).toBe('61c2a9c3a6f09f9882f09f918c');
  });
});

describe('prependPaymentIdWithPushdata', () => {
  it('Prepends 3 bytes paymentId with pushdata', () => {
    expect(prependPaymentIdWithPushdata('aa00bb')).toBe('03aa00bb');
  });
  it('Prepends 45 bytes paymentId with pushdata', () => {
    const paymentId =
      'ff019349025bc95aefa6dfab756f6ea7cb96eadbfa696abd816abef6a97fbad8917afd5bbdf6a7b5976b95a6dc';
    expect(prependPaymentIdWithPushdata(paymentId)).toBe('2d' + paymentId);
  });
  it('Prepends paymentId with pushdata at 75 bytes limit', () => {
    expect(prependPaymentIdWithPushdata('aa'.repeat(75))).toBe(
      '4b' + 'aa'.repeat(75),
    );
  });
  it('Throws if paymentId greater than 75 bytes limit', () => {
    expect(() => prependPaymentIdWithPushdata('aa'.repeat(76))).toThrow(
      'Maximum 75 byte size exceeded for paymentId: 76',
    );
  });
  it('Throws if paymentId not even in length', () => {
    expect(() => prependPaymentIdWithPushdata('abc')).toThrow(
      'Malformed input; paymentId hex should never be of odd length',
    );
  });
});

describe('generatePushdataPrefixedPaymentId', () => {
  it('Generates 8 byte paymentId', () => {
    const prefixedPaymentId = generatePushdataPrefixedPaymentId(8);
    expect(prefixedPaymentId.length).toBe(18); // 8 * 2 (two hex chars=byte) + 2(pushdata prefix)
    expect(prefixedPaymentId.slice(0, 2)).toBe('08');
  });
  it('Generates 16 byte paymentId', () => {
    const prefixedPaymentId = generatePushdataPrefixedPaymentId(16);
    expect(prefixedPaymentId.length).toBe(34); // 16 * 2 + 2
    expect(prefixedPaymentId.slice(0, 2)).toBe('10');
  });
  it('Generates paymentId at 75 bytes limit', () => {
    const prefixedPaymentId = generatePushdataPrefixedPaymentId(75);
    expect(prefixedPaymentId.length).toBe(152); // 75 * 2 + 2
    expect(prefixedPaymentId.slice(0, 2)).toBe('4b');
  });
  it('Throws if trying to generate paymentId greater than the 75 bytes limit', () => {
    expect(() => generatePushdataPrefixedPaymentId(76)).toThrow(
      'Maximum 75 byte size exceeded for paymentId: 76',
    );
  });
  it('Generates 00 if disabled', () => {
    expect(generatePushdataPrefixedPaymentId(8, true)).toBe('00');
  });
  it('Generates 00 if disabled, regardless if bytes amount greater than 75 bytes limit', () => {
    expect(generatePushdataPrefixedPaymentId(999, true)).toBe('00');
  });
});

describe('getDataPushdata', () => {
  it('Calculates 1 byte pushdata for data less than 75 bytes', () => {
    const data16Bytes = 'my 16 bytes data';
    expect(getDataPushdata(data16Bytes)).toBe('10');
  });
  it('Calculates 1 byte pushdata for data at precisely 75 bytes', () => {
    const data75bytes = '1'.repeat(75);
    expect(getDataPushdata(data75bytes)).toBe('4b');
  });
  it('Calculates 2 byte pushdata for 76 bytes data', () => {
    const data76bytes = '&'.repeat(76);
    expect(getDataPushdata(data76bytes)).toBe('4c4c');
  });
  it('Calculates 2 byte pushdata for 150 bytes data', () => {
    const data150bytes = 'm'.repeat(150);
    expect(getDataPushdata(data150bytes)).toBe('4c96');
  });
  it('Calculates 2 byte pushdata for data at the 205 bytes limit', () => {
    const data205bytes = '['.repeat(205);
    expect(getDataPushdata(data205bytes)).toBe('4ccd');
  });
  it('Throws if pushdata greater than the 205 bytes limit', () => {
    const data206bytes = '%'.repeat(206);
    expect(() => getDataPushdata(data206bytes)).toThrow(
      'Maximum 205 byte size exceeded for user data: 206',
    );
  });
  it('Calculates expected byte size for UTF8 encoding of non ASCII chars', () => {
    // let b(x) := number of bytes of char x in UTF8 encoding
    // then...
    // (b(a) = 1) +
    // (b(©) = 2) +
    // (b(æ) = 2) +
    // (b(😂) = 4) +
    // (b(👌) = 4) +
    // = 13, 0d in hex
    const data13bytes = 'a©æ😂👌';
    expect(getDataPushdata(data13bytes)).toBe('0d');
  });
});

describe('encodeOpReturnProps', () => {
  // protocol pushdata + protocol + version byte
  const allResultsPrefix = '04' + '50415900' + '00';
  const paymentIdDigits = 18;
  const paymentIdRegex = /^08[0-9a-fA-F]{16}$/;
  it('Encodes undefined data with paymentId', () => {
    const fullResult = encodeOpReturnProps(undefined);
    const resultData = fullResult?.slice(0, -paymentIdDigits);
    expect(resultData).toBe(allResultsPrefix + '00'); // 00 is pushdata for no data
    const resultPaymentId = fullResult?.slice(-paymentIdDigits);
    expect(resultPaymentId).toMatch(paymentIdRegex);
  });
  it('Encodes undefined data without paymentId', () => {
    const fullResult = encodeOpReturnProps(undefined, true);
    expect(fullResult).toBe(allResultsPrefix + '00' + '00'); // the 00s are pushdata for the data and paymentId respectively
  });
  it('Encodes empty string with paymentId', () => {
    const fullResult = encodeOpReturnProps('');
    const resultPaymentId = fullResult?.slice(-paymentIdDigits);
    const resultData = fullResult?.slice(0, -paymentIdDigits);
    expect(resultData).toBe(allResultsPrefix + '00'); // 00 is pushdata for no data
    expect(resultPaymentId).toMatch(paymentIdRegex);
  });
  it('Encodes empty string without paymentId', () => {
    const fullResult = encodeOpReturnProps('', true);
    expect(fullResult).toBe(allResultsPrefix + '00' + '00'); // the 00s are pushdata for the data and paymentId respectively
  });
  it('Encodes custom string with paymentId', () => {
    const fullResult = encodeOpReturnProps('myCustomUserData'); // 16 bytes
    const resultPaymentId = fullResult?.slice(-paymentIdDigits);
    const resultData = fullResult?.slice(0, -paymentIdDigits);
    expect(resultData).toBe(
      allResultsPrefix +
        '10' + // 16 in hex
        '6d79437573746f6d5573657244617461',
    );
    expect(resultPaymentId?.length).toBe(paymentIdDigits);
    expect(resultPaymentId).toMatch(paymentIdRegex);
  });
  it('Encodes custom string without paymentId', () => {
    const fullResult = encodeOpReturnProps('myCustomUserData', true); // 16 bytes
    expect(fullResult).toBe(
      allResultsPrefix +
        '10' + // 16 in hex
        '6d79437573746f6d5573657244617461' +
        '00', // Empty paymentId pushdata
    );
  });
  it('Encodes custom data at limit size of 205 bytes when paymentId is present', () => {
    const data205bytes = '😂'.repeat(51).concat('x'); // 51 * 4 + 1 = 205 bytes
    const fullResult = encodeOpReturnProps(data205bytes)
    const resultPaymentId = fullResult?.slice(-paymentIdDigits);
    const resultData = fullResult?.slice(0, -paymentIdDigits);
    expect(resultData).toBe(
      allResultsPrefix +
        '4ccd' + // 4c because pushData > 75 bytes; cd is 205 in hex
        'f09f9882'.repeat(51) + '78'
    );
    expect(resultPaymentId?.length).toBe(paymentIdDigits);
    expect(resultPaymentId).toMatch(paymentIdRegex);
  });
  it('Throws if custom data greater than 205 bytes when paymentId is present', () => {
    const data208bytes = '😂'.repeat(52); // 52 * 4 = 208 bytes
    expect(() => encodeOpReturnProps(data208bytes)).toThrow(
      'Maximum 205 byte size exceeded for user data: 208',
    );
  });
  it('Encodes custom data greater than 205 bytes and smaller than 213 bytes when paymentId not present', () => {
    const data208bytes = '😂'.repeat(52); // 52 * 4 = 208 bytes
    const fullResult = encodeOpReturnProps(data208bytes, true);
    expect(fullResult).toBe(
      allResultsPrefix +
        '4cd0' + // 4c because pushData > 75 bytes; d0 is 208 in hex
        'f09f9882'.repeat(52) +
        '00', // Empty paymentId pushdata
    );
  });
  it('Encodes custom data at limit size of 213 bytes when paymentId not present', () => {
    const data213bytes = '😂'.repeat(53).concat('y'); // 53 * 4 + 1 = 213 bytes
    const fullResult = encodeOpReturnProps(data213bytes, true);
    expect(fullResult).toBe(
      allResultsPrefix +
        '4cd5' + // 4c because pushData > 75 bytes; d5 is 213 in hex
        'f09f9882'.repeat(53) + '79' +
        '00', // Empty paymentId pushdata
    );
  });
  it('Throws if custom data greater than 213 bytes when paymentId not present', () => {
    const data216bytes = '😂'.repeat(54); // 54 * 4 = 216 bytes
    expect(() => encodeOpReturnProps(data216bytes, true)).toThrow(
      'Maximum 213 byte size exceeded for user data: 216',
    );
  });
});
