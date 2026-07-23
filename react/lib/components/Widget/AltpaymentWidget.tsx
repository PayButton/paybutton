import React, { Fragment, useEffect, useRef, useState } from 'react'
import { TextField, Select, MenuItem, InputLabel, FormControl, Box, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { QRCodeSVG } from 'qrcode.react'

import { resolveNumber, CryptoCurrency, DECIMALS } from '../../util'
import { Button, animation } from '../Button/Button'
import { Socket } from 'socket.io-client'
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment'
import { SIDESHIFT_BASE_URL } from '../../altpayment/sideshift'
import { sideShiftLogo, copyIcon } from './SideShiftLogo'

const XEC_ICON_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M145.1,99.82l-31.71,18.26a2.61,2.61,0,0,0-1.31,2.29v15.32a2.48,2.48,0,0,0,1.31,2.21l13.28,7.66a2.36,2.36,0,0,0,2.53,0L184,114c9.3-5.38,9.3-20.88,0-26.26L134.75,59.38a13.17,13.17,0,0,0-13.62,0L71.88,87.75A13.46,13.46,0,0,0,65,99.58c0,19,.08,37.91,0,56.82a13.46,13.46,0,0,0,6.84,11.83l49.25,28.45a13.54,13.54,0,0,0,13.62,0L184,168.23a13.31,13.31,0,0,0,6.77-11.83V131.7l-58.62,33.92a8.31,8.31,0,0,1-8.48,0L97.49,150.45a8.3,8.3,0,0,1-4.24-7.34V112.87a8.36,8.36,0,0,1,4.15-7.26c8.73-5.06,17.53-10.11,26.26-15.17a8.36,8.36,0,0,1,8.48,0l13,7.42A1.15,1.15,0,0,1,145.1,99.82Z"/><path fill="#0074c2" d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0Zm17.1,97.86-13-7.42a8.36,8.36,0,0,0-8.48,0c-8.73,5.06-17.53,10.11-26.26,15.17a8.36,8.36,0,0,0-4.15,7.26v30.24a8.3,8.3,0,0,0,4.24,7.34l26.17,15.17a8.31,8.31,0,0,0,8.48,0l58.62-33.92v24.7A13.31,13.31,0,0,1,184,168.23l-49.24,28.45a13.54,13.54,0,0,1-13.62,0L71.88,168.23A13.46,13.46,0,0,1,65,156.4c.08-18.91,0-37.83,0-56.82a13.46,13.46,0,0,1,6.84-11.83l49.25-28.37a13.17,13.17,0,0,1,13.62,0L184,87.75c9.3,5.38,9.3,20.88,0,26.26L129.2,145.56a2.36,2.36,0,0,1-2.53,0l-13.28-7.66a2.48,2.48,0,0,1-1.31-2.21V120.37a2.61,2.61,0,0,1,1.31-2.29L145.1,99.82A1.15,1.15,0,0,0,145.1,97.86Z"/></svg>`,
)}`

interface AltpaymentProps {
  altpaymentSocket?: Socket;
  setUseAltpayment: Function;
  altpaymentShift?: AltpaymentShift;
  setAltpaymentShift: Function;
  shiftCompleted: boolean;
  setShiftCompleted: Function;
  altpaymentError?: AltpaymentError;
  setAltpaymentError: Function;
  coins: AltpaymentCoin[];
  loadingPair: boolean;
  setLoadingPair: Function;
  loadingShift: boolean;
  setLoadingShift: Function;
  coinPair?: AltpaymentPair;
  setCoinPair: Function;
  altpaymentEditable: boolean;
  preselectedCoin?: string;
  animation?: animation;
  addressType: CryptoCurrency;
  to: string;
  thisAmount?: string | number | null
  updateAmount: Function;
}

export const AltpaymentWidget: React.FunctionComponent<AltpaymentProps> = props => {

  const {
    altpaymentSocket,
    setUseAltpayment,
    altpaymentShift,
    setAltpaymentShift,
    shiftCompleted,
    setShiftCompleted,
    altpaymentError,
    setAltpaymentError,
    coins,
    loadingPair,
    loadingShift,
    coinPair,
    setCoinPair,
    altpaymentEditable,
    preselectedCoin,
    animation,
    addressType,
    thisAmount,
    updateAmount,
    setLoadingPair,
    setLoadingShift,
    to
  } = Object.assign({}, props);

  const [pairAmountMaxLength, setPairAmountMaxLength] = useState<number | undefined>(undefined);
  const [isAboveMinimumAltpaymentAmount, setIsAboveMinimumAltpaymentAmount] = useState<boolean | null>(null);
  const [isBelowMaximumAltpaymentAmount, setIsBelowMaximumAltpaymentAmount] = useState<boolean | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<AltpaymentCoin|undefined>();
  const [selectedCoinNetwork, setSelectedCoinNetwork] = useState<string | undefined>(undefined);
  const [pairAmountFixedDecimals, setPairAmountFixedDecimals] = useState<string | undefined>(undefined);
  const [pairAmount, setPairAmount] = useState<string | undefined>(undefined);
  const autoRateRequestedRef = useRef(false);
  const autoQuoteRequestedRef = useRef(false);
  const prevAltpaymentSocketRef = useRef<Socket | undefined>(undefined);

  const getDepositDecimals = (
    coin: AltpaymentCoin,
    network: string,
    pair: AltpaymentPair,
  ): number => {
    const networkTokenDetails = coin.tokenDetails?.[network]
    if (networkTokenDetails?.decimals !== undefined) {
      return networkTokenDetails.decimals
    }
    const minFraction = pair.min.split('.')[1]
    if (minFraction !== undefined) {
      return minFraction.length
    }
    return DECIMALS[coin.coin] ?? 8
  }

  const computeDepositAmountFromSettle = (): string | undefined => {
    if (!coinPair || !selectedCoin || !selectedCoinNetwork || thisAmount == null || thisAmount === '') {
      return undefined
    }
    const settleAmount = +thisAmount
    if (Number.isNaN(settleAmount) || settleAmount <= 0) {
      return undefined
    }
    const decimals = getDepositDecimals(selectedCoin, selectedCoinNetwork, coinPair)
    return resolveNumber(settleAmount / +coinPair.rate).toFixed(decimals)
  }

  useEffect(() => {
    if (altpaymentSocket === undefined) {
      autoRateRequestedRef.current = false
      autoQuoteRequestedRef.current = false
      prevAltpaymentSocketRef.current = undefined
      return
    }
    if (altpaymentSocket !== prevAltpaymentSocketRef.current) {
      autoRateRequestedRef.current = false
      autoQuoteRequestedRef.current = false
      setSelectedCoin(undefined)
      setSelectedCoinNetwork(undefined)
      setPairAmount(undefined)
      setPairAmountFixedDecimals(undefined)
      prevAltpaymentSocketRef.current = altpaymentSocket
    }
  }, [altpaymentSocket])

  useEffect(() => {
    if (preselectedCoin && coins.length > 0 && selectedCoin === undefined) {
      const coin = coins.find(c => c.coin === preselectedCoin)
      if (coin) {
        setSelectedCoin(coin)
        setSelectedCoinNetwork(coin.networks[0])
      }
    }
  }, [coins, preselectedCoin, selectedCoin])

  useEffect(() => {
    if (pairAmount && coinPair) {
      setIsBelowMaximumAltpaymentAmount(+pairAmount <= +coinPair.max)
      setIsAboveMinimumAltpaymentAmount(+pairAmount >= +coinPair.min)
    } else {
      setIsBelowMaximumAltpaymentAmount(true)
      setIsAboveMinimumAltpaymentAmount(true)
    }
  }, [pairAmount, coinPair])

  useEffect(() => {
    if (selectedCoin?.networks.length === 1) {
      setSelectedCoinNetwork(selectedCoin.networks[0])
    }
  }, [selectedCoin])

  useEffect(() => {
    if (coinPair && thisAmount != null && thisAmount !== '' && selectedCoin && selectedCoinNetwork) {
      const depositAmount = computeDepositAmountFromSettle()
      if (depositAmount === undefined) {
        return
      }
      const decimals = getDepositDecimals(selectedCoin, selectedCoinNetwork, coinPair)
      setPairAmountFixedDecimals(depositAmount)
      if (!altpaymentEditable) {
        setPairAmount(depositAmount)
      }

      const floorAmount = Math.floor(+depositAmount) || 1
      const nonDecimalCharCount = 1 + Math.ceil(Math.log10(floorAmount + 1))
      setPairAmountMaxLength(nonDecimalCharCount + decimals)
    }
  }, [coinPair, selectedCoin, thisAmount, selectedCoinNetwork, altpaymentEditable])

  const requestPairRate = (): void => {
    if (selectedCoin !== undefined && selectedCoinNetwork !== undefined) {
      const from = `${selectedCoin.coin}-${selectedCoinNetwork}`
      const to = addressType === 'XEC' ? `ecash-mainnet` : `bitcoincash-mainnet`
      if (altpaymentSocket !== undefined) {
        altpaymentSocket.emit('get-altpayment-rate', {from, to})
      }
    }
  }

  useEffect(() => {
    if (
      preselectedCoin &&
      !altpaymentEditable &&
      selectedCoin !== undefined &&
      selectedCoinNetwork !== undefined &&
      coinPair === undefined &&
      !loadingPair &&
      !autoRateRequestedRef.current &&
      altpaymentSocket !== undefined
    ) {
      autoRateRequestedRef.current = true
      setLoadingPair(true)
      const from = `${selectedCoin.coin}-${selectedCoinNetwork}`
      const to = addressType === 'XEC' ? `ecash-mainnet` : `bitcoincash-mainnet`
      altpaymentSocket.emit('get-altpayment-rate', {from, to})
    }
  }, [
    preselectedCoin,
    altpaymentEditable,
    selectedCoin,
    selectedCoinNetwork,
    coinPair,
    loadingPair,
    altpaymentSocket,
    addressType,
    setLoadingPair,
  ])

  const handleCoinChange = async (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const coinName = e.target.value as string
    const selectedCoin = coins.find(c => c.coin === coinName)
    setSelectedCoinNetwork(selectedCoin?.networks[0])
    setSelectedCoin(selectedCoin)
  }

  const handleGetRateButtonClick = () => {
    setLoadingPair(true)
    requestPairRate()
  }

  const handleNetworkChange = async (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const networkName = e.target.value as string
    setSelectedCoinNetwork(networkName)
  }

  const handlePairAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let pairAmount = e.target.value;
    if (pairAmount === '') {
      pairAmount = '0';
    }
    setPairAmount(pairAmount)

    if (coinPair !== undefined) {
      const settleCoinAmount = +coinPair.rate * +pairAmount

      if(Object.keys(DECIMALS).includes(coinPair.settleCoin)){
        updateAmount(settleCoinAmount.toFixed(DECIMALS[coinPair.settleCoin]))
      }
    }
  };

  const createQuote = (): boolean => {
    if (altpaymentSocket === undefined || selectedCoin === undefined || selectedCoinNetwork === undefined) {
      return false
    }

    const depositAmount = altpaymentEditable
      ? pairAmountFixedDecimals
      : (pairAmountFixedDecimals ?? computeDepositAmountFromSettle())

    const quotePayload: Record<string, string> = {
      settleCoin: addressType,
      depositCoin: selectedCoin.coin,
      depositNetwork: selectedCoinNetwork,
      settleAddress: to,
    }

    if (depositAmount) {
      quotePayload.depositAmount = depositAmount
    } else if (thisAmount != null && thisAmount !== '' && !altpaymentEditable) {
      const settleDecimals = DECIMALS[addressType] ?? 2
      quotePayload.settleAmount = resolveNumber(+thisAmount).toFixed(settleDecimals)
    } else {
      return false
    }

    setLoadingShift(true)
    altpaymentSocket.emit('create-altpayment-quote', quotePayload)
    return true
  }

  useEffect(() => {
    if (
      !preselectedCoin ||
      altpaymentEditable ||
      altpaymentSocket === undefined ||
      selectedCoin === undefined ||
      selectedCoinNetwork === undefined ||
      coinPair === undefined ||
      altpaymentShift !== undefined ||
      loadingShift ||
      autoQuoteRequestedRef.current ||
      altpaymentError
    ) {
      return
    }

    autoQuoteRequestedRef.current = createQuote()
  }, [
    preselectedCoin,
    altpaymentEditable,
    altpaymentSocket,
    selectedCoin,
    selectedCoinNetwork,
    coinPair,
    altpaymentShift,
    loadingShift,
    altpaymentError,
    thisAmount,
    pairAmountFixedDecimals,
  ])

  const handleCreateQuoteButtonClick = () => {
    createQuote()
  }

  const resetTrade = () => {
    autoRateRequestedRef.current = false
    autoQuoteRequestedRef.current = false
    setSelectedCoin(undefined)
    setSelectedCoinNetwork(undefined)
    setCoinPair(undefined)
    setAltpaymentError(undefined)
    setAltpaymentShift(undefined)
    setPairAmount(undefined)
    setPairAmountFixedDecimals(undefined)
    setShiftCompleted(false)
  }

  const showCopyToast = (message: string): void => {
    const existingToast = document.getElementById('paybutton-copy-toast')
    if (existingToast) {
      existingToast.remove()
    }

    const toast = document.createElement('div')
    toast.id = 'paybutton-copy-toast'
    toast.textContent = message
    toast.style.position = 'fixed'
    toast.style.left = '50%'
    toast.style.bottom = '16px'
    toast.style.transform = 'translateX(-50%)'
    toast.style.background = 'rgba(35, 31, 32, 0.9)'
    toast.style.color = '#fff'
    toast.style.padding = '8px 12px'
    toast.style.borderRadius = '6px'
    toast.style.fontSize = '12px'
    toast.style.lineHeight = '1'
    toast.style.zIndex = '2147483647'
    toast.style.pointerEvents = 'none'
    document.body.appendChild(toast)

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 1500)
  }

  const copyToClipboard = async (value: string): Promise<void> => {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      showCopyToast('Copied')
    } catch {
      showCopyToast('Copy failed')
    }
  }

  const SideshiftCtn = styled('div')({
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'absolute',
    zIndex: 9,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#f5f5f7',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '16px',
    '@media (min-width: 760px)': {
      padding: '24px',
    },
  })

  const LoadingCenter = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
    width: 'max-content',
    maxWidth: '100%',
  })

  const Header = styled('div')({
    marginBottom: '30px', display: 'flex', alignItems: 'center',
    flexDirection: 'column', color: 'rgb(35, 31, 32)', fontSize: '0.9rem',
    '& img': { width: '150px', marginTop: '10px' },
  })

  const BackLink = styled('div')({
    fontSize: '14px', marginTop: '20px', cursor: 'pointer',
    border: '1px solid #000', opacity: '0.7', padding: '2px 20px',
    borderRadius: '3px', '&:hover': { opacity: '1' },
  })

  const ShiftReady = styled('div')({
    width: '100%', display: 'flex', flexDirection: 'column',
    minWidth: 0,
  })

  const ShiftReadyTitle = styled('h4')({
    margin: 0,
    fontSize: '22px',
    borderBottom: '1px solid #000',
    paddingBottom: '12px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    lineHeight: 1.3,
  })

  const ShiftReadyBody = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '14px',
  })

  const ShiftReadyMain = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
    minWidth: 0,
  })

  const ShiftLabelRow = styled('div')({
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '4px',
    minWidth: 0,
  })

  const CopyCtn = styled('div')({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    gap: '6px',
    '& > div': { position: 'relative' },
  })

  const AmountError = styled('p')({
    position: 'absolute', bottom: '10px', textAlign: 'center',
    background: '#00000014', padding: '10px', borderRadius: '5px'
  })

  const ErrorMsg = styled('p')({
    textAlign: 'center', background: '#ee010119',
    padding: '10px', borderRadius: '5px', color: 'red'
  })

  const ShiftLabel = styled('span')({
    fontSize: '14px', marginLeft: '5px', fontWeight: 600
  })

  const ShiftSubLabel = styled('span')({
    fontSize: '11px',
    color: '#8e8e8e',
    marginRight: '5px',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  })

  const ShiftInput = styled('div')({
    background: '#ffffff', padding: '10px', borderRadius: '5px', fontSize: '14px',
    border: '1px solid #b3b3b3', wordBreak: 'break-word', overflowWrap: 'anywhere', flex: '1 1 auto', position: 'relative', minWidth: 0,
  })

  const ShiftValueRow = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
  })

  const ShiftCurrencyIcon = styled('img')({
    width: '20px',
    height: '20px',
    flexShrink: 0,
  })

  const ShiftAddress = styled('div')({
    fontSize: '14px',
    lineHeight: 1.25,
    overflowWrap: 'anywhere',
  })

  const QrCard = styled('div')({
    width: '100%',
    maxWidth: '236px',
    boxSizing: 'border-box',
    background: '#fff',
    border: '1px solid #d7d7d7',
    borderRadius: '8px',
    padding: '12px',
    margin: '8px auto 4px',
    alignSelf: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'box-shadow 160ms ease, transform 160ms ease',
    '&:hover': {
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-1px)',
    },
  })

  const QrTitle = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px',
  })

  const InlineCoin = styled('span')({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 700,
  })

  const CopyBtn = styled('div')({
    background: '#ffffff', padding: '10px', borderRadius: '5px', border: '1px solid #b3b3b3',
    display: 'flex', alignItems: 'center', cursor: 'pointer',
    flex: '0 0 auto',
    alignSelf: 'stretch', transition: 'all ease-in-out 200ms',
    '&:hover': { background: '#f1f1f1' }, '& img': { width: '15px' },
  })

  const ShiftComplete = styled('div')({
    display: 'flex', alignItems: 'center', height: '100%', flex: '1', width: '100%', fontSize: '18px'
  })

  const SelectBox = styled(Select)({
    minWidth: '220px'
  })

  const OptionOuterCtn = styled('div')({
    display: 'flex', alignItems: 'center'
  })

  const OptionCtn = styled('div')({
    display: 'flex', flexDirection: 'column', margin: '5px 0'
  })

  const ListIcon = styled('img')({
    width: '28px', height: '28px', marginRight: '10px'
  })

  const Coin = styled('span')({
    fontWeight: 'bold', lineHeight: '1em'
  })

  const CoinName = styled('span')({
    fontSize: '14px'
  })

  const Spacer = styled('div')({
    height: '20px'
  })

  const checkCoin = (coin:string) => {
    let coinString = coin.toLowerCase();
    if (coinString.includes('.')) {
      return 'btc';
    }
    if (coinString === 'bitcoin') {
    return 'harrypotterobamasonic10inu';
    }
    return coinString;
  }

  const formatNetworkName = (network?: string): string => {
    if (!network) {
      return ''
    }
    return network.charAt(0).toUpperCase() + network.slice(1)
  }

  const getCoinName = (coinCode?: string): string => {
    if (!coinCode) {
      return ''
    }

    const match = coins.find(c => c.coin.toLowerCase() === coinCode.toLowerCase())
    if (match) {
      return match.name
    }

    const fallbackNames: Record<string, string> = {
      BTC: 'Bitcoin',
      BCH: 'Bitcoin Cash',
      XEC: 'eCash',
      ETH: 'Ethereum',
      LTC: 'Litecoin',
      XMR: 'Monero',
    }

    return fallbackNames[coinCode.toUpperCase()] ?? coinCode
  }

  const getCoinIconSrc = (coinCode?: string): string => {
    const normalizedCode = coinCode?.toUpperCase()
    if (normalizedCode === 'XEC' || coinCode?.toLowerCase() === 'ecash') {
      return XEC_ICON_DATA_URI
    }
    return `${SIDESHIFT_BASE_URL}coins/icon/${checkCoin(coinCode ?? '')}`
  }

  const getQrUriScheme = (network?: string, coin?: string): string => {
    if (network && network.length > 0) {
      return network.toLowerCase()
    }
    if (coin && coin.length > 0) {
      return coin.toLowerCase()
    }
    return 'bitcoin'
  }

  const getShiftQrValue = (shift: AltpaymentShift): string => {
    const scheme = getQrUriScheme(selectedCoinNetwork, shift.depositCoin)
    return `${scheme}:${shift.depositAddress}?amount=${shift.depositAmount}`
  }

  const shiftQrValue = altpaymentShift ? getShiftQrValue(altpaymentShift) : ''

  const isAutoStart = Boolean(preselectedCoin)
  const isAutoStartLoading = isAutoStart && !altpaymentShift && !altpaymentError

  const renderLoading = (message: string) => (
    <LoadingCenter>
      <CircularProgress size={48} thickness={4} sx={{ display: 'block' }} />
      <Box
        component="span"
        sx={{
          fontSize: '0.9rem',
          color: 'rgb(35, 31, 32)',
          fontFamily: 'inherit',
          textAlign: 'center',
        }}
      >
        {message}
      </Box>
    </LoadingCenter>
  )

  return (
    <SideshiftCtn>
      {altpaymentError ? (
        <Fragment>
          <ErrorMsg>Error: {altpaymentError.errorMessage}</ErrorMsg>
          <BackLink onClick={resetTrade}>Back</BackLink>
        </Fragment>
      ) : isAutoStartLoading ? (
        renderLoading('Loading SideShift...')
      ) : (
        <Fragment>
          {
            altpaymentShift ? (
              shiftCompleted ? (
                <ShiftComplete>Shift Completed!</ShiftComplete>
              ) : (
                <ShiftReady>
                  <ShiftReadyTitle>
                    <span>Send</span>
                    <InlineCoin>
                      <ShiftCurrencyIcon
                        src={getCoinIconSrc(altpaymentShift.depositCoin)}
                        alt={altpaymentShift.depositCoin}
                      />
                      <span>{getCoinName(altpaymentShift.depositCoin)}</span>
                    </InlineCoin>
                    <span>for</span>
                    <InlineCoin>
                      <ShiftCurrencyIcon
                        src={getCoinIconSrc(altpaymentShift.settleCoin)}
                        alt={altpaymentShift.settleCoin}
                      />
                      <span>{getCoinName(altpaymentShift.settleCoin)}</span>
                    </InlineCoin>
                  </ShiftReadyTitle>
                  <ShiftReadyBody>
                    <ShiftReadyMain>
                      <ShiftLabel>Send</ShiftLabel>
                      <CopyCtn>
                        <ShiftInput>
                          <ShiftValueRow>
                            <ShiftCurrencyIcon
                              src={getCoinIconSrc(altpaymentShift.depositCoin)}
                              alt={altpaymentShift.depositCoin}
                            />
                            <span>{altpaymentShift.depositAmount}{' '}{altpaymentShift.depositCoin}</span>
                          </ShiftValueRow>
                        </ShiftInput>
                        <CopyBtn onClick={() => { void copyToClipboard(altpaymentShift.depositAmount) }}>
                          <img
                            src={copyIcon}
                            alt="Copy"
                          />
                        </CopyBtn>
                      </CopyCtn>
                      <ShiftLabelRow>
                        <ShiftLabel>To</ShiftLabel>
                        <ShiftSubLabel>Network: {formatNetworkName(selectedCoinNetwork)}</ShiftSubLabel>
                      </ShiftLabelRow>
                      <CopyCtn>
                        <ShiftInput>
                          <ShiftAddress>
                            {altpaymentShift.depositAddress}
                          </ShiftAddress>
                        </ShiftInput>
                        <CopyBtn onClick={() => { void copyToClipboard(altpaymentShift.depositAddress) }}>
                          <img
                            src={copyIcon}
                            alt="Copy"
                          />
                        </CopyBtn>
                      </CopyCtn>
                      <QrCard onClick={() => { void copyToClipboard(shiftQrValue) }}>
                        <QrTitle>
                          <ShiftCurrencyIcon
                            src={getCoinIconSrc(altpaymentShift.depositCoin)}
                            alt={altpaymentShift.depositCoin}
                          />
                          <span>Scan to Pay</span>
                        </QrTitle>
                        <QRCodeSVG
                          value={shiftQrValue}
                          size={176}
                          level="M"
                          includeMargin
                        />
                      </QrCard>
                      <ShiftLabel>SideShift ID</ShiftLabel>
                      <CopyCtn>
                        <ShiftInput>
                          {altpaymentShift.id}
                        </ShiftInput>
                        <CopyBtn onClick={() => { void copyToClipboard(altpaymentShift.id) }}>
                          <img
                            src={copyIcon}
                            alt="Copy"
                          />
                        </CopyBtn>
                      </CopyCtn>
                    </ShiftReadyMain>
                  </ShiftReadyBody>
                </ShiftReady>
              )
            ) : loadingShift ? (
              renderLoading('Loading Shift...')
            ) : coinPair && selectedCoin ? (
              <Fragment>
                <p>
                  {' '}
                  1 {selectedCoin.name} ~={' '}
                  {resolveNumber(coinPair.rate).toFixed(DECIMALS[coinPair.settleCoin] ?? 8)} {coinPair.settleCoin}{' '}
                </p>
                {altpaymentEditable ? (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '6px auto', width: '100%' }}>
                    <TextField
                      label="Amount"
                      value={pairAmount ?? 0}
                      onChange={handlePairAmountChange}
                      inputProps={{
                        maxLength: pairAmountMaxLength,
                          type: 'number',
                          pattern: '[0-9]*',
                          inputMode: 'numeric',
                      }}
                    />
                  </div>
                ) : null}

                <div></div>
                <div style={loadingPair ||
                    selectedCoinNetwork === undefined ||
                    (altpaymentEditable && !pairAmount) ||
                    !isAboveMinimumAltpaymentAmount ||
                    !isBelowMaximumAltpaymentAmount ? {opacity: '0.5', cursor: 'not-allowed'} : {}}>
                <Button
                  text={`Send ${selectedCoin.name}`}
                  hoverText={`Send ${selectedCoin.name}`}
                  onClick={handleCreateQuoteButtonClick}
                  disabled={
                    loadingPair ||
                    selectedCoinNetwork === undefined ||
                    (altpaymentEditable && !pairAmount) ||
                    (!altpaymentEditable && !pairAmountFixedDecimals && !computeDepositAmountFromSettle()) ||
                    !isAboveMinimumAltpaymentAmount ||
                    !isBelowMaximumAltpaymentAmount
                  }
                  animation={animation}
                />
                </div>
                {pairAmount && !isAboveMinimumAltpaymentAmount && (
                  <AmountError>Amount is below minimum.</AmountError>
                )}
                {pairAmount && !isBelowMaximumAltpaymentAmount && (
                  <AmountError>Amount is above maximum.</AmountError>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {coins.length === 0 && renderLoading('Loading SideShift...')}
                {coins.length > 0 && (
                  <Fragment>
                    <Header>
                      Swap coins with
                      <a href="https://sideshift.ai" target="_blank">
                        <img src={sideShiftLogo} alt='SideShift' />
                      </a>
                    </Header>
                    {!preselectedCoin ? (
                    <FormControl>
                      <InputLabel id="select-coin-label">Select a coin</InputLabel>
                      <SelectBox
                        labelId="select-coin-label"
                        value={selectedCoin?.coin ?? ''}
                        label="Select a coin"
                        onChange={(e) => handleCoinChange(e as any)}
                      >
                        {coins.map(coin => (
                          <MenuItem key={coin.coin} value={coin.coin}>
                            <OptionOuterCtn>
                              <ListIcon
                                src={getCoinIconSrc(coin.coin)}
                                alt={coin.coin}
                              />
                              <OptionCtn>
                                <Coin>{coin.coin}</Coin>
                                <CoinName>{coin.name}</CoinName>
                              </OptionCtn>
                            </OptionOuterCtn>
                          </MenuItem>
                        ))}
                      </SelectBox>
                    </FormControl>
                    ) : null}

                    <Spacer />
                    {selectedCoin && selectedCoin.networks.length > 1 && (
                      <Fragment>
                        {
                          <FormControl>
                            <InputLabel id="select-network-label">Select a network</InputLabel>
                            <SelectBox
                              labelId="select-network-label"
                              value={selectedCoinNetwork ?? ''}
                              label="Select a network"
                              onChange={(e) => handleNetworkChange(e as any)}
                            >
                              {selectedCoin.networks.map(network => (
                                <MenuItem key={network} value={network}>
                                  <OptionOuterCtn>
                                    <OptionCtn>
                                      <Coin>
                                        {network.charAt(0).toUpperCase() + network.slice(1)}
                                      </Coin>
                                    </OptionCtn>
                                  </OptionOuterCtn>
                                </MenuItem>
                              ))}
                            </SelectBox>
                          </FormControl>
                        }
                      </Fragment>
                    )}
                  </Fragment>
                )}
                <Spacer />
                {loadingPair ||
                selectedCoin === undefined ||
                selectedCoinNetwork === undefined ? null : (
                  <Button
                    text={'Send with SideShift'}
                    hoverText={'Send with SideShift'}
                    onClick={handleGetRateButtonClick}
                    disabled={
                      loadingPair ||
                      selectedCoin === undefined ||
                      selectedCoinNetwork === undefined
                    }
                    animation={animation}
                  />
                )}
                <BackLink onClick={() => {setUseAltpayment(false)}}>Back</BackLink>
              </Fragment>
            )
            // END: Altpayment region
          }
        </Fragment>
      )}
    </SideshiftCtn>
  );
};

export default AltpaymentWidget;
