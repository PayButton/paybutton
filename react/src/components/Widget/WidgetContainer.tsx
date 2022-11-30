import { OptionsObject, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import successSound from '../../assets/success.mp3.json';
import { useAddressDetails } from '../../hooks/useAddressDetails';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import {
  cryptoCurrency,
  cryptoCurrencies,
  currency,
  getBchFiatPrice,
  getXecFiatPrice,
  getAddressBalance,
  UnconfirmedTransaction,
} from '../../util/api-client';
import { getCurrencyObject, currencyObject } from '../../util/satoshis';
import Widget, { WidgetProps } from './Widget';

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
  editable: boolean;
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
  <T extends object>(Component: React.ComponentType<T>): React.FC<T> =>
  (props): React.ReactElement =>
    (
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
      ...widgetProps
    } = props;

    const address = to;

    const [success, setSuccess] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [totalReceived, setTotalReceived] = useState(0);
    const [currencyObj, setCurrencyObj] = useState<currencyObject>();

    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(props.amount);
    const [price, setPrice] = useState(0);

    const addressDetails = useAddressDetails(address, active && !success);

    const isFiat: boolean = currency !== 'BCH' && currency !== 'XEC';

    const getPrice = useCallback(async (): Promise<void> => {
      try {
        if (isFiat && isValidCashAddress(address)) {
          const data = await getBchFiatPrice(currency);

          const { price } = data;
          setLoading(false);
          setPrice(price);
        } else if (isFiat && isValidXecAddress(address)) {
          // TODO: THIS SHOULD POINT TO THE XEC FUNCTION. THIS IS TEMPORARY WHILE WAITING FOR BACKEND
          const data = await getXecFiatPrice(currency);

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
      (transaction: any, satoshis: number) => {
        if (sound && !hideToasts) txSound.play().catch(() => {});

        const receivedAmount = satoshis;

        if (!hideToasts)
          // TODO: This assumes only bch
          enqueueSnackbar(`Received ${receivedAmount} BCH`, snackbarOptions);

        onTransaction?.(transaction, receivedAmount);

        if (amount && satoshis === amount) {
          setSuccess(true);
          onSuccess?.(transaction, receivedAmount);
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
    const prefixAddress = (string: string): string => {
      const split = string.split(':')[1];

      if (split === undefined) {
        string = `bitcoincash:${string}`;
      }
      return string;
    };

    const handleNewTransaction = useCallback(
      (unconfirmed: UnconfirmedTransaction) => {
        let satoshis = 0;
        const {
          transaction: { outputsList },
        } = unconfirmed;
        outputsList.map((x: Output) => {
          const prefixedAddr = prefixAddress(x.address);
          if (prefixedAddr === prefixAddress(address)) {
            satoshis += x.value;
          }
        });

        if (satoshis > 0) {
          handlePayment(unconfirmed.transaction, satoshis);
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
      (async (): Promise<void> => {
        if (addressDetails) {
          const { balance } = await getAddressBalance(address);
          setTotalReceived(balance);
        }
      })();

      addressDetails?.unconfirmedTransactionsList?.map(unconfirmed => {
        handleNewTransaction(unconfirmed);
      });
    }, [addressDetails, handleNewTransaction]);

    useEffect(() => {
      if (!active) return;

      if (!props.amount || cryptoCurrencies.includes(currency)) {
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
          animation={animation}
          currencyObject={currencyObj}
          loading={loading}
          randomSatoshis={randomSatoshis}
          price={price}
          success={success}
          disabled={disabled}
          editable={editable}
        />
      </React.Fragment>
    );
  },
);

export default WidgetContainer;
