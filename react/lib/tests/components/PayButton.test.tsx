import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PayButton } from '../../components/PayButton'

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getFiatPrice: jest.fn(async () => 100),
  setupChronikWebSocket: jest.fn(() => Promise.resolve(undefined)),
  setupAltpaymentSocket: jest.fn(() => Promise.resolve(undefined)),
}))

describe('PayButton', () => {
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

    await user.click(await screen.findByRole('button'))
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
})
