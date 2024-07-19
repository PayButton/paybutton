import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem
} from '@material-ui/core';
import {
  resolveNumber,
  CryptoCurrency
} from '../../util';
import PencilIcon from '../../assets/edit-pencil';
import { Button, animation } from '../Button/Button';
import { Socket } from 'socket.io-client';
import { AltpaymentCoin, AltpaymentError, AltpaymentPair, AltpaymentShift } from '../../altpayment';

interface AltpaymentProps {
  altpaymentSocket?: Socket;
  setUseAltpayment: Function;
  altpaymentShift?: AltpaymentShift;
  setAltpaymentShift: Function;
  shiftCompleted: boolean;
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
    setSelectedCoinNetwork(undefined)
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
  }

  return <>
    {altpaymentError ? <>
      <button onClick={resetTrade}> Go back</button>
      <p>Error: {altpaymentError.errorMessage}</p></>
      :
      <>
        {(coinPair && !loadingShift )&& <button onClick={resetTrade}> Go back</button>}
        {altpaymentShift ? (shiftCompleted ?
          <p> shift completed!</p>
          :
          <>
            <p> Deposit at least</p> {altpaymentShift.depositAmount} {altpaymentShift.depositCoin} to the address:
            <p>{altpaymentShift.depositAddress}</p>
            on the {selectedCoinNetwork} network.
            The id of your SideShift operation is {altpaymentShift.id}
          </>
        )
        :
          (loadingShift ?
            <p> loading shift...</p> :
            (coinPair ? <>
              <p> 1 {selectedCoin?.name} ~= {resolveNumber(coinPair.rate).toFixed(2)} XEC </p>
              {
                (altpaymentEditable) ? (
                  <Grid
                    container
                    spacing={2}
                    alignItems="flex-end"
                    style={{ margin: '6px auto' }}
                  >
                    <Grid item xs={6}>
                      <TextField
                        label="Amount"
                        value={pairAmount ?? 0}
                        onChange={handlePairAmountChange}
                        inputProps={{ maxLength: pairAmountMaxLength}}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <PencilIcon width={20} height={20} fill="#333" />
                    </Grid>
                  </Grid>
                ) : (
                  <Typography>Send {pairAmount} {selectedCoin?.name}</Typography>
                )
              }
              <Button
                text={`Send ${selectedCoin?.name}`}
                hoverText={`Send ${selectedCoin?.name}`}
                onClick={handleCreateQuoteButtonClick}
                disabled={loadingPair || selectedCoinNetwork === undefined || !pairAmount || !isAboveMinimumAltpaymentAmount || !isBelowMaximumAltpaymentAmount}
                animation={animation}
              />
              {!isAboveMinimumAltpaymentAmount && <p>Amount is below minimum.</p>}
              {!isBelowMaximumAltpaymentAmount && <p>Amount is above maximum.</p>}
            </>
            :
            <>
              { coins.length > 0 && <>
                <br/>
                {
                  (
                  (selectedCoin) && <>
                    Send {selectedCoin.name}
                    <br/>
                  </>
                  )
                }
                <h3> Select a coin </h3>
                <Select
                  value={selectedCoin?.coin}
                  onChange={(e) => {handleCoinChange(e)} }
                >
                  {coins.map(coin => <MenuItem key ={coin.coin} value={coin.coin}>{coin.coin}</MenuItem>)}
                </Select>
                {selectedCoin &&
                <>
                  <h3> Select a network </h3>
                  {
                    selectedCoin.networks.length > 1 ?
                      <Select
                        value={selectedCoinNetwork}
                        onChange={(e) => {handleNetworkChange(e)} }
                      >
                        {selectedCoin.networks.map(network => <MenuItem key ={network} value={network}>{network}</MenuItem>)}
                      </Select> :
                        <p>{selectedCoinNetwork}</p>
                  }
                </>
                }
              </> }
              <Button
                text={'Trade with SideShift'}
                hoverText={'Trade with SideShift'}
                onClick={handleGetRateButtonClick}
                disabled={loadingPair || selectedCoin === undefined || selectedCoinNetwork === undefined}
                animation={animation}
              />

              <Typography>
                <a onClick={() => {setUseAltpayment(false)}}>Trade with {addressType}</a>
              </Typography>
            </>
            ))
          // END: Altpayment region
        }
      </>
    }
  </>
};

export default AltpaymentWidget;
