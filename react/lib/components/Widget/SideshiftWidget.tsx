import React from 'react';
import {
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem
} from '@material-ui/core';
import {
  SideshiftCoin,
  SideshiftPair,
  SideshiftShift,
  SideshiftError,
  resolveNumber,
  CryptoCurrency
} from '../../util';
import PencilIcon from '../../assets/edit-pencil';
import { Button, animation } from '../Button/Button';

interface SideshiftProps {
  setUseSideshift: Function;
  sideshiftShift?: SideshiftShift;
  shiftCompleted: boolean;
  sideshiftError?: SideshiftError;
  coins: SideshiftCoin[];
  selectedCoin?: SideshiftCoin;
  selectedCoinNetwork?: string;
  loadingPair: boolean;
  pairAmount?: string;
  isAboveMinimumSideshiftAmount: boolean | null;
  isBelowMaximumSideshiftAmount: boolean | null;
  loadingShift: boolean;
  coinPair?: SideshiftPair;
  sideshiftEditable: boolean;
  pairAmountMaxLength?: number;
  handleGetRateButtonClick: () => void;
  handleNetworkChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  handleCoinChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  handlePairAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateQuoteButtonClick: () => void;
  animation?: animation;
  addressType: CryptoCurrency;
}

export const SideshiftWidget: React.FunctionComponent<SideshiftProps> = props => {
  const {
  setUseSideshift,
  sideshiftShift,
  shiftCompleted,
  sideshiftError,
  coins,
  selectedCoin,
  selectedCoinNetwork,
  loadingPair,
  pairAmount,
  isAboveMinimumSideshiftAmount,
  isBelowMaximumSideshiftAmount,
  loadingShift,
  coinPair,
  sideshiftEditable,
  pairAmountMaxLength,
  handleGetRateButtonClick,
  handleNetworkChange,
  handleCoinChange,
  handlePairAmountChange,
  handleCreateQuoteButtonClick,
  animation,
  addressType,
  } = Object.assign({}, props);

  return <>
    {sideshiftError ? <p>Error: {sideshiftError.errorMessage}</p> :
              (sideshiftShift ? (shiftCompleted ?
                <p> shift completed!</p>
                :
                <>
                    <p> Deposit at least</p> {sideshiftShift.depositAmount} {sideshiftShift.depositCoin} to the address:
                  <p>{sideshiftShift.depositAddress}</p>
                  on the {selectedCoinNetwork} network.
                  The id of your sideshift operation is {sideshiftShift.id}
                </>
              )
              :
              (loadingShift ?
                <p> loading shift...</p> :
              (coinPair ? <>
                <p> 1 {selectedCoin?.name} ~= {resolveNumber(coinPair.rate).toFixed(2)} XEC </p>
                {
                  (sideshiftEditable) ? (
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
                  disabled={loadingPair || selectedCoinNetwork === undefined || !pairAmount || !isAboveMinimumSideshiftAmount || !isBelowMaximumSideshiftAmount}
                  animation={animation}
                />
                {!isAboveMinimumSideshiftAmount && <p>Amount is below minimum.</p>}
                {!isBelowMaximumSideshiftAmount && <p>Amount is above maximum.</p>}
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
                  <a onClick={() => {setUseSideshift(false)}}>Trade with {addressType}</a>
                </Typography>
              </>
              ))
            // END: Sideshift region
            )}
    </>
};

export default SideshiftWidget;
