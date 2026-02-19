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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        expect(result).toBe(true);
      });

      it('true if disablePaymentId is set even if both paymentId and received paymentId are empty or undefined', async () => {
        const transaction: Transaction = {
          amount: '101.00',
          paymentId: '',
          message: 'test opReturn message',
          rawMessage: 'test opReturn message',
          hash: '',
          timestamp: 0,
          address: 'ecash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7quss2vxek',
        };
        let expectedPaymentId: string | undefined = undefined;
        const expectedAmount = resolveNumber('101.00');
        const expectedOpReturn = 'test opReturn message';
        const price = 1;
        const currency = 'XEC';

        const result1 = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ true,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        expect(result1).toBe(true);

        expectedPaymentId = '';

        const result2 = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ true,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        expect(result2).toBe(true);
      });

      it('false if disablePaymentId is unset when both expected and received paymentId are empty', async () => {
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        // It shouldn't match an empty payment ID unless explicitly instructed
        // to do so. Payment IDs are not set when the button is built so any
        // tx with the same address and amount (even not PayButton) could match.
        expect(result).toBe(false);
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/   false,
          /*disablePaymentId=*/ false,
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        expect(result).toBe(true);
      });

      it('false when opReturn is undefined and received opReturn message is not empty', async () => {
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn
        );

        expect(result).toBe(false);
      });

      // FIXME: I have no idea what is the use case for this, so assuming it's
      // useful. Fabien 2026-02-19
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
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
        // FIXME: This value is unused in shouldTriggerOnSuccess (the amount is
        // compared to currencyObject.float divided by price) but it has to be
        // set nontheless otherwise the price is not even checked. It has to be
        // set to any value that don't convert to false. Fabien 2026-02-19
        const expectedAmount = resolveNumber('101.00');
        const expectedOpReturn = 'test opReturn';
        const price = 0.00003172;
        const currency = 'USD';
        const currencyObject: CurrencyObject = {
            currency: 'USD',
            string: '$100',
            float: 100,
        };

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ false,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
          currencyObject
        );

        expect(result).toBe(true);
      });

      // FIXME: this is another test for an actual bug. Here the
      // expectedPaymentId is defined and disablePaymentId is false so it's
      // explicitely asking for a payment ID match. However because the random
      // satoshis are another (vert bad) way to add entropy the
      // shouldTriggerOnSuccess assumes you don't need the payment ID and skips
      // the check. Random satoshis should be removed completely as it's a
      // terrible idea for a payment system to randomly change the price.
      // Fabien 2026-02-19
      it('true when randomSatoshis is true and paymentId does not match', async () => {
        const transaction: Transaction = {
          amount: '3152585.12',
          paymentId: '1234',
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

        const result = shouldTriggerOnSuccess(
          transaction,
          currency,
          price,
          /*randomSatoshis=*/ true,
          /*disablePaymentId=*/ false,
          expectedPaymentId,
          expectedAmount,
          expectedOpReturn,
          currencyObject
        );

        expect(result).toBe(true);
      });
    });
  });

