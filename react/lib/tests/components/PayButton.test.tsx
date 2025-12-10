jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getFiatPrice: jest.fn(async () => 100),
  setupChronikWebSocket: jest.fn(() => Promise.resolve(undefined)),
  setupAltpaymentSocket: jest.fn(() => Promise.resolve(undefined)),
  getAddressBalance: jest.fn(async () => 0),
  createPayment: jest.fn(async () => '00112233445566778899aabbccddeeff'),
}))
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PayButton } from '../../components/PayButton'

const TEST_ADDRESSES = {
  XEC: 'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk',
  BCH: 'bitcoincash:qq7f38meqgctcnywyx74uputa3yuycnv6qr3c6p6rz',
}

const CRYPTO_CASES = [
  { currency: 'XEC', address: TEST_ADDRESSES.XEC },
  { currency: 'BCH', address: TEST_ADDRESSES.BCH },
]

const FIAT_CASES = [
  { currency: 'USD', address: TEST_ADDRESSES.XEC },
  { currency: 'CAD', address: TEST_ADDRESSES.XEC },
]

const ALL_CASES = [...CRYPTO_CASES, ...FIAT_CASES]


const realConsoleError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args.some(a => typeof a === 'string' && a.includes('Error creating payment ID'))) {
      return
    }
    realConsoleError(...args)
  }
})
afterAll(() => {
  console.error = realConsoleError
})


beforeEach(() => {
  jest.clearAllMocks()
})


// ─────────────────────────────────────────────────────────────
// OPENING & onOpen
// ─────────────────────────────────────────────────────────────
describe('PayButton – onOpen behavior', () => {

  test.each(CRYPTO_CASES)(
    'onOpen executes immediately for crypto (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()
      const onOpen = jest.fn()

      render(
        <PayButton
          to={address}
          amount={5}
          currency={currency as any}
          onOpen={onOpen}
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => {
        const { createPayment } = require('../../util');
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
      expect(onOpen).toHaveBeenCalledTimes(1)
    }
  )

  test.each(FIAT_CASES)(
    'onOpen waits for FIAT price before responding (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()
      const onOpen = jest.fn()

      render(
        <PayButton
          to={address}
          amount={5}
          currency={currency as any}
          onOpen={onOpen}
        />
      )
      await user.click(screen.getByRole('button', { name: /donate/i }))
      await user.click(screen.getByRole('button', { name: /donate/i })) // for some reason first click here in the tests is not doing anything.

      expect(onOpen).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(onOpen).toHaveBeenCalledTimes(1)
      }, { timeout: 3000 }) // wIP WTF
      await waitFor(() => {
        const { getFiatPrice } = require('../../util')
        expect(getFiatPrice).toHaveBeenCalledTimes(1)
      })

      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1))
    }
  )
})



// ─────────────────────────────────────────────────────────────
// PAYMENT ID CREATION
// ─────────────────────────────────────────────────────────────
describe('PayButton – Payment ID lifecycle', () => {

  test.each(CRYPTO_CASES)(
    'creates payment ID once for crypto open (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={1}
          currency={currency as any}
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))

      await waitFor(() => {
        const { createPayment } = require('../../util');
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      const { createPayment } = require('../../util');
      expect(createPayment).toHaveBeenCalledWith(1, address, undefined)
    }
  )

  test.each(FIAT_CASES)(
    'payment ID uses converted value for fiat (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={5}
          currency={currency as any}
          editable
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await user.click(screen.getByRole('button', { name: /donate/i })) // for some reason first click here in the tests is not doing anything.

      const { createPayment } = require('../../util');
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))
      const input = await screen.findByLabelText(/edit amount/i)

      // user types something that triggers conversion
      await user.clear(input)
      await user.type(input, '100')
      await user.click(screen.getByRole('button', { name: /confirm/i }))

      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      const [amountUsed] = (createPayment as jest.Mock).mock.calls[0]
      expect(amountUsed).toBeCloseTo(0.05, 8)
      const [secondAmountUsed] = (createPayment as jest.Mock).mock.calls[1]
      expect(secondAmountUsed).toBeCloseTo(1.0000000, 8)
    }
  )

  test.each(ALL_CASES)(
    'no payment ID when disablePaymentId=true (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={10}
          currency={currency as any}
          disablePaymentId
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => {
        const { createPayment } = require('../../util');
        expect(createPayment).not.toHaveBeenCalled()
      })
    }
  )
})



// ─────────────────────────────────────────────────────────────
// REGENERATION RULES
// ─────────────────────────────────────────────────────────────
describe('PayButton – Payment ID regeneration', () => {
  test.each(CRYPTO_CASES)(
    'regenerates only when crypto amount changes while open (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={2}
          currency={currency as any}
          editable
        />
      )

      // open
      await user.click(screen.getByRole('button', { name: /donate/i }))
      const { createPayment } = require('../../util');
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))

      const input = await screen.findByLabelText(/edit amount/i)

      // 2 → 3
      await user.clear(input)
      await user.type(input, '3')
      await user.click(screen.getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      // 3 → 4
      await user.clear(input)
      await user.type(input, '4')
      await user.click(screen.getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(3))

      const calls = (createPayment as jest.Mock).mock.calls.map(c => c[0])
      expect(calls).toEqual([2, 3, 4])
    }
  )

  test.each(FIAT_CASES)(
    'for fiat, raw amount changes also regenerate paymentId (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={50}
          currency={currency as any}
          editable
        />
      )

      // open
      await user.click(screen.getByRole('button', { name: /donate/i }))
      await user.click(screen.getByRole('button', { name: /donate/i })) // for some reason first click here in the tests is not doing anything.
      const { createPayment } = require('../../util');
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))

      const input = await screen.findByLabelText(/edit amount/i)

      // change base amount → SHOULD REGEN
      await user.clear(input)
      await user.type(input, '55')
      await user.click(screen.getByRole('button', { name: /confirm/i }))

      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      // Now converted changes — mock fiat price returns different value
      const { getFiatPrice } = require('../../util')
      getFiatPrice.mockResolvedValueOnce(123) // force new conversion

      await act(async () => {
        // trigger recalculation by modifying the input again
        await user.clear(input)
        await user.type(input, '56')
        await user.click(screen.getByRole('button', { name: /confirm/i }))
      })

      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(3))
    }
  )
})




// ─────────────────────────────────────────────────────────────
// FAILURE BEHAVIOR
// ─────────────────────────────────────────────────────────────
describe('PayButton – failure cases', () => {
  test.each(CRYPTO_CASES)(
    'if createPayment fails, load forever',
    async ({ currency, address }) => {
      const user = userEvent.setup()
      const onOpen = jest.fn()

      const { createPayment } = require('../../util');
      (createPayment as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('server offline')
      })

      render(
        <PayButton
          to={address}
          amount={5}
          currency={currency as any}
          editable
          onOpen={onOpen}
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))

      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(0))

      await expect(screen.findByText(/loading/i)).resolves.toBeDefined()
    }
  )
})
