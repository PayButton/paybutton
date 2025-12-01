// FILE: react/lib/tests/components/PayButton.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PayButton } from '../../components/PayButton'
import { createPayment } from '../../util/api-client'

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getFiatPrice: jest.fn(async () => 100),
  setupChronikWebSocket: jest.fn(() => Promise.resolve(undefined)),
  setupAltpaymentSocket: jest.fn(() => Promise.resolve(undefined)),
}))

jest.mock('../../components/PaymentDialog', () => ({
  PaymentDialog: (props: any) => (
    <div data-testid="payment-dialog">
      <button
        type="button"
        onClick={() =>
          props.setAmount?.((prev: any) =>
            typeof prev === 'number' ? prev + 1 : 1
          )
        }
      >
        mock-change-amount
      </button>
      <button
        type="button"
        onClick={() =>
          props.setConvertedCurrencyObj?.({
            float: 0.12345678,
            string: '0.12345678',
            currency: 'XEC',
          })
        }
      >
        mock-set-converted
      </button>
    </div>
  ),
}))

jest.mock('../../util/api-client', () => ({
  createPayment: jest.fn(async () => 'mock-payment-id'),
}))

describe('PayButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls onOpen when clicked (crypto path, no timers needed)', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()

    // using XEC  will skip waitPrice()
    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={5}
        currency="XEC"
        onOpen={onOpen}
      />
    )

    await user.click(screen.getByRole('button', { name: /donate/i }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('calls onOpen when clicked (USD)', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={5}
        currency="USD"
        onOpen={onOpen}
      />
    )

    // ensure price effect ran (getFiatPrice awaited & setPrice called)
    await waitFor(() => {
      const { getFiatPrice } = require('../../util')
      expect(getFiatPrice).toHaveBeenCalled()
    })

    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1))
  })

  it('creates a payment id exactly once for crypto when dialog opens', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={1}
        currency="XEC"
      />
    )

    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    expect(createPayment).toHaveBeenCalledWith(
      1,
      'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk',
      undefined
    )
  })

  it('creates a payment id exactly once for fiat using converted amount', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={5}
        currency="USD"
      />
    )

    // simulate dialog child computing conversion and updating parent
    await user.click(
      screen.getByRole('button', { name: 'mock-set-converted' })
    )

    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    const [amountUsed, addrUsed] =
      (createPayment as jest.Mock).mock.calls[0]

    expect(addrUsed).toBe(
      'ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk'
    )
    expect(amountUsed).toBeCloseTo(0.12345678, 8)
  })

  it('does not create payment id when disablePaymentId is true', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={10}
        currency="XEC"
        disablePaymentId
      />
    )

    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).not.toHaveBeenCalled()
    })
  })

  it('create payment id when amount is missing', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        currency="XEC"
      />
    )

    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })

  it('creates a new payment id when amount changes while dialog is open (crypto)', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={1}
        currency="XEC"
      />
    )

    // open dialog: first payment id
    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    // change amount via mocked dialog control
    await user.click(
      screen.getByRole('button', { name: 'mock-change-amount' })
    )

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(2)
    })

    const firstCall = (createPayment as jest.Mock).mock.calls[0]
    const secondCall = (createPayment as jest.Mock).mock.calls[1]

    expect(firstCall[0]).toBe(1)
    expect(secondCall[0]).toBe(2)
  })

  it('does not create extra payment ids for repeated renders with same effective amount (crypto)', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={2}
        currency="XEC"
      />
    )

    // open dialog – first id
    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    // clicking the mock-change-amount twice will move from 2 -> 3 -> 4
    await user.click(
      screen.getByRole('button', { name: 'mock-change-amount' })
    )
    await user.click(
      screen.getByRole('button', { name: 'mock-change-amount' })
    )

    await waitFor(() => {
      // 2 (initial) + 3 + 4 = 3 distinct effective amounts => 3 calls total
      expect(createPayment).toHaveBeenCalledTimes(3)
    })

    const calls = (createPayment as jest.Mock).mock.calls.map(
      (c: any[]) => c[0]
    )

    expect(calls).toEqual([2, 3, 4])
  })

  it('prefers convertedCurrencyObj for fiat and does not create extra ids when only base amount changes', async () => {
    const user = userEvent.setup()

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={10}
        currency="USD"
      />
    )

    // simulate conversion done by dialog
    await user.click(
      screen.getByRole('button', { name: 'mock-set-converted' })
    )

    // open dialog (this will use convertedCurrencyObj.float)
    await user.click(screen.getByRole('button', { name: /donate/i }))

    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    const [firstAmount] = (createPayment as jest.Mock).mock.calls[0]
    expect(firstAmount).toBeCloseTo(0.12345678, 8)

    // change the base amount via mocked dialog, convertedCurrencyObj remains the same
    await user.click(
      screen.getByRole('button', { name: 'mock-change-amount' })
    )

    // effectiveAmount is still the converted one, so no extra call should happen
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })


  it('does not regenerate paymentId when amount is undefined across reopen', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()

    // createPayment calls should start at 0 for this test
    expect(createPayment).toHaveBeenCalledTimes(0)

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        currency="XEC"
        onOpen={onOpen}
      />
    )

    // Still 0 right after render, before opening
    expect(createPayment).toHaveBeenCalledTimes(0)

    // First open
    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    // Second open (we don't actually need a close button for the paymentId behavior)
    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })
  it('does not regenerate paymentId when using fixed numeric amount across reopen', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()

    // sanity check — should start at zero
    expect(createPayment).toHaveBeenCalledTimes(0)

    render(
      <PayButton
        to="ecash:qz3wrtmwtuycud3k6w7afkmn3285vw2lfy36y43nvk"
        amount={7}
        currency="XEC"
        onOpen={onOpen}
      />
    )

    // still 0 after mount
    expect(createPayment).toHaveBeenCalledTimes(0)

    // first open
    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    // second open with same amount
    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })

    // third open: still same amount
    await user.click(screen.getByRole('button', { name: /donate/i }))
    await waitFor(() => {
      expect(createPayment).toHaveBeenCalledTimes(1)
    })
  })
})


