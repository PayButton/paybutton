import { act } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AltpaymentWidget } from '../../components/Widget/AltpaymentWidget'

const altpaymentShift = {
  depositAmount: '0.01',
  depositCoin: 'BTC',
  depositAddress: 'bc1-test-address',
  settleCoin: 'XEC',
  id: 'shift-123',
}

const coins = [
  {
    coin: 'BTC',
    name: 'Bitcoin',
    networks: ['bitcoin'],
  },
]

const baseProps = {
  setUseAltpayment: jest.fn(),
  setAltpaymentShift: jest.fn(),
  shiftCompleted: false,
  setShiftCompleted: jest.fn(),
  setAltpaymentError: jest.fn(),
  coins,
  loadingPair: false,
  setLoadingPair: jest.fn(),
  loadingShift: false,
  setLoadingShift: jest.fn(),
  setCoinPair: jest.fn(),
  altpaymentEditable: false,
  addressType: 'XEC',
  to: 'ecash:qqtestaddress',
  updateAmount: jest.fn(),
  preselectedCoin: 'BTC',
}

let writeTextMock: jest.Mock

describe('AltpaymentWidget copy feedback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    writeTextMock = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
    cleanup()
  })

  test.each([
    ['altpayment-copy-amount', '0.01', 'Copied Amount!', '0.01 BTC'],
    ['altpayment-copy-address', 'bc1-test-address', 'Copied Address!', 'bc1-test-address'],
    ['altpayment-copy-id', 'shift-123', 'Copied SideShift ID!', 'shift-123'],
  ])('copy button %s shows temporary inline feedback', async (testId, copiedValue, copiedText, restoredText) => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentShift={altpaymentShift as any}
      />,
    )

    await act(async () => {
      fireEvent.click(screen.getByTestId(testId))
    })

    expect(writeTextMock).toHaveBeenCalledWith(copiedValue)
    await waitFor(() => {
      expect(screen.getByText(copiedText)).toBeTruthy()
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.getByText(restoredText)).toBeTruthy()
    })
  })

  test('qr click shows payment copied feedback in the card corner', async () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentShift={altpaymentShift as any}
      />,
    )

    expect(screen.getByText('Click to copy')).toBeTruthy()

    await act(async () => {
      fireEvent.click(screen.getByTestId('altpayment-qr-click-area'))
    })

    expect(writeTextMock).toHaveBeenCalledWith('bitcoin:bc1-test-address?amount=0.01')
    await waitFor(() => {
      expect(screen.getByText('Payment copied!')).toBeTruthy()
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.getByText('Click to copy')).toBeTruthy()
    })
  })
})
