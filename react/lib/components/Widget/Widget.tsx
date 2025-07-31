import {
  Box,
  CircularProgress,
  Fade,
  Typography,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import QRCode, { BaseQRCodeProps } from 'qrcode.react';
import { Socket } from 'socket.io-client';
import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import { Button, animation } from '../Button/Button';
import BarChart from '../BarChart/BarChart';
import {
  Currency,
  getAddressBalance,
  isFiat,
  Transaction,
  openCashtabPayment,
  initializeCashtabStatus,
  DECIMALS,
  CurrencyObject,
  getCurrencyObject,
  formatPrice,
  encodeOpReturnProps,
  isValidCashAddress,
  isValidXecAddress,
  getCurrencyTypeFromAddress,
  CURRENCY_PREFIXES_MAP,
  CRYPTO_CURRENCIES,
  isPropsTrue,
  setupChronikWebSocket,
  setupAltpaymentSocket,
  CryptoCurrency,
} from '../../util';
import AltpaymentWidget from './AltpaymentWidget';
import { AltpaymentPair, AltpaymentShift, AltpaymentError, AltpaymentCoin, MINIMUM_ALTPAYMENT_DOLLAR_AMOUNT, MINIMUM_ALTPAYMENT_CAD_AMOUNT } from '../../altpayment';

type QRCodeProps = BaseQRCodeProps & { renderAs: 'svg' };

export interface WidgetProps {
  to: string;
  isChild?: boolean;
  amount?: number | null | string;
  setAmount?: Function;
  opReturn?: string;
  paymentId?: string;
  disablePaymentId?: boolean;
  text?: string;
  ButtonComponent?: React.ComponentType;
  success: boolean;
  successText?: string;
  theme?: ThemeName | Theme;
  foot?: React.ReactNode;
  disabled: boolean;
  goalAmount?: number | string | null;
  currency?: Currency;
  animation?: animation;
  currencyObject?: CurrencyObject | undefined;
  setCurrencyObject?: Function;
  randomSatoshis?: boolean | number;
  price?: number | undefined;
  usdPrice?: number | undefined;
  editable?: boolean;
  setNewTxs: Function;
  newTxs?: Transaction[];
  wsBaseUrl?: string;
  apiBaseUrl?: string;
  loading?: boolean;
  hoverText?: string;
  disableAltpayment?: boolean;
  contributionOffset?: number;
  setAltpaymentShift?: Function;
  altpaymentShift?: AltpaymentShift | undefined,
  useAltpayment?: boolean
  setUseAltpayment?: Function;
  txsSocket?: Socket;
  setTxsSocket?: Function;
  altpaymentSocket?: Socket;
  setAltpaymentSocket?: Function;
  shiftCompleted?: boolean
  setShiftCompleted?: Function;
  setCoins?: Function;
  coins?: AltpaymentCoin[];
  setCoinPair?: Function;
  coinPair?: AltpaymentPair;
  setLoadingPair?: Function;
  loadingPair?: boolean;
  setLoadingShift?: Function;
  loadingShift?: boolean;
  setAltpaymentError?: Function;
  altpaymentError?: AltpaymentError;
  addressType?: Currency,
  setAddressType?: Function,
  newTxText?: string;
  transactionText?: string;
}

interface StyleProps {
  success: boolean;
  loading: boolean;
  theme: Theme;
  recentlyCopied: boolean
  copied: boolean
}

const useStyles = makeStyles({
  root: {
    minWidth: '240px !important',
    background: '#f5f5f7 !important',
    position: 'relative',
  },
  qrCode: ({ success, loading, theme }: StyleProps) => ({
    background: '#fff !important',
    border: '1px solid #eee !important',
    borderRadius: '4px !important',
    outline: 'none !important',
    lineHeight: '0 !important',
    maxWidth: '28vh !important',
    maxHeight: '28vh !important',
    position: 'relative',
    padding: '1rem !important',
    cursor: 'pointer !important',
    userSelect: 'none',
    '&:active': {
      borderWidth: '2px !important',
      margin: '-1px !important',
    },
    '& path': {
      opacity: loading ? 0 : success ? 0.35 : 1,
      color: theme.palette.secondary,
    },
    '& image': {
      opacity: loading ? 0 : 1,
    },
  }),
  copyTextContainer: ({ loading }: StyleProps) => ({
    display: loading ? 'none' : 'block',
    background: '#ffffffcc !important',
    padding: '0 0.15rem 0.15rem 0 !important',
  }),
  copyText: ({ theme }: StyleProps) => ({
    lineHeight: '1.2em !important',
    fontSize: '0.7em !important',
    color: `${theme.palette.tertiary} !important`,
    textShadow:
      '#fff -2px 0 1px, #fff 0 -2px 1px, #fff 0 2px 1px, #fff 2px 0 1px !important',
    '&:disabled span': {
      filter: 'blur(2px)',
      color: 'rgba(0, 0, 0, 0.5)',
    },
  }),
  text: ({ theme }: StyleProps) => ({
    fontSize: '0.9rem !important',
    color: `${theme.palette.tertiary} !important`,
  }),
  spinner: ({ theme }: StyleProps) => ({
    color: `${theme.palette.primary} !important`,
  }),
  footer: () => ({
    fontSize: '0.6rem !important',
    color: '#a8a8a8 !important',
    fontWeight: 'normal',
    userSelect: 'none',
  }),
  sideShiftLink: ({ theme }: StyleProps) => ({
    fontSize: '14px',
    cursor: 'pointer',
    padding: '6px 12px',
    marginTop: '20px',
    background: '#e9e9e9',
    borderRadius: '5px',
    transition: 'all ease-in-out 200ms',
    opacity: 0,
    '&:hover': {
      background: `${theme.palette.primary}`,
      color: `${theme.palette.secondary}`,
    },
  }),
  animate_sideshift: ({ success }: StyleProps) => ({
    animation: success
      ? 'button-slide-out 0.4s ease-in-out forwards'
      : 'button-slide 0.6s ease-in-out forwards',
    animationDelay: success ? '0' : '0.5s',
  }),
  hide_sideshift: {
    display: 'none',
  },
  editAmount: {
    width: '100%',
    margin: '12px auto 10px',
    display: 'flex',
    alignItems: 'flex-end',
    '& > div': {
      width: '100%',
    },
    '& span': {
      marginLeft: '4px',
      fontSize: '16px',
    },
  },
  error: () => ({
    fontSize: '0.9rem !important',
    color: '#EB3B3B !important',
  }),
  '@global': {
    '@keyframes reveal-qr': {
      from: { clipPath: 'circle(0% at 50% 50%)', transform: 'rotate(-10deg)' },
      to: { clipPath: 'circle(100% at 50% 50%)', transform: 'rotate(0deg)' },
    },
    '@keyframes fade-scale': {
      from: {
        opacity: 0,
        transform: 'scale(0.3)',
      },
      '80%': {
        opacity: 1,
        transform: 'scale(1.3)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    '@keyframes button-slide': {
      from: {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0px)',
      },
    },
    '@keyframes button-slide-out': {
      from: {
        opacity: 1,
        transform: 'translateY(0px)',
      },
      to: {
        opacity: 0,
        transform: 'translateY(20px)',
      },
    },
    '@keyframes copy-qr': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)' },
    },
    '@keyframes copy-svg': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    '@keyframes copy-icon': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(0.7)' },
      '100%': { transform: 'scale(1)' },
    },
    '@keyframes success-qr': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(0.7)' },
      '100%': { transform: 'scale(1)' },
    },
    '@keyframes success-icon': {
      '0%': { transform: 'rotate(0deg)' },
      '20%': { transform: 'rotate(-10deg)' },
      '60%': { transform: 'rotate(370deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
  qrAnimations: ({ success, loading, recentlyCopied, copied }: StyleProps) => ({
    animation: success
      ? 'success-qr 0.4s ease-in-out forwards'
      : recentlyCopied
      ? 'copy-qr 0.3s ease-in-out forwards'
      : !loading && !copied
      ? 'reveal-qr 0.8s ease-in-out forwards'
      : 'none',
    '& svg': {
      animation: recentlyCopied ? 'copy-svg 0.3s ease-in-out forwards' : 'none',
    },
    '& image': {
      animation: success
        ? 'success-icon 1s ease-in-out forwards'
        : recentlyCopied
        ? 'copy-icon 0.3s ease-in-out forwards'
        : !loading && !copied
        ? 'fade-scale 0.6s ease-in-out forwards'
        : 'none',
      transformOrigin: 'center center',
    },
  }),
  button_container: {
    opacity: 0,
    animation: 'button-slide 0.6s ease-in-out forwards',
    animationDelay: '0.4s',
  },
});

export const Widget: React.FunctionComponent<WidgetProps> = props => {
  const {
    to,
    foot,
    success,
    paymentId,
    successText,
    disablePaymentId,
    goalAmount,
    ButtonComponent = Button,
    currency = getCurrencyTypeFromAddress(to),
    animation,
    randomSatoshis = false,
    editable,
    newTxs,
    setNewTxs,
    apiBaseUrl,
    usdPrice,
    wsBaseUrl,
    hoverText = Button.defaultProps.hoverText,
    setAltpaymentShift,
    altpaymentShift,
    shiftCompleted,
    setShiftCompleted,
    disableAltpayment,
    contributionOffset,
    useAltpayment,
    setUseAltpayment,
    setTxsSocket,
    txsSocket,
    setAltpaymentSocket,
    altpaymentSocket,
    addressType,
    setAddressType,
    coins,
    setCoins,
    coinPair,
    setCoinPair,
    loadingPair,
    setLoadingPair,
    loadingShift,
    setLoadingShift,
    altpaymentError,
    setAltpaymentError,
    isChild,
  } = Object.assign({}, Widget.defaultProps, props);

  const [loading, setLoading] = useState(true);

  // Define controlled websocket constants if standalone widget

  const [internalTxsSocket, setInternalTxsSocket] = useState<Socket | undefined>(undefined);
  const thisTxsSocket = txsSocket ?? internalTxsSocket
  const setThisTxsSocket = setTxsSocket ?? setInternalTxsSocket

  const [internalNewTxs, setInternalNewTxs] = useState<Transaction[] | undefined>();
  const thisNewTxs = newTxs ?? internalNewTxs
  const setThisNewTxs = setNewTxs ?? setInternalNewTxs

  const [internalAltpaymentShift, setInternalAltpaymentShift] = useState<AltpaymentShift | undefined>(undefined);
  const thisAltpaymentShift = altpaymentShift ?? internalAltpaymentShift;
  const setThisAltpaymentShift = setAltpaymentShift ?? setInternalAltpaymentShift;

  const [internalUseAltpayment, setInternalUseAltpayment] = useState<boolean>(false);
  const thisUseAltpayment = useAltpayment ?? internalUseAltpayment;
  const setThisUseAltpayment = setUseAltpayment ?? setInternalUseAltpayment;

  const [internalAltpaymentSocket, setInternalAltpaymentSocket] = useState<Socket | undefined>(undefined);
  const thisAltpaymentSocket = altpaymentSocket ?? internalAltpaymentSocket;
  const setThisAltpaymentSocket = setAltpaymentSocket ?? setInternalAltpaymentSocket;

  const [internalShiftCompleted, setInternalShiftCompleted] = useState<boolean>(false);
  const thisShiftCompleted = shiftCompleted ?? internalShiftCompleted;
  const setThisShiftCompleted = setShiftCompleted ?? setInternalShiftCompleted;

  const [internalCoins, setInternalCoins] = useState<AltpaymentCoin[]>([]);
  const thisCoins = coins ?? internalCoins;
  const setThisCoins = setCoins ?? setInternalCoins;

  const [internalCoinPair, setInternalCoinPair] = useState<AltpaymentPair | undefined>();
  const thisCoinPair = coinPair ?? internalCoinPair;
  const setThisCoinPair = setCoinPair ?? setInternalCoinPair;

  const [internalLoadingPair, setInternalLoadingPair] = useState<boolean>(false);
  const thisLoadingPair = loadingPair ?? internalLoadingPair;
  const setThisLoadingPair = setLoadingPair ?? setInternalLoadingPair;

  const [internalLoadingShift, setInternalLoadingShift] = useState<boolean>(false);
  const thisLoadingShift = loadingShift ?? internalLoadingShift;
  const setThisLoadingShift = setLoadingShift ?? setInternalLoadingShift;

  const [internalAltpaymentError, setInternalAltpaymentError] = useState<AltpaymentError | undefined>();
  const thisAltpaymentError = altpaymentError ?? internalAltpaymentError;
  const setThisAltpaymentError = setAltpaymentError ?? setInternalAltpaymentError;

  const [internalAddressType, setInternalAddressType] = useState<CryptoCurrency>(getCurrencyTypeFromAddress(to));
  const thisAddressType = addressType ?? internalAddressType;
  const setThisAddressType = setAddressType ?? setInternalAddressType;

  const [copied, setCopied] = useState(false);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [totalReceived, setTotalReceived] = useState<number | undefined>(
    undefined,
  );
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [goalText, setGoalText] = useState('');
  const [goalPercent, setGoalPercent] = useState(0);
  const [altpaymentEditable, setAltpaymentEditable] = useState<boolean>(false);

  const price = props.price ?? 0;
  const [url, setUrl] = useState('');
  const [userEditedAmount, setUserEditedAmount] = useState<CurrencyObject>();
  const [text, setText] = useState(`Send any amount of ${thisAddressType}`);
  const [widgetButtonText, setWidgetButtonText] = useState('Send Payment');
  const [opReturn, setOpReturn] = useState<string | undefined>();
  const [isCashtabAvailable, setIsCashtabAvailable] = useState<boolean>(false);

  const [isAboveMinimumAltpaymentAmount, setIsAboveMinimumAltpaymentAmount] = useState<boolean | null>(null);

  const theme = useTheme(props.theme, isValidXecAddress(to));
  const classes = useStyles({ success, loading, theme, recentlyCopied, copied });

  const [thisAmount, setThisAmount] = useState(props.amount);
  const [hasPrice, setHasPrice] = useState(props.price !== undefined && props.price > 0);
  const [thisCurrencyObject, setThisCurrencyObject] = useState(
    props.currencyObject,
  );

  const blurCSS = isPropsTrue(disabled) ? { filter: 'blur(5px)' } : {};

  const bchSvg = useMemo((): string => {
    const color = theme.palette.logo ?? theme.palette.primary;
    return `data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(1,1)'%3E%3Ccircle cx='16' cy='16' r='17' fill='%23fff' stroke-width='1.0625'/%3E%3C/g%3E%3Cg transform='translate(1,1)' fill-rule='evenodd'%3E%3Ccircle cx='16' cy='16' r='16' fill='${window.encodeURIComponent(
      color,
    )}'/%3E%3Cpath d='m21.207 10.534c-0.776-1.972-2.722-2.15-4.988-1.71l-0.807-2.813-1.712 0.491 0.786 2.74c-0.45 0.128-0.908 0.27-1.363 0.41l-0.79-2.758-1.711 0.49 0.805 2.813c-0.368 0.114-0.73 0.226-1.085 0.328l-3e-3 -0.01-2.362 0.677 0.525 1.83s1.258-0.388 1.243-0.358c0.694-0.199 1.035 0.139 1.2 0.468l0.92 3.204c0.047-0.013 0.11-0.029 0.184-0.04l-0.181 0.052 1.287 4.49c0.032 0.227 4e-3 0.612-0.48 0.752 0.027 0.013-1.246 0.356-1.246 0.356l0.247 2.143 2.228-0.64c0.415-0.117 0.825-0.227 1.226-0.34l0.817 2.845 1.71-0.49-0.807-2.815a65.74 65.74 0 0 0 1.372-0.38l0.802 2.803 1.713-0.491-0.814-2.84c2.831-0.991 4.638-2.294 4.113-5.07-0.422-2.234-1.724-2.912-3.471-2.836 0.848-0.79 1.213-1.858 0.642-3.3zm-0.65 6.77c0.61 2.127-3.1 2.929-4.26 3.263l-1.081-3.77c1.16-0.333 4.704-1.71 5.34 0.508zm-2.322-5.09c0.554 1.935-2.547 2.58-3.514 2.857l-0.98-3.419c0.966-0.277 3.915-1.455 4.494 0.563z' fill='%23fff' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E%0A`;
  }, [theme]);

  const xecSvg =
    "data:image/svg+xml;charset=UTF-8,%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='576px' height='576px' viewBox='0 0 576 576' enable-background='new 0 0 576 576' xml:space='preserve'%3e%3cg transform='translate(1,1)'%3e%3ccircle fill='%23FFFFFF' cx='287' cy='287' r='288'/%3e%3c/g%3e%3cpath fill='%23FFFFFF' d='M325.089,228.325l-67.15,38.668c-1.734,0.995-2.794,2.85-2.773,4.849v32.443 c-0.019,1.954,1.05,3.757,2.773,4.681l28.122,16.22c1.635,1.039,3.723,1.039,5.359,0l116.046-66.833 c19.694-11.393,19.694-44.216,0-55.609l-104.294-60.057c-8.867-5.357-19.975-5.357-28.842,0l-104.294,60.078 c-9.056,5.074-14.637,14.671-14.569,25.052c0,40.235,0.17,80.28,0,120.325c-0.085,10.362,5.461,19.954,14.485,25.052l104.294,60.247 c8.914,5.188,19.928,5.188,28.843,0l104.378-60.247c9.017-5.085,14.521-14.702,14.337-25.052v-52.306l-124.136,71.83 c-5.537,3.283-12.423,3.283-17.959,0l-55.439-32.124c-5.612-3.147-9.056-9.11-8.979-15.545V255.96 c-0.028-6.327,3.322-12.188,8.788-15.374c18.487-10.716,37.122-21.409,55.609-32.125c5.542-3.262,12.416-3.262,17.958,0 l27.53,15.713c1.13,0.727,1.459,2.233,0.732,3.365C325.7,227.862,325.42,228.131,325.089,228.325z'/%3e%3cpath fill='%230074C2' d='M288.878,16.941C139.176,16.941,17.819,138.298,17.819,288c0,149.701,121.357,271.059,271.059,271.059 c149.701,0,271.059-121.357,271.059-271.059C559.937,138.298,438.579,16.941,288.878,16.941z M325.089,224.174l-27.529-15.713 c-5.541-3.262-12.415-3.262-17.957,0c-18.487,10.715-37.122,21.409-55.609,32.125c-5.466,3.186-8.816,9.047-8.788,15.374v64.037 c-0.078,6.435,3.366,12.397,8.979,15.545l55.418,32.124c5.536,3.283,12.422,3.283,17.957,0l124.138-71.83v52.306 c0.204,10.327-5.257,19.938-14.231,25.052L303.193,433.44c-8.915,5.188-19.928,5.188-28.843,0l-104.315-60.247 c-9.056-5.075-14.637-14.671-14.569-25.052c0.17-40.045,0-80.111,0-120.325c-0.085-10.363,5.461-19.956,14.485-25.052 l104.294-60.078c8.868-5.357,19.975-5.357,28.843,0l104.378,60.078c19.694,11.393,19.694,44.217,0,55.609L291.42,325.186 c-1.636,1.039-3.724,1.039-5.359,0l-28.122-16.22c-1.724-0.924-2.792-2.727-2.773-4.681v-32.443 c-0.021-1.999,1.04-3.854,2.773-4.849l67.15-38.668c1.146-0.705,1.506-2.204,0.802-3.35 C325.689,224.649,325.416,224.375,325.089,224.174z'/%3e%3c/svg%3e";

  const checkSvg = useMemo((): string => {
    const color = theme.palette.logo ?? theme.palette.primary;
    return `data:image/svg+xml,%3Csvg version='1.1' viewBox='1.65 1.65 20.65 20.65' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='${window.encodeURIComponent(
      color,
    )}' stroke='%23fff' stroke-width='.6'/%3E%3Cpath d='m7.2979 14.697-2.6964-2.6966 0.89292-0.8934c0.49111-0.49137 0.90364-0.88958 0.91675-0.88491 0.013104 0.0047 0.71923 0.69866 1.5692 1.5422 0.84994 0.84354 1.6548 1.6397 1.7886 1.7692l0.24322 0.23547 7.5834-7.5832 1.8033 1.8033-9.4045 9.4045z' fill='%23fff' stroke-width='.033708'/%3E%3C/svg%3E%0A`;
  }, [theme]);

  useEffect((): (() => void) | undefined => {
    if (!recentlyCopied) return;

    const timer = setTimeout((): void => {
      setRecentlyCopied(false);
    }, 1000);

    return (): void => clearTimeout(timer);
  }, [recentlyCopied]);

  useEffect(() => {
    setHasPrice(price !== undefined && price > 0)
  }, [price])

  useEffect(() => {
    const initCashtab = async () => {
      try {
        const isAvailable = await initializeCashtabStatus();
        setIsCashtabAvailable(isAvailable);
      } catch (error) {
        setIsCashtabAvailable(false);
      }
    };
    
    initCashtab();
  }, []);

  useEffect(() => {
    (async () => {
      if (isChild !== true) {
        await setupChronikWebSocket({
          address: to,
          txsSocket: thisTxsSocket,
          apiBaseUrl,
          wsBaseUrl,
          setTxsSocket: setThisTxsSocket,
          setNewTxs: setThisNewTxs,
        })
        if (thisUseAltpayment) {
          await setupAltpaymentSocket({
            addressType: thisAddressType,
            wsBaseUrl,
            altpaymentSocket: thisAltpaymentSocket,
            setAltpaymentSocket: setThisAltpaymentSocket,
            setCoins: setThisCoins,
            setCoinPair: setThisCoinPair,
            setLoadingPair: setThisLoadingPair,
            setAltpaymentShift: setThisAltpaymentShift,
            setLoadingShift: setThisLoadingShift,
            setAltpaymentError: setThisAltpaymentError,
          })
        }
      }
    })()

    return () => {
      if (thisAltpaymentSocket !== undefined) {
        thisAltpaymentSocket.disconnect();
        setThisAltpaymentSocket(undefined);
      }
    }
  }, [to, thisUseAltpayment]);

  const tradeWithAltpayment = () => {
    if (setThisUseAltpayment) {
      setThisUseAltpayment(true)
    }
  }

  useEffect(() => {
    if (thisAmount === undefined || thisAmount === null || thisAmount === 0) {
      setAltpaymentEditable(true)
    }
    if (isPropsTrue(editable)) {
      setAltpaymentEditable(true)
    }
  }, [])

  useEffect(() => {
    (async (): Promise<void> => {
      if(thisNewTxs === undefined || thisNewTxs.length === 0) {
        const balance = await getAddressBalance(to, apiBaseUrl);
        setTotalReceived(balance);
        setLoading(false);
      }
    })();
  }, [thisNewTxs]);

  useEffect(() => {
    const invalidAmount =
      thisAmount !== undefined && thisAmount && isNaN(+thisAmount);

    if (isValidCashAddress(to) || isValidXecAddress(to)) {
      setDisabled(isPropsTrue(props.disabled));
      setErrorMsg('');
    } else if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else {
      setDisabled(true);
      setErrorMsg('Invalid Recipient');
    }
    if (usdPrice && thisAmount) {
      const usdAmount = usdPrice * +thisAmount
      setIsAboveMinimumAltpaymentAmount(usdAmount >= MINIMUM_ALTPAYMENT_DOLLAR_AMOUNT)
    } else if (currency === 'USD'){
      if (thisAmount && +thisAmount >= MINIMUM_ALTPAYMENT_DOLLAR_AMOUNT){
        setIsAboveMinimumAltpaymentAmount(true)
      }

    } else if (currency === 'CAD'){
      if (thisAmount && +thisAmount >= MINIMUM_ALTPAYMENT_CAD_AMOUNT){
        setIsAboveMinimumAltpaymentAmount(true)
      }

    }
  }, [to, thisAmount, usdPrice]);

  useEffect(() => {
    const invalidAmount =
      thisAmount !== undefined && thisAmount && isNaN(+thisAmount);
    const isNegativeNumber =
      typeof thisAmount === 'string' && thisAmount.startsWith('-');
    let cleanAmount: any;

    if (invalidAmount) {
      setDisabled(true);
      setErrorMsg('Amount should be a number');
    } else if (isNegativeNumber) {
      setDisabled(true);
      setErrorMsg('Amount should be positive');
    } else {
      if (isValidCashAddress(to) || isValidXecAddress(to)) {
        setErrorMsg('');
      } else {
        setErrorMsg('Invalid Recipient');
      }
    }

    if (userEditedAmount !== undefined && thisAmount && thisAddressType) {
      const obj = getCurrencyObject(+thisAmount, currency, false);
      setThisCurrencyObject(obj);
      if (props.setCurrencyObject) {
        props.setCurrencyObject(obj);
      }
    } else if (thisAmount && thisAddressType) {
      cleanAmount = +thisAmount;
      const obj = getCurrencyObject(cleanAmount, currency, randomSatoshis);
      setThisCurrencyObject(obj);
      if (props.setCurrencyObject) {
        props.setCurrencyObject(obj);
      }
    }
  }, [thisAmount, currency, userEditedAmount]);

  useEffect(() => {
    if (to === undefined) {
      return;
    }
    let url;

    setThisAddressType(thisAddressType);
    
    if (thisAddressType === 'XEC' && isCashtabAvailable) {
      setWidgetButtonText('Send with Cashtab');
    } else {
      setWidgetButtonText(`Send with ${thisAddressType} wallet`);
    }

    if (thisCurrencyObject && hasPrice) {
      const convertedAmount = thisCurrencyObject.float / price
      const convertedObj = price
        ? getCurrencyObject(
          convertedAmount,
          thisAddressType,
          randomSatoshis,
        )
        : null;
      if (convertedObj) {
        setText(
          `Send ${thisCurrencyObject.string} ${thisCurrencyObject.currency} = ${convertedObj.string} ${thisAddressType}`,
        );
        url = resolveUrl(thisAddressType, convertedObj.float);
        setUrl(url ?? "");
      }
    } else {
      const notZeroValue: boolean =
        thisCurrencyObject?.float !== undefined && thisCurrencyObject.float > 0;
      if (!isFiat(currency) && thisCurrencyObject && notZeroValue) {
        const currency: string = thisCurrencyObject.currency;
        setText(`Send ${thisCurrencyObject.string} ${currency}`);
        url = resolveUrl(currency, thisCurrencyObject?.float);
      } else {
        setText(`Send any amount of ${thisAddressType}`);
        url = resolveUrl(thisAddressType);
      }
      setUrl(url ?? "");
    }
  }, [to, thisCurrencyObject, price, thisAmount, opReturn, hasPrice, isCashtabAvailable]);

  useEffect(() => {
    try {
      setOpReturn(
        encodeOpReturnProps({
          opReturn: props.opReturn,
          paymentId,
          disablePaymentId: disablePaymentId ?? false,
        }),
      );
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message);
      setDisabled(true)
    }
  }, [props.opReturn, paymentId, disablePaymentId]);

  useEffect(() => {
    setThisAmount(props.amount);
  }, [props.amount]);

  useEffect(() => {
    if (totalReceived !== undefined) {
      const progress = getCurrencyObject(totalReceived, currency, false);

      const goal = getCurrencyObject(cleanGoalAmount, currency, false);
      if (!isFiat(currency)) {
        if (goal !== undefined) {
          let progressFloat = progress.float;
          if(contributionOffset !== undefined){
            progressFloat = Number(progressFloat) + Number(contributionOffset)
          };
          setGoalPercent((100 * progressFloat) / goal.float);
          setGoalText(`${progressFloat} / ${cleanGoalAmount}`);
          setLoading(false);
        }
      } else {
        if (hasPrice) {
          const receivedVal: number = totalReceived * price;
          const receivedText: string = formatPrice(
            receivedVal,
            currency,
            DECIMALS.FIAT,
          );
          const goalText: string = formatPrice(
            cleanGoalAmount,
            currency,
            DECIMALS.FIAT,
          );
          const receivedRatio = `${receivedText} / ${goalText}`;
          const receivedPercentage: number =
            100 * (receivedVal / cleanGoalAmount);
          setLoading(false);
          setGoalPercent(receivedPercentage);
          setGoalText(receivedRatio);
        }
      }
      if (shouldDisplayGoal && goal.float !== undefined && goal.float <= 0) {
        setDisabled(true);
        setErrorMsg('Goal Value must be a number');
      }
    }
  }, [totalReceived, currency, goalAmount, price, hasPrice, contributionOffset]);

  const handleButtonClick = async () => {
    if (thisAddressType === 'XEC') {
      await openCashtabPayment(url);
    } else {
      window.location.href = url;
    }
  };

  const handleQrCodeClick = useCallback((): void => {
    if (disabled || to === undefined) return;
    if (!url || !copy(url)) return;
    setCopied(true);
    setRecentlyCopied(true);
  }, [disabled, to, url, copy, setCopied, setRecentlyCopied]);

  const resolveUrl = useCallback((currency: string, amount?: number) => {
    if (disabled || !to) return;

    const prefix = CURRENCY_PREFIXES_MAP[currency.toLowerCase() as typeof CRYPTO_CURRENCIES[number]];
    if (!prefix) return;

    let thisUrl = `${prefix}:${to.replace(/^.*:/, '')}`;

    if (amount) {
      thisUrl += `?amount=${amount}`;
    }

    if (opReturn) {
      const separator = thisUrl.includes('?') ? '&' : '?';
      thisUrl += `${separator}op_return_raw=${opReturn}`;
    }

    return thisUrl;
  }, [disabled, to, currency, opReturn]);

  const qrCodeProps: QRCodeProps = {
    renderAs: 'svg',
    size: 300,
    level: 'H', // High error correction allows for a larger logo
    value: url,
    fgColor: theme.palette.tertiary,
    imageSettings: {
      src: success ? checkSvg : isValidCashAddress(to) ? bchSvg : xecSvg,
      excavate: false,
      height: 112,
      width: 112,
    },
  };

  const qrCode = (
    <div className={classes.qrAnimations}>
      <QRCode
        {...qrCodeProps}
        style={{ flex: 1, width: '100%', height: 'auto', ...blurCSS }}
      />
    </div>
  );

  let cleanGoalAmount: any;
  if (goalAmount) {
    cleanGoalAmount = +goalAmount;
  }

  const shouldDisplayGoal: boolean = goalAmount !== undefined;
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = e.target.value;
    if (amount === '') {
      amount = '0';
    }

    const userEdited = getCurrencyObject(+amount, currency, false);

    setUserEditedAmount(userEdited);
    updateAmount(amount)
  };

  const updateAmount = (amount: string) => {
    setThisAmount(amount);
    if (props.setAmount) {
      props.setAmount(amount);
    }
  }

  return (
    <ThemeProvider value={theme}>
      <Box
        className={classes.root}
        pt={0}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          flex="shrink"
          alignSelf="stretch"
          style={{ background: '#fff' }}
          py={1}
          textAlign="center"
        >
          <Typography className={errorMsg ? classes.error : classes.text}>
            {(() => {
              if (errorMsg) return errorMsg;
              if (disabled) return 'Not yet ready for payment';
              if (loading) return 'Loading...';
              if (success) return successText;
              return text;
            })()}
        </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={3}
          pt={2}
          position="relative"
        >
          {// Altpayment region
            thisUseAltpayment &&
              <AltpaymentWidget
                altpaymentSocket={thisAltpaymentSocket}
                thisAmount={thisAmount}
                updateAmount={updateAmount}
                setUseAltpayment={setThisUseAltpayment}
                altpaymentShift={thisAltpaymentShift}
                setAltpaymentShift={setThisAltpaymentShift}
                shiftCompleted={thisShiftCompleted}
                setShiftCompleted={setThisShiftCompleted}
                altpaymentError={thisAltpaymentError}
                setAltpaymentError={setThisAltpaymentError}
                coins={thisCoins}
                loadingPair={thisLoadingPair}
                setLoadingPair={setThisLoadingPair}
                loadingShift={thisLoadingShift}
                setLoadingShift={setThisLoadingShift}
                coinPair={thisCoinPair}
                setCoinPair={setThisCoinPair}
                altpaymentEditable={altpaymentEditable}
                animation={animation}
                addressType={thisAddressType}
                to={to}
              />
           }
            <>
              {loading && shouldDisplayGoal ? (
                <Typography
                  className={classes.text}
                  style={{ margin: '10px auto 20px' }}
                >
                  <CircularProgress
                    size={15}
                    thickness={4}
                    className={classes.spinner}
                  />
                </Typography>
              ) : (
                <>
                  {shouldDisplayGoal && (
                    <>
                      <Typography
                        className={classes.copyText}
                        style={{ marginBottom: '0.61rem', ...blurCSS}}
                      >
                        {goalText}
                        <strong>&nbsp;{currency}</strong>
                      </Typography>
                      <BarChart
                        color={theme.palette.primary}
                        value={Math.round(goalPercent)}
                        disabled={disabled}
                      />
                    </>
                  )}
                </>
              )}

              <Box
                flex={1}
                position="relative"
                className={classes.qrCode}
                onClick={handleQrCodeClick}
              >
                <Fade in={!loading && url !== ''}>
                  <React.Fragment>
                    {qrCode}
                    <Box position="absolute" bottom={0} right={0}>
                      <Fade
                        appear={false}
                        in={!copied || recentlyCopied}
                        timeout={{ enter: 0, exit: 2000 }}
                      >
                        <Box className={classes.copyTextContainer}>
                          {!isPropsTrue(disabled) && (
                            <Typography className={classes.copyText}>
                              {copied ? 'Payment copied!' : 'Click to copy'}
                            </Typography>
                          )}
                        </Box>
                      </Fade>
                    </Box>
                  </React.Fragment>
                </Fade>
                {loading && (
                  <Box
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress
                      size={70}
                      thickness={4}
                      className={classes.spinner}
                    />
                  </Box>
                )}
              </Box>

              {isPropsTrue(editable) && (
                <div className={classes.editAmount}>
                  <TextField
                    label='Edit amount'
                    value={thisCurrencyObject?.float || 0}
                    onChange={handleAmountChange}
                    inputProps={{ maxlength: '12' }}
                    name="Amount"
                    placeholder='Enter Amount'
                    id="userEditedAmount"
                    disabled={success}
                  />
                 <Typography component="span">{currency}</Typography>
                </div>
              )}

              {success || (
                <Box pt={2} flex={1} className={classes.button_container}>
                  <ButtonComponent
                    text={widgetButtonText}
                    hoverText={hoverText}
                    onClick={handleButtonClick}
                    disabled={isPropsTrue(disabled)}
                    animation={animation}
                    size={'medium'}
                  />
                </Box>
              )}
              {!isPropsTrue(disableAltpayment) && (
                <Typography
                  component="div"
                  className={`${classes.sideShiftLink} ${isAboveMinimumAltpaymentAmount || altpaymentEditable ? classes.animate_sideshift : classes.hide_sideshift}`}
                  onClick={isAboveMinimumAltpaymentAmount || altpaymentEditable ? tradeWithAltpayment : undefined}
                  style={{cursor: isAboveMinimumAltpaymentAmount || altpaymentEditable ? 'pointer' : 'default'}}
                >
                  Don't have any {thisAddressType}?
                </Typography>
              )}
            </>
          {foot && (
            <Box pt={2} flex={1}>
              {foot}
            </Box>
          )}
          <Box py={0.8}>
            <Typography className={classes.footer}>
              Powered by PayButton.org
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

Widget.defaultProps = {
  success: false,
  successText: 'Thank you!',
  editable: false,
};

export default Widget;
