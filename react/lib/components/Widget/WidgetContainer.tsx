import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAltpaymentClient } from '../../altpayment';

import successSound from '../../assets/success.mp3.json';

import {
  getFiatPrice,
  Currency,
  CurrencyObject,
  Transaction,
  generatePaymentId,
  getCurrencyTypeFromAddress,
  isCrypto,
  isGreaterThanZero,
  isValidCurrency,
  resolveNumber,
  shouldTriggerOnSuccess,
  isPropsTrue,
  ButtonSize,
} from '../../util';

import Widget, { WidgetProps } from './Widget';

export interface WidgetContainerProps
  extends Omit<WidgetProps, 'success' | 'setCurrencyObject' | 'shiftCompleted' | 'setShiftCompleted'  > {
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
  disableAltpayment?: boolean
  contributionOffset?: number
  setNewTxs: Function
  disableSound?: boolean
  transactionText?: string
  size: ButtonSize;
}

const snackbarOptionsSuccess: OptionsObject = {
  variant: 'success',
  style:{
    marginBottom: '60px',
  },
  autoHideDuration: 8000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
};

const snackbarOptionsInfo: OptionsObject = {
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
      disableAltpayment,
      contributionOffset,
      altpaymentShift,
      setAltpaymentShift,
      newTxs,
      setNewTxs,
      txsSocket,
      isChild,
      disableSound,
      transactionText,
      size,
      ...widgetProps
    } = props;
    const [internalCurrencyObj, setInternalCurrencyObj] = useState<CurrencyObject>();
    const setCurrencyObj = props.setCurrencyObj || setInternalCurrencyObj;
    const currencyObj = props.currencyObj || internalCurrencyObj;

    const [thisPaymentId, setThisPaymentId] = useState<string | undefined>();
    const [thisPrice, setThisPrice] = useState(0);
    const [usdPrice, setUsdPrice] = useState(0);
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

    const [shiftCompleted, setShiftCompleted] = useState(false);

    const paymentClient = getAltpaymentClient()

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
      async (transaction: Transaction) => {
        if (altpaymentShift) {
          const shiftStatus = await paymentClient.getPaymentStatus(altpaymentShift.id)
          if (shiftStatus.status === 'settled') {
            if (sound && !isPropsTrue(disableSound)) txSound.play().catch(() => {});
            onSuccess?.(transaction);
            setShiftCompleted(true)
          }
        } else {
          const expectedAmount = currencyObj ? currencyObj?.float : undefined
          const receivedAmount = resolveNumber(transaction.amount);
          const currencyTicker = getCurrencyTypeFromAddress(to);

          if (shouldTriggerOnSuccess(
            transaction,
            currency,
            thisPrice,
            randomSatoshis,
            disablePaymentId,
            thisPaymentId,
            expectedAmount,
            opReturn,
            currencyObj
          )) {
            if (sound && !isPropsTrue(disableSound)) {
              txSound.play().catch(() => {});
            }

            if (!hideToasts)
              enqueueSnackbar(
                `${
                  successText ? successText + ' | ' : ''
                }Received ${receivedAmount} ${currencyTicker}`,
                snackbarOptionsSuccess,
              );
            setSuccess(true);
            onSuccess?.(transaction);
          } else {
            onTransaction?.(transaction);
            if (transactionText){
              enqueueSnackbar(
                `${
                  transactionText ? transactionText : 'New transaction'
                } | Received ${receivedAmount} ${currencyTicker}`,
                snackbarOptionsInfo,
              );
            }
            
          }
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
        thisPaymentId,
        altpaymentShift,
        thisPrice,
        currencyObj,
        randomSatoshis
      ],
    );

    const getPrice = useCallback(
      async () => {
        const price = await getFiatPrice(currency, to, apiBaseUrl)
        const usdPrice = await getFiatPrice('USD', to, apiBaseUrl)
        if (price !== null) setThisPrice(price)
        if (usdPrice !== null) setUsdPrice(usdPrice)
      }
      , [currency, to, apiBaseUrl]
    );

    useEffect(() => {
      if (price === undefined || price === 0) {
        (async () => {
          getPrice();
        })()
      } else {
        setThisPrice(price)
      }
    }, [currency, price, usdPrice]);

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
          isChild={isChild}
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
          usdPrice={usdPrice}
          success={success}
          disabled={disabled}
          editable={editable}
          newTxs={newTxs}
          setNewTxs={setNewTxs}
          txsSocket={txsSocket}
          wsBaseUrl={wsBaseUrl}
          apiBaseUrl={apiBaseUrl}
          successText={successText}
          hoverText={hoverText}
          altpaymentShift={altpaymentShift}
          setAltpaymentShift={setAltpaymentShift}
          shiftCompleted={shiftCompleted}
          setShiftCompleted={setShiftCompleted}
          disableAltpayment={disableAltpayment}
          contributionOffset={contributionOffset}
          transactionText={transactionText}
          size={size}
        />
      </React.Fragment>
    );
  });

export default WidgetContainer;
