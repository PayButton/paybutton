import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import sumBy from 'lodash/sumBy';
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
import { randomizeSats } from '../../util/randomizeSats';
import { bchToSatoshis, satoshisToBch } from '../../util/satoshis';
import Widget, { WidgetProps } from './Widget';

export type cryptoCurrency = 'BCH' | 'SAT';
export type currency = cryptoCurrency | fiatCurrency;

export interface WidgetContainerProps
  extends Omit<Omit<WidgetProps, 'loading'>, 'success'> {
  active?: boolean;
  amount?: number;
  currency?: currency;
  detectPayment?: boolean;
  displayCurrency?: cryptoCurrency;
  hideToasts?: boolean;
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
  sound?: boolean;
}

export const WidgetContainer = (
  props: WidgetContainerProps,
): React.ReactElement => {
  const {
    active = true,
    address,
    currency = 'BCH',
    detectPayment = false,
    displayCurrency,
    hideToasts = false,
    sound = true,
    onSuccess,
    onTransaction,
    ...widgetProps
  } = props;

  const transactionsRef = useRef<Set<string>>(new Set());
  const hasLoadedTransactionsRef = useRef(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const addressDetails = useAddressDetails(address, active && !success);

  const transformAmount = useMemo(
    () => (detectPayment ? randomizeSats : (x: number): number => x),
    [detectPayment],
  );

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(() => {
    if (props.amount == null) return null;

    if (currency === 'BCH') return transformAmount(props.amount);

    if (currency === 'SAT') return transformAmount(satoshisToBch(props.amount));

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

      if (!hideToasts) setToastMessage(`Received ${receivedAmount} BCH`);

      onTransaction?.(txid, receivedAmount);

      if (amount && satoshis === bchToSatoshis(amount)) {
        setSuccess(true);
        onSuccess?.(txid, receivedAmount);
      }
    },
    [amount, onSuccess, onTransaction, hideToasts, sound, txSound],
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

  const handleCloseToast = (
    _event: React.SyntheticEvent<Element, Event>,
    reason?: string,
  ): void => {
    reason === 'clickaway' || setToastMessage(undefined);
  };

  return (
    <React.Fragment>
      <Widget
        address={address}
        {...widgetProps}
        amount={amount}
        text={text}
        loading={loading}
        success={success}
      />
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="success">
          {toastMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default WidgetContainer;
