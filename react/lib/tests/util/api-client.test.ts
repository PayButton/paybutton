import { shouldTriggerOnSuccess } from '../../util';
import { Transaction, resolveNumber } from '../../util';

jest.mock('axios');

global.fetch = jest.fn();

describe('API Client Util Tests', () => {
  describe('shouldTriggerOnSuccess', () => {
    it('true when amount, opReturn, and paymentId match the ones received in transaction', () => {
      const transaction: Transaction = {
        amount: '100.00',
        paymentId: '123',
        message: 'test message',
        rawMessage: 'test message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedAmount = resolveNumber('100.00');
      const expectedOpReturn = 'test message';
      const expectedPaymentId = '123';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('true when paymentId is undefined and received paymentId is empty', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '',
        message: 'test opReturn message',
        rawMessage: 'test opReturn message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = undefined;
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = 'test opReturn message';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('true when both expected and received paymentId are empty ', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '',
        message: 'test opReturn message',
        rawMessage: 'test opReturn message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '';
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = 'test opReturn message';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('false when paymentId does not match received paymentId', () => {
      const transaction: Transaction = {
        amount: '100.00',
        paymentId: '123',
        message: 'test opReturn message',
        rawMessage: 'test opReturn message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '999';
      const expectedAmount = resolveNumber('100.00');
      const expectedOpReturn = 'test opReturn message';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(false);
    });
    
    it('false when amount does not match received amount', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: 'test opReturn message',
        rawMessage: 'test opReturn message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '123';
      const expectedAmount = resolveNumber('100.00');
      const expectedOpReturn = 'test opReturn message';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(false);
    });

    it('false when opReturn message does not match received message', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: 'test opReturn message',
        rawMessage: 'test opReturn message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '123';
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = 'test opReturn';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(false);
    });

    it('should ignore amount validation when expected amount is undefined', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: 'test opReturn',
        rawMessage: 'test opReturn',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '123';
      const expectedAmount = undefined;
      const expectedOpReturn = 'test opReturn';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('should ignore paymentId validation when paymentId is undefined', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: 'test opReturn',
        rawMessage: 'test opReturn',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = undefined;
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = 'test opReturn';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('false when opReturn is undefined and received opReturn message is not empty or undefined', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: 'test opReturn',
        rawMessage: 'test opReturn',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '123';
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = undefined;
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(false);
    });

    it('true when opReturn is in a different format than received opReturn message but rawMessage matches expected opReturn', () => {
      const transaction: Transaction = {
        amount: '101.00',
        paymentId: '123',
        message: JSON.stringify({
          classOf: '2013',
          bullYears: ['2013', '2017', '2021'],
        }),
        rawMessage: 'classOf=2013 bullYears=2013|2017|2021',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedPaymentId = '123';
      const expectedAmount = resolveNumber('101.00');
      const expectedOpReturn = 'classOf=2013 bullYears=2013|2017|2021';
      const price = 1;
      const currency = 'XEC';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    });

    it('true when amount, opReturn, and paymentId match the ones received in transaction, with currency USD', () => {
      const transaction: Transaction = {
        amount: '32851.51',
        paymentId: '123',
        message: 'test message',
        rawMessage: 'test message',
        hash: '',
        timestamp: 0,
        address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
      };
      const expectedAmount = resolveNumber(1);
      const expectedOpReturn = 'test message';
      const expectedPaymentId = '123';
      const price = 0.00003044;
      const currency = 'USD';

      expect(
        shouldTriggerOnSuccess(
          transaction,
          price,
          currency,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
        ),
      ).toBe(true);
    
    });
  });
})
