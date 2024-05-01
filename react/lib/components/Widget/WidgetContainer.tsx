import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import successSound from '../../assets/success.mp3.json';


import Widget, { WidgetProps } from './Widget';
import { Currency } from 'currency-formatter';
import { CurrencyObject, Transaction, getCurrencyTypeFromAddress, isValidCurrency, isCrypto, isAddressSupported, compareAddresses, getFiatPrice, isFiat, resolveNumber } from '../../util';

export interface WidgetContainerProps
  extends Omit<WidgetProps, 'success' | 'setNewTxs' | 'setCurrencyObject'> {
  active?: boolean;
  amount?: number;
  opReturn?: string;
  paymentId?: string;
  disablePaymentId?: boolean;
  currency?: Currency;
  currencyObj?: CurrencyObject;
  cryptoAmount?: string;
  price?: number;
  setCurrencyObj: Function;
  randomSatoshis?: boolean | number;
  hideToasts?: boolean;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  sound?: boolean;
  goalAmount?: number | string;
  disabled: boolean;
  editable: boolean;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
  successText?: string;
}

const snackbarOptions: OptionsObject = {
  variant: 'success',
  autoHideDuration: 8000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
};

export interface Output {
  index: number;
  value: number;
  pubkeyScript: string;
  address: string;
  scriptClass: string;
  disassembledScript: string;
}

const withSnackbar =
  <T extends object>(
    Component: React.ComponentType<T>,
  ): React.FunctionComponent<T> =>
  (props): React.ReactElement =>
    (
      <SnackbarProvider>
        <Component {...props} />
      </SnackbarProvider>
    );
    const shouldTriggerOnSuccess = (transaction: Transaction, thisPaymentId?: string, cryptoAmount?: string, thisOpReturn?:string) => {
      const { 
        amount, 
        paymentId, 
        message
      } = transaction;
      
        const formattedTxAmount = resolveNumber(amount);
        const formattedAmountSet = cryptoAmount ? resolveNumber(cryptoAmount) : false;
        const formattedTxOpReturn = JSON.stringify(message);
        const formattedOpReturn = JSON.stringify(thisOpReturn);

        const isAmountValid = formattedAmountSet ? formattedTxAmount.isEqualTo(formattedAmountSet) : true;        
        const isPaymentIdValid = thisPaymentId ? thisPaymentId === paymentId : true;
        const isOpReturnValid = thisOpReturn ? formattedOpReturn === formattedTxOpReturn : true

        return isAmountValid && isPaymentIdValid && isOpReturnValid
    }

export const WidgetContainer: React.FunctionComponent<WidgetContainerProps> =
  withSnackbar((props): React.ReactElement => {
    let {
      to,
      opReturn,
      disablePaymentId,
      paymentId,
      amount,
      setAmount,
      setCurrencyObj,
      currencyObj,
      currency = '' as Currency,
      cryptoAmount,
      price,
      animation,
      randomSatoshis = false,
      hideToasts = false,
      sound = true,
      onSuccess,
      onTransaction,
      goalAmount,
      disabled,
      editable,
      wsBaseUrl,
      apiBaseUrl,
      successText,
      hoverText,
      ...widgetProps
    } = props;

    const [thisPrice, setThisPrice] = useState(0);

    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [newTxs, setNewTxs] = useState<Transaction[] | undefined>();
    const addrType = getCurrencyTypeFromAddress(to);

    const txSound = useMemo(
      (): HTMLAudioElement => new Audio(successSound.base64),
      [],
    );

    if (
      !isValidCurrency(currency) ||
      (isCrypto(currency) && addrType !== currency)
    ) {
      currency = addrType;
    }

    const txSound = useMemo(
      (): HTMLAudioElement => new Audio(successSound.base64),
      [],
    );

    const handlePayment = useCallback(
      (transaction: Transaction) => {
        const { address, amount } = transaction;
        if(!isAddressSupported(address)||
            !compareAddresses(to, address)){ 
          console.log(`Address is not valid. Transaction address: ${address}, destination address: ${to}`, address,)
          return;
        }

        if (shouldTriggerOnSuccess(transaction, paymentId, cryptoAmount, opReturn)) {
          if (sound) {
            txSound.play().catch();
          }
          if (!hideToasts) {
            const toastSuccessText = successText ? successText + ' | ' : ''
            enqueueSnackbar(
              `${ toastSuccessText }Received ${amount} ${getCurrencyTypeFromAddress(to)}`,
              snackbarOptions,
            );
          }

          setSuccess(true);
          onSuccess?.(transaction);
        } else {
          onTransaction?.(transaction);
        }
      },
      [
        onSuccess,
        onTransaction,
        enqueueSnackbar,
        hideToasts,
        cryptoAmount,
        successText,
        to,
        paymentId,
        opReturn
      ],
    );

    const getPrice = useCallback(
      async () => {
        const price = await getFiatPrice(currency, to, apiBaseUrl)
        if (price !== null) setThisPrice(price)
      }
      , [currency, to, apiBaseUrl]
    );

    useEffect(() => {
      const fetchPrice = async () => {
        if (price === undefined) {
          await getPrice();
        } else {
          setThisPrice(price);
        }
      };

      if (isFiat(currency) || price === undefined) {
        fetchPrice();
      }
    }, [currency, price]);


    useEffect(() => {
      newTxs?.map(tx => {
        if (tx.confirmed === false &&
          isLessThanZero(tx.amount)){
            handlePayment(tx);
            setNewTxs([])
        }
      });
    }, [newTxs]);

    return (
      <React.Fragment>
        <Widget
          to={to}
          {...widgetProps}
          amount={amount}
          setAmount={setAmount}
          opReturn={opReturn}
          paymentId={paymentId}
          disablePaymentId={disablePaymentId}
          goalAmount={goalAmount}
          currency={currency}
          animation={animation}
          currencyObject={currencyObj}
          setCurrencyObject={setCurrencyObj}
          randomSatoshis={randomSatoshis}
          price={thisPrice}
          success={success}
          disabled={disabled}
          editable={editable}
          setNewTxs={setNewTxs}
          newTxs={newTxs}
          wsBaseUrl={wsBaseUrl}
          apiBaseUrl={apiBaseUrl}
          successText={successText}
          hoverText={hoverText}
        />
      </React.Fragment>
    );
  });

export default WidgetContainer;
