import { act } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ALTPAYMENT_TIMEOUT_MS, AltpaymentWidget } from '../../components/Widget/AltpaymentWidget'

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
    hasMemo: false,
    fixedOnly: false,
    variableOnly: false,
    tokenDetails: {},
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

  test('non-editable errors provide a button that resets state before exiting altpayment', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentError={{ errorMessage: 'Quote failed' } as any}
      />,
    )

    const backButton = screen.getByRole('button', { name: 'Back' })
    expect(backButton.getAttribute('type')).toBe('button')

    fireEvent.click(backButton)

    expect(baseProps.setCoinPair).toHaveBeenCalledWith(undefined)
    expect(baseProps.setAltpaymentError).toHaveBeenCalledWith(undefined)
    expect(baseProps.setAltpaymentShift).toHaveBeenCalledWith(undefined)
    expect(baseProps.setLoadingPair).toHaveBeenCalledWith(false)
    expect(baseProps.setLoadingShift).toHaveBeenCalledWith(false)
    expect(baseProps.setShiftCompleted).toHaveBeenCalledWith(false)
    expect(baseProps.setUseAltpayment).toHaveBeenCalledWith(false)
    expect(baseProps.setAltpaymentShift.mock.invocationCallOrder[0]).toBeLessThan(
      baseProps.setUseAltpayment.mock.invocationCallOrder[0],
    )
  })

  test('editable errors reset the trade without exiting altpayment', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentEditable
        altpaymentError={{ errorMessage: 'Quote failed' } as any}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(baseProps.setAltpaymentError).toHaveBeenCalledWith(undefined)
    expect(baseProps.setLoadingPair).toHaveBeenCalledWith(false)
    expect(baseProps.setLoadingShift).toHaveBeenCalledWith(false)
    expect(baseProps.setUseAltpayment).not.toHaveBeenCalled()
  })
})

const coinPair = {
  min: '0.0001',
  max: '10',
  rate: '9500000000',
  depositCoin: 'BTC',
  settleCoin: 'XEC',
  depositNetwork: 'bitcoin',
  settleNetwork: 'mainnet',
}

describe('AltpaymentWidget preselected coin flow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
    cleanup()
  })

  test('non-editable buttons wait on the loading screen until the shift is ready', () => {
    render(<AltpaymentWidget {...baseProps} coinPair={coinPair as any} />)

    expect(screen.getByText('Loading SideShift...')).toBeTruthy()
  })

  test('editable buttons show the amount form instead of an endless loading screen', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentEditable
        coinPair={coinPair as any}
      />,
    )

    expect(screen.queryByText('Loading SideShift...')).toBeNull()
    expect(screen.getByLabelText('Amount (BTC)')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Send Bitcoin' })).toBeTruthy()
  })

  test('editable buttons prefill the amount converted from the button amount', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        altpaymentEditable
        coinPair={coinPair as any}
        thisAmount={950000}
      />,
    )

    expect((screen.getByLabelText('Amount (BTC)') as HTMLInputElement).value).toBe('0.0001')
  })

  test('an unknown preselected coin falls back to the coin selector', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        preselectedCoin="DOGE"
      />,
    )

    expect(screen.queryByText('Loading SideShift...')).toBeNull()
    expect(screen.getAllByText('Select a coin').length).toBeGreaterThan(0)
  })

  test('gives up with an error when SideShift never sends the coin list', () => {
    render(<AltpaymentWidget {...baseProps} coins={[]} />)

    expect(screen.getByText('Loading SideShift...')).toBeTruthy()
    expect(baseProps.setAltpaymentError).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(ALTPAYMENT_TIMEOUT_MS)
    })

    expect(baseProps.setAltpaymentError).toHaveBeenCalledWith({
      errorType: 'connection-error',
      errorMessage: 'Could not reach SideShift. Please try again.',
    })
  })

  test('does not time out once the shift is ready', () => {
    render(
      <AltpaymentWidget
        {...baseProps}
        coinPair={coinPair as any}
        altpaymentShift={altpaymentShift as any}
      />,
    )

    act(() => {
      jest.advanceTimersByTime(ALTPAYMENT_TIMEOUT_MS * 2)
    })

    expect(baseProps.setAltpaymentError).not.toHaveBeenCalled()
  })
})

describe('AltpaymentWidget editable amount', () => {
  const socket = { emit: jest.fn() }
  const editableProps = {
    ...baseProps,
    altpaymentEditable: true,
    coinPair: coinPair as any,
    altpaymentSocket: socket as any,
  }

  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  test('quotes the amount the user typed, not the one derived from the button', () => {
    render(<AltpaymentWidget {...editableProps} thisAmount={950000} />)

    const input = screen.getByLabelText('Amount (BTC)') as HTMLInputElement
    fireEvent.change(input, { target: { value: '0.0001' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send Bitcoin' }))

    expect(socket.emit).toHaveBeenCalledWith(
      'create-altpayment-quote',
      expect.objectContaining({ depositAmount: '0.0001' }),
    )
  })

  test('reports the typed amount back in the settle coin', () => {
    render(<AltpaymentWidget {...editableProps} />)

    fireEvent.change(screen.getByLabelText('Amount (BTC)'), { target: { value: '0.0001' } })

    // 0.0001 BTC at a rate of 9_500_000_000 XEC per BTC
    expect(baseProps.updateAmount).toHaveBeenCalledWith('950000.00')
  })

  test('does not offer a coin step to go back to when the coin is preselected', () => {
    render(<AltpaymentWidget {...editableProps} />)

    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  test('keeps the back button when the user picked the coin manually', () => {
    render(
      <AltpaymentWidget {...editableProps} preselectedCoin={undefined} />,
    )

    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy()
  })
})
