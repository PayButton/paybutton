import {
  Box,
  CircularProgress,
  Fade,
  Link,
  Typography,
  makeStyles,
  TextField,
  Grid,
} from '@material-ui/core';
import copy from 'copy-to-clipboard';
import QRCode, { BaseQRCodeProps } from 'qrcode.react';
import React, { useEffect, useMemo, useState } from 'react';

import { Theme, ThemeName, ThemeProvider, useTheme } from '../../themes';
import { isValidCashAddress, isValidXecAddress } from '../../util/address';
import { formatPrice } from '../../util/format';
import Button from '../Button/Button';
import BarChart from '../BarChart/BarChart';

import {
  satoshisToBch,
  getCurrencyObject,
  currencyObject,
} from '../../util/satoshis';
import { useAddressDetails } from '../../hooks/useAddressDetails';
import { currency, getSatoshiBalance } from '../../util/api-client';
import { randomizeSatoshis } from '../../util/randomizeSats';
import PencilIcon from '../../assets/edit-pencil';

type QRCodeProps = BaseQRCodeProps & { renderAs: 'svg' };

export interface WidgetProps {
  to: string;
  amount?: number | null | string;
  text?: string;
  ButtonComponent?: React.ComponentType;
  loading: boolean;
  success: boolean;
  successText?: string;
  theme?: ThemeName | Theme;
  foot?: React.ReactNode;
  disabled: boolean;
  totalReceived?: number | null;
  goalAmount?: number | string | null;
  currency?: currency;
  currencyObject?: currencyObject | undefined;
  randomSatoshis?: boolean;
  price?: number;
  editable?: boolean;
}

interface StyleProps {
  success: boolean;
  loading: boolean;
  theme: Theme;
}

const useStyles = makeStyles({
  root: {
    minWidth: 240,
    background: '#f5f5f7',
  },
  qrCode: ({ success, loading, theme }: StyleProps) => ({
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 4,
    outline: 'none',
    lineHeight: 0,
    maxWidth: '28vh',
    maxHeight: '28vh',
    position: 'relative',
    padding: '1rem',
    cursor: 'pointer',
    userSelect: 'none',
    '&:active': {
      borderWidth: 2,
      margin: -1,
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
    background: '#ffffffcc',
    padding: '0 0.15rem 0.15rem 0',
  }),
  copyText: ({ theme }: StyleProps) => ({
    lineHeight: '1.2em',
    fontSize: '0.7em',
    color: theme.palette.tertiary,
    textShadow:
      '#fff -2px 0 1px, #fff 0 -2px 1px, #fff 0 2px 1px, #fff 2px 0 1px',
  }),
  text: ({ theme }: StyleProps) => ({
    fontSize: '0.9rem',
    color: theme.palette.tertiary,
  }),
  spinner: ({ theme }: StyleProps) => ({
    color: theme.palette.primary,
  }),
  footer: ({ theme }: StyleProps) => ({
    fontSize: '0.6rem',
    color: theme.palette.tertiary,
  }),
});

export const Widget: React.FC<WidgetProps> = props => {
  const {
    to,
    foot,
    loading,
    success,
    successText,
    totalReceived,
    goalAmount,
    ButtonComponent = Button,
    currency = 'BCH',
    randomSatoshis = true,
    currencyObject,
    editable,
  } = Object.assign({}, Widget.defaultProps, props);

  const theme = useTheme(props.theme, isValidXecAddress(to));
  const classes = useStyles({ success, loading, theme });

  const [copied, setCopied] = useState(false);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [totalSatsReceived, setTotalSatsReceived] = useState(0);
  const [isLoading, setIsLoading] = useState(!!goalAmount);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [goalText, setGoalText] = useState('');
  const [goalPercent, setGoalPercent] = useState(0);
  const [currencyObj, setCurrencyObj] = useState<currencyObject>(
    currencyObject!,
  );
  const price = props.price;
  const [amount, setAmount] = useState(props.amount);
  const [url, setUrl] = useState('');
  const [userEditedAmount, setUserEditedAmount] = useState<currencyObject>();
  const [text, setText] = useState('Send any amount of BCH');
  const [widgetButtonText, setWidgetButtonText] = useState('Send Payment');
  const transformAmount = useMemo(
    () => (randomSatoshis ? randomizeSatoshis : (x: number): number => x),
    [randomSatoshis],
  );

  const blurCSS = disabled ? { filter: 'blur(5px)' } : {};

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

  const query: string[] = [];
  const isMissingWidgetContainer = !totalReceived;
  const addressDetails = useAddressDetails(to, isMissingWidgetContainer);
  const isFiat: boolean =
    currency !== 'SAT' &&
    currency !== 'BCH' &&
    currency !== 'bits' &&
    currency !== 'XEC';
  const hasPrice: boolean = price !== undefined && price > 0;
  let prefixedAddress: string;

  useEffect(() => {
    if (totalReceived) {
      return setTotalSatsReceived(totalReceived);
    }

    (async (): Promise<void> => {
      if (addressDetails) {
        const { satoshis } = await getSatoshiBalance(to);
        setTotalSatsReceived(satoshis);
      }
    })();
  }, [addressDetails, totalReceived, totalSatsReceived]);

  useEffect(() => {
    const invalidAmount = amount !== undefined && amount && isNaN(+amount);

    if (isValidCashAddress(to) || isValidXecAddress(to)) {
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
    const invalidAmount = amount !== undefined && amount && isNaN(+amount);
    const isNegativeNumber =
      typeof amount === 'string' && amount.startsWith('-');
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

    if (userEditedAmount !== undefined && amount) {
      const obj = getCurrencyObject(transformAmount(+amount), currency);
      setCurrencyObj(obj);
    } else if (amount) {
      cleanAmount = +amount;
      if (currencyObj === undefined) {
        const obj = getCurrencyObject(transformAmount(cleanAmount), currency);
        setCurrencyObj(obj);
      }
    }
  }, [amount, currency, userEditedAmount]);

  useEffect(() => {
    if (to === undefined) {
      return;
    }
    const address = to;
    let url;

    if (isValidCashAddress(address)) {
      prefixedAddress = `bitcoincash:${address.replace(/^.*:/, '')}`;
    } else if (isValidXecAddress(address)) {
      prefixedAddress = `ecash:${address.replace(/^.*:/, '')}`;
    }
    url = prefixedAddress + (query.length ? `?${query.join('&')}` : '');

    if (currencyObj && hasPrice) {
      const bchAmount = getCurrencyObject(
        currencyObj.float / (price! / 100),
        'BCH',
      );

      if (isValidCashAddress(address)) {
        setText(
          `Send ${currencyObj.string} ${currencyObj.currency} = ${bchAmount.BCHstring} BCH`,
        );
        setWidgetButtonText(
          `Send ${currencyObj.string} ${currencyObj.currency} = ${bchAmount.BCHstring} BCH`,
        );
      } else if (isValidXecAddress(address)) {
        setText(
          `Send ${currencyObj.string} ${currencyObj.currency} = ${bchAmount.BCHstring} XEC`,
        );
        setWidgetButtonText(
          `Send ${currencyObj.string} ${currencyObj.currency} = ${bchAmount.BCHstring} XEC`,
        );
      }
      query.push(`amount=${bchAmount.float}`);
      url = prefixedAddress + (query.length ? `?${query.join('&')}` : '');
      setUrl(url);
    } else {
      const notZeroValue: boolean =
        currencyObj?.satoshis !== undefined && currencyObj.satoshis > 0;
      if (!isFiat && currencyObj && notZeroValue) {
        const bchType: string =
          currency === 'SAT' ? 'satoshis' : currencyObj.currency;
        setText(`Send ${currencyObj.string} ${bchType}`);
        query.push(`amount=${currencyObj.BCHstring}`);
        url = prefixedAddress + (query.length ? `?${query.join('&')}` : '');
        setUrl(url);
      } else {
        if (isValidCashAddress(address)) {
          setText(`Send any amount of BCH`);
          setWidgetButtonText(`Send any amount of BCH`);
        } else if (isValidXecAddress(address)) {
          setText(`Send any amount of XEC`);
          setWidgetButtonText(`Send any amount of XEC`);
        }
        url = prefixedAddress + (query.length ? `?${query.join('&')}` : '');
        setUrl(url);
      }
    }
  }, [currencyObj, price, amount]);

  const handleButtonClick = (): void => {
    window.location.href = url;
  };
  const handleQrCodeClick = (): void => {
    if (disabled || to === undefined) return;
    const address = to;
    if (isValidCashAddress(address)) {
      prefixedAddress = `bitcoincash:${address.replace(/^.*:/, '')}`;
    } else {
      prefixedAddress = `ecash:${address.replace(/^.*:/, '')}`;
    }
    if (!copy(prefixedAddress)) return;
    setCopied(true);
    setRecentlyCopied(true);
  };

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
    <QRCode
      {...qrCodeProps}
      style={{ flex: 1, width: '100%', height: 'auto', ...blurCSS }}
    />
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

    const userEdited = getCurrencyObject(+amount, currency);

    setUserEditedAmount(userEdited);
    setAmount(amount);
  };

  useEffect(() => {
    const inSatoshis = getCurrencyObject(totalSatsReceived, 'SAT');

    const goal = getCurrencyObject(cleanGoalAmount, currency);

    if (!isFiat) {
      if (goal !== undefined && inSatoshis.float > 0) {
        setGoalPercent((100 * inSatoshis.float) / goal.satoshis!);
        if (currency === 'bits') {
          const bitstring = getCurrencyObject(
            parseFloat((inSatoshis.float / 100).toFixed(0)),
            'bits',
          );
          setGoalText(`${bitstring.string} / ${goal.string}`);
          setIsLoading(false);
        } else if (currency === 'SAT') {
          setGoalText(`${inSatoshis.string} / ${goal.string}`);
          setIsLoading(false);
        } else {
          const string = inSatoshis.BCHstring!;
          const truncated = parseFloat(string).toFixed(2);
          setGoalText(`${truncated} / ${cleanGoalAmount}`);
          setIsLoading(false);
        }
      }
    } else {
      if (totalSatsReceived !== 0 && hasPrice) {
        const receivedVal: number =
          satoshisToBch(totalSatsReceived) * (price! / 100);
        const receivedText: string = formatPrice(receivedVal, currency);
        const goalText: string = formatPrice(cleanGoalAmount, currency);
        setIsLoading(false);
        setGoalPercent(100 * (receivedVal / cleanGoalAmount));
        setGoalText(`${receivedText} / ${goalText}`);
      }
      if (shouldDisplayGoal && goal.float !== undefined && goal.float <= 0) {
        setDisabled(true);
        setErrorMsg('Goal Value must be a number');
      }
    }
  }, [totalSatsReceived, currency, goalAmount, price]);

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
          {errorMsg ? (
            <Typography className={classes.text} style={{ color: '#EB3B3B' }}>
              {errorMsg}
            </Typography>
          ) : (
            <Typography className={classes.text}>
              {loading ? 'Loading...' : success ? successText : text}
            </Typography>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={3}
          pt={2}
        >
          {isLoading ? (
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
                    style={{ marginBottom: '0.61rem' }}
                  >
                    {goalText}
                    <strong>&nbsp;{currency}</strong>
                  </Typography>
                  <BarChart
                    color={theme.palette.primary}
                    value={Math.round(goalPercent)}
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
                      {!disabled && (
                        <Typography className={classes.copyText}>
                          {copied ? 'Address copied!' : 'Click to copy'}
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

          {editable && (
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="flex-end"
              style={{ margin: '6px auto' }}
            >
              <Grid item xs={6}>
                <TextField
                  label={currency}
                  value={amount || 0}
                  onChange={handleAmountChange}
                  inputProps={{ maxlength: '12' }}
                  name="Amount"
                  id="userEditedAmount"
                />
              </Grid>
              <Grid item xs={2}>
                <PencilIcon width={20} height={20} fill="#333" />
              </Grid>
            </Grid>
          )}

          {success || (
            <Box pt={2} flex={1}>
              <ButtonComponent
                text={widgetButtonText}
                onClick={handleButtonClick}
                disabled={disabled}
              />
            </Box>
          )}
          {foot && (
            <Box pt={2} flex={1}>
              {foot}
            </Box>
          )}
          <Box py={0.8}>
            <Typography className={classes.footer}>
              <Link
                href="https://paybutton.org"
                target="_blank"
                rel="noopener"
                className="{classes.footer}"
                style={{ color: '#3f51b5', fontWeight: 'normal' }}
              >
                Powered by PayButton.org
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

Widget.defaultProps = {
  loading: false,
  success: false,
  successText: 'Thank you!',
  editable: false,
};

export default Widget;
