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
  getFiatPrice,
  getTransactionDetails,
} from '../../util/api-client';
import format from '../../util/format';
import { randomizeSatoshis } from '../../util/randomizeSats';
import { bchToSatoshis, satoshisToBch } from '../../util/satoshis';
import Widget, { WidgetProps } from './Widget';

export type cryptoCurrency = 'BCH' | 'SAT';
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
    const transformAmount = useMemo(
      () => (randomSatoshis ? randomizeSatoshis : (x: number): number => x),
      [randomSatoshis],
    );

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(() => {
      if (props.amount == null) return null;

      if (currency === 'BCH') return transformAmount(props.amount);

      if (currency === 'SAT')
        return transformAmount(satoshisToBch(props.amount));

      return null;
    });

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

      if (!props.amount || ['BCH', 'SAT'].includes(currency)) {
        setLoading(false);
        return;
      }

      setLoading(true);

      let cancelled = false;

      (async (): Promise<void> => {
        if (props.amount === undefined) return;

        const data = await getFiatPrice(currency as fiatCurrency);
        const bchAmount = props.amount / (data.price / 100);

        if (cancelled) return;

        setAmount(transformAmount(bchAmount));
        setLoading(false);
      })();

      return (): void => {
        cancelled = true;
      };
    }, [active, props.amount, currency, transformAmount]);

    let formattedAmount = `${format.amount(amount) ?? 'any amount of'} BCH`;
    if (amount != null) {
      if (currency !== 'BCH' && currency !== 'SAT')
        formattedAmount = `${format.amount(
          props.amount,
        )} ${currency} = ${formattedAmount}`;
      if (displayCurrency === 'BCH')
        formattedAmount = `${format.amount(amount)} BCH`;
      if (displayCurrency === 'SAT')
        formattedAmount = `${bchToSatoshis(amount)} BCH satoshis`;
    }

    const text = `Send ${formattedAmount ?? 'any amount of BCH'}`;

    return (
      <React.Fragment>
        <Widget
          to={to}
          {...widgetProps}
          amount={amount}
          text={text}
          totalReceived={totalReceived}
          goalAmount={goalAmount}
          currency={currency}
          loading={loading}
          success={success}
          disabled={disabled}
        />
      </React.Fragment>
    );
  },
);

export default WidgetContainer;
