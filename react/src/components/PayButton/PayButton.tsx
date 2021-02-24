import { Dialog } from '@material-ui/core';
import React, { useState } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import {
  WidgetContainer,
  cryptoCurrency,
  currency,
} from '../Widget/WidgetContainer';

export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number;
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
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [success, setSuccess] = useState(false);

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
    disabled,
    goalAmount,
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

  const ButtonComponent: React.FC<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  const theme = useTheme(props.theme);

  return (
    <ThemeProvider value={theme}>
      <ButtonComponent
        onClick={handleButtonClick}
        text={text}
        hoverText={hoverText}
        disabled={disabled}
      />
      <Dialog open={widgetOpen} onClose={handleWidgetClose} disableScrollLock>
        <WidgetContainer
          ButtonComponent={ButtonComponent}
          active={widgetOpen}
          to={to}
          amount={amount}
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
    </ThemeProvider>
  );
};

PayButton.defaultProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: true,
  successText: 'Thank you!',
  disabled: false,
};

export default PayButton;
