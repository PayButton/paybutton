import React, { Fragment, useEffect, useState } from 'react'
import { TextField, Select, MenuItem, InputLabel, FormControl  } from '@mui/material'
import { styled } from '@mui/material/styles'

import { resolveNumber, CryptoCurrency, DECIMALS } from '../../util'
import { Button, animation } from '../Button/Button'
import { Socket } from 'socket.io-client'
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment'
import { sideShiftLogo, copyIcon } from './SideShiftLogo'

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
    if (coinPair && thisAmount && selectedCoin && selectedCoinNetwork) {
      const bigNumber = resolveNumber(+thisAmount / +coinPair.rate)
      const tokenDetails = selectedCoin.tokenDetails
      let decimals: number
      if (tokenDetails !== undefined) {
        decimals = tokenDetails[selectedCoinNetwork].decimals
      } else {
        decimals = coinPair.min.split('.')[1].length
      }

      const amountString = bigNumber.toFixed(decimals)
      setPairAmountFixedDecimals(amountString)

      // Besides decimals, account for the non-decimal part of the bigNumber
      // plus the '.' character.
      const floorAmount = pairAmount ? Math.floor(+pairAmount) : 1
      const nonDecimalCharCount = 1 + Math.ceil(Math.log10(floorAmount + 1))
      setPairAmountMaxLength(nonDecimalCharCount + decimals)
    }
  }, [coinPair, selectedCoin, thisAmount, pairAmount, selectedCoinNetwork])

  const requestPairRate = (): void => {
    if (selectedCoin !== undefined) {
      const from = `${selectedCoin.coin}-${selectedCoin?.networks[0]}`
      const to = addressType === 'XEC' ? `ecash-mainnet` : `bitcoincash-mainnet`
      if (altpaymentSocket !== undefined) {
        altpaymentSocket.emit('get-altpayment-rate', {from, to})
      }
    }
  }

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

  const handleCreateQuoteButtonClick = () => {
    if (altpaymentSocket !== undefined && selectedCoin !== undefined) {
      setLoadingShift(true)
      altpaymentSocket.emit('create-altpayment-quote', {
        depositAmount: pairAmountFixedDecimals,
        settleCoin:  addressType,
        depositCoin: selectedCoin?.coin,
        depositNetwork: selectedCoinNetwork,
        settleAddress: to
      });
    }
  }

  const resetTrade = () => {
    setCoinPair(undefined)
    setAltpaymentError(undefined)
    setAltpaymentShift(undefined)
    setPairAmount(undefined)
    setShiftCompleted(false)
  }

  const copyToClipboard = (elementId: string) => {
    const contentElement = document.getElementById(elementId);
    const copiedMessage = document.createElement("div");
          copiedMessage.textContent = "Copied!";
          copiedMessage.style.position = "absolute";
          copiedMessage.style.width = "calc(100% - 10px)";
          copiedMessage.style.height = "calc(100% - 20px)";
          copiedMessage.style.alignItems = "center";
          copiedMessage.style.top = "0";
          copiedMessage.style.left = "0";
          copiedMessage.style.backgroundColor = "#fff";
          copiedMessage.style.borderRadius = "5px";
          copiedMessage.style.padding = "10px 0 10px 10px";
          copiedMessage.style.zIndex = "10";
          copiedMessage.style.display = "none";

    if (contentElement) {
      const content = contentElement.textContent || "";
      navigator.clipboard.writeText(content);
        contentElement.appendChild(copiedMessage);
        copiedMessage.style.display = "flex";

        setTimeout(() => {
          copiedMessage.style.display = "none";
          if (copiedMessage.parentElement === contentElement) {
            contentElement.removeChild(copiedMessage);
          }
        }, 2000);
      }
  };

  const SideshiftCtn = styled('div')({
    alignItems: 'center', display: 'flex', flexDirection: 'column',
    height: 'calc(100% - 45px)', width: '100%', position: 'absolute',
    zIndex: 9, top: '0', left: '0', background: '#f5f5f7', paddingTop: '20px'
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
    '& h4': { margin: '0', fontSize: '20px', borderBottom: '1px solid #000', paddingBottom: '10px', textAlign: 'center' },
  })

  const CopyCtn = styled('div')({
    display: 'flex', alignItems: 'center', '& > div': { position: 'relative' }
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
    fontSize: '14px', marginLeft: '5px', marginTop: '20px', marginBottom: '2px', fontWeight: 600
  })

  const ShiftInput = styled('div')({
    background: '#ffffff', padding: '10px', borderRadius: '5px', fontSize: '14px',
    border: '1px solid #b3b3b3', wordBreak: 'break-all', flexGrow: 1, position: 'relative',
  })

  const CopyBtn = styled('div')({
    background: '#ffffff', padding: '10px', borderRadius: '5px', border: '1px solid #b3b3b3',
    marginLeft: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer',
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

  return (
    <SideshiftCtn>
      {altpaymentError ? (
        <Fragment>
          <ErrorMsg>Error: {altpaymentError.errorMessage}</ErrorMsg>
          <BackLink onClick={resetTrade}>Back</BackLink>
        </Fragment>
      ) : (
        <Fragment>
          {
            altpaymentShift ? (
              shiftCompleted ? (
                <ShiftComplete>Shift Completed!</ShiftComplete>
              ) : (
                <ShiftReady>
                  <h4>Shift Ready!</h4>
                  <ShiftLabel>Send</ShiftLabel>
                  <CopyCtn>
                    <ShiftInput>
                      <span id="shift_amount">{altpaymentShift.depositAmount}</span>{' '}{altpaymentShift.depositCoin}
                    </ShiftInput>
                    <CopyBtn onClick={() => copyToClipboard('shift_amount')}>
                      <img
                        src={copyIcon}
                        alt="Copy"
                      />
                    </CopyBtn>
                  </CopyCtn>
                  <ShiftLabel>To</ShiftLabel>
                  <CopyCtn>
                    <ShiftInput id="to_address">
                      {altpaymentShift.depositAddress}
                    </ShiftInput>
                    <CopyBtn onClick={() => copyToClipboard('to_address')}>
                      <img
                        src={copyIcon}
                        alt="Copy"
                      />
                    </CopyBtn>
                  </CopyCtn>
                  <ShiftLabel>Network</ShiftLabel>
                  <ShiftInput>{selectedCoinNetwork}</ShiftInput>
                  <ShiftLabel>SideShift ID</ShiftLabel>
                  <CopyCtn>
                    <ShiftInput id="sideshift_id">
                      {altpaymentShift.id}
                    </ShiftInput>
                    <CopyBtn onClick={() => copyToClipboard('sideshift_id')}>
                      <img
                        src={copyIcon}
                        alt="Copy"
                      />
                    </CopyBtn>
                  </CopyCtn>
                </ShiftReady>
              )
            ) : loadingShift ? (
              <p>Loading Shift...</p>
            ) : coinPair ? (
              <Fragment>
                <p>
                  {' '}
                  1 {selectedCoin?.name} ~={' '}
                  {resolveNumber(coinPair.rate).toFixed(DECIMALS[coinPair.settleCoin])} {coinPair.settleCoin}{' '}
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
                  text={`Send ${selectedCoin?.name}`}
                  hoverText={`Send ${selectedCoin?.name}`}
                  onClick={handleCreateQuoteButtonClick}
                  disabled={
                    loadingPair ||
                    selectedCoinNetwork === undefined ||
                    (altpaymentEditable && !pairAmount) ||
                    !isAboveMinimumAltpaymentAmount ||
                    !isBelowMaximumAltpaymentAmount
                  }
                  animation={animation}
                />
                </div>
                {!isAboveMinimumAltpaymentAmount && (
                  <AmountError>Amount is below minimum.</AmountError>
                )}
                {!isBelowMaximumAltpaymentAmount && (
                  <AmountError>Amount is above maximum.</AmountError>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {coins.length === 0 && <div>Loading...</div>}
                {coins.length > 0 && (
                  <Fragment>
                    <Header>
                      Swap coins with
                      <a href="https://sideshift.ai" target="_blank">
                        <img src={sideShiftLogo} alt='SideShift' />
                      </a>
                    </Header>
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
                                src={`https://sideshift.ai/coin-icons/${checkCoin(coin.coin)}.svg`}
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
           {coinPair && !loadingShift && (
              <BackLink onClick={resetTrade}>Back</BackLink>
            )}
        </Fragment>
      )}
    </SideshiftCtn>
  );
};

export default AltpaymentWidget;
