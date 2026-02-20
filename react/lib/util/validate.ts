import BigNumber from "bignumber.js";
import { getAddressPrefix, getCurrencyTypeFromAddress } from "./address";
import { resolveNumber } from "./number";
import { Currency, CurrencyObject, Transaction } from "./types";
import { DECIMALS } from "./constants";

export const shouldTriggerOnSuccess = (
    transaction: Transaction,
    currency: string,
    price: number,
    randomSatoshis: number | boolean,
    disablePaymentId?: boolean,
    expectedPaymentId?: string,
    expectedAmount?: BigNumber | number,
    expectedOpReturn?: string,
    currencyObject?: CurrencyObject,
  ) => {
    const {
      paymentId,
      rawMessage:rawOpReturn,
      message,
      amount, 
      address } = transaction; 
    
    const addressPrefix = getAddressPrefix(address);
    const isBCH = addressPrefix === 'bitcoincash';
    let isAmountValid = true;

    if(expectedAmount) {
      if (typeof expectedAmount === 'number'){
        expectedAmount = new BigNumber(expectedAmount);
      }
      const transactionCurrency: Currency = getCurrencyTypeFromAddress(address);
      if (transactionCurrency !== currency) {
        if (currencyObject){
          const value = (currencyObject.float / price).toFixed(DECIMALS[transactionCurrency])
          isAmountValid = resolveNumber(value).isLessThanOrEqualTo(amount)
        }else {
          isAmountValid = false
        }
      } else {
        isAmountValid = expectedAmount.isLessThanOrEqualTo(amount);
      }
    }
    let isPaymentIdValid = true
    let isOpReturnValid = true

    if(!randomSatoshis || randomSatoshis === 0){
      if(!isBCH){
        const paymentIdsMatch = expectedPaymentId === paymentId;
        isPaymentIdValid = disablePaymentId ? true : paymentIdsMatch;  
      }
    }
    if(!isBCH){
      const rawOpReturnIsEmptyOrUndefined = rawOpReturn === '' || rawOpReturn === undefined;
      const opReturn = rawOpReturnIsEmptyOrUndefined ? message : rawOpReturn
      const opReturnIsEmptyOrUndefined = opReturn === '' || opReturn === undefined;
      
      const opReturnsMatch = opReturn === expectedOpReturn;
      isOpReturnValid = expectedOpReturn ? opReturnsMatch : opReturnIsEmptyOrUndefined;
    }

    return isAmountValid && isPaymentIdValid && isOpReturnValid;
};
