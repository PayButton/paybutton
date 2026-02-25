// react/lib/tests/components/Widget.test.tsx
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { act } from 'react'
import userEvent from '@testing-library/user-event'
import { WidgetContainer as Widget } from '../../components/Widget/WidgetContainer'
import { TEST_ADDRESSES } from '../util/constants'
import copyToClipboard from 'copy-to-clipboard'
import type { Currency, Transaction } from '../../util'
import { isFiat } from '../../util';
import config from '../../paybutton-config.json'

jest.mock('copy-to-clipboard', () => jest.fn())

jest.mock('../../util', () => {
  const real = jest.requireActual('../../util')

  return {
    __esModule: true,
    ...real,
    getFiatPrice: jest.fn(async (currency:  string, to: string) => {
      if (isFiat(currency)) {
        return 100
      }
      return null
    }),
    setupChronikWebSocket: jest.fn().mockResolvedValue(undefined),
    setupAltpaymentSocket: jest.fn().mockResolvedValue(undefined),
    getAddressBalance: jest.fn().mockResolvedValue(0),
    openCashtabPayment: jest.fn(),
    createPayment: jest.fn(async () => '00112233445566778899aabbccddeeff'),
  }
})


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
      const { createPayment } = require('../../util');
      (createPayment as jest.Mock).mockResolvedValue('pid-crypto-1')

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledWith(5, to, config.apiBaseUrl)
      })
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – amount change triggers new paymentId',
    async ({ currency, to }) => {
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock)
        .mockResolvedValueOnce('pid-crypto-1')
        .mockResolvedValueOnce('pid-crypto-2')


      const { rerender } = render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
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
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock).mockResolvedValue('pid-crypto')


      const { rerender } = render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
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

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          disablePaymentId={true}
        />
      )

      // WIP wait for loading to go away
      const { createPayment } = require('../../util');
      await waitFor(() => {
        expect(createPayment).not.toHaveBeenCalled()
      })
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – no paymentId when isChild=true',
    async ({ currency, to }) => {

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          isChild={true}
        />
      )

      // WIP wait for loading to go away
      const { createPayment } = require('../../util');
      await waitFor(() => {
        expect(createPayment).not.toHaveBeenCalled()
      })
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – undefined amount passes undefined to createPayment',
    async ({ currency, to }) => {
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock).mockResolvedValue('pid-crypto-undef')

      render(
        <Widget
          to={to}
          currency={currency}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })
      expect(createPayment).toHaveBeenCalledWith(undefined, to, config.apiBaseUrl)
    }
  )
})

describe('Widget – standalone paymentId (fiat)', () => {
  test.each(FIAT_CASES)(
    '%s – uses internal conversion (amount / price) for paymentId',
    async ({ currency, price }) => {
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock).mockResolvedValue('pid-fiat-1')
      const amount = 50

      const to = TEST_ADDRESSES.ecash

      render(
        <Widget
          to={to}
          amount={amount}
          currency={currency}
          price={price}
        />
      )

      const expectedCrypto = amount / price

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledWith(expectedCrypto, to, config.apiBaseUrl)
      })
    }
  )

  test.each(FIAT_CASES)(
    '%s – new converted amount regenerates paymentId',
    async ({ currency, price }) => {
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock)
        .mockResolvedValueOnce('pid-fiat-1')
        .mockResolvedValueOnce('pid-fiat-2')

      const to = TEST_ADDRESSES.ecash

      const { rerender } = render(
        <Widget
          to={to}
          amount={50}
          currency={currency}
          price={price}
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
      const { createPayment } = require('../../util');

      const user = userEvent.setup()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          editable={true}
        />
      )

      await waitFor(() => {
        expect(createPayment).toHaveBeenCalledTimes(1)
      })

      ;(createPayment as jest.Mock).mockResolvedValueOnce('aa112233445566778899aabbccddeeff')
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
      const { createPayment } = require('../../util');
      ;(createPayment as jest.Mock).mockResolvedValue('pid-edit-same')

      const user = userEvent.setup()

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          editable={true}
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

describe('Widget – QR copy interaction', () => {
  test.each([...CRYPTO_CASES, ...FIAT_CASES])(
    'clicking QR copies full URL for %s address',
    async ({ currency, to, label }) => {

      await act(async () => {
        const { createPayment } = require('../../util');
        ;(createPayment as jest.Mock).mockResolvedValue(`pid-qr-${label}`)
        ;(copyToClipboard as jest.Mock).mockReturnValue(true)


        render(
          <Widget
            to={to}
            amount={10}
            currency={currency}
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

describe('Widget – loading behaviour (WIP)', () => {
  const CASES = [...CRYPTO_CASES, ...FIAT_CASES]

  const WITH_AMOUNTS = CASES.flatMap(base => [
    { ...base, amount: 3 },
    { ...base, amount: undefined },
  ])

  test.each(WITH_AMOUNTS)(
    'handleQrCodeClick does nothing while component is loading (%s, amount=%s)',
    async ({ currency, to, amount }) => {
      const { createPayment } = require('../../util')
      ;(createPayment as jest.Mock).mockImplementation(
        () =>
        new Promise(resolve =>
          setTimeout(() => resolve('some-payment-id'), 1000),
        ),
    )

    render(<Widget to={to} amount={amount} currency={currency} />)

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeTruthy()
    })

    const qr = await screen.findByTestId('qr-click-area')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeTruthy()
    })

    expect(copyToClipboard).not.toHaveBeenCalled()
    await user.click(qr)
    expect(copyToClipboard).not.toHaveBeenCalled()
  },
)

  test.each(WITH_AMOUNTS)(
  'widget button is disabled while component is loading', async ({ currency, to, amount }) => {
    const { createPayment } = require('../../util');
    ;(createPayment as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve('some-payment-id'), 1000)),
    )

    render(
      <Widget
        to={to}
        currency={currency}
        amount={amount}
      />,
    )

    await waitFor(() => expect(screen.getByText(/loading/i)).toBeTruthy())

    const btn = screen.getByRole('button', { name: /send with.*wallet/i })

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeTruthy()
    })

    expect(btn.hasAttribute('disabled')).toBeTruthy()
  })
})

describe('Widget – hideSendButton', () => {
  test.each(CRYPTO_CASES)(
    '%s – send button is hidden when hideSendButton=true',
    async ({ currency, to }) => {
      const { createPayment } = require('../../util');
      (createPayment as jest.Mock).mockResolvedValue('pid-hide-test')

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          hideSendButton={true}
        />
      )

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).toBeNull()
      })

      // The send button should not be present
      const sendButton = screen.queryByRole('button', { name: /send with.*wallet/i })
      expect(sendButton).toBeNull()
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – send button is visible when hideSendButton=false',
    async ({ currency, to }) => {
      const { createPayment } = require('../../util');
      (createPayment as jest.Mock).mockResolvedValue('pid-show-test')

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
          hideSendButton={false}
        />
      )

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).toBeNull()
      })

      // The send button should be present
      const sendButton = await screen.findByRole('button', { name: /send with.*wallet/i })
      expect(sendButton).toBeTruthy()
    }
  )

  test.each(CRYPTO_CASES)(
    '%s – send button is visible by default (hideSendButton undefined)',
    async ({ currency, to }) => {
      const { createPayment } = require('../../util');
      (createPayment as jest.Mock).mockResolvedValue('pid-default-test')

      render(
        <Widget
          to={to}
          amount={5}
          currency={currency}
        />
      )

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).toBeNull()
      })

      // The send button should be present by default
      const sendButton = await screen.findByRole('button', { name: /send with.*wallet/i })
      expect(sendButton).toBeTruthy()
    }
  )
})

describe('Widget – payment finalization states', () => {
  test('XEC shows pending spinner on detection and runs success on finalization', async () => {
    const onSuccess = jest.fn()
    const onTransaction = jest.fn()
    const setNewTxs = jest.fn()

    const xecMempoolTx: Transaction = {
      hash: 'xec-mempool-hash',
      amount: '1',
      paymentId: '',
      message: '',
      rawMessage: '',
      timestamp: 1,
      address: TEST_ADDRESSES.ecash,
      confirmed: false,
      txStatus: 'mempool',
    }

    const xecFinalizedTx: Transaction = {
      ...xecMempoolTx,
      hash: 'xec-finalized-hash',
      confirmed: true,
      txStatus: 'finalized',
    }

    const { rerender } = render(
      <Widget
        to={TEST_ADDRESSES.ecash}
        currency={'XEC'}
        disablePaymentId={true}
        sound={false}
        onSuccess={onSuccess}
        onTransaction={onTransaction}
        setNewTxs={setNewTxs}
      />
    )

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    rerender(
      <Widget
        to={TEST_ADDRESSES.ecash}
        currency={'XEC'}
        disablePaymentId={true}
        sound={false}
        onSuccess={onSuccess}
        onTransaction={onTransaction}
        setNewTxs={setNewTxs}
        newTxs={[xecMempoolTx]}
      />
    )

    await waitFor(() => {
      expect(onTransaction).toHaveBeenCalled()
    })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(screen.queryByText(/waiting for finalization/i)).toBeNull()

    rerender(
      <Widget
        to={TEST_ADDRESSES.ecash}
        currency={'XEC'}
        disablePaymentId={true}
        sound={false}
        onSuccess={onSuccess}
        onTransaction={onTransaction}
        setNewTxs={setNewTxs}
        newTxs={[xecFinalizedTx]}
      />
    )

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(screen.getByText(/thank you!/i)).toBeTruthy()
    })
  })

  test('BCH keeps immediate success on first detected transaction', async () => {
    const onSuccess = jest.fn()
    const setNewTxs = jest.fn()

    const bchDetectedTx: Transaction = {
      hash: 'bch-detected-hash',
      amount: '1',
      paymentId: '',
      message: '',
      rawMessage: '',
      timestamp: 1,
      address: TEST_ADDRESSES.bitcoincash,
      confirmed: false,
      txStatus: 'mempool',
    }

    const { rerender } = render(
      <Widget
        to={TEST_ADDRESSES.bitcoincash}
        currency={'BCH'}
        disablePaymentId={true}
        sound={false}
        onSuccess={onSuccess}
        setNewTxs={setNewTxs}
      />
    )

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull()
    })

    rerender(
      <Widget
        to={TEST_ADDRESSES.bitcoincash}
        currency={'BCH'}
        disablePaymentId={true}
        sound={false}
        onSuccess={onSuccess}
        setNewTxs={setNewTxs}
        newTxs={[bchDetectedTx]}
      />
    )

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByText(/waiting for finalization/i)).toBeNull()
  })
})
