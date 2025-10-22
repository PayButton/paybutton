import '@testing-library/jest-dom'
import { render, screen, waitFor, act, cleanup } from '@testing-library/react'
import React from 'react'
import { WidgetContainer } from '../../components/Widget/WidgetContainer'

const VALID_XEC_ADDR = 'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk'
const VALID_BCH_ADDR = 'bitcoincash:qzceyr63927jqsjay83umcf8app7pu90xqegn38rpq'

/** Wrap resolution of pending microtasks/state in act() to silence warnings */
const flushAct = async () => { await act(async () => { await new Promise(r => setTimeout(r, 0)) }) }

// ---------- Global / lib mocks ----------
const mockEnqueue = jest.fn()
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueue }),
  SnackbarProvider: ({ children }: any) => <div data-testid="snackbar-provider">{children}</div>,
}))

// avoid style engine noise
jest.mock('@mui/styles', () => ({ makeStyles: () => () => ({ snackbarContainer: 'stub' }) }))

// capture Widget props on each render
let lastWidgetProps: any = null
jest.mock('../../components/Widget/Widget', () => ({
  __esModule: true,
  default: (props: any) => {
    lastWidgetProps = props
    return <div data-testid="widget" />
  },
}))

// Audio
const playSpy = jest.fn().mockResolvedValue(undefined)
class FakeAudio {
  src?: string
  constructor(_src: string) { this.src = _src }
  play = playSpy
}
;(global as any).Audio = FakeAudio as any

// util mocks
const mockGetFiatPrice = jest.fn()
const mockGeneratePaymentId = jest.fn((n: number) => 'P'.repeat(n))
const mockShouldTriggerOnSuccess = jest.fn()
const mockIsValidCurrency = jest.fn((c: any) => c === 'XEC' || c === 'BCH' || c === 'USD')
const mockIsCrypto = jest.fn((c: any) => c === 'XEC' || c === 'BCH')
jest.mock('../../util', () => {
  const actual = jest.requireActual('../../util')
  return {
    ...actual,
    getFiatPrice: (...args: any[]) => mockGetFiatPrice(...args),
    generatePaymentId: (n: number) => mockGeneratePaymentId(n),
    getCurrencyTypeFromAddress: (addr: string) => (addr === VALID_BCH_ADDR ? 'BCH' : 'XEC'),
    isValidCurrency: (c: any) => mockIsValidCurrency(c),
    isCrypto: (c: any) => mockIsCrypto(c),
    shouldTriggerOnSuccess: (...args: any[]) => mockShouldTriggerOnSuccess(...args),
    isPropsTrue: (v: any) => Boolean(v),
    resolveNumber: (v: any) => Number(v),
    isGreaterThanZero: (n: number) => n > 0,
  }
})

// altpayment client mock
const mockGetPaymentStatus = jest.fn()
jest.mock('../../altpayment', () => ({
  getAltpaymentClient: () => ({ getPaymentStatus: mockGetPaymentStatus }),
}))

beforeEach(() => {
  jest.clearAllMocks()
  lastWidgetProps = null
})
afterEach(() => {
  cleanup()
})

// handy tx object
const makeTx = (amount = 1, confirmed = false) => ({
  txid: 'tx1',
  amount,
  confirmed,
})

// ---------------- Matrix to exercise both coins ----------------
type CoinCase = { label: 'XEC' | 'BCH'; addr: string; currency: 'XEC' | 'BCH' }
const COINS: CoinCase[] = [
  { label: 'XEC', addr: VALID_XEC_ADDR, currency: 'XEC' },
  { label: 'BCH', addr: VALID_BCH_ADDR, currency: 'BCH' },
]

// 1) Currency normalization + forwarding + disabled passthrough
describe.each(COINS)('WidgetContainer — basics (%s)', ({ addr, currency }) => {
  test('forwards props to Widget; correct currency normalization', async () => {
    // give mismatched currency to force normalization for BCH case
    const givenCurrency = currency === 'BCH' ? 'XEC' : 'XEC'
    mockIsCrypto.mockImplementation((c: any) => c === 'XEC' || c === 'BCH')
    mockIsValidCurrency.mockImplementation((c: any) => ['XEC', 'BCH', 'USD'].includes(c))

    render(
      <WidgetContainer
        to={addr}
        amount={2.5}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={givenCurrency}
        disabled={true}
        editable={false}
      />
    )
    expect(await screen.findByTestId('widget')).toBeInTheDocument()

    // currency should be set to address type if mismatched
    const expectedCurrency = addr === VALID_BCH_ADDR ? 'BCH' : 'XEC'
    expect(lastWidgetProps.currency).toBe(expectedCurrency)
    expect(lastWidgetProps.amount).toBe(2.5)
    expect(lastWidgetProps.disabled).toBe(true)
  })
})

// 2) paymentId generation vs passthrough (incl. empty string edge cases)
describe('WidgetContainer — paymentId handling', () => {
  test('generates paymentId if not provided and not disabled', async () => {
    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        disabled={false}
        editable={false}
      />
    )
    await screen.findByTestId('widget')
    expect(mockGeneratePaymentId).toHaveBeenCalledWith(8)
    expect(lastWidgetProps.paymentId).toBe('PPPPPPPP')
  })

  test('passes provided paymentId; no generation when disablePaymentId', async () => {
    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        paymentId="PID-1"
        disablePaymentId
        disabled={false}
        editable={false}
      />
    )
    await screen.findByTestId('widget')
    expect(mockGeneratePaymentId).not.toHaveBeenCalled()
    expect(lastWidgetProps.paymentId).toBe('PID-1')
  })

  test('paymentId="" & disablePaymentId=false → generates new id', async () => {
    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        paymentId=""
        disablePaymentId={false}
        disabled={false}
        editable={false}
      />
    )
    await screen.findByTestId('widget')
    expect(mockGeneratePaymentId).toHaveBeenCalledWith(8)
    expect(lastWidgetProps.paymentId).toBe('PPPPPPPP')
  })

  test('paymentId="" & disablePaymentId=true → keeps empty string', async () => {
    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        paymentId=""
        disablePaymentId
        disabled={false}
        editable={false}
      />
    )
    await screen.findByTestId('widget')
    expect(mockGeneratePaymentId).not.toHaveBeenCalled()
    expect(lastWidgetProps.paymentId).toBe('')
  })
})

// 3) price logic: fetch when price missing/zero; use provided price otherwise
describe('WidgetContainer — price fetching / forwarding', () => {
  test('fetches price + usdPrice quando price é undefined/0', async () => {
    mockGetFiatPrice
      .mockResolvedValueOnce(50) // coin
      .mockResolvedValueOnce(1); // USD

    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        disabled={false}
        editable={false}
      />
    );

    // garante que os efeitos async rodaram e setState ocorreu
    await waitFor(() => {
      expect(mockGetFiatPrice).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(lastWidgetProps.price).toBe(50);
      expect(lastWidgetProps.usdPrice).toBe(1);
    });
  });

  test('uses provided non-zero price and does not fetch', async () => {
    render(
      <WidgetContainer
        to={VALID_XEC_ADDR}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency="XEC"
        price={123}
        disabled={false}
        editable={false}
      />
    )
    await screen.findByTestId('widget')
    // no need to flushAct here; no async fetch path is taken
    expect(lastWidgetProps.price).toBe(123)
    expect(mockGetFiatPrice).not.toHaveBeenCalled()
  })
})

// 4) newTx ingestion → shouldTriggerOnSuccess TRUE → success path with sound + toast
describe.each(COINS)('WidgetContainer — success path (%s)', ({ addr, currency }) => {
  test('success: plays sound (unless disabled), shows success toast (unless hideToasts), sets success=true, clears newTxs', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(true)

    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        successText="Thanks!"
      />
    )
    await screen.findByTestId('widget')

    act(() => {
      lastWidgetProps.setNewTxs([makeTx(1, false)])
    })

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalled()   // success toast
      expect(playSpy).toHaveBeenCalled()       // played sound
      expect(lastWidgetProps.success).toBe(true)
      expect(lastWidgetProps.newTxs).toEqual([]) // cleared
    })
  })

  test('success but hideToasts=true and disableSound=true → no toast, no sound', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(true)
    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        hideToasts
        disableSound
      />
    )
    await screen.findByTestId('widget')
    act(() => { lastWidgetProps.setNewTxs([makeTx(2, false)]) })
    await waitFor(() => {
      expect(lastWidgetProps.success).toBe(true)
    })
    expect(mockEnqueue).not.toHaveBeenCalled()
    expect(playSpy).not.toHaveBeenCalled()
  })

  test('success is also suppressed when sound={false} even if disableSound is false', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(true)
    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        sound={false}
        hideToasts={false}
      />
    )
    await screen.findByTestId('widget')
    act(() => { lastWidgetProps.setNewTxs([makeTx(2, false)]) })
    await waitFor(() => {
      expect(lastWidgetProps.success).toBe(true)
    })
    expect(playSpy).not.toHaveBeenCalled()        // sound prop suppresses
    expect(mockEnqueue).toHaveBeenCalled()        // toast still shown
  })
})

// 5) newTx ingestion → shouldTriggerOnSuccess FALSE → onTransaction + info toast when transactionText set
describe.each(COINS)('WidgetContainer — transaction-only path (%s)', ({ addr, currency }) => {
  test('calls onTransaction and shows info toast when transactionText provided', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(false)
    const onTransaction = jest.fn()

    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        onTransaction={onTransaction}
        transactionText="New tx"
      />
    )
    await screen.findByTestId('widget')

    act(() => {
      lastWidgetProps.setNewTxs([makeTx(3, false)])
    })

    await waitFor(() => {
      expect(onTransaction).toHaveBeenCalledTimes(1)
      expect(mockEnqueue).toHaveBeenCalled() // info toast
      expect(lastWidgetProps.newTxs).toEqual([]) // cleared
    })
  })

  test('does not show info toast when transactionText is absent', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(false)
    const onTransaction = jest.fn()
    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        onTransaction={onTransaction}
      />
    )
    await screen.findByTestId('widget')

    act(() => { lastWidgetProps.setNewTxs([makeTx(1.23, false)]) })

    await waitFor(() => {
      expect(onTransaction).toHaveBeenCalledTimes(1)
    })
    expect(mockEnqueue).not.toHaveBeenCalled()
  })

  test('filters out confirmed or zero-amount txs', async () => {
    mockShouldTriggerOnSuccess.mockReturnValue(false)
    const onTransaction = jest.fn()
    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        onTransaction={onTransaction}
      />
    )
    await screen.findByTestId('widget')

    act(() => {
      lastWidgetProps.setNewTxs([
        makeTx(0, false),   // zero amount -> ignored
        makeTx(1, true),    // confirmed -> ignored
      ])
    })

    // allow effect to run
    await new Promise(r => setTimeout(r, 0))
    expect(onTransaction).not.toHaveBeenCalled()
  })
})

// 6) altpayment shift path: uses client.getPaymentStatus, settled -> success
describe.each(COINS)('WidgetContainer — altpayment shift (%s)', ({ addr, currency }) => {
  test('when altpaymentShift present and status "settled" → plays sound, sets shiftCompleted', async () => {
    mockGetPaymentStatus.mockResolvedValueOnce({ status: 'settled' })
    mockShouldTriggerOnSuccess.mockReturnValue(false) // ignored; shift path short-circuits

    render(
      <WidgetContainer
        to={addr}
        setAmount={() => {}}
        setCurrencyObj={() => {}}
        currency={currency}
        disabled={false}
        editable={false}
        altpaymentShift={{ id: 'shift-1' } as any}
      />
    )
    await screen.findByTestId('widget')

    act(() => {
      lastWidgetProps.setNewTxs([makeTx(1, false)])
    })

    await waitFor(() => {
      expect(mockGetPaymentStatus).toHaveBeenCalledWith('shift-1')
      expect(playSpy).toHaveBeenCalled()
      expect(lastWidgetProps.shiftCompleted).toBe(true)
    })
  })
})

