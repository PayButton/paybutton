import '@testing-library/jest-dom'
import { render, screen, waitFor, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaymentDialog } from '../../components/PaymentDialog'
import React from 'react'

const VALID_XEC_ADDR = 'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk'
const VALID_BCH_ADDR = 'bitcoincash:qzceyr63927jqsjay83umcf8app7pu90xqegn38rpq'

// ---- capture WidgetContainer props so we can drive the dialog logic
let lastWidgetProps: any = null
jest.mock('../../components/Widget/WidgetContainer', () => ({
  WidgetContainer: (props: any) => {
    lastWidgetProps = props
    return <div data-testid="widget-mock" />
  },
}))

// ---- util mocks
const mockGetAutoCloseDelay = jest.fn<unknown, [boolean | number | string]>()
jest.mock('../../util', () => {
  const actual = jest.requireActual('../../util')
  return {
    ...actual,
    isValidCashAddress: (addr: string) => addr === VALID_BCH_ADDR, // BCH
    isValidXecAddress:  (addr: string) => addr === VALID_XEC_ADDR, // XEC
    isPropsTrue:        (v: any) => Boolean(v),
    getAutoCloseDelay:  (v: any) => mockGetAutoCloseDelay(v),
  }
})

beforeEach(() => {
  jest.clearAllMocks()
  lastWidgetProps = null
})

afterEach(() => {
  cleanup()
  jest.useRealTimers()
})

// -----------------------------------------------------------------------------
// Matrix: run core behaviors for both coins (XEC + BCH)
// -----------------------------------------------------------------------------
type CoinCase = { label: 'XEC' | 'BCH'; addr: string; currency: 'XEC' | 'BCH' }
const COINS: CoinCase[] = [
  { label: 'XEC', addr: VALID_XEC_ADDR, currency: 'XEC' },
  { label: 'BCH', addr: VALID_BCH_ADDR, currency: 'BCH' },
]

describe.each(COINS)('PaymentDialog — basics (%s)', ({ addr, currency }) => {
  test('forwards key props into WidgetContainer; internal disabled honors `disabled` when address is valid', async () => {
    render(
      <PaymentDialog
        to={addr}
        amount={3.5}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        dialogOpen
        setDialogOpen={() => {}}
        disabled={true}
      />
    )
    expect(await screen.findByTestId('widget-mock')).toBeInTheDocument()
    expect(lastWidgetProps.to).toBe(addr)
    expect(lastWidgetProps.amount).toBe(3.5)
    expect(lastWidgetProps.currency).toBe(currency)
    expect(lastWidgetProps.disabled).toBe(true)
  })

  test('when `disabled` is false and address is valid → internal disabled is false', async () => {
    render(
      <PaymentDialog
        to={addr}
        amount={1}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        dialogOpen
        setDialogOpen={() => {}}
        disabled={false}
      />
    )
    await screen.findByTestId('widget-mock')
    expect(lastWidgetProps.disabled).toBe(false)
  })
})

// -----------------------------------------------------------------------------
// Disabled logic branches when `to` is undefined or amount invalid
// -----------------------------------------------------------------------------
describe('PaymentDialog — disabled branches on invalid inputs', () => {
  test('to === undefined AND amount invalid → internal disabled true', async () => {
    render(
      <PaymentDialog
        to={undefined as any}
        amount={'xx' as any}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        dialogOpen
        setDialogOpen={() => {}}
      />
    )
    await screen.findByTestId('widget-mock')
    expect(lastWidgetProps.disabled).toBe(true)
  })

  test('to === undefined AND amount valid → internal disabled true', async () => {
    render(
      <PaymentDialog
        to={undefined as any}
        amount={2}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        dialogOpen
        setDialogOpen={() => {}}
      />
    )
    await screen.findByTestId('widget-mock')
    expect(lastWidgetProps.disabled).toBe(true)
  })
})

// -----------------------------------------------------------------------------
// Success flow: onSuccess -> foot Close, auto-close timer, manual close, unmount
// -----------------------------------------------------------------------------
describe('PaymentDialog — success & auto-close', () => {
  test('onSuccess sets success, provides foot Close; clicking Close invokes onClose(success=true, pid)', async () => {
    const onClose = jest.fn()
    render(
      <PaymentDialog
        to={VALID_XEC_ADDR}
        amount={1}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        dialogOpen
        setDialogOpen={() => {}}
        onClose={onClose}
        paymentId="PID123"
        autoClose={false}
      />
    )
    await screen.findByTestId('widget-mock')

    act(() => {
      lastWidgetProps.onSuccess({ txid: 'abc' })
    })

    expect(lastWidgetProps.foot).toBeTruthy()
    act(() => {
      lastWidgetProps.foot.props.onClick()
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledWith(true, 'PID123')
  })

  test('autoClose schedules a timer that closes the dialog (NOTE: current impl sends success=false)', async () => {
    jest.useFakeTimers()
    mockGetAutoCloseDelay.mockReturnValue(500)

    const onClose = jest.fn()
    render(
      <PaymentDialog
        to={VALID_XEC_ADDR}
        amount={1}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        dialogOpen
        setDialogOpen={() => {}}
        onClose={onClose}
        paymentId="PID999"
        autoClose={true}
      />
    )
    await screen.findByTestId('widget-mock')

    act(() => {
      lastWidgetProps.onSuccess({ txid: 'zzz' })
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Because the timeout captures an earlier render where success=false
    await waitFor(() =>
      expect(onClose).toHaveBeenCalledWith(false, 'PID999')
    )
  })

  test('manual Close cancels a pending autoClose timer (no double-close)', async () => {
    jest.useFakeTimers()
    mockGetAutoCloseDelay.mockReturnValue(3000)

    const onClose = jest.fn()
    render(
      <PaymentDialog
        to={VALID_XEC_ADDR}
        amount={1}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        dialogOpen
        setDialogOpen={() => {}}
        onClose={onClose}
        paymentId="PIDX"
        autoClose={true}
      />
    )
    await screen.findByTestId('widget-mock')

    act(() => {
      lastWidgetProps.onSuccess({ txid: 'yyy' })
    })

    // Click Close immediately -> cancels timer
    act(() => {
      lastWidgetProps.foot.props.onClick()
    })
    expect(onClose).toHaveBeenCalledTimes(1)

    // Instead of runAllTimers (can loop with MUI), advance far enough
    act(() => { jest.advanceTimersByTime(60_000) })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('timer is cleared on unmount (no auto close after unmount)', async () => {
    jest.useFakeTimers()
    mockGetAutoCloseDelay.mockReturnValue(800)

    const onClose = jest.fn()
    const { unmount } = render(
      <PaymentDialog
        to={VALID_XEC_ADDR}
        amount={1}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        dialogOpen
        setDialogOpen={() => {}}
        onClose={onClose}
        paymentId="PIDU"
        autoClose={true}
      />
    )
    await screen.findByTestId('widget-mock')

    act(() => {
      lastWidgetProps.onSuccess({ txid: 'uuu' })
    })

    unmount()
    act(() => { jest.advanceTimersByTime(10_000) })
    expect(onClose).not.toHaveBeenCalled()
  })
})

// -----------------------------------------------------------------------------
// Prop plumbing sanity
// -----------------------------------------------------------------------------
describe('PaymentDialog — prop plumbing to WidgetContainer', () => {
  test('forwards plumbing props intact', async () => {
    render(
      <PaymentDialog
        to={VALID_BCH_ADDR}
        amount={12.34}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="BCH"
        editable
        goalAmount={100}
        transactionText="Pay now"
        disableAltpayment={false}
        contributionOffset={0.01}
        dialogOpen
        setDialogOpen={() => {}}
        wsBaseUrl="wss://x"
        apiBaseUrl="https://api.x"
        disableSound
      />
    )
    await screen.findByTestId('widget-mock')

    expect(lastWidgetProps.editable).toBe(true)
    expect(lastWidgetProps.goalAmount).toBe(100)
    expect(lastWidgetProps.transactionText).toBe('Pay now')
    expect(lastWidgetProps.disableAltpayment).toBe(false)
    expect(lastWidgetProps.contributionOffset).toBe(0.01)
    expect(lastWidgetProps.wsBaseUrl).toBe('wss://x')
    expect(lastWidgetProps.apiBaseUrl).toBe('https://api.x')
    expect(lastWidgetProps.disableSound).toBe(true)
  })
})

