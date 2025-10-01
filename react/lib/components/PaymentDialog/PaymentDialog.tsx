import { Dialog, Zoom } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer } from '../Widget/WidgetContainer';
import { Currency, CurrencyObject, Transaction, isPropsTrue, isValidCashAddress, isValidXecAddress, getAutoCloseDelay } from '../../util';
import { Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentPair, AltpaymentShift, AltpaymentError } from '../../altpayment';
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
  theme?: ThemeName | Theme;
  successText?: string;
  randomSatoshis?: boolean | number;
  hideToasts?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  dialogOpen: boolean;
  setDialogOpen: Function;
  disableScrollLock?: boolean;
  active?: boolean;
  container?: HTMLElement;
  onClose?: (success?: boolean, paymentId?: string) => void;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
  disableAltpayment?: boolean;
  contributionOffset?: number;
  useAltpayment: boolean
  setUseAltpayment: Function;
  txsSocket?: Socket;
  setTxsSocket: Function;
  altpaymentSocket?: Socket;
  setAltpaymentSocket: Function;
  setCoins: Function;
  coins: AltpaymentCoin[];
  setCoinPair: Function;
  coinPair?: AltpaymentPair;
  setLoadingPair: Function;
  loadingPair: boolean;
  setAltpaymentShift: Function;
  altpaymentShift?: AltpaymentShift;
  setLoadingShift: Function;
  loadingShift: boolean;
  setAltpaymentError: Function;
  altpaymentError?: AltpaymentError;
  addressType: Currency,
  setAddressType: Function,
  setNewTxs: Function,
  newTxs?: Transaction[],
  autoClose?: boolean | number | string;
  disableSound?: boolean;
  transactionText?: string
}

export const PaymentDialog = (
  props: PaymentDialogProps,
): React.ReactElement => {
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
    setDialogOpen,
    container,
    wsBaseUrl,
    apiBaseUrl,
    disableAltpayment,
    contributionOffset,
    autoClose,
    hoverText,
    useAltpayment,
    setUseAltpayment,
    setTxsSocket,
    txsSocket,
    setAltpaymentSocket,
    altpaymentSocket,
    setCoins,
    coins,
    setCoinPair,
    coinPair,
    setLoadingPair,
    loadingPair,
    setAltpaymentShift,
    altpaymentShift,
    setLoadingShift,
    loadingShift,
    setAltpaymentError,
    altpaymentError,
    addressType,
    newTxs,
    setNewTxs,
    setAddressType,
    disableSound,
    transactionText,
  } = Object.assign({}, PaymentDialog.defaultProps, props);

  // Compute auto-close delay (ms) using shared util

  // Store timeout id so a manual close can cancel it
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoCloseTimer = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const handleWidgetClose = (): void => {
    clearAutoCloseTimer();
    if (onClose) onClose(success, paymentId);
    setSuccess(false);
  };

  const handleSuccess = (transaction: Transaction): void => {
    if (dialogOpen === false) {
      setDialogOpen(true);
    }
    setSuccess(true);
    onSuccess?.(transaction);
    const delay = getAutoCloseDelay(autoClose);
    if (delay !== undefined) {
      clearAutoCloseTimer();
      autoCloseTimerRef.current = setTimeout(() => { handleWidgetClose(); }, delay);
    }
  };

  // Cleanup on unmount
  useEffect(() => () => clearAutoCloseTimer(), []);
  useEffect(() => {
    const invalidAmount = amount !== undefined && isNaN(+amount);

    if (to !== undefined && (isValidCashAddress(to) || isValidXecAddress(to))) {
      setDisabled(isPropsTrue(props.disabled));
    } else if (invalidAmount) {
      setDisabled(true);
    } else {
      setDisabled(true);
    }
  }, [to, amount, props.disabled]);

  const ButtonComponent: React.FunctionComponent<ButtonProps> = (
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
        TransitionComponent={Zoom}
        transitionDuration={{ enter: 300, exit: 300 }}
      >
        <WidgetContainer
          isChild={true}
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
          disableAltpayment={disableAltpayment}
          contributionOffset={contributionOffset}
          useAltpayment={useAltpayment}
          setUseAltpayment={setUseAltpayment}
          setTxsSocket={setTxsSocket}
          txsSocket={txsSocket}
          setAltpaymentSocket={setAltpaymentSocket}
          altpaymentSocket={altpaymentSocket}
          setCoins={setCoins}
          coins={coins}
          setCoinPair={setCoinPair}
          coinPair={coinPair}
          setLoadingPair={setLoadingPair}
          loadingPair={loadingPair}
          setAltpaymentShift={setAltpaymentShift}
          altpaymentShift={altpaymentShift}
          setLoadingShift={setLoadingShift}
          loadingShift={loadingShift}
          setAltpaymentError={setAltpaymentError}
          altpaymentError={altpaymentError}
          addressType={addressType}
          setAddressType={setAddressType}
          setNewTxs={setNewTxs}
          newTxs={newTxs}
          disableSound={disableSound}
          transactionText={transactionText}
          foot={success && (
            <ButtonComponent
              onClick={handleWidgetClose}
              text="Close"
              hoverText="Close"
              disabled={disabled} />
          )}        />
      </Dialog>
    </ThemeProvider>
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
  autoClose: true,
};

export default PaymentDialog;
