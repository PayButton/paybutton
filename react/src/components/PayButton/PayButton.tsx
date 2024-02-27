import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { Transaction, currency, isFiat, getFiatPrice } from '../../util/api-client';
import { PaymentDialog } from '../PaymentDialog/PaymentDialog';
import { getCurrencyTypeFromAddress, isValidCashAddress, isValidXecAddress } from '../../util/address';
import { currencyObject, getCurrencyObject } from '../../util/satoshis';
import { generatePaymentId } from '../../util/opReturn';

export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number | string;
  opReturn?: string;
  disablePaymentId?: boolean;
  currency?: currency;
  theme?: ThemeName | Theme;
  text?: string;
  hoverText?: string;
  successText?: string;
  randomSatoshis?: boolean | number | undefined;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  onOpen?: (
    amount?: number | string,
    to?: string,
    paymentId?: string,
  ) => void;
  onClose?: (success?: boolean, paymentId?:string) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amount, setAmount] = useState(props.amount);

  const [currencyObj, setCurrencyObj] = useState<currencyObject | undefined>();
  const [cryptoAmount, setCryptoAmount] = useState<string>();
  const [price, setPrice] = useState(0);
  const priceRef = useRef<number>(price);
  const cryptoAmountRef = useRef<string | undefined>(cryptoAmount);


  const {
    to,
    opReturn,
    disablePaymentId,
    currency = '' as currency,
    text,
    hoverText,
    successText,
    animation,
    randomSatoshis,
    hideToasts,
    onSuccess,
    onTransaction,
    onOpen,
    onClose,
    goalAmount,
    disableEnforceFocus,
    editable,
    wsBaseUrl,
    apiBaseUrl,
  } = Object.assign({}, PayButton.defaultProps, props);

  const [paymentId] = useState(!disablePaymentId ? generatePaymentId(8) : undefined);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    priceRef.current = price;
  }, [price]);

  useEffect(() => {
    cryptoAmountRef.current = cryptoAmount;
  }, [cryptoAmount]);

  const waitPrice = async (callback: Function) => {
    while (true) {
      if (priceRef.current !== 0) {
        break;
      } else {
        await delay(300);
      }
    }
    callback()
  }
  const handleButtonClick = useCallback(async (): Promise<void> => {
    if (onOpen !== undefined) {
      if (isFiat(currency)) {
        void waitPrice(() => { onOpen(cryptoAmountRef.current, to, paymentId) })
      } else {
        onOpen(amount, to, paymentId)
      }
    }
    setDialogOpen(true);
  }, [cryptoAmount, to, paymentId, price])

  const handleCloseDialog = (success?: boolean, paymentId?: string): void => {
    if (onClose !== undefined) onClose(success, paymentId);
    setDialogOpen(false);
  };

  useEffect(() => {
    setAmount(props.amount);
  }, [props.amount]);

  useEffect(() => {
    const invalidAmount = props.amount !== undefined && isNaN(+props.amount);

    if (to !== undefined) {
      setDisabled(!!props.disabled);
      setErrorMsg('');
    } else if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
  }, [to, props.amount, props.disabled]);

  useEffect(() => {
    if (!to) {
      setErrorMsg('Enter an address');
    } else if (isValidCashAddress(to)) {
      setErrorMsg('');
    } else if (isValidXecAddress(to)) {
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Recipient');
    }
  }, [to]);

  useEffect(() => {
    if (dialogOpen === false && props.amount && currency) {
      const obj = getCurrencyObject(
        Number(props.amount),
        currency,
        randomSatoshis,
      );
      setTimeout(() => {
        setAmount(obj.float);
        setCurrencyObj(obj);
      }, 300);
    }
  }, [dialogOpen, props.amount, currency, randomSatoshis]);

  const getPrice = useCallback(
    async () => {
      const price = await getFiatPrice(currency, to, apiBaseUrl)
      if (price !== null) setPrice(price)
    }
    , [currency, to, apiBaseUrl]
  );

  useEffect(() => {
    (async () => {
    if (isFiat(currency) && price === 0) {
      await getPrice();
    }
    })()
  }, [currency, getPrice, to, price]);

  useEffect(() => {
    if (currencyObj && isFiat(currency) && price) {
      const addressType: currency = getCurrencyTypeFromAddress(to);
      const convertedObj = getCurrencyObject(
        currencyObj.float / price,
        addressType,
        randomSatoshis,
      );
      setCryptoAmount(convertedObj.string);
    } else if (!isFiat(currency)) {
      setCryptoAmount(amount?.toString());
    }
  }, [price, currencyObj, amount, currency, randomSatoshis, to]);

  const theme = useTheme(props.theme, isValidXecAddress(to ?? ''));

  const ButtonComponent: React.FC<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  return (
    <ThemeProvider value={theme}>
      <ButtonComponent
        onClick={handleButtonClick}
        text={text}
        hoverText={hoverText}
        disabled={disabled}
      />
      <PaymentDialog
        disableEnforceFocus={disableEnforceFocus}
        disableScrollLock
        to={to ?? ''}
        amount={amount}
        opReturn={opReturn}
        paymentId={paymentId}
        disablePaymentId={disablePaymentId}
        setAmount={setAmount}
        currencyObj={currencyObj}
        setCurrencyObj={setCurrencyObj}
        cryptoAmount={cryptoAmount}
        price={price}
        currency={currency}
        animation={animation}
        randomSatoshis={randomSatoshis}
        hideToasts={hideToasts}
        onTransaction={onTransaction}
        onSuccess={onSuccess}
        successText={successText}
        disabled={disabled}
        editable={editable}
        goalAmount={goalAmount}
        dialogOpen={dialogOpen}
        onClose={handleCloseDialog}
        wsBaseUrl={wsBaseUrl}
        apiBaseUrl={apiBaseUrl}
      />
      {errorMsg && (
        <p
          style={{
            color: '#EB3B3B',
            fontSize: '14px',
            maxWidth: '190px',
            textAlign: 'center',
          }}
        >
          {errorMsg}
        </p>
      )}
    </ThemeProvider>
  );
};

const payButtonDefaultProps: PayButtonProps = {
  to: '',
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: false,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
};

PayButton.defaultProps = payButtonDefaultProps;

export default PayButton;
