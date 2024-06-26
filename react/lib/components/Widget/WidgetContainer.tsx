import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import successSound from '../../assets/success.mp3.json';

import {
  getFiatPrice,
  Currency,
  CurrencyObject,
  Transaction,
  generatePaymentId,
  getCurrencyTypeFromAddress,
  isCrypto,
  isFiat,
  isGreaterThanZero,
  isValidCurrency,
  resolveNumber
} from '../../util';

import Widget, { WidgetProps } from './Widget';

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

    const [thisPaymentId, setThisPaymentId] = useState<string | undefined>();
    const [thisPrice, setThisPrice] = useState(0);
    useEffect(() => {
      if ((paymentId === undefined || paymentId === '') && !disablePaymentId) {
        const newPaymentId = generatePaymentId(8);
        setThisPaymentId(newPaymentId)
      } else {
        setThisPaymentId(paymentId)
      }
    }, [paymentId, disablePaymentId]);
    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [newTxs, setNewTxs] = useState<Transaction[] | undefined>();
    const addrType = getCurrencyTypeFromAddress(to);
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
        if (sound && !hideToasts) txSound.play().catch(() => {});

        const {
          amount: transactionAmount,
          paymentId: transactionPaymentId } = transaction;
        const receivedAmount = resolveNumber(transactionAmount);

        const currencyTicker = getCurrencyTypeFromAddress(to);
        if (!hideToasts)
          enqueueSnackbar(
            `${
              successText ? successText + ' | ' : ''
            }Received ${receivedAmount} ${currencyTicker}`,
            snackbarOptions,
          );
        const txPaymentId = transactionPaymentId
        const isCryptoAmountValid = (cryptoAmount && receivedAmount.isEqualTo(resolveNumber(cryptoAmount))) || !cryptoAmount;
        const isPaymentIdValid = thisPaymentId ? txPaymentId === thisPaymentId : true;

        if (isCryptoAmountValid && isPaymentIdValid)
        {
          setSuccess(true);
          onSuccess?.(transaction);
        } else {
          onTransaction?.(transaction);
        }
        setNewTxs([]);
      },
      [
        onSuccess,
        onTransaction,
        enqueueSnackbar,
        hideToasts,
        sound,
        txSound,
        cryptoAmount,
        successText,
        to,
        thisPaymentId
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
      if (price === undefined) {
          getPrice();
      } else {
        setThisPrice(price)
      }
    }, [currency, price]);

    useEffect(() => {
      if (isFiat(currency) && price === undefined) {
        (async () => {
          getPrice();
        })()
      }
    }, [currency, price]);

    const handleNewTransaction = useCallback(
      (tx: Transaction) => {
        if (
          tx.confirmed === false &&
          isGreaterThanZero(resolveNumber(tx.amount))
        ) {
          handlePayment(tx);
        }
      },
      [handlePayment],
    );

    useEffect(() => {
      newTxs?.map(tx => {
        handleNewTransaction(tx);
      });
    }, [newTxs, handleNewTransaction]);

    return (
      <React.Fragment>
        <Widget
          to={to}
          {...widgetProps}
          amount={amount}
          setAmount={setAmount}
          opReturn={opReturn}
          paymentId={thisPaymentId}
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
