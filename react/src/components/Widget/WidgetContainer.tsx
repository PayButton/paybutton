import sumBy from 'lodash/sumBy';
import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import successSound from '../../assets/success.mp3.json';
import { useAddressDetails } from '../../hooks/useAddressDetails';
import {
  fiatCurrency,
  getTransactionDetails,
  getFiatPrice,
} from '../../util/api-client';
import {
  bchToSatoshis,
  satoshisToBch,
  getCurrencyObject,
  currencyObject,
} from '../../util/satoshis';
import Widget, { WidgetProps } from './Widget';

export type cryptoCurrency = 'BCH' | 'SAT' | 'bits';
export type currency = cryptoCurrency | fiatCurrency;

export interface WidgetContainerProps
  extends Omit<Omit<WidgetProps, 'loading'>, 'success'> {
  active?: boolean;
  amount?: number;
  currency?: currency;
  randomSatoshis?: boolean;
  displayCurrency?: cryptoCurrency;
  hideToasts?: boolean;
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
  sound?: boolean;
  goalAmount?: number | string;
  disabled: boolean;
}

const snackbarOptions: OptionsObject = {
  variant: 'success',
  autoHideDuration: 8000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
};

const withSnackbar = <T extends object>(
  Component: React.ComponentType<T>,
): React.FC<T> => (props): React.ReactElement => (
  <SnackbarProvider>
    <Component {...props} />
  </SnackbarProvider>
);

export const WidgetContainer: React.FC<WidgetContainerProps> = withSnackbar(
  (props): React.ReactElement => {
    const {
      active = true,
      to,
      currency = 'BCH',
      randomSatoshis = true,
      displayCurrency,
      hideToasts = false,
      sound = true,
      onSuccess,
      onTransaction,
      goalAmount,
      disabled,
      ...widgetProps
    } = props;

    const address = to;

    const transactionsRef = useRef<Set<string>>(new Set());
    const hasLoadedTransactionsRef = useRef(false);
    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const addressDetails = useAddressDetails(address, active && !success);
    const [totalReceived, setTotalReceived] = useState(0);
    const [currencyObj, setCurrencyObj] = useState<currencyObject>();

    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const isFiat: boolean =
      currency !== 'SAT' && currency !== 'BCH' && currency !== 'bits';

    const getPrice = useCallback(async (): Promise<void> => {
      try {
        if (isFiat) {
          const data = await getFiatPrice(currency);
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
      (txid: string, satoshis: number) => {
        if (sound) txSound.play().catch(() => {});

        const receivedAmount = satoshisToBch(satoshis);

        if (!hideToasts)
          enqueueSnackbar(`Received ${receivedAmount} BCH`, snackbarOptions);

        onTransaction?.(txid, receivedAmount);

        if (amount && satoshis === bchToSatoshis(amount)) {
          setSuccess(true);
          onSuccess?.(txid, receivedAmount);
        }
      },
      [
        amount,
        onSuccess,
        onTransaction,
        enqueueSnackbar,
        hideToasts,
        sound,
        txSound,
      ],
    );

    const handleNewTransaction = useCallback(
      async (txid: string) => {
        const details = await getTransactionDetails(txid);
        const satoshis = sumBy(details.vout, output => {
          if (output.scriptPubKey?.cashAddrs?.length !== 1) return 0;
          if (output.scriptPubKey?.cashAddrs[0] !== address) return 0;
          return bchToSatoshis(+output.value);
        });

        if (satoshis > 0) {
          handlePayment(txid, satoshis);
        }
      },
      [handlePayment, address],
    );

    useEffect(() => {
      if (props.amount && currency) {
        const obj = getCurrencyObject(props.amount, currency);
        setAmount(obj.float);
        setCurrencyObj(obj);
      }

      if (isFiat && price === 0) {
        getPrice();
      }
    }, []);

    useEffect(() => {
      const txIds = transactionsRef.current;

      if (addressDetails) {
        const { totalReceivedSat, unconfirmedBalanceSat } = addressDetails;
        setTotalReceived(totalReceivedSat + unconfirmedBalanceSat);
      }

      addressDetails?.transactions?.map(txid => {
        if (!txIds.has(txid)) {
          txIds.add(txid);
          if (hasLoadedTransactionsRef.current) handleNewTransaction(txid);
        }
      });

      if (addressDetails?.transactions) hasLoadedTransactionsRef.current = true;
    }, [addressDetails, handleNewTransaction]);

    useEffect(() => {
      if (!active) return;

      if (!props.amount || ['BCH', 'SAT', 'bits'].includes(currency)) {
        setLoading(false);
      }
    }, [active, props.amount, currency]);

    return (
      <React.Fragment>
        <Widget
          to={to}
          {...widgetProps}
          amount={amount}
          totalReceived={totalReceived}
          goalAmount={goalAmount}
          currency={currency}
          currencyObject={currencyObj}
          loading={loading}
          randomSatoshis={randomSatoshis}
          price={price}
          success={success}
          disabled={disabled}
        />
      </React.Fragment>
    );
  },
);

export default WidgetContainer;
