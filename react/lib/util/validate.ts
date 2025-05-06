import BigNumber from "bignumber.js";
import { getAddressPrefix, getCurrencyTypeFromAddress } from "./address";
import { resolveNumber } from "./number";
import { Currency, CurrencyObject, Transaction } from "./types";
import { DECIMALS } from "./constants";

export const shouldTriggerOnSuccess = async (
    transaction: Transaction,
    currency: string,
    price: number,
    disablePaymentId?: boolean,
    expectedPaymentId?: string,
    expectedAmount?: BigNumber,
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
      const transactionCurrency: Currency = getCurrencyTypeFromAddress(address);
      if (transactionCurrency !== currency) {
        if (currencyObject){
          const value = (currencyObject.float / price).toFixed(DECIMALS[transactionCurrency])
          isAmountValid = resolveNumber(value).isEqualTo(amount)
        }else {
          isAmountValid = false
        }
      } else {
        isAmountValid = expectedAmount.isEqualTo(amount)
      }
    } 
  
    const paymentIdsMatch = expectedPaymentId === paymentId;
    const isPaymentIdValid = disablePaymentId ? true : paymentIdsMatch;

    let isOpReturnValid = true;
    if(!isBCH){
      const rawOpReturnIsEmptyOrUndefined = rawOpReturn === '' || rawOpReturn === undefined;
      const opReturn = rawOpReturnIsEmptyOrUndefined ? message : rawOpReturn
      const opReturnIsEmptyOrUndefined = opReturn === '' || opReturn === undefined;
    
      const opReturnsMatch = opReturn === expectedOpReturn;
      isOpReturnValid = expectedOpReturn ? opReturnsMatch : opReturnIsEmptyOrUndefined;
    }
    
    return isAmountValid && isPaymentIdValid && isOpReturnValid;
};