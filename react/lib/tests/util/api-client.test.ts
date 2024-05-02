import { shouldTriggerOnSuccess } from '../../util/api-client';
import { Transaction } from '../../util';

jest.mock('axios');

global.fetch = jest.fn();

describe('API Client Util Tests', () => {
  describe('shouldTriggerOnSuccess', () => {
    it('should return true when all conditions match', () => {
      const transaction:Transaction = {
          amount: '100.00',
          paymentId: '123',
          message: 'test message',
          hash: '',
          timestamp: 0,
          address: ''
      };
      expect(shouldTriggerOnSuccess(transaction, '123', '100.00', 'test message')).toBe(true);
    
    });

    it('should return false when the payment ID does not match', () => {
      const transaction:Transaction = {
          amount: '100.00',
          paymentId: '123',
          message: 'test opReturn message',
          hash: '',
          timestamp: 0,
          address: ''
      };
      expect(shouldTriggerOnSuccess(transaction, '999', '100.00', 'test opReturn message')).toBe(false);
    });
    
    it('should return false when crypto amounts do not match', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, '123', '100.00', 'test opReturn message')).toBe(false);
    }); // todo - check if amount higher than the one requested is also valid

    it('should return false when OpReturn data does not match', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn message',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, '123', '101.00', 'test opReturn')).toBe(false);
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
        expect(shouldTriggerOnSuccess(transaction, '123', undefined, 'test opReturn')).toBe(true);
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
        expect(shouldTriggerOnSuccess(transaction, undefined, '101.00', 'test opReturn')).toBe(true);
    });

    it('should ignore opReturn validation when opReturn does not exists', () => {
        const transaction:Transaction = {
            amount: '101.00',
            paymentId: '123',
            message: 'test opReturn',
            hash: '',
            timestamp: 0,
            address: ''
        };
        expect(shouldTriggerOnSuccess(transaction, '123', '101.00', undefined)).toBe(true);
    });
  });
});
