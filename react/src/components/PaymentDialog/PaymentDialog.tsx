import { Dialog } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer, currency } from '../Widget/WidgetContainer';
import { validateCashAddress } from '../../util/address';

export interface PaymentDialogProps extends ButtonProps {
  to: string;
  amount?: number | string;
  currency?: currency;
  theme?: ThemeName | Theme;
  successText?: string;
  randomSatoshis?: boolean;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  onClose?: () => void;
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
}

export const PaymentDialog = (
  props: PaymentDialogProps,
): React.ReactElement => {
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    to,
    amount,
    currency,
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
  } = Object.assign({}, PaymentDialog.defaultProps, props);

  const handleWidgetClose = (): void => {
    setWidgetOpen(false);
    setSuccess(false);
    if (onClose) onClose();
  };
  const handleSuccess = (txid: string, amount: number): void => {
    setSuccess(true);
    onSuccess?.(txid, amount);
  };

  useEffect(() => {
    const invalidAmount = amount !== undefined && isNaN(+amount);

    if (to !== undefined && validateCashAddress(to)) {
      setDisabled(!!props.disabled);
      setErrorMsg('');
    } else if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
  }, [to, amount]);

  const ButtonComponent: React.FC<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  const theme = useTheme(props.theme);

  let cleanAmount: any;

  if (amount) {
    cleanAmount = +amount;
  }

  return (
    <ThemeProvider value={theme}>
      <Dialog
        open={widgetOpen}
        onClose={handleWidgetClose}
        disableEnforceFocus={disableEnforceFocus}
        disableScrollLock
      >
        <WidgetContainer
          ButtonComponent={ButtonComponent}
          active={widgetOpen}
          to={to}
          amount={cleanAmount}
          currency={currency}
          randomSatoshis={randomSatoshis}
          hideToasts={hideToasts}
          onSuccess={handleSuccess}
          onTransaction={onTransaction}
          successText={successText}
          disabled={disabled}
          editable={editable}
          goalAmount={goalAmount}
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

PaymentDialog.defaultProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: true,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
};

export default PaymentDialog;
