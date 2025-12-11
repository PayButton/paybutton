jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getFiatPrice: jest.fn(async () => 100),
  setupChronikWebSocket: jest.fn(() => Promise.resolve(undefined)),
  setupAltpaymentSocket: jest.fn(() => Promise.resolve(undefined)),
  getAddressBalance: jest.fn(async () => 0),
  createPayment: jest.fn(async () => '00112233445566778899aabbccddeeff'),
}))
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, 'data-testid': tid, imageSettings, fgColor, ...rest }: any) =>
    require('react').createElement(
      'svg',
      { 'data-testid': tid, 'data-value': value, ...rest },
      null
    ),
}));

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
    'onOpen opens with updated paymentId & amount after editing amount (crypto)',
    async ({ currency, address }) => {
      const user = userEvent.setup()
      const onOpen = jest.fn()

      render(
        <PayButton
          to={address}
          amount={17}
          currency={currency as any}
          editable={true}
          onOpen={onOpen}
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))

      const { createPayment } = require('../../util');
      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
      expect(createPayment).toHaveBeenCalledWith(17, address, undefined);
      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
      (createPayment as jest.Mock).mockResolvedValueOnce('11112233445566778899aabbccddeeff')

      const input = await screen.findByLabelText(/edit amount/i)
      await user.clear(input)
      await user.type(input, '100')
      await user.click(screen.getByRole('button', { name: /confirm/i }))
      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(2)
      })
      const backdrop = document.querySelector('.MuiBackdrop-root')!;
      await user.click(backdrop);
      await waitFor(() =>
        expect(screen.queryByText(/send with.*wallet/i)).toBeNull()
      );

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(2))

      const firstCallArgs = (onOpen as jest.Mock).mock.calls[0]
      const secondCallArgs = (onOpen as jest.Mock).mock.calls[1]
      expect(firstCallArgs[0]).toBeCloseTo(17, 8)
      expect(firstCallArgs[1]).toBe(address)
      expect(firstCallArgs[2]).toBe('00112233445566778899aabbccddeeff')
      expect(Number(secondCallArgs[0])).toBeCloseTo(100.00000000, 8)
      expect(secondCallArgs[1]).toBe(address)
      expect(secondCallArgs[2]).toBe('11112233445566778899aabbccddeeff')

    }
  )

  test.each(FIAT_CASES)(
    'onOpen opens with updated paymentId & amount after editing amount (fiat)',
    async ({ currency, address }) => {
      const user = userEvent.setup()
      const onOpen = jest.fn()

      render(
        <PayButton
          to={address}
          amount={1000}
          currency={currency as any}
          editable
          onOpen={onOpen}
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await user.click(screen.getByRole('button', { name: /donate/i })) // for some reason first click here in the tests is not doing anything.

      const { createPayment } = require('../../util');
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1))
      const input = await screen.findByLabelText(/edit amount/i);

      (createPayment as jest.Mock).mockResolvedValueOnce('11112233445566778899aabbccddeeff')
      // user types something that triggers conversion
      await user.clear(input)
      await user.type(input, '100')
      await user.click(screen.getByRole('button', { name: /confirm/i }))

      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      const backdrop = document.querySelector('.MuiBackdrop-root')!;
      await user.click(backdrop);
      await waitFor(() =>
        expect(screen.queryByText(/send with xec wallet/i)).toBeNull()
      );

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(2))

      const firstCallArgs = (onOpen as jest.Mock).mock.calls[0]
      const secondCallArgs = (onOpen as jest.Mock).mock.calls[1]
      expect(Number(firstCallArgs[0])).toBeCloseTo(10, 8)
      expect(firstCallArgs[1]).toBe(address)
      expect(firstCallArgs[2]).toBe('00112233445566778899aabbccddeeff')
      expect(Number(secondCallArgs[0])).toBeCloseTo(1.0000000, 8)
      expect(secondCallArgs[1]).toBe(address)
      expect(secondCallArgs[2]).toBe('11112233445566778899aabbccddeeff')
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


describe('PayButton – UI shows updated amount + QR after reopen', () => {
  test.each(CRYPTO_CASES)(
    'reopens using latest amount and paymentId (crypto) (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={10}
          currency={currency as any}
          editable
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      const { createPayment } = require('../../util')
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))

      const input = await screen.findByLabelText(/edit amount/i)
      ;(createPayment as jest.Mock).mockResolvedValueOnce('ffff2233445566778899aabbccddeeff')

      await user.clear(input)
      await user.type(input, '1789')
      await user.click(screen.getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      const backdrop = document.querySelector('.MuiBackdrop-root')!
        await user.click(backdrop)
      await waitFor(() =>
        expect(screen.queryByText(/send with/i)).toBeNull()
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      await expect(screen.findByText(/1,789/)).resolves.toBeDefined()

      const qr = screen.getByTestId('qr-code')
      expect(qr.getAttribute('data-value')).toBe(`${address}?amount=1789&op_return_raw=0450415900000010ffff2233445566778899aabbccddeeff`);
    }
  )
  test.each(FIAT_CASES)(
    'reopens using latest amount and paymentId (fiat) (%s)',
    async ({ currency, address }) => {
      const user = userEvent.setup()

      render(
        <PayButton
          to={address}
          amount={10}
          currency={currency as any}
          editable
        />
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await user.click(screen.getByRole('button', { name: /donate/i }))
      const { createPayment } = require('../../util')
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(1))

      const input = await screen.findByLabelText(/edit amount/i)
      ;(createPayment as jest.Mock).mockResolvedValueOnce('ffff2233445566778899aabbccddeeff')

      await user.clear(input)
      await user.type(input, '1789')
      await user.click(screen.getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      const backdrop = document.querySelector('.MuiBackdrop-root')!
        await user.click(backdrop)
      await waitFor(() =>
        expect(screen.queryByText(/send with/i)).toBeNull()
      )

      await user.click(screen.getByRole('button', { name: /donate/i }))
      await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2))

      await expect(screen.findByText(/17.89/)).resolves.toBeDefined()

      const qr = screen.getByTestId('qr-code')
      expect(qr.getAttribute('data-value')).toBe('ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk?amount=17.89&op_return_raw=0450415900000010ffff2233445566778899aabbccddeeff');
    }
  )
})

