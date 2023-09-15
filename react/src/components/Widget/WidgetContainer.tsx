import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import successSound from '../../assets/success.mp3.json';
import {
  isValidCashAddress,
  isValidXecAddress,
  getCurrencyTypeFromAddress,
} from '../../util/address';
import {
  Transaction,
  cryptoCurrency,
  isCrypto,
  isFiat,
  currency,
  getBchFiatPrice,
  getXecFiatPrice,
  isValidCurrency,
} from '../../util/api-client';
import { getCurrencyObject, currencyObject } from '../../util/satoshis';
import Widget, { WidgetProps } from './Widget';
import BigNumber from 'bignumber.js';

export interface WidgetContainerProps
  extends Omit<WidgetProps, 'loading'|'success'|'setNewTxs'|'setCurrencyObject'|'setAmount'> {
  active?: boolean;
  amount?: number;
  currency?: currency;
  randomSatoshis?: boolean;
  displayCurrency?: cryptoCurrency;
  hideToasts?: boolean;
  onSuccess?: (txid: string, amount: BigNumber) => void;
  onTransaction?: (txid: string, amount: BigNumber) => void;
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

const zero = new BigNumber(0);
const withSnackbar =
  <T extends object>(Component: React.ComponentType<T>): React.FC<T> =>
  (props): React.ReactElement =>
    (
      <SnackbarProvider>
        <Component {...props} />
      </SnackbarProvider>
    );

export const WidgetContainer: React.FC<WidgetContainerProps> = withSnackbar(
  (props): React.ReactElement => {
    let {
      active = true,
      to,
      currency="" as currency,
      animation,
      randomSatoshis = true,
      displayCurrency,
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
      ...widgetProps
    } = props;

    const address = to;

    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [currencyObj, setCurrencyObj] = useState<currencyObject>();
    const [cryptoAmount, setCryptoAmount] = useState<string>();

    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(props.amount);
    const [price, setPrice] = useState(0);

    const [newTxs, setNewTxs] = useState<
      Transaction[] | undefined
    >();
    const addrType = getCurrencyTypeFromAddress(to)
    if (
      !isValidCurrency(currency)
      || (isCrypto(currency) && addrType != currency)
    ) {
      currency = addrType
    }

    const getPrice = useCallback(async (): Promise<void> => {
      try {
        if (isFiat(currency) && isValidCashAddress(address)) {
          const data = await getBchFiatPrice(currency, apiBaseUrl);

          const { price } = data;
          setLoading(false);
          setPrice(price);
        } else if (isFiat(currency) && isValidXecAddress(address)) {
          const data = await getXecFiatPrice(currency, apiBaseUrl);

          const { price } = data;
          setLoading(false);
          setPrice(price);
        }
      } catch (error) {
        console.log('err', error);
      }
    }, [currency]);

    const txSound = useMemo(
      (): HTMLAudioElement => new Audio(successSound.base64),
      [],
    );

    const handlePayment = useCallback(
      (transaction: Transaction) => {
        if (sound && !hideToasts) txSound.play().catch(() => {});

        const receivedAmount = new BigNumber(transaction.amount);

        const currencyTicker = getCurrencyTypeFromAddress(to);

        if (!hideToasts)
          // TODO: This assumes only bch
          enqueueSnackbar(
            `${successText} | Received ${receivedAmount} ${currencyTicker}`,
            snackbarOptions,
          );

        if (cryptoAmount && receivedAmount.isEqualTo(new BigNumber(cryptoAmount))) {
          setSuccess(true);
          onSuccess?.(transaction.id, receivedAmount);
        } else {
          onTransaction?.(transaction.id, receivedAmount);
        }
        setNewTxs([])
      },
      [
        amount,
        onSuccess,
        onTransaction,
        enqueueSnackbar,
        hideToasts,
        sound,
        txSound,
        cryptoAmount
      ],
    );

    const handleNewTransaction = useCallback(
      (tx: Transaction) => {

        if (
          tx.confirmed === false &&
          zero.isLessThan(new BigNumber(tx.amount))
        ) {
          handlePayment(tx);
        }
      },
      [handlePayment, address],
    );

    useEffect(() => {
      if (props.amount && currency) {
        const obj = getCurrencyObject(props.amount, currency, randomSatoshis);
        setAmount(obj.float);
        setCurrencyObj(obj);
      }

      if (isFiat(currency) && price === 0) {
        getPrice();
      }
    }, []);

    useEffect(() => {
      newTxs?.map(tx => {
        handleNewTransaction(tx);
      });
    }, [newTxs]);

    useEffect(() => {
      if (!active) return;

      if (!props.amount || isCrypto(currency)) {
        setLoading(false);
      }
    }, [active, props.amount, currency]);

    useEffect(() => {
      if (currencyObj && isFiat(currency) && price) {
        const addressType: currency = getCurrencyTypeFromAddress(to);
        const convertedObj = getCurrencyObject(currencyObj.float / price, addressType, randomSatoshis)
        setCryptoAmount(convertedObj.string)
      } else if (!isFiat(currency)) {
        setCryptoAmount(amount?.toString())
      }
    }, [price, currencyObj])

    return (
      <React.Fragment>
        <Widget
          to={to}
          {...widgetProps}
          amount={amount}
          setAmount={setAmount}
          goalAmount={goalAmount}
          currency={currency}
          animation={animation}
          currencyObject={currencyObj}
          setCurrencyObject={setCurrencyObj}
          loading={loading}
          randomSatoshis={randomSatoshis}
          price={price}
          success={success}
          disabled={disabled}
          editable={editable}
          setNewTxs={setNewTxs}
          newTxs={newTxs}
          wsBaseUrl={wsBaseUrl}
          apiBaseUrl={apiBaseUrl}
          successText={successText}
        />
      </React.Fragment>
    );
  },
);

export default WidgetContainer;
