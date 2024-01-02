import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { currency } from '../../util/api-client';
import { PaymentDialog } from '../PaymentDialog/PaymentDialog';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import BigNumber from 'bignumber.js';

export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number | string;
  currency?: currency;
  theme?: ThemeName | Theme;
  text?: string;
  hoverText?: string;
  successText?: string;
  randomSatoshis?: boolean | number;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  onSuccess?: (txid: string, amount: BigNumber) => void;
  onTransaction?: (txid: string, amount: BigNumber) => void;
  onOpen?: () => void;
  onClose?: (paid: boolean) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false);
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
    onOpen,
    onClose,
    goalAmount,
    disableEnforceFocus,
    editable,
    wsBaseUrl,
    apiBaseUrl,
  } = Object.assign({}, PayButton.defaultProps, props);

  const handleButtonClick = (): void => {
    if (onOpen !== undefined) onOpen();
    setDialogOpen(true);
  };
  const handleCloseDialog = (paid: boolean): void => {
    if (onClose !== undefined) onClose(paid);
    setDialogOpen(false);
  };

  useEffect(() => {
    const invalidAmount = amount !== undefined && isNaN(+amount);

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
  }, [to, amount]);

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

  const theme = useTheme(props.theme, isValidXecAddress(to));

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
        to={to}
        amount={amount}
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
