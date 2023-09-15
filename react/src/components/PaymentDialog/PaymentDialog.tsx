import { Dialog } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer } from '../Widget/WidgetContainer';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import { currency } from '../../util/api-client';
import BigNumber from 'bignumber.js';

export interface PaymentDialogProps extends ButtonProps {
  to: string;
  amount?: number | string;
  currency?: currency;
  theme?: ThemeName | Theme;
  successText?: string;
  randomSatoshis?: boolean;
  hideToasts?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  canEdit?: boolean;
  dialogOpen: boolean;
  disableScrollLock?: boolean;
  active?: boolean;
  container?: HTMLElement;
  onClose?: () => void;
  onSuccess?: (txid: string, amount: BigNumber) => void;
  onTransaction?: (txid: string, amount: BigNumber) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
}

export const PaymentDialog = (
  props: PaymentDialogProps,
): React.ReactElement => {
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);

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
    canEdit,
    dialogOpen,
    container,
    wsBaseUrl,
    apiBaseUrl
  } = Object.assign({}, PaymentDialog.defaultProps, props);

  const handleWidgetClose = (): void => {
    setSuccess(false);
    if (onClose) onClose();
  };
  const handleSuccess = (txid: string, amount: BigNumber): void => {
    setSuccess(true);
    onSuccess?.(txid, amount);
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
  }, [to, amount]);

  const ButtonComponent: React.FC<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  const theme = useTheme(props.theme, isValidXecAddress(to));

  let cleanAmount: any;

  if (amount) {
    cleanAmount = +amount;
  }

  return (
    <ThemeProvider value={theme}>
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
          currency={currency}
          animation={animation}
          randomSatoshis={randomSatoshis}
          hideToasts={hideToasts}
          onSuccess={handleSuccess}
          onTransaction={onTransaction}
          successText={successText}
          disabled={disabled}
          canEdit={canEdit}
          goalAmount={goalAmount}
          wsBaseUrl={wsBaseUrl}
          apiBaseUrl={apiBaseUrl}
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

PaymentDialog.defaultProps = {
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: true,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  canEdit: false,
  dialogOpen: true,
};

export default PaymentDialog;
