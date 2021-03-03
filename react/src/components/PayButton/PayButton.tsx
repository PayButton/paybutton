import { Dialog } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import {
  WidgetContainer,
  cryptoCurrency,
  currency,
} from '../Widget/WidgetContainer';
import { validateCashAddress } from '../../util/address';

export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number | string;
  currency?: currency;
  theme?: ThemeName | Theme;
  text?: string;
  hoverText?: string;
  successText?: string;
  displayCurrency?: cryptoCurrency;
  randomSatoshis?: boolean;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
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
    displayCurrency,
    hideToasts,
    onSuccess,
    onTransaction,
    goalAmount,
    disableEnforceFocus,
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
    if (validateCashAddress(to)) {
      setDisabled(!!props.disabled);
      setErrorMsg('');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
    if (to === '') {
      setErrorMsg('Missing Recipient');
    }
  }, [to]);

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
          displayCurrency={displayCurrency}
          hideToasts={hideToasts}
          onSuccess={handleSuccess}
          onTransaction={onTransaction}
          successText={successText}
          disabled={disabled}
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
};

export default PayButton;
