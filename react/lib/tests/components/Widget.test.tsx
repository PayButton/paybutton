// react/lib/tests/components/Widget.test.tsx
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Widget from '../../components/Widget/Widget'
import { TEST_ADDRESSES } from '../util/constants'
import copyToClipboard from 'copy-to-clipboard'
import type { Currency } from '../../util'

jest.mock('copy-to-clipboard', () => jest.fn())

jest.mock('../../util', () => {
  const real = jest.requireActual('../../util')

  return {
    __esModule: true,
    ...real,
    setupChronikWebSocket: jest.fn().mockResolvedValue(undefined),
    setupAltpaymentSocket: jest.fn().mockResolvedValue(undefined),
    getAddressBalance: jest.fn().mockResolvedValue(0),
    openCashtabPayment: jest.fn(),
  }
})

jest.mock('../../util/api-client', () => ({
  __esModule: true,
  createPayment: jest.fn(),
}))

import { createPayment } from '../../util/api-client'

const CRYPTO_CASES: { label: string; currency: Currency; to: string }[] = [
  { label: 'XEC', currency: 'XEC' as Currency, to: TEST_ADDRESSES.ecash },
  { label: 'BCH', currency: 'BCH' as Currency, to: TEST_ADDRESSES.bitcoincash },
]

const FIAT_CASES: { label: string; currency: Currency; price: number, to: string }[] = [
  { label: 'USD', currency: 'USD' as Currency, price: 10, to: TEST_ADDRESSES.ecash },
  { label: 'CAD', currency: 'CAD' as Currency, price: 20, to: TEST_ADDRESSES.ecash},
]

beforeEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('Widget – standalone paymentId (crypto)', () => {
  test.each(CRYPTO_CASES)(
    '%s – first render triggers createPayment(amount)',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock).mockResolvedValue('pid-crypto-1')
      const setPaymentId = jest.fn()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledWith(5, to, undefined)
      })
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – amount change triggers new paymentId',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock)
        .mockResolvedValueOnce('pid-crypto-1')
        .mockResolvedValueOnce('pid-crypto-2')

      const setPaymentId = jest.fn()

      const { rerender } = render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      rerender(
        <Widget
          to={to}
          amount={8}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(2)
      })
      expect((createPayment as jest.Mock).mock.calls[1][0]).toBe(8)
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – same amount across rerender does NOT regenerate',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock).mockResolvedValue('pid-crypto')

      const setPaymentId = jest.fn()

      const { rerender } = render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      rerender(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      // still only the first call
      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – no paymentId when disablePaymentId=true',
    async ({ currency, to }) => {
      const setPaymentId = jest.fn()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          disablePaymentId={true}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).not.toHaveBeenCalled()
      })
      expect(setPaymentId).not.toHaveBeenCalled()
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – no paymentId when isChild=true',
    async ({ currency, to }) => {
      const setPaymentId = jest.fn()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          isChild={true}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).not.toHaveBeenCalled()
      })
      expect(setPaymentId).not.toHaveBeenCalled()
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – undefined amount passes undefined to createPayment',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock).mockResolvedValue('pid-crypto-undef')
      const setPaymentId = jest.fn()

      render(
        <Widget
          to={to}
          currency={currency}
          price={0}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
      expect(createPayment).toHaveBeenCalledWith(undefined, to, undefined)
    }
  )
})

describe('Widget – standalone paymentId (fiat)', () => {
  test.each(FIAT_CASES)(
    '%s – uses internal conversion (amount / price) for paymentId',
    async ({ currency, price }) => {
      ;(createPayment as jest.Mock).mockResolvedValue('pid-fiat-1')
      const setPaymentId = jest.fn()
      const amount = 50

      const to = TEST_ADDRESSES.ecash

      render(
        <Widget
          to={to}
          amount={amount}
          currency={currency}
          price={price}
          setPaymentId={setPaymentId}
        />
      )

      const expectedCrypto = amount / price

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledWith(expectedCrypto, to, undefined)
      })
    }
  )

  test.each(FIAT_CASES)(
    '%s – new converted amount regenerates paymentId',
    async ({ currency, price }) => {
      ;(createPayment as jest.Mock)
        .mockResolvedValueOnce('pid-fiat-1')
        .mockResolvedValueOnce('pid-fiat-2')

      const setPaymentId = jest.fn()
      const to = TEST_ADDRESSES.ecash

      const { rerender } = render(
        <Widget
          to={to}
          amount={50}
          currency={currency}
          price={price}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      rerender(
        <Widget
          to={to}
          amount={90}
          currency={currency}
          price={price}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(2)
      })

      const lastCall = (createPayment as jest.Mock).mock.calls[1]
      expect(lastCall[0]).toBe(90 / price)
      expect(lastCall[1]).toBe(to)
    }
  )
})

describe('Widget – editable amount input (crypto)', () => {
  test.each(CRYPTO_CASES)(
    '%s – editing amount to a new value regenerates paymentId',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock)
        .mockResolvedValueOnce('pid-edit-1')
        .mockResolvedValueOnce('pid-edit-2')

      const setPaymentId = jest.fn()
      const user = userEvent.setup()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          editable={true}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      const input = screen.getByLabelText(/edit amount/i)

      await user.clear(input)
      await user.type(input, '8')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(2)
      })

      const lastCall = (createPayment as jest.Mock).mock.calls[1]
      expect(lastCall[0]).toBe(8)
      expect(lastCall[1]).toBe(to)
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – editing amount to SAME value does NOT regenerate paymentId',
    async ({ currency, to }) => {
      ;(createPayment as jest.Mock).mockResolvedValue('pid-edit-same')

      const setPaymentId = jest.fn()
      const user = userEvent.setup()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          price={0}
          editable={true}
          setPaymentId={setPaymentId}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      const input = screen.getByLabelText(/edit amount/i)

      await user.clear(input)
      await user.type(input, '5')
      await user.keyboard('{Enter}')

      // applyDraftAmount should not fire (isSameAmount=true), so no new call
      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
    }
  )
})

import { act } from 'react-dom/test-utils'

describe('Widget – QR copy interaction', () => {
  test.each([...CRYPTO_CASES, ...FIAT_CASES])(
    'clicking QR copies full URL for %s address',
    async ({ currency, to, label }) => {

      await act(async () => {
        ;(createPayment as jest.Mock).mockResolvedValue(`pid-qr-${label}`)
        ;(copyToClipboard as jest.Mock).mockReturnValue(true)

        const setPaymentId = jest.fn()

        render(
          <Widget
            to={to}
            amount={10}
            currency={currency}
            price={0}
            setPaymentId={setPaymentId}
          />
        )
      })

      const user = userEvent.setup()
      await waitFor(() => {
        expect(screen.queryByText(/Click to copy/i)).toBeTruthy()
      })

      const qrBox = screen.getByTestId('qr-click-area')
      await user.click(qrBox)

      expect(copyToClipboard).toHaveBeenCalledTimes(1)
      const copied = (copyToClipboard as jest.Mock).mock.calls[0][0] as string

      if (currency === 'XEC') {
        expect(copied).toContain('ecash:')
      } else if (currency === 'BCH') {
        expect(copied).toContain('bitcoincash:')
      }
    }
  )
})

