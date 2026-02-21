import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAltpaymentClient } from '../../altpayment';
import { GlobalStyles } from '@mui/material'
import config from '../../paybutton-config.json'

import successSound from '../../assets/success.mp3.json';

import {
  getFiatPrice,
  Currency,
  CurrencyObject,
  Transaction,
  getCurrencyTypeFromAddress,
  isCrypto,
  isGreaterThanZero,
  isValidCurrency,
  resolveNumber,
  shouldTriggerOnSuccess,
  isPropsTrue,
  DEFAULT_DONATION_RATE,
  POLL_TX_HISTORY_LOOKBACK,
  POLL_REQUEST_DELAY,
} from '../../util';
import { getAddressDetails } from '../../util/api-client';

import Widget, { WidgetProps } from './Widget';

export interface WidgetContainerProps
  extends Omit<WidgetProps, 'success' | 'setCurrencyObject' | 'shiftCompleted' | 'setShiftCompleted' | 'setPaymentId' > {
  active?: boolean;
  amount?: number;
  opReturn?: string;
  paymentId?: string;
  disablePaymentId?: boolean;
  currency?: Currency;
  currencyObj?: CurrencyObject;
  cryptoAmount?: string;
  price?: number;
  setCurrencyObj?: Function;
  randomSatoshis?: boolean | number;
  hideToasts?: boolean;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  sound?: boolean;
  goalAmount?: number | string;
  disabled?: boolean;
  editable?: boolean;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
  successText?: string;
  disableAltpayment?: boolean
  contributionOffset?: number
  setNewTxs?: Function
  disableSound?: boolean
  transactionText?: string
  donationAddress?: string
  donationRate?: number
  convertedCurrencyObj?: CurrencyObject;
  hideSendButton?: boolean;
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
  <T extends object>(Component: React.ComponentType<T>): React.FunctionComponent<T> =>
  (props) => {
    return (
      <SnackbarProvider>
        <GlobalStyles styles={{
          '.SnackbarContainer-root': { marginBottom: '60px' },
          '.SnackbarContainer-anchorOriginBottomCenter': { marginBottom: '60px' },
        }} />
        <Component {...props} />
      </SnackbarProvider>
    )
  }

export const WidgetContainer: React.FunctionComponent<WidgetContainerProps> =
  withSnackbar((props): React.ReactElement => {
    let {
      to,
      opReturn,
      disablePaymentId = isPropsTrue(props.disablePaymentId),
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
      apiBaseUrl = config.apiBaseUrl,
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
      donationAddress,
      donationRate,
      convertedCurrencyObj,
      setConvertedCurrencyObj,
      hideSendButton,
      ...widgetProps
    } = props;
    const [internalCurrencyObj, setInternalCurrencyObj] = useState<CurrencyObject>();
    const setCurrencyObj = props.setCurrencyObj || setInternalCurrencyObj;
    const currencyObj = props.currencyObj || internalCurrencyObj;
    const [internalNewTxs, setInternalNewTxs] = useState<Transaction[] | undefined>();
    const thisNewTxs = setNewTxs ? newTxs : internalNewTxs;
    const thisSetNewTxs = setNewTxs ?? setInternalNewTxs;
    if (donationRate === undefined){
      donationRate = DEFAULT_DONATION_RATE
    }

    const [internalPaymentId, setInternalPaymentId] = useState<string | undefined>(undefined)
    const thisPaymentId = paymentId ?? internalPaymentId
    const setThisPaymentId = setInternalPaymentId

    const [thisPrice, setThisPrice] = useState(0);
    const [usdPrice, setUsdPrice] = useState(0);
    const [success, setSuccess] = useState(false);
    const [pendingFinalization, setPendingFinalization] = useState(false);
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
          const isXec = currencyTicker === 'XEC';
          const isFinalized = transaction.txStatus === 'finalized';

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
            if (isXec && !isFinalized) {
              setPendingFinalization(true);
              if (transaction.txStatus === 'mempool') {
                onTransaction?.(transaction);
              }
              thisSetNewTxs([]);
              return;
            }

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
            setPendingFinalization(false);
            setSuccess(true);
            onSuccess?.(transaction);
          } else {
            // FIXME: Since the confirmed transactions are supported this could
            // be called twice for the same transaction. In order to maintain
            // the same behavior as before the confirmed transactions are
            // supported we should only call onTransaction if the transaction is
            // not confirmed. The proper fix would be to add a status so the
            // callback know why it's called (added to mempool, finalized,
            // confirmed, etc.). Fabien 2026-02-20
            if (transaction.confirmed === false) {
              onTransaction?.(transaction);
            }
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
        thisSetNewTxs([]);
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
        randomSatoshis,
        donationRate,
        pendingFinalization
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
        if (success) {
          return;
        }

        if (isGreaterThanZero(resolveNumber(tx.amount))) {
          handlePayment(tx);
        }
      },
      [handlePayment, success],
    );

    const checkForTransactions = useCallback(async (): Promise<boolean> => {
      if (success) {
        // Payment already succeeded, stop checking
        return true;
      }

      try {
        const history = await getAddressDetails(to, apiBaseUrl);
        // Save time by only checking the last few transactions
        const recentTxs = history.slice(0, POLL_TX_HISTORY_LOOKBACK);

        recentTxs.forEach(tx => {
          handleNewTransaction(tx);
        });
        return true;
      } catch (error) {
        // Failed to fetch history, there is no point in retrying
        return false;
      }
    }, [success, to, apiBaseUrl, handleNewTransaction]);

    useEffect(() => {
      thisNewTxs?.map(tx => {
        handleNewTransaction(tx);
      });
    }, [thisNewTxs, handleNewTransaction]);

    useEffect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      let wasHidden = document.hidden;
      let hiddenTimestamp = 0;
      let retryTimeoutId: NodeJS.Timeout | null = null;

      const handleVisibilityChange = async () => {
        // Clear any pending retry timeout
        if (retryTimeoutId) {
          clearTimeout(retryTimeoutId);
          retryTimeoutId = null;
        }

        if (document.hidden) {
          wasHidden = true;
          hiddenTimestamp = Date.now();
          return;
        }

        // Debounce the event to avoid querying the history for spurious events.
        // This happens specifically when the user clicks on the paybutton,
        // before the app handles the deeplink.
        if (!wasHidden || Date.now() - hiddenTimestamp < 200) {
          wasHidden = false;
          return;
        }

        wasHidden = false;
        
        if (!to || success) {
          // No destination or payment already succeeded, skip checking
          return;
        }
        
        // Run immediately (attempt 1)
        const checkCompleted = await checkForTransactions();
        
        // If check completed successfully but payment hasn't succeeded yet,
        // Schedule a single retry after 2 seconds. This is only there to handle
        // the case where the transaction is discovered after the app has been
        // foregrounded, but before the chronik websocket is resumed. 2 seconds
        // should be plenty for this case which is not expected to happen under
        // normal circumstances.
        // Note that we can't check success at this stage because it is captured
        // and we would use a stale value. So we run the timeout unconditionally
        // and let the useEffect cancel it if success turns true. Worst case it
        // does an API call and then it's a no-op.
        if (checkCompleted && !success) {
          retryTimeoutId = setTimeout(async () => {
            await checkForTransactions();
            retryTimeoutId = null;
          }, POLL_REQUEST_DELAY);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (retryTimeoutId) {
          clearTimeout(retryTimeoutId);
          retryTimeoutId = null;
        }
      };
    }, [to, thisPaymentId, success, disablePaymentId, checkForTransactions]);

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
          pendingFinalization={pendingFinalization}
          disabled={disabled}
          editable={editable}
          newTxs={thisNewTxs}
          setNewTxs={thisSetNewTxs}
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
          donationAddress={donationAddress}
          donationRate={donationRate}
          convertedCurrencyObj={convertedCurrencyObj}
          setConvertedCurrencyObj={setConvertedCurrencyObj}
          setPaymentId={setThisPaymentId}
          hideSendButton={hideSendButton}
        />
      </React.Fragment>
    );
  });

export default WidgetContainer;
