import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  makeStyles,
  InputLabel,
  FormControl
} from '@material-ui/core';
import {
  resolveNumber,
  CryptoCurrency
} from '../../util';
import { Button, animation } from '../Button/Button';
import { Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment';
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
      const xecAmount = +coinPair.rate * +pairAmount
      updateAmount(xecAmount.toString())
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
          copiedMessage.style.width = "100%";
          copiedMessage.style.top = "-5px";
          copiedMessage.style.left = "0";
          copiedMessage.style.backgroundColor = "rgb(232 232 237)";
          copiedMessage.style.padding = "5px 0 5px 5px";
          copiedMessage.style.zIndex = "10";
          copiedMessage.style.display = "none";
  
    if (contentElement) {
      const content = contentElement.textContent || "";
      navigator.clipboard.writeText(content);
        contentElement.appendChild(copiedMessage);
        copiedMessage.style.display = "inline-block";

        setTimeout(() => {
          copiedMessage.style.display = "none";
          if (copiedMessage.parentElement === contentElement) {
            contentElement.removeChild(copiedMessage);
          }
        }, 2000);
      }
  };

  const useStyles = makeStyles({
    select_box: {
      minWidth: '300px'
    },
    option_outer_ctn: {
      display: 'flex',
      alignItems: 'center'
    },
    option_ctn: {
      display: 'flex',
      flexDirection: 'column',
      margin: '5px 0'
    },
    list_icon: {
      width: '28px',
      height: '28px',
      marginRight: '10px'
    },
    coin: {
      fontWeight: 'bold',
      lineHeight: '1em'
    },
    coin_name: {
      fontSize: '14px'
    },
    spacer: {
      height: '20px'
    },
    sideshift_ctn: {
      padding: '20px 0',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      marginBottom:'30px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      color: 'rgb(35, 31, 32)',
      fontSize: '0.9rem',

      '& img': {
        width: '150px',
        marginTop: '10px'
      },
    },
    back_link: {
      fontSize: '14px',
      marginTop: '20px',
      cursor: 'pointer',
      border: '1px solid #000',
      opacity: '0.7',
      padding: '2px 20px',
      borderRadius: '3px',
      '&:hover': {
        opacity: '1'
      },
    },
    shift_ready: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '& h4': {
       margin: '0',
       fontSize: '20px',
      },
      '& span': {
        marginTop: '20px',
        marginBottom: '2px',
        fontSize: '16px',
        fontWeight: '600'
       },
    },
    copy_ctn: {
      display: 'flex',
      alignItems: 'center',
      '& > div': {
        position: 'relative'
       },
       '& img': {
       width: '15px',
       marginLeft: '5px'
       },
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
      }
    }
  });

  const classes = useStyles();

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
    <div className={classes.sideshift_ctn}>
      {altpaymentError ? (
        <>
          <p>Error: {altpaymentError.errorMessage}</p>
          <div className={classes.back_link} onClick={resetTrade}>Back</div>
        </>
      ) : (
        <>
          {
            altpaymentShift ? (
              shiftCompleted ? (
                <p>Shift Completed!</p>
              ) : (
                <div className={classes.shift_ready}>
                  <h4>Shift Ready!</h4>
                  <span>Send</span>
                  <div>{altpaymentShift.depositAmount}{' '}{altpaymentShift.depositCoin}</div>
                  <span>To</span>
                  <div className={classes.copy_ctn}>
                    <div id="to_address">{altpaymentShift.depositAddress}</div>
                    <img src={copyIcon} alt="Copy" onClick={() => copyToClipboard('to_address')}/>
                  </div>
                  <span>Network</span>
                  <div>{selectedCoinNetwork}</div>
                  <span>SideShift ID</span>
                  <div className={classes.copy_ctn}>
                    <div id="sideshift_id">{altpaymentShift.id}</div>
                    <img src={copyIcon} alt="Copy" onClick={() => copyToClipboard('sideshift_id')}/>
                  </div>
                </div> 
              )
            ) : loadingShift ? (
              <p>Loading Shift...</p>
            ) : coinPair ? (
              <>
                <p>
                  {' '}
                  1 {selectedCoin?.name} ~={' '}
                  {resolveNumber(coinPair.rate).toFixed(2)} XEC{' '}
                </p>
                {altpaymentEditable ? (
                  <div className={classes.editAmount}>
                    <TextField
                      label='Edit amount'
                      value={pairAmount ?? 0}
                      onChange={handlePairAmountChange}
                      inputProps={{ maxLength: pairAmountMaxLength }}
                    />
                    <span>{selectedCoin?.coin}</span>
                  </div>
                ) : (
                  <Typography>
                    Send {pairAmount} {selectedCoin?.name}
                  </Typography>
                )}
                <div style={loadingPair ||
                    selectedCoinNetwork === undefined ||
                    !pairAmount ||
                    !isAboveMinimumAltpaymentAmount ||
                    !isBelowMaximumAltpaymentAmount ? {opacity: '0.5', cursor: 'not-allowed'} : {}}>
                <Button
                  text={`Send ${selectedCoin?.name}`}
                  hoverText={`Send ${selectedCoin?.name}`}
                  onClick={handleCreateQuoteButtonClick}
                  disabled={
                    loadingPair ||
                    selectedCoinNetwork === undefined ||
                    !pairAmount ||
                    !isAboveMinimumAltpaymentAmount ||
                    !isBelowMaximumAltpaymentAmount
                  }
                  animation={animation}
                />
                </div>
                {!isAboveMinimumAltpaymentAmount && (
                  <p>Amount is below minimum.</p>
                )}
                {!isBelowMaximumAltpaymentAmount && (
                  <p>Amount is above maximum.</p>
                )}
              </>
            ) : (
              <>
                {coins.length === 0 && <div>Loading...</div>}
                {coins.length > 0 && (
                  <>
                    <div className={classes.header}>
                      Swap coins with
                      <a href="https://sideshift.ai" target="_blank">
                        <img src={sideShiftLogo} alt='SideShift' />
                      </a>
                    </div>
                    <FormControl>
                      <InputLabel id="select-coin-label">
                        Select a coin
                      </InputLabel>
                      <Select
                        labelId="select-coin-label"
                        className={classes.select_box}
                        value={selectedCoin?.coin}
                        onChange={e => {
                          handleCoinChange(e);
                        }}
                      >
                        {coins.map(coin => (
                          <MenuItem key={coin.coin} value={coin.coin}>
                            <div className={classes.option_outer_ctn}>
                              <img
                                className={classes.list_icon}
                                src={`https://sideshift.ai/coin-icons/${checkCoin(
                                  coin.coin,
                                )}.svg`}
                              />
                              <div className={classes.option_ctn}>
                                <span className={classes.coin}>
                                  {coin.coin}
                                </span>
                                <span className={classes.coin_name}>
                                  {coin.name}
                                </span>
                              </div>
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className={classes.spacer} />
                    {selectedCoin && selectedCoin.networks.length > 1 && (
                      <>
                        {
                          <FormControl>
                            <InputLabel id="select-network-label">
                              Select a network
                            </InputLabel>

                            <Select
                              labelId="select-network-label"
                              className={classes.select_box}
                              value={selectedCoinNetwork}
                              onChange={e => {
                                handleNetworkChange(e);
                              }}
                            >
                              {selectedCoin.networks.map(network => (
                                <MenuItem key={network} value={network}>
                                  <div className={classes.option_outer_ctn}>
                                    <div className={classes.option_ctn}>
                                      <span className={classes.coin}>
                                        {network.charAt(0).toUpperCase() +
                                          network.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        }
                      </>
                    )}
                  </>
                )}
                <div className={classes.spacer} />
                <div className={classes.spacer} />
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
                <div className={classes.back_link} onClick={() => {setUseAltpayment(false)}}>Back</div>
              </>
            )
            // END: Altpayment region
          }
           {coinPair && !loadingShift && (
              <div className={classes.back_link} onClick={resetTrade}>Back</div>
            )}
        </>
      )}
    </div>
  );
};

export default AltpaymentWidget;
