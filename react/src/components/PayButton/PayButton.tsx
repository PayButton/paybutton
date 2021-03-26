import { Dialog } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer, currency } from '../Widget/WidgetContainer';
import { validateCashAddress } from '../../util/address';

export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number | string;
  currency?: currency;
  theme?: ThemeName | Theme;
  text?: string;
  hoverText?: string;
  successText?: string;
  randomSatoshis?: boolean;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    to,
    amount,
    currency,
    text,
    hoverText,
    successText,
    animation,
    randomSatoshis,
    hideToasts,
    onSuccess,
    onTransaction,
    goalAmount,
    disableEnforceFocus,
    editable,
  } = Object.assign({}, PayButton.defaultProps, props);

  const handleButtonClick = (): void => setWidgetOpen(true);
  const handleWidgetClose = (): void => {
    setWidgetOpen(false);
    setSuccess(false);
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
      <ButtonComponent
        onClick={handleButtonClick}
        text={text}
        hoverText={hoverText}
        disabled={disabled}
      />
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

PayButton.defaultProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: true,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
};

export default PayButton;
