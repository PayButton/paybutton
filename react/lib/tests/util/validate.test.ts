import { CurrencyObject, shouldTriggerOnSuccess } from '../../util';
import { Transaction, resolveNumber } from '../../util';

jest.mock('axios');

global.fetch = jest.fn();


describe('Validate Util Tests', () => {
    describe('shouldTriggerOnSuccess', () => {
  
      it('true when amount, opReturn, and paymentId match the ones received in transaction', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('true when paymentId is undefined and received paymentId is empty', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          true,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('true when both expected and received paymentId are empty', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('false when paymentId does not match received paymentId', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(false);
      });
  
      it('false when amount does not match received amount', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(false);
      });
  
      it('false when opReturn message does not match received message', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(false);
      });
  
      it('should ignore amount validation when expected amount is undefined', async () => {
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
        const expectedAmount = undefined; // Indefinido
        const expectedOpReturn = 'test opReturn';
        const price = 1;
        const currency = 'XEC';
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('should ignore paymentId validation when disablePaymentId is true', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          true,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('false when opReturn is undefined and received opReturn message is not empty or undefined', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(false);
      });
  
      it('true when opReturn is in a different format than received opReturn message but rawMessage matches expected opReturn', async () => {
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
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(true);
      });
  
      it('false when currency is USD and currencyObject is missing', async () => {
        const transaction: Transaction = {
          amount: '101.00',
          paymentId: '123',
          message: 'test opReturn',
          rawMessage: 'test opReturn',
          hash: '',
          timestamp: 0,
          address: 'bitcoincash:qq7f38meqgctcnywyx74uputa3yuycnv6qr3c6p6rz',
        };
        const expectedPaymentId = '123';
        const expectedAmount = resolveNumber('101.00');
        const expectedOpReturn = 'test opReturn';
        const price = 1;
        const currency = 'USD';
  
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );
  
        expect(result).toBe(false);
      });
  
      it('true when currency is USD and currencyObject is provided', async () => {
        const transaction: Transaction = {
          amount: '3152585.12',
          paymentId: '123',
          message: 'test opReturn',
          rawMessage: 'test opReturn',
          hash: '',
          timestamp: 0,
          address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
        };
        const expectedPaymentId = '123';
        const expectedAmount = resolveNumber('101.00');
        const expectedOpReturn = 'test opReturn';
        const price = 0.00003172;
        const currency = 'USD';
        const currencyObject: CurrencyObject = {
            currency: 'USD',
            string: '$100',
            float: 100,
        };
      
        const result = await shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
          currencyObject
        );
  
        expect(result).toBe(true);
      });
    });
  });
  