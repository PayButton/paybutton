import { shouldTriggerOnSuccess } from '../../util/api-client';
import { Transaction, resolveNumber } from '../../util';

jest.mock('axios');

global.fetch = jest.fn();

describe('API Client Util Tests', () => {
  describe('shouldTriggerOnSuccess', () => {
    it('returns true when all conditions match', () => {
      const transaction:Transaction = {
          amount: '100.00',
          paymentId: '123',
          message: 'test message',
          hash: '',
          timestamp: 0,
          address: ''
      };
      expect(shouldTriggerOnSuccess(transaction, resolveNumber('100.00'), '123', resolveNumber('100.00'), 'test message')).toBe(true);
    
    });

    it('returns true when tx paymentId is empty and component paymentId is undefined', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), undefined, resolveNumber('101.00'), 'test opReturn message')).toBe(true);
    });

    it('returns true when tx paymentId is empty and component paymentId is empty', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'),'',  resolveNumber('101.00'), 'test opReturn message')).toBe(true);
    });

    it('returns false when the payment ID does not match', () => {
      const transaction:Transaction = {
          amount: '100.00',
          paymentId: '123',
          message: 'test opReturn message',
          hash: '',
          timestamp: 0,
          address: ''
      };
      expect(shouldTriggerOnSuccess(transaction, resolveNumber('100.00'), '999', resolveNumber('100.00'), 'test opReturn message')).toBe(false);
    });
    
    it('returns false when crypto amounts do not match', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), '123', resolveNumber('100.00'), 'test opReturn message')).toBe(false);
    });

    it('returns false when OpReturn data does not match', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), '123', resolveNumber('101.00'), 'test opReturn')).toBe(false);
    });

    it('should ignore amount validation when amount is not set', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), '123', undefined, 'test opReturn')).toBe(true);
    });

    it('should ignore paymentId validation when paymentId does not exists', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), undefined, resolveNumber('101.00'), 'test opReturn')).toBe(true);
    });

    it('should fail when there is a message but opReturn is not enabled', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, resolveNumber('101.00'), '123', resolveNumber('101.00'), undefined)).toBe(false);
    });
  });
});
