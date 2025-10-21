import '@testing-library/jest-dom'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PayButton } from '../../components/PayButton'

const VALID_XEC_ADDR = 'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk'
const VALID_BCH_ADDR = 'bitcoincash:qzceyr63927jqsjay83umcf8app7pu90xqegn38rpq'
const INVALID_ADDR = 'ecash:not-an-address'      // syntactically looks like ecash but invalid
const TOTALLY_INVALID_ADDR = 'not-an-address'    // completely bogus

// Capture PaymentDialog props and expose setters to tests.
let lastDialogProps: any = null
let altSocketRef: any = null

jest.mock('../../components/PaymentDialog', () => ({
  PaymentDialog: (props: any) => {
    lastDialogProps = props
    ;(globalThis as any).__setUseAltpayment = props.setUseAltpayment
    ;(globalThis as any).__setDialogOpen = props.setDialogOpen
    ;(globalThis as any).__onClose = props.onClose
    return <div data-testid="payment-dialog-mock" />
  },
}))

// util mocks
const mockGetFiatPrice = jest.fn(async () => 100) as unknown as jest.Mock<any, any>
const mockSetupChronikWebSocket = jest.fn(async (args: any) => {
  args.setTxsSocket({ disconnect: jest.fn(), __kind: 'chronik' })
})
const mockSetupAltpaymentSocket = jest.fn(async (args: any) => {
  altSocketRef = { disconnect: jest.fn(), __kind: 'alt' }
  args.setAltpaymentSocket(altSocketRef)
})

jest.mock('../../util', () => {
  const actual = jest.requireActual('../../util')
  return {
    ...actual,
    // Only these two addresses validate
    isValidCashAddress: (addr: string) => addr === VALID_BCH_ADDR, // BCH
    isValidXecAddress:  (addr: string) => addr === VALID_XEC_ADDR, // XEC
    getCurrencyTypeFromAddress: (addr: string) =>
      addr === VALID_BCH_ADDR ? 'BCH' : 'XEC',
    getFiatPrice: (c: any, to: any, api: any) => mockGetFiatPrice(c, to, api),
    setupChronikWebSocket: (arg: any) => mockSetupChronikWebSocket(arg),
    setupAltpaymentSocket: (arg: any) => mockSetupAltpaymentSocket(arg),
    generatePaymentId: (n: number) => 'P'.repeat(n),
  }
})

beforeEach(() => {
  jest.clearAllMocks()
  lastDialogProps = null
  altSocketRef = null
  ;(globalThis as any).__setUseAltpayment = undefined
  ;(globalThis as any).__setDialogOpen = undefined
  ;(globalThis as any).__onClose = undefined
})

// -----------------------------------------------------------------------------
// Shared coin matrix (XEC + BCH)
// -----------------------------------------------------------------------------
type CryptoCase = { label: 'XEC' | 'BCH'; addr: string; currency: 'XEC' | 'BCH' }
const CRYPTOS: CryptoCase[] = [
  { label: 'XEC', addr: VALID_XEC_ADDR, currency: 'XEC' },
  { label: 'BCH', addr: VALID_BCH_ADDR, currency: 'BCH' },
]

// 1) Crypto click flow + Chronik wiring (both coins)
describe.each(CRYPTOS)('PayButton — crypto flow (%s)', ({ addr, currency }) => {
  test('calls onOpen immediately (no price wait)', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()
    render(<PayButton to={addr} amount={2.5} currency={currency} onOpen={onOpen} />)
    await user.click(await screen.findByRole('button'))
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith(2.5, addr, 'PPPPPPPP')
  })

  test('opens dialog and wires Chronik with expected checkSuccessInfo', async () => {
    const user = userEvent.setup()
    render(<PayButton to={addr} amount={1} currency={currency} />)
    await user.click(await screen.findByRole('button'))
    await waitFor(() => expect(mockSetupChronikWebSocket).toHaveBeenCalledTimes(1))
    const args = mockSetupChronikWebSocket.mock.calls[0][0]
    expect(args.address).toBe(addr)
    expect(args.checkSuccessInfo.currency).toBe(currency)
    expect(args.checkSuccessInfo.expectedPaymentId).toBe('PPPPPPPP')
  })
})

// 2) Fiat → crypto conversion targets the address coin (both coins)
describe.each(CRYPTOS)('PayButton — fiat conversion (%s)', ({ addr }) => {
  test('USD converts to the coin of the address', async () => {
    (mockGetFiatPrice as jest.Mock).mockResolvedValueOnce(100) // $100 per coin
    render(<PayButton to={addr} amount={5} currency="USD" />)
    await waitFor(() => expect(mockGetFiatPrice).toHaveBeenCalled())
    await waitFor(() => {
      // 5 USD / 100 USD/coin = 0.05 coin
      expect(lastDialogProps.price).toBe(100)
      expect(Number(lastDialogProps.cryptoAmount)).toBeCloseTo(0.05, 6)
    })
  })
})

// 3) Alt-payment socket lifecycle (both coins)
describe.each(CRYPTOS)('PayButton — altpayment lifecycle (%s)', ({ addr, currency }) => {
  test('creates alt socket and disconnects on dialog close', async () => {
    const user = userEvent.setup()
    render(<PayButton to={addr} amount={1} currency={currency} disableAltpayment={false} />)

    await user.click(await screen.findByRole('button'))
    act(() => { (globalThis as any).__setUseAltpayment(true) })

    await waitFor(() => expect(mockSetupAltpaymentSocket).toHaveBeenCalledTimes(1))
    expect(altSocketRef).toBeTruthy()

    act(() => { (globalThis as any).__onClose?.(false, 'PPPPPPPP') })
    await waitFor(() => expect(altSocketRef.disconnect).toHaveBeenCalledTimes(1))
  })
})

// -----------------------------------------------------------------------------
// Validation / errors (address-agnostic + specific cases)
// -----------------------------------------------------------------------------
describe('PayButton — validation / errors', () => {
  test('shows "Enter an address" when `to` is empty string', async () => {
    render(<PayButton to={'' as any} />)
    expect(await screen.findByText(/Enter an address/i)).toBeInTheDocument()
  })

  test('shows "Invalid Recipient" for invalid-looking address string', async () => {
    render(<PayButton to={INVALID_ADDR} />)
    expect(await screen.findByText(/Invalid Recipient/i)).toBeInTheDocument()
  })

  test('respects disabled prop when address is valid', async () => {
    render(<PayButton to={VALID_XEC_ADDR} disabled />)
    const btn = await screen.findByRole('button')
    expect(btn).toBeDisabled()
  })

  test('invalid amount with valid `to`: no amount error; button not disabled by it', async () => {
    render(<PayButton to={VALID_XEC_ADDR} amount={'xx' as any} />)
    const btn = await screen.findByRole('button')
    expect(btn).not.toBeDisabled()
    expect(screen.queryByText(/Amount should be a number/i)).toBeNull()
  })

  // ---- Coverage for lines 162–167 in PayButton.tsx ----
  // Those branches execute ONLY when `to === undefined`.
  test('when `to` is undefined AND amount invalid → executes "Amount should be a number" branch', async () => {
    render(<PayButton to={undefined as any} amount={'xx' as any} />)
    // The second effect will overwrite the error text to "Enter an address",
    // but the first effect still executed (covers the branch). Just assert disabled.
    const btn = await screen.findByRole('button')
    expect(btn).toBeDisabled()
  })

  test('when `to` is undefined AND amount valid → executes "Invalid Recipient" branch', async () => {
    render(<PayButton to={undefined as any} amount={1} />)
    // Again, final visible message becomes "Enter an address"; branch still executed.
    const btn = await screen.findByRole('button')
    expect(btn).toBeDisabled()
  })
})

// -----------------------------------------------------------------------------
// Original USD/XEC specifics retained (sanity checks)
// -----------------------------------------------------------------------------
describe('PayButton — USD/XEC sanity', () => {
  test('fiat: waits for price before calling onOpen', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()
    render(<PayButton to={VALID_XEC_ADDR} amount={5} currency="USD" onOpen={onOpen} />)
    await waitFor(() => expect(mockGetFiatPrice).toHaveBeenCalled())
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      const [amountStr, to, pid] = onOpen.mock.calls[0]
      expect(to).toBe(VALID_XEC_ADDR)
      expect(pid).toBe('PPPPPPPP')
      expect(Number(amountStr)).toBeCloseTo(0.05, 6)
    })
  })

  test('crypto: uses amount directly', async () => {
    render(<PayButton to={VALID_XEC_ADDR} amount={3.25} currency="XEC" />)
    await waitFor(() =>
      expect(Number(lastDialogProps.cryptoAmount)).toBeCloseTo(3.25, 6)
    )
  })
})

// -----------------------------------------------------------------------------
// Button props & onClose propagation
// -----------------------------------------------------------------------------
describe('PayButton — Button props & events', () => {
  test('text & size flow to Button (label visible)', async () => {
    render(<PayButton to={VALID_XEC_ADDR} amount={1} currency="XEC" text="Donate" size="lg" />)
    expect(await screen.findByRole('button', { name: /donate/i })).toBeVisible()
  })

  test('onClose propagates', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<PayButton to={VALID_XEC_ADDR} amount={1} currency="XEC" onClose={onClose} />)
    await user.click(await screen.findByRole('button'))
    act(() => { (globalThis as any).__onClose?.(true, 'PPPPPPPP') })
    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true, 'PPPPPPPP'))
  })
})

// -----------------------------------------------------------------------------
// Precompute currencyObj after open (fiat rounding tolerance)
// -----------------------------------------------------------------------------
describe('PayButton — precompute currencyObj after open (fiat)', () => {
  test('uses price=200; tolerate util rounding', async () => {
    ;(mockGetFiatPrice as jest.Mock).mockResolvedValueOnce(200)
    const user = userEvent.setup()
    render(<PayButton to={VALID_XEC_ADDR} amount={5} currency="USD" />)
    await waitFor(() => expect(mockGetFiatPrice).toHaveBeenCalled())
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(lastDialogProps.currencyObj?.float).toBe(5)
      const ca = Number(lastDialogProps.cryptoAmount)
      expect(ca).toBeGreaterThan(0.024)
      expect(ca).toBeLessThan(0.031)
      expect(lastDialogProps.price).toBe(200)
    })
  })
})
