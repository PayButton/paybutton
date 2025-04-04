import { Dialog, Zoom } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer } from '../Widget/WidgetContainer';
import { Currency, CurrencyObject, Transaction, isPropsTrue, isValidCashAddress, isValidXecAddress } from '../../util';
import { Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment';

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
  autoClose?: boolean
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
  newTxs?: Transaction[]
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
    hoverText,
    disableAltpayment,
    contributionOffset,
    autoClose
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
    setAddressType
  } = Object.assign({}, PaymentDialog.defaultProps, props);

  const handleWidgetClose = (): void => {
    if (onClose) onClose(success, paymentId);
    setSuccess(false);
  };
  const handleSuccess = (transaction: Transaction): void => {
    if (dialogOpen === false) {
      setDialogOpen(true)
    }
    setSuccess(true);
    onSuccess?.(transaction);
    setTimeout(() => {
      setSuccess(false);
      if (autoClose === true) {
        handleWidgetClose();
      }
    }, 3000);
  };
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
