// lib/tests/components/Widget.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '../../components/Widget/Widget'

jest.mock('copy-to-clipboard', () => jest.fn())

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  // network / balance
  getAddressBalance: jest.fn().mockResolvedValue(0),
  // address / currency helpers
  isFiat: jest.fn((c: string) => ['USD', 'CAD', 'EUR'].includes(c)),
  isValidCashAddress: jest.fn().mockReturnValue(false),
  isValidXecAddress: jest.fn().mockReturnValue(true),
  getCurrencyTypeFromAddress: jest.fn().mockReturnValue('XEC'),
  CURRENCY_PREFIXES_MAP: {
    xec: 'ecash',
    bch: 'bitcoincash',
  },
  CRYPTO_CURRENCIES: ['xec', 'bch'],
  DECIMALS: {
    XEC: 2,
    BCH: 8,
    USD: 2,
    CAD: 2,
  },
  // cashtab / sockets
  openCashtabPayment: jest.fn(),
  initializeCashtabStatus: jest.fn().mockResolvedValue(false),
  setupChronikWebSocket: jest.fn().mockResolvedValue(undefined),
  setupAltpaymentSocket: jest.fn().mockResolvedValue(undefined),
  // misc helpers
  getCurrencyObject: jest.fn((amount: number, currency: string) => ({
    float: Number(amount),
    string: String(amount),
    currency,
  })),
  formatPrice: jest.fn((value: number, currency: string) => `${value} ${currency}`),
  encodeOpReturnProps: jest.fn(() => 'deadbeef'),
  isPropsTrue: (v: unknown) => Boolean(v),
  DEFAULT_DONATION_RATE: 0,
  DEFAULT_MINIMUM_DONATION_AMOUNT: {
    XEC: 10,
    BCH: 0.0001,
  },
}))

jest.mock('../../util/api-client', () => ({
  __esModule: true,
  createPayment: jest.fn(),
}))

import copyToClipboard from 'copy-to-clipboard'
import { createPayment } from '../../util/api-client'

const ADDRESS = 'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk'
const API_BASE_URL = 'https://api.example.com'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Widget – paymentId creation (standalone)', () => {
  test('creates paymentId once on initial render when standalone', async () => {
    ;(createPayment as jest.Mock).mockResolvedValue('pid-1')
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    expect(createPayment).toHaveBeenCalledWith(undefined, ADDRESS, API_BASE_URL)
    expect(setPaymentId).toHaveBeenCalledWith('pid-1')
  })

  test('does not create paymentId when isChild is true', async () => {
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        isChild={true}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).not.toHaveBeenCalled()
    })
    expect(setPaymentId).not.toHaveBeenCalled()
  })

  test('does not create paymentId when disablePaymentId is true', async () => {
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        disablePaymentId={true}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).not.toHaveBeenCalled()
    })
    expect(setPaymentId).not.toHaveBeenCalled()
  })

  test('creates paymentId with undefined amount when amount is not provided', async () => {
    ;(createPayment as jest.Mock).mockResolvedValue('pid-2')
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    expect(createPayment).toHaveBeenCalledWith(undefined, ADDRESS, API_BASE_URL)
  })

  test('creates paymentId with numeric amount when amount is given', async () => {
    ;(createPayment as jest.Mock).mockResolvedValue('pid-3')
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        amount={10}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    expect(createPayment).toHaveBeenCalledWith(10, ADDRESS, API_BASE_URL)
  })

  test('creates new paymentId if amount changes to a different value', async () => {
    ;(createPayment as jest.Mock)
      .mockResolvedValueOnce('pid-1')
      .mockResolvedValueOnce('pid-2')

    const setPaymentId = jest.fn()

    const { rerender } = render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        amount={5}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
    expect(createPayment).toHaveBeenLastCalledWith(5, ADDRESS, API_BASE_URL)

    rerender(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        amount={10}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(2)
    })
    expect(createPayment).toHaveBeenLastCalledWith(10, ADDRESS, API_BASE_URL)
  })

  test('does not create new paymentId if amount changes to the same effective value', async () => {
    ;(createPayment as jest.Mock).mockResolvedValue('pid-1')
    const setPaymentId = jest.fn()

    const { rerender } = render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        amount={5}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    rerender(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        amount={5}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      // still only the first call
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Widget – QR copy behaviour', () => {
  test('clicking QR copies payment URL and triggers feedback behaviour', async () => {
    const setPaymentId = jest.fn()

    render(
      <Widget
        to={ADDRESS}
        success={false}
        disabled={false}
        setPaymentId={setPaymentId}
        apiBaseUrl={API_BASE_URL}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText(/click to copy/i)).toBeTruthy()
    })

    const user = userEvent.setup()
    await user.click(screen.getByText(/click to copy/i))

    expect(copyToClipboard).toHaveBeenCalledTimes(1)
    expect((copyToClipboard as jest.Mock).mock.calls[0][0]).toContain('ecash:')
  })
})

