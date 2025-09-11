import { Dialog, Zoom } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { WidgetContainer } from '../Widget/WidgetContainer';
import { Currency, CurrencyObject, Transaction, isPropsTrue, isValidCashAddress, isValidXecAddress } from '../../util';
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
  newTxs?: Transaction[]
  autoClose?: boolean;
  disableSound?: boolean;
  transactionText?: string
}

export const PaymentDialog = ({
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
  successText = 'Thank you!',
  animation = 'slide',
  randomSatoshis = false,
  hideToasts = false,
  onClose,
  onSuccess,
  onTransaction,
  goalAmount,
  disableEnforceFocus = false,
  editable = false,
  dialogOpen = true,
  setDialogOpen,
  container,
  wsBaseUrl,
  apiBaseUrl,
  hoverText,
  disableAltpayment,
  contributionOffset,
  autoClose = true,
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
  disabled,
  theme: themeProp,
}: PaymentDialogProps): React.ReactElement => {
  const [success, setSuccess] = useState(false);
  const [internalDisabled, setInternalDisabled] = useState(false);

  

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
      if (isPropsTrue(autoClose)) {
        handleWidgetClose();
      }
    }, 3000);
  };
  useEffect(() => {
    const invalidAmount = amount !== undefined && isNaN(+amount);

    if (to !== undefined && (isValidCashAddress(to) || isValidXecAddress(to))) {
      setInternalDisabled(isPropsTrue(disabled));
    } else if (invalidAmount) {
      setInternalDisabled(true);
    } else {
      setInternalDisabled(true);
    }
  }, [to, amount, disabled]);

  const ButtonComponent: React.FunctionComponent<ButtonProps> = (
    props: ButtonProps,
  ): React.ReactElement => <Button animation={animation} {...props} />;

  const theme = useTheme(themeProp, isValidXecAddress(to));

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
          disabled={internalDisabled}
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
              disabled={internalDisabled} />
          )}        />
      </Dialog>
    </ThemeProvider>
  );
};

export default PaymentDialog;
