import { getAddressDetails, resolveApiAddress } from '../../util/api-client';
import { shouldTriggerOnSuccess } from '../../util/validate';

const ADDRESS = 'ecash:qphvmsp9lg9qtq3jxvvy5t982usl73py3cy9u539d0';
const INPUT_ADDRESS = 'ecash:qr57r0qvfflp6pprw234c3ppu8afznhqjv67j2gz0s';

const mockResponse = (data: unknown, ok = true): void => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok,
    json: async () => data,
  });
};

describe('api-client', () => {
  describe('resolveApiAddress', () => {
    it('keeps plain string addresses', () => {
      expect(resolveApiAddress(ADDRESS)).toBe(ADDRESS);
    });

    it('unwraps addresses sent as nested objects', () => {
      expect(resolveApiAddress({ address: ADDRESS } as any)).toBe(ADDRESS);
    });

    it('returns an empty string for unusable values', () => {
      expect(resolveApiAddress(undefined)).toBe('');
      expect(resolveApiAddress(null)).toBe('');
      expect(resolveApiAddress({} as any)).toBe('');
    });
  });

  describe('getAddressDetails', () => {
    it('normalizes transactions that carry the address as an object', async () => {
      mockResponse([
        {
          hash: 'hash-1',
          amount: '1001',
          paymentId: '',
          confirmed: true,
          message: '',
          rawMessage: '',
          timestamp: 1772040277,
          address: { id: 'some-uuid', address: ADDRESS, networkId: 1 },
          inputAddresses: [{ address: { id: 'other-uuid', address: INPUT_ADDRESS }, amount: '5' }],
        },
      ]);

      const transactions = await getAddressDetails(ADDRESS, 'http://api');

      expect(transactions[0].address).toBe(ADDRESS);
      expect(transactions[0].inputAddresses).toEqual([INPUT_ADDRESS]);
    });

    it('falls back to the queried address when the API sends none', async () => {
      mockResponse([
        {
          hash: 'hash-2',
          amount: '1001',
          paymentId: '',
          confirmed: true,
          message: '',
          rawMessage: '',
          timestamp: 1772040277,
        },
      ]);

      const transactions = await getAddressDetails(ADDRESS, 'http://api');

      expect(transactions[0].address).toBe(ADDRESS);
    });

    it('produces transactions that address parsing can consume', async () => {
      mockResponse([
        {
          hash: 'hash-3',
          amount: '1001',
          paymentId: '',
          confirmed: true,
          message: '',
          rawMessage: '',
          timestamp: 1772040277,
          address: { id: 'some-uuid', address: ADDRESS, networkId: 1 },
        },
      ]);

      const transactions = await getAddressDetails(ADDRESS, 'http://api');

      // Before normalization this threw "Invalid address prefix." as an
      // unhandled rejection whenever the widget checked for transactions.
      expect(() =>
        shouldTriggerOnSuccess(transactions[0], 'XEC', 0, false, true),
      ).not.toThrow();
    });
  });
});
