import BigNumber from "bignumber.js";
import { getCurrencyTypeFromAddress } from "./address";
import { resolveNumber } from "./number";
import { Currency, Transaction } from "./types";

export const shouldTriggerOnSuccess = (
    transaction: Transaction,
    price: number,
    currency: string,
    expectedPaymentId?: string,
    expectedAmount?: BigNumber,
    expectedOpReturn?: string,
  ) => {
    const {
      paymentId,
      rawMessage:rawOpReturn,
      message,
      amount, 
      address } = transaction; 
    let isAmountValid = true;
    if(expectedAmount) {
      const transactionCurrency: Currency = getCurrencyTypeFromAddress(address);
      if ((transactionCurrency !== currency)) {
        const value = resolveNumber(amount).times(price)
        const expectedValue = resolveNumber(amount).times(price)
        if(value) {
          isAmountValid = expectedValue.isEqualTo(value);
        }
      } else {
        isAmountValid = expectedAmount.isEqualTo(amount)
      }
    } 
  
    const paymentIdsMatch = expectedPaymentId === paymentId;
    const isPaymentIdValid = expectedPaymentId ? paymentIdsMatch : true;
  
    const rawOpReturnIsEmptyOrUndefined = rawOpReturn === '' || rawOpReturn === undefined;
    const opReturn = rawOpReturnIsEmptyOrUndefined ? message : rawOpReturn
    const opReturnIsEmptyOrUndefined = opReturn === '' || opReturn === undefined;
  
    const opReturnsMatch = opReturn === expectedOpReturn;
    const isOpReturnValid = expectedOpReturn ? opReturnsMatch : opReturnIsEmptyOrUndefined;
  
    return isAmountValid && isPaymentIdValid && isOpReturnValid;
};