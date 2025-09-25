import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import Button, { ButtonProps } from '../Button/Button';
import { Socket } from 'socket.io-client';
import config from '../../paybutton-config.json'
import {
  Transaction,
  Currency,
  isFiat,
  getFiatPrice,
  getCurrencyTypeFromAddress,
  isValidCashAddress,
  isValidXecAddress,
  CurrencyObject,
  getCurrencyObject,
  isPropsTrue,
  setupAltpaymentSocket,
  setupChronikWebSocket,
  CryptoCurrency,
  ButtonSize,
  DEFAULT_DONATION_RATE
} from '../../util';
import { createPayment } from '../../util/api-client';
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
  transactionText?: string;
  disableSound?: boolean;
  autoClose?: boolean | number | string;
  disableAltpayment?:boolean
  contributionOffset?:number
  size?: ButtonSize;
  sizeScaleAlreadyApplied?: boolean;
  donationAddress?: string;
  donationRate?: number;
}

export const PayButton = ({
  to,
  amount: initialAmount,
  opReturn,
  disablePaymentId,
  currency = '' as Currency,
  theme: themeProp,
  text,
  hoverText,
  successText = 'Thank you!',
  animation = 'slide',
  randomSatoshis = false,
  hideToasts = false,
  disabled: disabledProp = false,
  goalAmount,
  disableEnforceFocus = false,
  editable = false,
  onSuccess,
  onTransaction,
  onOpen,
  onClose,
  wsBaseUrl,
  apiBaseUrl,
  transactionText,
  disableSound,
  autoClose = false,
  disableAltpayment,
  contributionOffset,
  size = 'md',
  sizeScaleAlreadyApplied = false,
  donationRate = DEFAULT_DONATION_RATE,
  donationAddress = config.donationAddress
}: PayButtonProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amount, setAmount] = useState(initialAmount);
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



  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [addressType, setAddressType] = useState<CryptoCurrency>(
    getCurrencyTypeFromAddress(to),
  );

  useEffect(() => {
    const initializePaymentId = async () => {
      if (!disablePaymentId && to) {
        try {
          const responsePaymentId = await createPayment(amount, to, apiBaseUrl);
          setPaymentId(responsePaymentId);
        } catch (error) {
          console.error('Error creating payment ID:', error);
        }
      }
    };

    initializePaymentId();
  }, [disablePaymentId, amount, to, apiBaseUrl]);

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
    setAmount(initialAmount);
  }, [initialAmount]);

  useEffect(() => {
    const invalidAmount = initialAmount !== undefined && isNaN(+initialAmount);

    if (to !== undefined) {
      setDisabled(isPropsTrue(disabledProp));
      setErrorMsg('');
    } else if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
  }, [to, initialAmount, disabledProp]);

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
      await setupChronikWebSocket({
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
          donationRate
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
      if (altpaymentSocket !== undefined) {
        altpaymentSocket.disconnect();
        setAltpaymentSocket(undefined);
      }
    }
  }, [dialogOpen, useAltpayment]);

  useEffect(() => {
    if (dialogOpen === false && initialAmount && currency) {
      const obj = getCurrencyObject(
        Number(initialAmount),
        currency,
        randomSatoshis,
      );
      setTimeout(() => {
        setAmount(obj.float);
        setCurrencyObj(obj);
      }, 300);
    }
  }, [dialogOpen, initialAmount, currency, randomSatoshis]);

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

  const theme = useTheme(themeProp, isValidXecAddress(to ?? ''));

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
        size={size}
        sizeScaleAlreadyApplied={sizeScaleAlreadyApplied}
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
        donationAddress={donationAddress}
        donationRate={donationRate}
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

export default PayButton;
