import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { currency } from '../../util/api-client';
import { PaymentDialog } from '../PaymentDialog/PaymentDialog';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import { currencyObject, getCurrencyObject } from '../../util/satoshis';
import BigNumber from 'bignumber.js';
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
  onSuccess?: (txid: string, amount: BigNumber) => void;
  onTransaction?: (txid: string, amount: BigNumber) => void;
  onOpen?: (
    expectedAmount?: number | string,
    address?: string,
    paymentId?: string,
  ) => void;
  onClose?: (paymentId?: string, success?: boolean) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amount, setAmount] = useState(props.amount);
  const [paymentId] = useState(generatePaymentId(8));
  const [currencyObj, setCurrencyObj] = useState<currencyObject | undefined>();

  const {
    to,
    opReturn,
    disablePaymentId,
    currency,
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

  const handleButtonClick = (): void => {
    if (onOpen !== undefined) onOpen(amount, to, paymentId);
    setDialogOpen(true);
  };
  const handleCloseDialog = (paymentId?: string, success?: boolean): void => {
    if (onClose !== undefined) onClose(paymentId, success);
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
  randomSatoshis: true,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
};

PayButton.defaultProps = payButtonDefaultProps;

export default PayButton;
