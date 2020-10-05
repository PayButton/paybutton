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
  displayCurrency?: cryptoCurrency;
  randomSatoshis?: boolean;
  hideToasts?: boolean;
  onSuccess?: (txid: string, amount: number) => void;
  onTransaction?: (txid: string, amount: number) => void;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    to: address,
    amount,
    currency,
    animation,
    randomSatoshis,
    displayCurrency,
    hideToasts,
    hoverText,
    onSuccess,
    onTransaction,
    text,
  } = Object.assign({}, PayButton.defaultProps, props);

  const handleButtonClick = (): void => setWidgetOpen(true);
  const handleWidgetClose = (): void => setWidgetOpen(false);
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
      />
      <Dialog open={widgetOpen} onClose={handleWidgetClose} keepMounted>
        <WidgetContainer
          ButtonComponent={ButtonComponent}
          active={widgetOpen}
          address={address}
          amount={amount}
          currency={currency}
          randomSatoshis={randomSatoshis}
          displayCurrency={displayCurrency}
          hideToasts={hideToasts}
          onSuccess={handleSuccess}
          onTransaction={onTransaction}
          foot={
            success && (
              <ButtonComponent
                onClick={handleWidgetClose}
                text="Close"
                hoverText="Close"
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
};

export default PayButton;
