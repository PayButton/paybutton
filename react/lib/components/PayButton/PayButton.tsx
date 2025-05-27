import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { Socket } from 'socket.io-client';

import {
  Transaction,
  Currency,
  isFiat,
  getFiatPrice,
  getCurrencyTypeFromAddress,
  isValidCashAddress,
  isValidXecAddress,
  CurrencyObject,
  generatePaymentId,
  getCurrencyObject,
  isPropsTrue,
  setupAltpaymentSocket,
  setupTxsSocket,
  CryptoCurrency
} from '../../util';
import { PaymentDialog } from '../PaymentDialog';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment';
export interface PayButtonProps extends ButtonProps {
  to: string;
  amount?: number | string;
  opReturn?: string;
  disablePaymentId?: boolean;
  currency?: Currency;
  theme?: ThemeName | Theme;
  text?: string;
  hoverText?: string;
  successText?: string;
  randomSatoshis?: boolean | number | undefined;
  hideToasts?: boolean;
  disabled?: boolean;
  goalAmount?: number | string;
  disableEnforceFocus?: boolean;
  editable?: boolean;
  onSuccess?: (transaction: Transaction) => void;
  onTransaction?: (transaction: Transaction) => void;
  onOpen?: (
    amount?: number | string,
    to?: string,
    paymentId?: string,
  ) => void;
  onClose?: (success?: boolean, paymentId?:string) => void;
  wsBaseUrl?: string;
  apiBaseUrl?: string;
  disableSound?: boolean
  autoClose?: boolean;
  disableAltpayment?:boolean;
  contributionOffset?:number;
  transactionText?: string;
}

export const PayButton = (props: PayButtonProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amount, setAmount] = useState(props.amount);
  const [txsSocket, setTxsSocket] = useState<Socket | undefined>(undefined);
  const [altpaymentSocket, setAltpaymentSocket] = useState<Socket | undefined>(undefined);
  const [useAltpayment, setUseAltpayment] = useState(false);
  const [coins, setCoins] = useState<AltpaymentCoin[]>([]);
  const [loadingPair, setLoadingPair] = useState<boolean>(false);
  const [coinPair, setCoinPair] = useState<AltpaymentPair | undefined>();
  const [loadingShift, setLoadingShift] = useState(false);
  const [altpaymentShift, setAltpaymentShift] = useState<AltpaymentShift | undefined>();
  const [altpaymentError, setAltpaymentError] = useState<AltpaymentError | undefined>(undefined);

  const [currencyObj, setCurrencyObj] = useState<CurrencyObject | undefined>();
  const [cryptoAmount, setCryptoAmount] = useState<string>();
  const [price, setPrice] = useState(0);
  const [newTxs, setNewTxs] = useState<Transaction[] | undefined>();
  const priceRef = useRef<number>(price);
  const cryptoAmountRef = useRef<string | undefined>(cryptoAmount);

  const {
    to,
    opReturn,
    disablePaymentId,
    currency = '' as Currency,
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
    disableAltpayment,
    contributionOffset,
    autoClose,
    disableSound,
    transactionText,
  } = Object.assign({}, PayButton.defaultProps, props);

  const [paymentId] = useState(!disablePaymentId ? generatePaymentId(8) : undefined);
  const [addressType, setAddressType] = useState<CryptoCurrency>(
    getCurrencyTypeFromAddress(to),
  );

  useEffect(() => {
    priceRef.current = price;
  }, [price]);

  useEffect(() => {
    cryptoAmountRef.current = cryptoAmount;
  }, [cryptoAmount]);

  const waitPrice = (callback: Function) => {
    const intervalId = setInterval(() => {
      if (priceRef.current !== 0) {
        clearInterval(intervalId);
        callback();
      }
    }, 300);
  };
  const handleButtonClick = useCallback(async (): Promise<void> => {
    if (onOpen !== undefined) {
      if (isFiat(currency)) {
        void waitPrice(() => { onOpen(cryptoAmountRef.current, to, paymentId) })
      } else {
        onOpen(amount, to, paymentId)
      }
    }
    setDialogOpen(true);
  }, [cryptoAmount, to, paymentId, price])

  const handleCloseDialog = (success?: boolean, paymentId?: string): void => {
    if (onClose !== undefined) onClose(success, paymentId);
    setDialogOpen(false);
  };

  useEffect(() => {
    setAmount(props.amount);
  }, [props.amount]);

  useEffect(() => {
    const invalidAmount = props.amount !== undefined && isNaN(+props.amount);

    if (to !== undefined) {
      setDisabled(isPropsTrue(props.disabled));
      setErrorMsg('');
    } else if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
  }, [to, props.amount, props.disabled]);

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

  useEffect(() => {
    if (dialogOpen === false) {
      return
    }
    (async () => {
    if (txsSocket === undefined) {
      const expectedAmount = currencyObj ? currencyObj?.float : undefined
      await setupTxsSocket({
        address: to,
        txsSocket,
        apiBaseUrl,
        wsBaseUrl,
        setTxsSocket,
        setNewTxs,
        setDialogOpen,
        checkSuccessInfo: {
          currency,
          price,
          randomSatoshis: randomSatoshis ?? false,
          disablePaymentId,
          expectedAmount,
          expectedOpReturn: opReturn,
          expectedPaymentId: paymentId,
          currencyObj,
        }
      })
    }
    if (altpaymentSocket === undefined && useAltpayment) {
      await setupAltpaymentSocket({
        addressType,
        altpaymentSocket,
        wsBaseUrl,
        setAltpaymentSocket,
        setCoins,
        setCoinPair,
        setLoadingPair,
        setAltpaymentShift,
        setLoadingShift,
        setAltpaymentError,
      })
    }
    })()

    return () => {
      if (txsSocket !== undefined) {
        txsSocket.disconnect();
        setTxsSocket(undefined);
      }
      if (altpaymentSocket !== undefined) {
        altpaymentSocket.disconnect();
        setAltpaymentSocket(undefined);
      }
    }
  }, [dialogOpen, useAltpayment]);

  useEffect(() => {
    if (dialogOpen === false && props.amount && currency) {
      const obj = getCurrencyObject(
        Number(props.amount),
        currency,
        randomSatoshis,
      );
      setTimeout(() => {
        setAmount(obj.float);
        setCurrencyObj(obj);
      }, 300);
    }
  }, [dialogOpen, props.amount, currency, randomSatoshis]);

  const getPrice = useCallback(
    async () => {
      const price = await getFiatPrice(currency, to, apiBaseUrl)
      if (price !== null) setPrice(price)
    }
    , [currency, to, apiBaseUrl]
  );

  useEffect(() => {
    (async () => {
    if (isFiat(currency) && price === 0) {
      await getPrice();
    }
    })()
  }, [currency, getPrice, to, price]);

  useEffect(() => {
    if (currencyObj && isFiat(currency) && price) {
      const addressType: Currency = getCurrencyTypeFromAddress(to);
      const convertedObj = getCurrencyObject(
        currencyObj.float / price,
        addressType,
        randomSatoshis,
      );
      setCryptoAmount(convertedObj.string);
    } else if (!isFiat(currency)) {
      setCryptoAmount(amount?.toString());
    }
  }, [price, currencyObj, amount, currency, randomSatoshis, to]);

  const theme = useTheme(props.theme, isValidXecAddress(to ?? ''));

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
        to={to ?? ''}
        amount={amount}
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
        onTransaction={onTransaction}
        onSuccess={onSuccess}
        successText={successText}
        disabled={disabled}
        editable={editable}
        goalAmount={goalAmount}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onClose={handleCloseDialog}
        wsBaseUrl={wsBaseUrl}
        apiBaseUrl={apiBaseUrl}
        hoverText={hoverText}
        disableAltpayment={disableAltpayment}
        contributionOffset={contributionOffset}
        autoClose={autoClose}
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

const payButtonDefaultProps: PayButtonProps = {
  to: '',
  animation: 'slide',
  hideToasts: false,
  randomSatoshis: false,
  successText: 'Thank you!',
  disableEnforceFocus: false,
  disabled: false,
  editable: false,
  autoClose: true,
};

PayButton.defaultProps = payButtonDefaultProps;

export default PayButton;
