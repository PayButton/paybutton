import { Dialog } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { ButtonTheme, ButtonThemeName, ButtonThemeProvider, useButtonTheme } from '../../buttonThemes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer } from '../Widget/WidgetContainer';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import { Currency, CurrencyObject, Transaction } from '../../util/types';

export interface PaymentDialogProps extends ButtonProps {
  to: string;
  amount?: number | string;
  setAmount: Function;
  opReturn?: string;
  paymentId?: string;
  disablePaymentId?: boolean;
  currency?: Currency;
  currencyObj?: CurrencyObject;
  cryptoAmount?: string;
  price?: number;
  hoverText?: string;
  setCurrencyObj: Function;
  buttonTheme?: ButtonThemeName | ButtonTheme;
  successText?: string;
  randomSatoshis?: boolean | number;
  hideToasts?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  dialogOpen: boolean;
  disableScrollLock?: boolean;
  active?: boolean;
  container?: HTMLElement;
  onClose?: (success?: boolean, paymentId?: string) => void;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
}

const defaultPaymentDialogProps: PaymentDialogProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: false,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
  dialogOpen: true,
  to: '',
  setAmount: () =>{},
  setCurrencyObj: () =>{},
}

export function PaymentDialog(props: PaymentDialogProps){
  props = {...defaultPaymentDialogProps, ...props}

  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const {
    to,
    amount,
    setAmount,
    opReturn,
    paymentId,
    disablePaymentId,
    currency,
    currencyObj,
    setCurrencyObj,
    cryptoAmount,
    price,
    successText,
    animation,
    randomSatoshis,
    hideToasts,
    onClose,
    onSuccess,
    onTransaction,
    goalAmount,
    disableEnforceFocus,
    editable,
    dialogOpen,
    container,
    wsBaseUrl,
    apiBaseUrl,
    hoverText
  } = Object.assign({}, PaymentDialog.defaultProps, props);

  const handleWidgetClose = (): void => {
    if (onClose) onClose(success, paymentId);
    setSuccess(false);
  };
  const handleSuccess = (transaction: Transaction): void => {
    setSuccess(true);
    onSuccess?.(transaction);
  };
  useEffect(() => {
    const invalidAmount = amount !== undefined && isNaN(+amount);

    if (to !== undefined && (isValidCashAddress(to) || isValidXecAddress(to))) {
      setDisabled(!!props.disabled);
    } else if (invalidAmount) {
      setDisabled(true);
    } else {
      setDisabled(true);
    }
  }, [to, amount, props.disabled]);

  const ButtonComponent: React.FC<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  const buttonTheme = useButtonTheme(props.buttonTheme, isValidXecAddress(to));

  let cleanAmount: any;

  if (amount) {
    cleanAmount = +amount;
  }

  return (
    <ButtonThemeProvider value={buttonTheme}>
      <Dialog
        container={container}
        open={dialogOpen}
        onClose={handleWidgetClose}
        disableEnforceFocus={disableEnforceFocus}
        disableScrollLock
      >
        <WidgetContainer
          ButtonComponent={ButtonComponent}
          active={dialogOpen}
          to={to}
          amount={cleanAmount}
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
          onSuccess={handleSuccess}
          onTransaction={onTransaction}
          successText={successText}
          disabled={disabled}
          editable={editable}
          goalAmount={goalAmount}
          wsBaseUrl={wsBaseUrl}
          apiBaseUrl={apiBaseUrl}
          hoverText={hoverText}
          foot={
            success && (
              <ButtonComponent
                onClick={handleWidgetClose}
                text="Close"
                hoverText="Close"
                disabled={disabled}
              />
            )
          }
        />
      </Dialog>
    </ButtonThemeProvider>
  );
};

PaymentDialog.defaultProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: false,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
  dialogOpen: true,
};

export default PaymentDialog;
